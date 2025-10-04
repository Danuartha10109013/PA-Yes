import React, { useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
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
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/users', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                },
            });

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
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // --- Add User Handlers ---
    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleSaveNewUser = async (newUserData: UserData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            router.post('/users', newUserData as any, {
                onSuccess: () => {
                    fetchUsers();
                    setCurrentPage(1);
                    handleCloseAddModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Pengguna baru berhasil ditambahkan',
                        timer: 3000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end',
                        background: '#10B981',
                        color: '#ffffff',
                        iconColor: '#ffffff',
                    });
                },
                onError: (errors) => {
                    const errorMessage = Object.values(errors).flat().join(', ');
                    setError(`Gagal menambahkan pengguna: ${errorMessage}`);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Menambahkan Pengguna',
                        text: errorMessage,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#EF4444',
                        background: '#ffffff',
                        color: '#374151',
                    });
                    console.error('Error adding user:', errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (err: any) {
            setError(`Gagal menambahkan pengguna: ${err.message}`);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menambahkan Pengguna',
                text: err.message,
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444',
                background: '#ffffff',
                color: '#374151',
            });
            console.error('Error adding user:', err);
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
        setError(null);

        try {
            if (!userToEdit) {
                throw new Error('Pengguna untuk diedit tidak ditemukan.');
            }

            router.put(`/users/${userToEdit.id}`, updatedUserData as any, {
                onSuccess: () => {
                    fetchUsers();
                    handleCloseEditModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Data pengguna berhasil diperbarui',
                        timer: 3000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end',
                        background: '#10B981',
                        color: '#ffffff',
                        iconColor: '#ffffff',
                    });
                },
                onError: (errors) => {
                    const errorMessage = Object.values(errors).flat().join(', ');
                    setError(`Gagal memperbarui pengguna: ${errorMessage}`);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Memperbarui Pengguna',
                        text: errorMessage,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#EF4444',
                        background: '#ffffff',
                        color: '#374151',
                    });
                    console.error('Error saving edited user:', errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (err: any) {
            setError(`Gagal memperbarui pengguna: ${err.message}`);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memperbarui Pengguna',
                text: err.message,
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444',
                background: '#ffffff',
                color: '#374151',
            });
            console.error('Error saving edited user:', err);
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
            router.delete(`/users/${userToDelete.id}`, {
                onSuccess: () => {
                    fetchUsers();
                    handleCloseDeleteModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Pengguna berhasil dihapus',
                        timer: 3000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end',
                        background: '#10B981',
                        color: '#ffffff',
                        iconColor: '#ffffff',
                    });
                },
                onError: (errors) => {
                    const errorMessage = Object.values(errors).flat().join(', ');
                    setError(errorMessage || 'Terjadi kesalahan saat menghapus pengguna.');
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Menghapus Pengguna',
                        text: errorMessage,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#EF4444',
                        background: '#ffffff',
                        color: '#374151',
                    });
                    console.error('Error saat hapus pengguna:', errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat menghapus pengguna.');
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menghapus Pengguna',
                text: err.message,
                confirmButtonText: 'OK',
                confirmButtonColor: '#EF4444',
                background: '#ffffff',
                color: '#374151',
            });
            console.error('Error saat hapus pengguna:', err);
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

                <main className="flex-1 overflow-hidden p-4 md:p-6">
                    <div className="mx-auto max-w-7xl">
                        {/* Header */}
                        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex flex-col">
                                <h2 className="text-xl font-semibold text-[#344767] md:text-2xl">Daftar Pengguna</h2>
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
                                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 sm:w-auto"
                                onClick={handleOpenAddModal}
                            >
                                + Tambah Pengguna
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-hidden rounded-xl bg-white shadow-md">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
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
                                                        <th className="py-3 pl-6 text-left">NAMA</th>
                                                        <th className="py-3 text-left">EMAIL</th>
                                                        <th className="py-3 text-left">ROLE</th>
                                                        <th className="py-3 text-left">CREATED AT</th>
                                                        <th className="py-3 text-left">UPDATED AT</th>
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
                                        <div className="space-y-4 p-4">
                                            {currentUsers.map((user) => (
                                                <div key={user.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                    <div className="mb-3 flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-[#344767]">{user.name}</h3>
                                                            <p className="text-sm text-gray-600">{user.email}</p>
                                                        </div>
                                                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-800">
                                                            {user.role}
                                                        </span>
                                                    </div>

                                                    <div className="mb-4 grid grid-cols-2 gap-4 text-xs text-gray-500">
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
                                                            className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition duration-200 hover:bg-blue-700"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenDeleteModal(user)}
                                                            className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition duration-200 hover:bg-red-700"
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
                            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className="rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-md transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                                                        className={`rounded-lg px-3 py-2 text-sm shadow-md transition-colors ${
                                                            currentPage === pageNumber
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-white text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                                return (
                                                    <span key={pageNumber} className="px-2 text-gray-500">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages}
                                        className="rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-md transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                <AddUserModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSave={handleSaveNewUser} isSubmitting={isSubmitting} />

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
