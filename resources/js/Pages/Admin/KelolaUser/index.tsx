import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import MySidebar from '../../../Layout/SidebarAdmin';
import AddUserModal from './addUser';
import EditUserModal from './editUser';
import DeleteUserModal from './deleteUser';
import { UserData, User as UserType } from '@/components/Types/types';
import TableRowUser from '@/components/Tabel/TabelRowUser';
import { Breadcrumbs } from '../../../components/breadcrumbs';
import Swal from 'sweetalert2';

const UsersIndex: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserType | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/users');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data: UserType[] = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setUsers(sortedData);
        } catch (err: any) {
            setError(`Gagal memuat pengguna: ${err.message}`);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    // --- Add User Handlers ---
    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleSaveNewUser = async (newUserData: UserData) => {
        setIsSubmitting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                },
                body: JSON.stringify(newUserData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('User created:', result.user);

            await fetchUsers();
            setCurrentPage(1);
            await Swal.fire({
                icon: 'success',
                title: 'User baru berhasil ditambahkan!',
                timer: 2000,
                showConfirmButton: false,
            });
            handleCloseAddModal();
        } catch (err: any) {
            setError(`Gagal menambahkan pengguna: ${err.message}`);
            await Swal.fire({
                icon: 'error',
                title: 'Gagal menambahkan pengguna',
                text: err.message,
            });
            console.error('Error adding user:', err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Edit User Handlers ---
    const handleOpenEditModal = (user: UserType) => {
        setUserToEdit(user);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setUserToEdit(null);
    };

    const handleSaveEditedUser = async (updatedUserData: UserData) => {
        setIsSubmitting(true);
        try {
            if (!userToEdit) {
                throw new Error("Pengguna untuk diedit tidak ditemukan.");
            }
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/users/${userToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            await fetchUsers();
            await Swal.fire({
                icon: 'success',
                title: 'User berhasil diperbarui!',
                timer: 2000,
                showConfirmButton: false,
            });

            handleCloseEditModal();
        } catch (err: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Gagal memperbarui user',
                text: err.message,
            });

            console.error('Error saving edited user:', err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Delete User Handlers ---
    const handleOpenDeleteModal = (user: UserType) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleDeleteUserConfirmed = async () => {
        setIsSubmitting(true);
        setError(null);

        if (!userToDelete) {
            setError('Tidak ada pengguna yang dipilih untuk dihapus.');
            setIsSubmitting(false);
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/users/${userToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                },
            });

            if (!response.ok) {
                let errData = null;
                try {
                    errData = await response.json();
                } catch {
                    // response is not JSON, ignore
                }
                throw new Error(errData?.message || 'Gagal menghapus pengguna.');
            }

            console.log('Hapus pengguna berhasil.');

            await fetchUsers();
            await Swal.fire({
                icon: 'success',
                title: 'User berhasil dihapus!',
                timer: 2000,
                showConfirmButton: false,
            });

            handleCloseDeleteModal();
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat menghapus pengguna.');
            await Swal.fire({
                icon: 'error',
                title: 'Gagal menghapus user',
                text: err.message,
            });

            console.error('Error saat hapus pengguna:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <>
            <Head title="Kelola User - Tappp" />
            <div className="flex min-h-screen">
                <MySidebar />

                <main className="flex-1 p-4 md:p-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex flex-col">
                            <h2 className="text-[#344767] font-semibold text-xl md:text-2xl">
                                Daftar Pengguna
                            </h2>
                            <div className="mt-1">
                                <Breadcrumbs
                                    breadcrumbs={[
                                        { title: 'Dashboard', href: '/dashboard' },
                                        { title: 'Kelola User', href: '/admin/kelola-user' },
                                    ]}
                                />
                            </div>
                        </div>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full sm:w-auto"
                            onClick={handleOpenAddModal}
                        >
                            + Tambah Pengguna
                        </button>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Memuat data pengguna...</p>
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center">
                                <p className="text-red-500">{error}</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-500">Belum ada data pengguna yang ditambahkan.</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden lg:block">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-separate border-spacing-y-2">
                                            <thead>
                                                <tr className="text-xs font-semibold text-[#98A2B3]">
                                                    <th className="text-left pl-6 py-3">NAMA</th>
                                                    <th className="text-left py-3">EMAIL</th>
                                                    <th className="text-left py-3">ROLE</th>
                                                    <th className="text-left py-3">CREATED AT</th>
                                                    <th className="text-left py-3">UPDATED AT</th>
                                                    <th className="py-3 pr-6 text-right">AKSI</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-[#344767]">
                                                {currentUsers.map((user) => (
                                                    <TableRowUser
                                                        key={user.id}
                                                        id={user.id}
                                                        name={user.name}
                                                        email={user.email}
                                                        role={user.role}
                                                        created_at={user.created_at}
                                                        updated_at={user.updated_at}
                                                        onEdit={() => handleOpenEditModal(user)}
                                                        onDelete={() => handleOpenDeleteModal(user)}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden">
                                    <div className="p-4 space-y-4">
                                        {currentUsers.map((user) => (
                                            <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-[#344767] text-lg">{user.name}</h3>
                                                        <p className="text-gray-600 text-sm">{user.email}</p>
                                                    </div>
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
                                                        {user.role}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-4">
                                                    <div>
                                                        <p className="font-medium text-gray-700">Created:</p>
                                                        <p>{formatDate(user.created_at)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-700">Updated:</p>
                                                        <p>{formatDate(user.updated_at)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(user)}
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(user)}
                                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-200"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {users.length > usersPerPage && (
                        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Sebelumnya
                                </button>
                                
                                <div className="flex items-center space-x-1">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        // Show only current page, first page, last page, and pages around current
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => paginate(pageNumber)}
                                                    className={`px-3 py-2 rounded-lg shadow-md transition-colors text-sm ${
                                                        currentPage === pageNumber
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        } else if (
                                            pageNumber === currentPage - 2 ||
                                            pageNumber === currentPage + 2
                                        ) {
                                            return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>
                                
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Berikutnya
                                </button>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                                Halaman {currentPage} dari {totalPages} ({users.length} total pengguna)
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSave={handleSaveNewUser}
                isSubmitting={isSubmitting}
            />

            {userToEdit && (
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveEditedUser}
                    initialData={userToEdit}
                    isSubmitting={isSubmitting}
                />
            )}

            {isDeleteModalOpen && userToDelete && (
                <DeleteUserModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onDelete={handleDeleteUserConfirmed}
                    user={userToDelete}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    </>
    );
};

export default UsersIndex;
