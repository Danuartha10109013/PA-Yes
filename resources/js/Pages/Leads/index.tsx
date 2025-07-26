import React, { useState, useEffect, useCallback } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MySidebar from '../../Layout/Sidebar';
import AddLeadModal from '../Kanban/addlead'; // Perlu dicek relevansinya untuk 'arsip'
import EditLeadModal from '../Kanban/editlead'; // Perlu dicek relevansinya untuk 'arsip'
import DeleteLeadModal from '../Kanban/deletelead';
import { LeadDatas as LeadType } from '@/components/Leads/types';
import TableRowTransactionLead from '@/components/Tabel/TabelRowLeads';
import BoardHeader from '../Kanban/boardheader';

const ArsipLeads: React.FC = () => {
    // State untuk data arsip
    const [arsips, setArsips] = useState<LeadType[]>([]);
    // State untuk modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // State untuk data arsip yang akan diedit/dihapus
    const [arsipToEdit, setArsipToEdit] = useState<LeadType | null>(null);
    const [arsipToDelete, setArsipToDelete] = useState<LeadType | null>(null);
    // State untuk UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State untuk paginasi
    const [currentPage, setCurrentPage] = useState(1);
    // Deklarasi konstanta yang benar tanpa useState
    const LEADS_PER_PAGE = 10;
    
    // State untuk menentukan view yang aktif
    const { url } = usePage();
    const getCurrentViewTitle = () => {
        if (url.includes('show=arsip')) {
            if (url.includes('filter=dealing')) {
                return 'Dealing Leads - Tappp';
            } else if (url.includes('filter=junk')) {
                return 'Junk Leads - Tappp';
            } else {
                return 'Archive Leads - Tappp';
            }
        } else {
            return 'List Leads - Tappp';
        }
    };

    // --- Fetch Data Arsip ---
    const fetchArsips = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/kanban/leads?show=arsip');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const kanbanData: { id: string; title: string; leads: LeadType[] }[] = await response.json();
            const allArsips: LeadType[] = kanbanData.flatMap(column => column.leads);
            const sortedArsips = allArsips.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setArsips(sortedArsips);
        } catch (err: any) {
            setError(`Failed to load arsips: ${err.message}`);
            console.error('Error fetching arsips:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Efek samping untuk memuat data saat komponen dimuat
    useEffect(() => {
        fetchArsips();
    }, [fetchArsips]);

    // --- Logika Paginasi ---
    const indexOfLastArsip = currentPage * LEADS_PER_PAGE;
    const indexOfFirstArsip = indexOfLastArsip - LEADS_PER_PAGE;
    const currentArsips = arsips.slice(indexOfFirstArsip, indexOfLastArsip);
    const totalPages = Math.ceil(arsips.length / LEADS_PER_PAGE);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    // --- Handler Modal Tambah Arsip ---
    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleSaveNewArsip = async (newData: CreateLeadData) => {
        setIsSubmitting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/kanban/leads', { // Sesuaikan endpoint jika ada API khusus untuk arsip
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Arsip created:', result.lead);

            await fetchArsips();
            setCurrentPage(1);
            alert('New arsip successfully added!');
            handleCloseAddModal();
            // Trigger refresh untuk Segmentasi Pasar
            localStorage.setItem('segmentasi_needs_refresh', 'true');
        } catch (err: any) {
            setError(`Failed to add arsip: ${err.message}`);
            alert(`Failed to add arsip: ${err.message}`);
            console.error('Error adding arsip:', err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Handler Modal Edit Arsip ---
    const handleOpenEditArsip = (arsip: LeadType) => {
        setArsipToEdit(arsip);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setArsipToEdit(null);
    };

    const handleSaveEditedArsip = async (updatedData: EditLeadData) => {
        setIsSubmitting(true);
        try {
            if (!arsipToEdit) {
                throw new Error("Arsip to edit not found.");
            }
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/kanban/leads/${arsipToEdit.id}`, { // Sesuaikan endpoint jika ada API khusus untuk arsip
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            await fetchArsips();
            alert('Arsip successfully updated!');
            handleCloseEditModal();
            // Trigger refresh untuk Segmentasi Pasar
            localStorage.setItem('segmentasi_needs_refresh', 'true');
        } catch (err: any) {
            alert(`Failed to update arsip: ${err.message}`);
            console.error('Error saving edited arsip:', err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Handler Modal Hapus Arsip ---
    const handleOpenDeleteArsip = (arsip: LeadType) => {
        setArsipToDelete(arsip);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setArsipToDelete(null);
    };

    const handleDeleteArsipConfirmed = async () => {
        setIsSubmitting(true);
        setError(null);

        if (!arsipToDelete) {
            setError('No arsip selected for deletion.');
            setIsSubmitting(false);
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/kanban/leads/${arsipToDelete.id}`, { // Sesuaikan endpoint jika ada API khusus untuk arsip
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
                throw new Error(errData?.message || 'Failed to delete arsip.');
            }

            console.log('Arsip deletion successful.');

            await fetchArsips();
            alert('Arsip successfully deleted!');
            handleCloseDeleteModal();
            // Trigger refresh untuk Segmentasi Pasar
            localStorage.setItem('segmentasi_needs_refresh', 'true');
        } catch (err: any) {
            setError(err.message || 'An error occurred while deleting the arsip.');
            alert(`Failed to delete arsip: ${err.message}`);
            console.error('Error deleting arsip:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Handler Detail Arsip ---
    const handleDetailArsip = (arsip: LeadType) => {
        console.log("Showing detail for arsip:", arsip);
    };

    // --- Handler Perubahan Kolom Arsip (jika relevan untuk arsip) ---
    const handleArsipColumnChange = async (arsipId: string, newColumnId: string) => {
        setIsSubmitting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/kanban/leads/update-status/${arsipId}`, { // Sesuaikan endpoint jika ada API khusus untuk arsip
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                },
                body: JSON.stringify({ column_id: newColumnId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setArsips(prevArsips =>
                prevArsips.map(arsip =>
                    arsip.id === arsipId ? { ...arsip, columnId: newColumnId } : arsip
                )
            );

            await fetchArsips();
            alert('Arsip status updated successfully!');
        } catch (err: any) {
            setError(`Failed to update arsip status: ${err.message}`);
            alert(`Failed to update arsip status: ${err.message}`);
            console.error('Error updating arsip status:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title={getCurrentViewTitle()} />
            <div className="flex min-h-screen bg-gray-100">
                <MySidebar />

                <div className="flex flex-col flex-1 overflow-hidden">
                <BoardHeader />
                <main className="flex-1 p-6 pt-1 p-3">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {loading ? (
                            <p className="p-4 text-center text-gray-600">Loading arsips data...</p>
                        ) : error ? (
                            <p className="p-4 text-center text-red-500">Error: {error}</p>
                        ) : arsips.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">No arsip data has been added yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-xs font-semibold text-[#98A2B3]">
                                            <th className="text-left pl-6 py-2">NAMA</th>
                                            <th className="text-left py-2">PERUSAHAAN</th>
                                            <th className="text-left py-2">PRODUCT</th>
                                            <th className="text-left py-2">DEADLINE</th>
                                            <th className="text-left py-2">SECTOR</th>
                                            <th className="text-left py-2">CREATED AT</th>
                                            <th className="text-left py-2">UPDATED AT</th>
                                            <th className="py-2 pr-6 text-right">STATUS</th>
                                            <th className="py-2 pr-6 text-right">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-[#344767]">
                                        {currentArsips.map((arsip) => (
                                            <TableRowTransactionLead
                                                key={arsip.id}
                                                lead={arsip} // Pastikan prop di TableRowTransactionLead masih bernama 'lead'
                                                onEdit={handleOpenEditArsip}
                                                onDelete={handleOpenDeleteArsip}
                                                onDetail={handleDetailArsip}
                                                onColumnChange={handleArsipColumnChange}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Paginasi */}
                    {arsips.length > LEADS_PER_PAGE && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-4 py-2 rounded-lg shadow-md transition-colors ${currentPage === index + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Tambah Arsip */}
            <AddLeadModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSave={handleSaveNewArsip}
                isSubmitting={isSubmitting}
            />

            {/* Modal Edit Arsip */}
            {arsipToEdit && (
                <EditLeadModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveEditedArsip}
                    initialData={arsipToEdit}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Modal Hapus Arsip */}
            {isDeleteModalOpen && arsipToDelete && (
                <DeleteLeadModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onDelete={handleDeleteArsipConfirmed}
                    lead={arsipToDelete} // Pastikan prop di DeleteLeadModal masih bernama 'lead'
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    </>
    );
};

export default ArsipLeads;
