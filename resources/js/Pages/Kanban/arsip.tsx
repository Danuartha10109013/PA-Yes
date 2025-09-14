import { ContactOption, LeadDatas, ProductOption } from '@/components/Leads/types';
import TableRowTransactionLead from '@/components/Tabel/TabelRowLeads';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import MySidebar from '../../Layout/Sidebar';
import BoardHeader from './boardheader';
import DeleteLeadModal from './deletelead';
import LeadDetailDrawer from './detaillead';
import EditLeadModal from './editlead';
interface CreateLeadDataResponse extends LeadDatas {}

interface LeadsIndexProps {
    kanbanData: {
        id: string;
        title: string;
        leads: LeadDatas[];
    }[];
    columns: { id: string; name: string }[];
    contacts: ContactOption[];
    products: ProductOption[];
}

const LeadsIndex: React.FC = () => {
    const { kanbanData, columns, contacts, products } = usePage<LeadsIndexProps>().props;

    const [leads, setLeads] = useState<LeadDatas[]>(() => {
        const allLeads = kanbanData.flatMap((col) => col.leads);
        return allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage] = useState(10);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState<LeadDatas | null>(null);
    const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);

    // ✅ state untuk detail
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [leadToDetail, setLeadToDetail] = useState<LeadDatas | null>(null);

    const { url } = usePage();
    const getCurrentViewTitle = () => {
        if (url.includes('show=arsip')) {
            if (url.includes('filter=dealing')) return 'Dealing Leads - Tappp';
            if (url.includes('filter=junk')) return 'Junk Leads - Tappp';
            return 'Archive Leads - Tappp';
        }
        return 'List Leads - Tappp';
    };

    useEffect(() => {
        const allLeads = kanbanData.flatMap((col) => col.leads);
        setLeads(allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    }, [kanbanData]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredLeads = leads.filter(
        (lead) =>
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.product_name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

    const paginate = (num: number) => setCurrentPage(num);
    const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

    const handleSaveNewLead = async (newLead: CreateLeadDataResponse) => {
        router.reload({
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Lead baru berhasil ditambahkan!',
                    timer: 1500,
                    showConfirmButton: false,
                });
                setCurrentPage(1);
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: `Gagal menambahkan lead: ${Object.values(errors).join(', ')}`,
                });
            },
        });
    };

    const handleOpenDetailModal = (lead: LeadDatas) => {
        setLeadToDetail(lead);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setLeadToDetail(null);
        setIsDetailModalOpen(false);
    };

    const handleOpenEditModal = (lead: LeadDatas) => {
        setLeadToEdit(lead);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setLeadToEdit(null);
        setIsEditModalOpen(false);
    };

    const handleSaveEditedLead = (updatedData: Partial<LeadDatas>) => {
        if (!leadToEdit) return;
        router.put(`/kanban/leads/${leadToEdit.id}`, updatedData, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Lead berhasil diperbarui!',
                    timer: 1500,
                    showConfirmButton: false,
                });
                handleCloseEditModal();
                router.reload({ only: ['kanbanData'] });
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: `Gagal memperbarui lead: ${Object.values(errors).join(', ')}`,
                });
            },
        });
    };

    const handleOpenDeleteModal = (lead: LeadDatas) => {
        setLeadToDelete(lead);
        setIsDeleteModalOpen(true);
    };
    const handleCloseDeleteModal = () => {
        setLeadToDelete(null);
        setIsDeleteModalOpen(false);
    };
    const handleDeleteLeadConfirmed = () => {
        if (!leadToDelete) return;
        router.delete(`/kanban/leads/${leadToDelete.id}`, {
            onSuccess: () => {
                setLeads((prev) => prev.filter((l) => l.id !== leadToDelete.id));
                Swal.fire({
                    icon: 'success',
                    title: 'Lead berhasil dihapus!',
                    timer: 1500,
                    showConfirmButton: false,
                });
                handleCloseDeleteModal();
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: `Gagal menghapus lead: ${Object.values(errors).join(', ')}`,
                });
            },
        });
    };

    const handleColumnChange = (leadId: string, newColumnId: string) => {
        router.put(
            '/kanban/leads/update-column',
            { leadId, newColumnId },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Lead diperbarui!',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    router.reload({ only: ['kanbanData'] });
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: `Gagal memperbarui status lead: ${Object.values(errors).join(', ')}`,
                    });
                },
            },
        );
    };

    return (
        <>
            <Head title={getCurrentViewTitle()} />
            <div className="flex min-h-screen">
                <MySidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <BoardHeader
                        onSave={handleSaveNewLead}
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        contacts={contacts}
                        products={products}
                        columns={columns}
                    />
                    <main className="flex-1 p-6 pt-1">
                        <div className="overflow-hidden rounded-xl bg-white shadow-md">
                            {filteredLeads.length === 0 ? (
                                <p className="p-4 text-center text-gray-500">No leads match your search.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-separate border-spacing-y-2">
                                        <thead>
                                            <tr className="text-xs font-semibold text-[#98A2B3]">
                                                <th className="py-2 pl-6 text-left">NAMA</th>
                                                <th className="py-2 text-left">PERUSAHAAN</th>
                                                <th className="py-2 text-left">PRODUCT</th>
                                                <th className="py-2 text-left">DEADLINE</th>
                                                <th className="py-2 text-left">SECTOR</th>
                                                <th className="py-2 text-left">CREATED AT</th>
                                                <th className="py-2 text-left">UPDATED AT</th>
                                                <th className="py-2 pr-6 text-right">STATUS</th>
                                                <th className="py-2 pr-6 text-right">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm text-[#344767]">
                                            {currentLeads.map((lead) => (
                                                <TableRowTransactionLead
                                                    key={lead.id}
                                                    lead={lead}
                                                    onEdit={handleOpenEditModal}
                                                    onDelete={handleOpenDeleteModal}
                                                    onDetail={handleOpenDetailModal}
                                                    onColumnChange={handleColumnChange}
                                                    columns={columns}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {filteredLeads.length > leadsPerPage && (
                            <div className="mt-6 flex items-center justify-center space-x-2">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className="rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`rounded-lg px-4 py-2 shadow-md ${
                                            currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </main>
                </div>

                {leadToEdit && (
                    <EditLeadModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        onSave={handleSaveEditedLead}
                        initialData={leadToEdit}
                        contacts={contacts}
                        products={products}
                        columns={columns}
                        isSubmitting={router.processing}
                    />
                )}

                {isDeleteModalOpen && leadToDelete && (
                    <DeleteLeadModal
                        isOpen={isDeleteModalOpen}
                        onClose={handleCloseDeleteModal}
                        onDelete={handleDeleteLeadConfirmed}
                        lead={leadToDelete}
                        isSubmitting={router.processing}
                    />
                )}
                {leadToDetail && <LeadDetailDrawer isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} lead={leadToDetail} />}
            </div>
        </>
    );
};

export default LeadsIndex;
