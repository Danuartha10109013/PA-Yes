// import React, { useState, useEffect } from 'react';
// import MySidebar from '../../Layout/Sidebar';
// import EditLeadModal from './editlead';
// import DeleteLeadModal from './deletelead';
// import { LeadDatas } from '@/components/Leads/types';
// import TableRowTransactionLead from '@/components/Tabel/TabelRowLeads';
// import BoardHeader from '@/Pages/Kanban/Universal/boardheader';
// import { usePage, router, useForm, Head } from '@inertiajs/react';

// interface CreateLeadDataResponse extends LeadDatas {}

// interface EditLeadDataPayload {
//   name?: string;
//   company_name?: string;
//   product_id?: string | null;
//   product_name?: string | null;
//   current_price?: number | null;
//   qty?: number | null;
//   grand_total?: number | null;
//   notes?: string;
//   deadline?: string | null;
//   column_id?: string;
// }

// interface LeadsIndexProps {
//   kanbanData: {
//     id: string;
//     title: string;
//     leads: LeadDatas[];
//   }[];
//   columns: { id: string; title: string }[];
//   filters: {
//     show: string | null;
//     filter: string | null;
//   };
// }

// const LeadsIndex: React.FC = () => {
//   const { kanbanData, columns, filters } = usePage<LeadsIndexProps>().props;

//   // Extract filter params from props
//   const { show, filter } = filters || { show: null, filter: null };

//   // Flatten leads list
//   const [leads, setLeads] = useState<LeadDatas[]>(() => {
//     const allLeads: LeadDatas[] = kanbanData.flatMap((column) => column.leads);
//     return allLeads.sort(
//       (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//     );
//   });

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [leadToEdit, setLeadToEdit] = useState<LeadDatas | null>(null);
//   const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const leadsPerPage = 10;

//   useEffect(() => {
//     const allLeads: LeadDatas[] = kanbanData.flatMap((column) => column.leads);
//     setLeads(
//       allLeads.sort(
//         (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//       )
//     );
//     setCurrentPage(1); // Reset page on data reload
//   }, [kanbanData]);

//   const indexOfLastLead = currentPage * leadsPerPage;
//   const indexOfFirstLead = indexOfLastLead - leadsPerPage;
//   const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
//   const totalPages = Math.ceil(leads.length / leadsPerPage);

//   // Pagination handlers
//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };
//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   // New Lead form handlers (you can extend this as needed)
//   const { data: newLeadForm, setData: setNewLeadForm, post, processing: isCreatingNewLead, errors: newLeadErrors, reset: resetNewLeadForm } = useForm({});

//   const handleSaveNewLead = async (newlyCreatedLead: CreateLeadDataResponse) => {
//     // Usually BoardHeader handles form submission and reload
//     router.reload({
//       onSuccess: () => {
//         alert('New lead successfully added!');
//         setCurrentPage(1);
//       },
//       onError: (errors) => {
//         alert(`Failed to add lead: ${Object.values(errors).join(', ')}`);
//       },
//     });
//   };

//   const handleOpenEditModal = (lead: LeadDatas) => {
//     setLeadToEdit(lead);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setLeadToEdit(null);
//   };

//   const handleSaveEditedLead = (updatedData: EditLeadDataPayload) => {
//     if (!leadToEdit) return;
//     router.put(`/kanban/leads/${leadToEdit.id}`, updatedData, {
//       onSuccess: () => {
//         alert('Lead successfully updated!');
//         handleCloseEditModal();
//       },
//       onError: (errors) => {
//         alert(`Failed to update lead: ${Object.values(errors).join(', ')}`);
//       },
//     });
//   };

//   const handleOpenDeleteModal = (lead: LeadDatas) => {
//     setLeadToDelete(lead);
//     setIsDeleteModalOpen(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setLeadToDelete(null);
//   };

//   const handleDeleteLeadConfirmed = () => {
//     if (!leadToDelete) return;
//     router.delete(`/kanban/leads/${leadToDelete.id}`, {
//       onSuccess: () => {
//         alert('Lead successfully deleted!');
//         handleCloseDeleteModal();
//       },
//       onError: (errors) => {
//         alert(`Failed to delete lead: ${Object.values(errors).join(', ')}`);
//       },
//     });
//   };

//   const handleColumnChange = (leadId: string, newColumnId: string) => {
//     router.put(
//       `/kanban/leads/update-status/${leadId}`,
//       { column_id: newColumnId },
//       {
//         onSuccess: () => {
//           alert('Lead status updated successfully!');
//         },
//         onError: (errors) => {
//           alert(`Failed to update lead status: ${Object.values(errors).join(', ')}`);
//         },
//         preserveScroll: true,
//         preserveState: true,
//       }
//     );
//   };

//   // Handle filter change from BoardHeader
//   const handleFilterChange = (newShow: string, newFilter: string) => {
//     const query: any = {};
//     if (newShow) query.show = newShow;
//     if (newFilter) query.filter = newFilter;

//     router.visit('/list/leads', { data: query, preserveState: true, replace: true });
//   };

//   // Search term state (if you want to add search)
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     // You can add debounce or filter leads client side or reload with query param
//   };

//   return (
//     <div className="flex min-h-screen">
//       <MySidebar />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <BoardHeader
//           onSave={handleSaveNewLead}
//           searchTerm={searchTerm}
//           onSearchChange={handleSearchChange}
//           currentShow={show || ''}
//           currentFilter={filter || ''}
//           onFilterChange={handleFilterChange}
//         />
//         <main className="flex-1 p-6 pt-1 p-3">
//           <div className="bg-white rounded-xl shadow-md overflow-hidden">
//             {leads.length === 0 ? (
//               <p className="p-4 text-center text-gray-500">No lead data has been added yet.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full border-separate border-spacing-y-2">
//                   <thead>
//                     <tr className="text-xs font-semibold text-[#98A2B3]">
//                       <th className="text-left pl-6 py-2">NAMA</th>
//                       <th className="text-left py-2">PERUSAHAAN</th>
//                       <th className="text-left py-2">PRODUCT</th>
//                       <th className="text-left py-2">DEADLINE</th>
//                       <th className="text-left py-2">SECTOR</th>
//                       <th className="text-left py-2">CREATED AT</th>
//                       <th className="text-left py-2">UPDATED AT</th>
//                       <th className="py-2 pr-6 text-right">STATUS</th>
//                       <th className="py-2 pr-6 text-right">ACTIONS</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm text-[#344767]">
//                     {currentLeads.map((lead) => (
//                       <TableRowTransactionLead
//                         key={lead.id}
//                         lead={lead}
//                         onEdit={handleOpenEditModal}
//                         onDelete={handleOpenDeleteModal}
//                         onDetail={() => {}}
//                         onColumnChange={handleColumnChange}
//                         columns={columns}
//                       />
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//           {leads.length > leadsPerPage && (
//             <div className="flex justify-center items-center mt-6 space-x-2">
//               <button
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Previous
//               </button>
//               {[...Array(totalPages)].map((_, index) => (
//                 <button
//                   key={index + 1}
//                   onClick={() => paginate(index + 1)}
//                   className={`px-4 py-2 rounded-lg shadow-md transition-colors ${
//                     currentPage === index + 1
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-white text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </main>
//       </div>

//       {leadToEdit && (
//         <EditLeadModal
//           isOpen={isEditModalOpen}
//           onClose={handleCloseEditModal}
//           onSave={handleSaveEditedLead}
//           initialData={leadToEdit}
//           isSubmitting={router.processing}
//         />
//       )}

//       {isDeleteModalOpen && leadToDelete && (
//         <DeleteLeadModal
//           isOpen={isDeleteModalOpen}
//           onClose={handleCloseDeleteModal}
//           onDelete={handleDeleteLeadConfirmed}
//           lead={leadToDelete}
//           isSubmitting={router.processing}
//         />
//       )}
//     </div>
//   );
// };

// export default LeadsIndex;


import React, { useState, useEffect } from 'react';
import MySidebar from '../../Layout/Sidebar';
import EditLeadModal from './editlead';
import DeleteLeadModal from './deletelead';
import { LeadDatas } from '@/components/Leads/types';
import TableRowTransactionLead from '@/components/Tabel/TabelRowLeads';
import BoardHeader from '@/Pages/Kanban/Universal/boardheader';
import { Breadcrumbs } from '../../components/breadcrumbs';
import { usePage, router, useForm, Head } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface CreateLeadDataResponse extends LeadDatas { }

interface EditLeadDataPayload {
    name?: string;
    company_name?: string;
    product_id?: string | null;
    product_name?: string | null;
    current_price?: number | null;
    qty?: number | null;
    grand_total?: number | null;
    notes?: string;
    deadline?: string | null;
    column_id?: string;
}

interface LeadsIndexProps {
    kanbanData: {
        id: string;
        title: string;
        leads: LeadDatas[];
    }[];
    columns: { id: string; title: string }[];
}

const LeadsIndex: React.FC = () => {
    const { kanbanData, columns } = usePage<LeadsIndexProps>().props;

    const [leads, setLeads] = useState<LeadDatas[]>(() => {
        const allLeads = kanbanData.flatMap(col => col.leads);
        return allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage] = useState(10);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState<LeadDatas | null>(null);
    const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);
    
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

    useEffect(() => {
        const allLeads = kanbanData.flatMap(col => col.leads);
        setLeads(allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    }, [kanbanData]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
    const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

    const { data: newLeadForm, setData: setNewLeadForm, post, processing: isCreatingNewLead, errors: newLeadErrors, reset: resetNewLeadForm } = useForm({});

    const handleSaveNewLead = async (newlyCreatedLead: CreateLeadDataResponse) => {
        router.reload({
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Lead baru berhasil ditambahkan!', timer: 1500, showConfirmButton: false });
                setCurrentPage(1);
            },
            onError: (errors) => {
                console.error("Failed to add lead:", errors);
                Swal.fire({ icon: 'error', title: 'Gagal!', text: `Gagal menambahkan lead: ${Object.values(errors).join(', ')} ` });
            }
        });
    };

    const handleOpenEditModal = (lead: LeadDatas) => {
        setLeadToEdit(lead);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setLeadToEdit(null);
    };

    const handleSaveEditedLead = async (updatedData: EditLeadDataPayload) => {
        if (!leadToEdit) return;
        router.put(`/kanban/leads/${leadToEdit.id}`, updatedData, {
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Lead berhasil diperbarui!', timer: 1500, showConfirmButton: false });
                handleCloseEditModal();
            },
            onError: (errors) => {
                console.error("Failed to update lead:", errors);
                Swal.fire({ icon: 'error', title: 'Gagal!', text: `Gagal memperbarui lead: ${Object.values(errors).join(', ')} ` });
            },
        });
    };

    const handleOpenDeleteModal = (lead: LeadDatas) => {
        setLeadToDelete(lead);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setLeadToDelete(null);
    };

    const handleDeleteLeadConfirmed = async () => {
        if (!leadToDelete) return;
        router.delete(`/kanban/leads/${leadToDelete.id}`, {
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Lead berhasil dihapus!', timer: 1500, showConfirmButton: false });
                handleCloseDeleteModal();
            },
            onError: (errors) => {
                console.error("Failed to delete lead:", errors);
                Swal.fire({ icon: 'error', title: 'Gagal!', text: `Gagal menghapus lead: ${Object.values(errors).join(', ')} ` });
            },
        });
    };

    const handleColumnChange = async (leadId: string, newColumnId: string) => {
        router.put('/kanban/leads/update-column', {
            leadId: leadId,
            newColumnId: newColumnId,
        }, {
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Status Lead diperbarui!', timer: 1500, showConfirmButton: false });
                // Refresh data from server to ensure consistency
                router.reload({ only: ['kanbanData'] });
            },
            onError: (errors) => {
                console.error("Failed to update lead status:", errors);
                Swal.fire({ icon: 'error', title: 'Gagal!', text: `Gagal memperbarui status lead: ${Object.values(errors).join(', ')} ` });
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title={getCurrentViewTitle()} />
            <div className="flex min-h-screen">
                <MySidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                <BoardHeader
                    onSave={handleSaveNewLead}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />
                <div className="px-6 pt-3">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Dashboard', href: '/dashboard' },
                            { title: 'Manage Leads', href: '/kanban' },
                            { title: 'Arsip', href: '/kanban/arsip' },
                        ]}
                    />
                </div>
                <main className="flex-1 p-6 pt-1 p-3">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {filteredLeads.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">No leads match your search.</p>
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
                                        {currentLeads.map((lead) => (
                                            <TableRowTransactionLead
                                                key={lead.id}
                                                lead={lead}
                                                onEdit={handleOpenEditModal}
                                                onDelete={handleOpenDeleteModal}
                                                onDetail={() => { }}
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
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50">
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-4 py-2 rounded-lg shadow-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50">
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
        </div>
    </>
    );
};

export default LeadsIndex;
