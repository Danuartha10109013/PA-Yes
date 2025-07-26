// import React, { useState, useEffect, useCallback } from 'react';
// import MySidebar from '../../Layout/Sidebar';
// import EditLeadModal from './editlead';
// import DeleteLeadModal from './deletelead';
// import { LeadDatas } from '@/components/Leads/types';
// import TableRowTransactionLead from '@/components/Tabel/TabelRowLeads';
// import BoardHeader from './boardheader';

// interface CreateLeadDataResponse extends LeadDatas { }

// interface EditLeadDataPayload {
//     name?: string;
//     company_name?: string;
//     product_id?: string | null;
//     product_name?: string | null;
//     current_price?: number | null;
//     qty?: number | null;
//     grand_total?: number | null;
//     notes?: string;
//     deadline?: string | null;
//     column_id?: string;
// }

// const LeadsIndex: React.FC = () => {
//     const [leads, setLeads] = useState<LeadDatas[]>([]);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [leadToEdit, setLeadToEdit] = useState<LeadDatas | null>(null);
//     const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [leadsPerPage] = useState(10);

//     const fetchLeads = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch('/kanban/leads');
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }
//             const kanbanData: { id: string; title: string; leads: LeadDatas[] }[] = await response.json();
//             const allLeads: LeadDatas[] = kanbanData.flatMap(column => column.leads);
//             const sortedLeads = allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//             setLeads(sortedLeads);
//         } catch (err: any) {
//             setError(`Failed to load leads: ${err.message}`);
//             console.error('Error fetching leads:', err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchLeads();
//     }, [fetchLeads]);

//     const indexOfLastLead = currentPage * leadsPerPage;
//     const indexOfFirstLead = indexOfLastLead - leadsPerPage;
//     const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
//     const totalPages = Math.ceil(leads.length / leadsPerPage);

//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
//     const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
//     const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

//     const handleSaveNewLead = async (newlyCreatedLead: CreateLeadDataResponse) => {
//         setIsSubmitting(true);
//         try {
//             setLeads(prevLeads => {
//                 const updatedLeads = [newlyCreatedLead, ...prevLeads];
//                 return updatedLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//             });
//             setCurrentPage(1);
//             alert('New lead successfully added!');
//             await fetchLeads();
//         } catch (err: any) {
//             setError(`Failed to add lead: ${err.message}`);
//             alert(`Failed to add lead: ${err.message}`);
//             await fetchLeads();
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleOpenEditModal = (lead: LeadDatas) => {
//         setLeadToEdit(lead);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setLeadToEdit(null);
//     };

//     const handleSaveEditedLead = async (updatedData: EditLeadDataPayload) => {
//         setIsSubmitting(true);
//         try {
//             if (!leadToEdit) throw new Error("Lead to edit not found.");
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             const response = await fetch(`/kanban/leads/${leadToEdit.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//                 body: JSON.stringify(updatedData),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }

//             await fetchLeads();
//             alert('Lead successfully updated!');
//             handleCloseEditModal();
//         } catch (err: any) {
//             alert(`Failed to update lead: ${err.message}`);
//             await fetchLeads();
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleOpenDeleteModal = (lead: LeadDatas) => {
//         setLeadToDelete(lead);
//         setIsDeleteModalOpen(true);
//     };

//     const handleCloseDeleteModal = () => {
//         setIsDeleteModalOpen(false);
//         setLeadToDelete(null);
//     };

//     const handleDeleteLeadConfirmed = async () => {
//         setIsSubmitting(true);
//         if (!leadToDelete) return;
//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//             const response = await fetch(`/kanban/leads/${leadToDelete.id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//             });

//             if (!response.ok) {
//                 let errData = null;
//                 try { errData = await response.json(); } catch { }
//                 throw new Error(errData?.message || 'Failed to delete lead.');
//             }

//             setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadToDelete.id));
//             await fetchLeads();
//             alert('Lead successfully deleted!');
//             handleCloseDeleteModal();
//         } catch (err: any) {
//             setError(err.message);
//             alert(`Failed to delete lead: ${err.message}`);
//             await fetchLeads();
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleColumnChange = async (leadId: string, newColumnId: string) => {
//         setIsSubmitting(true);
//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//             const response = await fetch(`/kanban/leads/update-status/${leadId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//                 body: JSON.stringify({ column_id: newColumnId }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }

//             await fetchLeads();
//             alert('Lead status updated successfully!');
//         } catch (err: any) {
//             setError(`Failed to update lead status: ${err.message}`);
//             alert(`Failed to update lead status: ${err.message}`);
//             await fetchLeads();
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="flex min-h-screen">
//             <MySidebar />
//             <div className="flex flex-col flex-1 overflow-hidden">
//                 <BoardHeader onSave={handleSaveNewLead} />
//                 <main className="flex-1 p-6 pt-1 p-3">
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         {loading ? (
//                             <p className="p-4 text-center text-gray-600">Loading leads data...</p>
//                         ) : error ? (
//                             <p className="p-4 text-center text-red-500">Error: {error}</p>
//                         ) : leads.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">No lead data has been added yet.</p>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full border-separate border-spacing-y-2">
//                                     <thead>
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2">NAMA</th>
//                                             <th className="text-left py-2">PERUSAHAAN</th>
//                                             <th className="text-left py-2">PRODUCT</th>
//                                             <th className="text-left py-2">DEADLINE</th>
//                                             <th className="text-left py-2">SECTOR</th>
//                                             <th className="text-left py-2">CREATED AT</th>
//                                             <th className="text-left py-2">UPDATED AT</th>
//                                             <th className="py-2 pr-6 text-right">STATUS</th>
//                                             <th className="py-2 pr-6 text-right">ACTIONS</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentLeads.map((lead) => (
//                                             <TableRowTransactionLead
//                                                 key={lead.id}
//                                                 lead={lead}
//                                                 onEdit={handleOpenEditModal}
//                                                 onDelete={handleOpenDeleteModal}
//                                                 onDetail={() => { }}
//                                                 onColumnChange={handleColumnChange}
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                     {leads.length > leadsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             <button
//                                 onClick={prevPage}
//                                 disabled={currentPage === 1}
//                                 className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 Previous
//                             </button>
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <button
//                                     key={index + 1}
//                                     onClick={() => paginate(index + 1)}
//                                     className={`px-4 py-2 rounded-lg shadow-md transition-colors ${currentPage === index + 1
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-white text-gray-700 hover:bg-gray-200'
//                                         }`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             ))}
//                             <button
//                                 onClick={nextPage}
//                                 disabled={currentPage === totalPages}
//                                 className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </main>
//             </div>

//             {leadToEdit && (
//                 <EditLeadModal
//                     isOpen={isEditModalOpen}
//                     onClose={handleCloseEditModal}
//                     onSave={handleSaveEditedLead}
//                     initialData={leadToEdit}
//                     isSubmitting={isSubmitting}
//                 />
//             )}

//             {isDeleteModalOpen && leadToDelete && (
//                 <DeleteLeadModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={handleCloseDeleteModal}
//                     onDelete={handleDeleteLeadConfirmed}
//                     lead={leadToDelete}
//                     isSubmitting={isSubmitting}
//                 />
//             )}
//         </div>
//     );
// };

// export default LeadsIndex;


// import React, { useState, useEffect, useCallback } from 'react';
// import MySidebar from '../../Layout/Sidebar';
// import EditLeadModal from './editlead';
// import DeleteLeadModal from './deletelead';
// import { LeadDatas } from '@/components/Leads/types';
// import TableRowTransactionLead from '@/components/Tabel/TabelRowLeads';
// import BoardHeader from './boardheader';
// import { usePage, router, useForm } from '@inertiajs/react'; // Import usePage, router, and useForm

// interface CreateLeadDataResponse extends LeadDatas { }

// interface EditLeadDataPayload {
//     name?: string;
//     company_name?: string;
//     product_id?: string | null;
//     product_name?: string | null;
//     current_price?: number | null;
//     qty?: number | null;
//     grand_total?: number | null;
//     notes?: string;
//     deadline?: string | null;
//     column_id?: string;
// }

// // Define the type for the props received from Inertia
// interface LeadsIndexProps {
//     kanbanData: {
//         id: string;
//         title: string;
//         leads: LeadDatas[];
//     }[];
//     columns: { id: string; title: string }[]; // New prop for columns dropdown
// }

// const LeadsIndex: React.FC = () => {
//     // Use usePage to get the props
//     const { kanbanData, columns } = usePage<LeadsIndexProps>().props;

//     // Initialize leads state from kanbanData props
//     const [leads, setLeads] = useState<LeadDatas[]>(() => {
//         const allLeads: LeadDatas[] = kanbanData.flatMap(column => column.leads);
//         return allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//     });

//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [leadToEdit, setLeadToEdit] = useState<LeadDatas | null>(null);
//     const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [leadsPerPage] = useState(10);

//     // No need for a separate `loading` state from initial fetch, Inertia handles it implicitly
//     // You can use form.processing for submission loading states.

//     // Effect to update leads if kanbanData props change (e.g., after an Inertia visit/reload)
//     useEffect(() => {
//         const allLeads: LeadDatas[] = kanbanData.flatMap(column => column.leads);
//         setLeads(allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
//     }, [kanbanData]);

//     const indexOfLastLead = currentPage * leadsPerPage;
//     const indexOfFirstLead = indexOfLastLead - leadsPerPage;
//     const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
//     const totalPages = Math.ceil(leads.length / leadsPerPage);

//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
//     const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
//     const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

//     // Form for creating a new lead (example, assuming BoardHeader uses it)
//     const { data: newLeadForm, setData: setNewLeadForm, post, processing: isCreatingNewLead, errors: newLeadErrors, reset: resetNewLeadForm } = useForm({
//         // Define initial state for new lead here
//         // e.g., name: '', company_name: '', etc.
//     });

//     const handleSaveNewLead = async (newlyCreatedLead: CreateLeadDataResponse) => {
//         // Since you're likely creating a lead via a separate form/modal (BoardHeader),
//         // and its submission might trigger an Inertia reload, this function might simplify.
//         // If BoardHeader handles the actual Inertia form submission, you might just need
//         // to refetch leads or update the state optimistically if not reloading the page.
//         // For simplicity, let's assume BoardHeader's submission triggers a page reload
//         // or a manual `router.reload()`.
//         router.reload({
//             onSuccess: () => {
//                 alert('New lead successfully added!');
//                 setCurrentPage(1); // Reset to first page after adding
//             },
//             onError: (errors) => {
//                 console.error("Failed to add lead:", errors);
//                 alert(`Failed to add lead: ${Object.values(errors).join(', ')}`);
//             }
//         });
//     };

//     const handleOpenEditModal = (lead: LeadDatas) => {
//         setLeadToEdit(lead);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setLeadToEdit(null);
//     };

//     const handleSaveEditedLead = async (updatedData: EditLeadDataPayload) => {
//         if (!leadToEdit) return;

//         // Use Inertia's useForm for editing
//         router.put(`/kanban/leads/${leadToEdit.id}`, updatedData, {
//             onSuccess: () => {
//                 alert('Lead successfully updated!');
//                 handleCloseEditModal();
//             },
//             onError: (errors) => {
//                 console.error("Failed to update lead:", errors);
//                 alert(`Failed to update lead: ${Object.values(errors).join(', ')}`);
//             },
//             // The `onFinish` or `onSettled` callback will be called after the request
//             // regardless of success or failure.
//         });
//     };

//     const handleOpenDeleteModal = (lead: LeadDatas) => {
//         setLeadToDelete(lead);
//         setIsDeleteModalOpen(true);
//     };

//     const handleCloseDeleteModal = () => {
//         setIsDeleteModalOpen(false);
//         setLeadToDelete(null);
//     };

//     const handleDeleteLeadConfirmed = async () => {
//         if (!leadToDelete) return;

//         // Use Inertia's router.delete for deleting
//         router.delete(`/kanban/leads/${leadToDelete.id}`, {
//             onSuccess: () => {
//                 alert('Lead successfully deleted!');
//                 handleCloseDeleteModal();
//                 // setLeads will be updated by the useEffect when kanbanData changes after reload
//             },
//             onError: (errors) => {
//                 console.error("Failed to delete lead:", errors);
//                 alert(`Failed to delete lead: ${Object.values(errors).join(', ')}`);
//             },
//         });
//     };

//     const handleColumnChange = async (leadId: string, newColumnId: string) => {
//         // Use Inertia's router.put for updating status
//         router.put(`/kanban/leads/update-status/${leadId}`, { column_id: newColumnId }, {
//             onSuccess: () => {
//                 alert('Lead status updated successfully!');
//             },
//             onError: (errors) => {
//                 console.error("Failed to update lead status:", errors);
//                 alert(`Failed to update lead status: ${Object.values(errors).join(', ')}`);
//             },
//             // This will trigger a page reload, and `useEffect` will re-sort the leads
//             preserveScroll: true, // Keep scroll position after update
//             preserveState: true, // Keep component local state (like current page)
//         });
//     };

//     return (
//         <div className="flex min-h-screen">
//             <MySidebar />
//             <div className="flex flex-col flex-1 overflow-hidden">
//                 {/* BoardHeader might need to be refactored to use useForm for new lead creation */}
//                 <BoardHeader onSave={handleSaveNewLead} />
//                 <main className="flex-1 p-6 pt-1 p-3">
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         {leads.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">No lead data has been added yet.</p>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full border-separate border-spacing-y-2">
//                                     <thead>
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2">NAMA</th>
//                                             <th className="text-left py-2">PERUSAHAAN</th>
//                                             <th className="text-left py-2">PRODUCT</th>
//                                             <th className="text-left py-2">DEADLINE</th>
//                                             <th className="text-left py-2">SECTOR</th>
//                                             <th className="text-left py-2">CREATED AT</th>
//                                             <th className="text-left py-2">UPDATED AT</th>
//                                             <th className="py-2 pr-6 text-right">STATUS</th>
//                                             <th className="py-2 pr-6 text-right">ACTIONS</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentLeads.map((lead) => (
//                                             <TableRowTransactionLead
//                                                 key={lead.id}
//                                                 lead={lead}
//                                                 onEdit={handleOpenEditModal}
//                                                 onDelete={handleOpenDeleteModal}
//                                                 onDetail={() => { }}
//                                                 onColumnChange={handleColumnChange}
//                                                 columns={columns} // Pass columns to TableRowTransactionLead
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                     {leads.length > leadsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             <button
//                                 onClick={prevPage}
//                                 disabled={currentPage === 1}
//                                 className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 Previous
//                             </button>
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <button
//                                     key={index + 1}
//                                     onClick={() => paginate(index + 1)}
//                                     className={`px-4 py-2 rounded-lg shadow-md transition-colors ${currentPage === index + 1
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-white text-gray-700 hover:bg-gray-200'
//                                         }`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             ))}
//                             <button
//                                 onClick={nextPage}
//                                 disabled={currentPage === totalPages}
//                                 className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </main>
//             </div>

//             {leadToEdit && (
//                 <EditLeadModal
//                     isOpen={isEditModalOpen}
//                     onClose={handleCloseEditModal}
//                     onSave={handleSaveEditedLead}
//                     initialData={leadToEdit}
//                     isSubmitting={router.processing} // Use router.processing or a form.processing if applicable
//                 />
//             )}

//             {isDeleteModalOpen && leadToDelete && (
//                 <DeleteLeadModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={handleCloseDeleteModal}
//                     onDelete={handleDeleteLeadConfirmed}
//                     lead={leadToDelete}
//                     isSubmitting={router.processing} // Use router.processing
//                 />
//             )}
//         </div>
//     );
// };

// export default LeadsIndex;

// import React, { useState, useEffect } from 'react';
// import MySidebar from '../../Layout/Sidebar';
// import EditLeadModal from './editlead';
// import DeleteLeadModal from './deletelead';
// import { LeadDatas } from '@/components/Leads/types';
// import TableRowTransactionLead from '@/components/Tabel/TabelRowLeads';
// import BoardHeader from './boardheader';
// import { usePage, router, useForm } from '@inertiajs/react';

// interface CreateLeadDataResponse extends LeadDatas { }

// interface EditLeadDataPayload {
//     name?: string;
//     company_name?: string;
//     product_id?: string | null;
//     product_name?: string | null;
//     current_price?: number | null;
//     qty?: number | null;
//     grand_total?: number | null;
//     notes?: string;
//     deadline?: string | null;
//     column_id?: string;
// }

// interface LeadsIndexProps {
//     kanbanData: {
//         id: string;
//         title: string;
//         leads: LeadDatas[];
//     }[];
//     columns: { id: string; title: string }[];
// }

// const LeadsIndex: React.FC = () => {
//     const { kanbanData, columns } = usePage<LeadsIndexProps>().props;

//     const [leads, setLeads] = useState<LeadDatas[]>(() => {
//         const allLeads = kanbanData.flatMap(col => col.leads);
//         return allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//     });

//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [leadsPerPage] = useState(10);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [leadToEdit, setLeadToEdit] = useState<LeadDatas | null>(null);
//     const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);

//     useEffect(() => {
//         const allLeads = kanbanData.flatMap(col => col.leads);
//         setLeads(allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
//     }, [kanbanData]);

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(event.target.value);
//         setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
//     };

//     const filteredLeads = leads.filter(lead =>
//         lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const indexOfLastLead = currentPage * leadsPerPage;
//     const indexOfFirstLead = indexOfLastLead - leadsPerPage;
//     const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
//     const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
//     const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
//     const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

//     const { data: newLeadForm, setData: setNewLeadForm, post, processing: isCreatingNewLead, errors: newLeadErrors, reset: resetNewLeadForm } = useForm({});

//     const handleSaveNewLead = async (newlyCreatedLead: CreateLeadDataResponse) => {
//         router.reload({
//             onSuccess: () => {
//                 alert('New lead successfully added!');
//                 setCurrentPage(1);
//             },
//             onError: (errors) => {
//                 console.error("Failed to add lead:", errors);
//                 alert(`Failed to add lead: ${Object.values(errors).join(', ')}`);
//             }
//         });
//     };

//     const handleOpenEditModal = (lead: LeadDatas) => {
//         setLeadToEdit(lead);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setLeadToEdit(null);
//     };

//     const handleSaveEditedLead = async (updatedData: EditLeadDataPayload) => {
//         if (!leadToEdit) return;
//         router.put(`/kanban/leads/${leadToEdit.id}`, updatedData, {
//             onSuccess: () => {
//                 alert('Lead successfully updated!');
//                 handleCloseEditModal();
//             },
//             onError: (errors) => {
//                 console.error("Failed to update lead:", errors);
//                 alert(`Failed to update lead: ${Object.values(errors).join(', ')}`);
//             },
//         });
//     };

//     const handleOpenDeleteModal = (lead: LeadDatas) => {
//         setLeadToDelete(lead);
//         setIsDeleteModalOpen(true);
//     };

//     const handleCloseDeleteModal = () => {
//         setIsDeleteModalOpen(false);
//         setLeadToDelete(null);
//     };

//     const handleDeleteLeadConfirmed = async () => {
//         if (!leadToDelete) return;
//         router.delete(`/kanban/leads/${leadToDelete.id}`, {
//             onSuccess: () => {
//                 alert('Lead successfully deleted!');
//                 handleCloseDeleteModal();
//             },
//             onError: (errors) => {
//                 console.error("Failed to delete lead:", errors);
//                 alert(`Failed to delete lead: ${Object.values(errors).join(', ')}`);
//             },
//         });
//     };

//     const handleColumnChange = async (leadId: string, newColumnId: string) => {
//         router.put(`/kanban/leads/update-status/${leadId}`, { column_id: newColumnId }, {
//             onSuccess: () => {
//                 alert('Lead status updated successfully!');
//             },
//             onError: (errors) => {
//                 console.error("Failed to update lead status:", errors);
//                 alert(`Failed to update lead status: ${Object.values(errors).join(', ')}`);
//             },
//             preserveScroll: true,
//             preserveState: true,
//         });
//     };

//     return (
//         <div className="flex min-h-screen">
//             <MySidebar />
//             <div className="flex flex-col flex-1 overflow-hidden">
//                 <BoardHeader
//                     onSave={handleSaveNewLead}
//                     searchTerm={searchTerm}
//                     onSearchChange={handleSearchChange}
//                 />
//                 <main className="flex-1 p-6 pt-1 p-3">
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         {filteredLeads.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">No leads match your search.</p>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full border-separate border-spacing-y-2">
//                                     <thead>
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2">NAMA</th>
//                                             <th className="text-left py-2">PERUSAHAAN</th>
//                                             <th className="text-left py-2">PRODUCT</th>
//                                             <th className="text-left py-2">DEADLINE</th>
//                                             <th className="text-left py-2">SECTOR</th>
//                                             <th className="text-left py-2">CREATED AT</th>
//                                             <th className="text-left py-2">UPDATED AT</th>
//                                             <th className="py-2 pr-6 text-right">STATUS</th>
//                                             <th className="py-2 pr-6 text-right">ACTIONS</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentLeads.map((lead) => (
//                                             <TableRowTransactionLead
//                                                 key={lead.id}
//                                                 lead={lead}
//                                                 onEdit={handleOpenEditModal}
//                                                 onDelete={handleOpenDeleteModal}
//                                                 onDetail={() => { }}
//                                                 onColumnChange={handleColumnChange}
//                                                 columns={columns}
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {filteredLeads.length > leadsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50">
//                                 Previous
//                             </button>
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <button
//                                     key={index + 1}
//                                     onClick={() => paginate(index + 1)}
//                                     className={`px-4 py-2 rounded-lg shadow-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             ))}
//                             <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50">
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </main>
//             </div>

//             {leadToEdit && (
//                 <EditLeadModal
//                     isOpen={isEditModalOpen}
//                     onClose={handleCloseEditModal}
//                     onSave={handleSaveEditedLead}
//                     initialData={leadToEdit}
//                     isSubmitting={router.processing}
//                 />
//             )}

//             {isDeleteModalOpen && leadToDelete && (
//                 <DeleteLeadModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={handleCloseDeleteModal}
//                     onDelete={handleDeleteLeadConfirmed}
//                     lead={leadToDelete}
//                     isSubmitting={router.processing}
//                 />
//             )}
//         </div>
//     );
// };

// export default LeadsIndex;


// import React, { useState, useEffect } from 'react';
// import MySidebar from '../../Layout/Sidebar';
// import EditLeadModal from './editlead'; // Assuming editlead.tsx exports the modal
// import DeleteLeadModal from './deletelead'; // Assuming deletelead.tsx exports the modal
// import { LeadDatas, ContactOption, ProductOption } from '@/components/Leads/types';
// import TableRowTransactionLead from '@/components/Tabel/TabelRowLeads';
// import BoardHeader from './boardheader'; // Assuming this component exists
// import { usePage, router, useForm } from '@inertiajs/react';
// import Swal from 'sweetalert2';

// interface CreateLeadDataResponse extends LeadDatas { } // This type is for the return of a create operation, which seems to reload the page anyway.

// interface EditLeadDataPayload {
//     // This interface defines the shape of data sent when editing,
//     // It should match TransactionPayload from types, with extra fields if needed for display.
//     // However, the `EditTransactionModal` is sending `TransactionPayload` directly.
//     name?: string; // Not sent in payload, derived from contact_id
//     company_name?: string; // Not sent in payload, derived from contact_id
//     product_id?: string | null;
//     product_name?: string | null; // Not sent in payload, derived from product_id
//     current_price?: number | null;
//     qty?: number | null;
//     grand_total?: number | null; // Calculated server-side
//     notes?: string;
//     deadline?: string | null;
//     column_id?: string; // This can be updated via `updateStatus`
//     contact_id?: string; // Added for clarity, though it's part of TransactionPayload
//     discount_amount?: number | null; // Added for clarity
// }

// interface LeadsIndexProps {
//     kanbanData: {
//         id: string;
//         name: string;
//         leads: LeadDatas[];
//     }[];
//     columns: { id: string; name: string }[];
//     contacts: ContactOption[]; // Added contacts to props
//     products: ProductOption[]; // Added products to props
// }

// const LeadsIndex: React.FC = () => {
//     // Destructure contacts and products from usePage().props
//     const { kanbanData, columns, contacts, products } = usePage<LeadsIndexProps>().props;

//     const [leads, setLeads] = useState<LeadDatas[]>(() => {
//         const allLeads = kanbanData.flatMap(col => col.leads);
//         return allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//     });

//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [leadsPerPage] = useState(10);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [leadToEdit, setLeadToEdit] = useState<LeadDatas | null>(null);
//     const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);

//     useEffect(() => {
//         const allLeads = kanbanData.flatMap(col => col.leads);
//         setLeads(allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
//     }, [kanbanData]);

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(event.target.value);
//         setCurrentPage(1); // Reset to first page on search change
//     };

//     const filteredLeads = leads.filter(lead =>
//         lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.product?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const indexOfLastLead = currentPage * leadsPerPage;
//     const indexOfFirstLead = indexOfLastLead - leadsPerPage;
//     const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
//     const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
//     const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
//     const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

//     // This useForm is likely for a "Create New Lead" modal (BoardHeader)
//     const { data: newLeadForm, setData: setNewLeadForm, post, processing: isCreatingNewLead, errors: newLeadErrors, reset: resetNewLeadForm } = useForm({});

//     const handleSaveNewLead = async (newlyCreatedLead: CreateLeadDataResponse) => {
//         router.reload({
//             onSuccess: () => {
//                 alert('New lead successfully added!');
//                 setCurrentPage(1);
//             },
//             onError: (errors) => {
//                 console.error("Failed to add lead:", errors);
//                 alert(`Failed to add lead: ${Object.values(errors).join(', ')}`);
//             }
//         });
//     };

//     const handleOpenEditModal = (lead: LeadDatas) => {
//         setLeadToEdit(lead);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setLeadToEdit(null);
//     };

//     // The onSave callback from EditTransactionModal receives a LeadDatas object from backend success
//     const handleSaveEditedLead = async (updatedLeadData: LeadDatas) => {
//         // No need to manually update state here, as router.reload will re-fetch data
//         Swal.fire({ icon: 'success', title: 'Lead dipindahkan!', timer: 1500, showConfirmButton: false });
//         handleCloseEditModal();
//         // The router.reload in the modal's onSubmit will handle re-fetching `kanbanData` for LeadsIndex
//     };

//     const handleOpenDeleteModal = (lead: LeadDatas) => {
//         setLeadToDelete(lead);
//         setIsDeleteModalOpen(true);
//     };

//     const handleCloseDeleteModal = () => {
//         setIsDeleteModalOpen(false);
//         setLeadToDelete(null);
//     };

//     const handleDeleteLeadConfirmed = async () => {
//         if (!leadToDelete) return;
//         router.delete(`/kanban/leads/${leadToDelete.id}`, {
//             onSuccess: () => {
//                 // alert('Lead successfully deleted!');
//                 Swal.fire({ icon: 'success', title: 'Lead berhasil dihapus!', timer: 1500, showConfirmButton: false });
//                 handleCloseDeleteModal();
//                 router.reload(); // Reload after delete
//             },
//             onError: (errors) => {
//                 console.error("Failed to delete lead:", errors);
//                 alert(`Failed to delete lead: ${Object.values(errors).join(', ')}`);
//             },
//         });
//     };

//     const handleColumnChange = async (leadId: string, newColumnId: string) => {
//         router.put(`/kanban/leads/update-status/${leadId}`, { column_id: newColumnId }, {
//             onSuccess: () => {
//                 Swal.fire({ icon: 'success', title: 'Lead berhasil diperbaharui!', timer: 1500, showConfirmButton: false });
//             },
//             onError: (errors) => {
//                 console.error("Failed to update lead status:", errors);
//                 alert(`Failed to update lead status: ${Object.values(errors).join(', ')}`);
//             },
//             preserveScroll: true,
//             preserveState: true, // Preserve form state and scroll position
//         });
//     };

//     return (
//         <div className="flex min-h-screen">
//             <MySidebar />
//             <div className="flex flex-col flex-1 overflow-hidden">
//                 <BoardHeader
//                     onSave={handleSaveNewLead}
//                     searchTerm={searchTerm}
//                     onSearchChange={handleSearchChange}
//                 />
//                 <main className="flex-1 p-6 pt-1 p-3">
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         {filteredLeads.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">No leads match your search.</p>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full border-separate border-spacing-y-2">
//                                     <thead>
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2">NAMA</th>
//                                             <th className="text-left py-2">PERUSAHAAN</th>
//                                             <th className="text-left py-2">PRODUCT</th>
//                                             <th className="text-left py-2">DEADLINE</th>
//                                             <th className="text-left py-2">SECTOR</th>
//                                             <th className="text-left py-2">CREATED AT</th>
//                                             <th className="text-left py-2">UPDATED AT</th>
//                                             <th className="py-2 pr-6 text-right">STATUS</th>
//                                             <th className="py-2 pr-6 text-right">ACTIONS</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentLeads.map((lead) => (
//                                             <TableRowTransactionLead
//                                                 key={lead.id}
//                                                 lead={lead}
//                                                 onEdit={handleOpenEditModal}
//                                                 onDelete={handleOpenDeleteModal}
//                                                 onDetail={() => { /* Implement detail view logic here if needed */ }}
//                                                 onColumnChange={handleColumnChange}
//                                                 columns={columns}
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {filteredLeads.length > leadsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50">
//                                 Previous
//                             </button>
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <button
//                                     key={index + 1}
//                                     onClick={() => paginate(index + 1)}
//                                     className={`px-4 py-2 rounded-lg shadow-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             ))}
//                             <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50">
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </main>
//             </div>

//             {/* Pass contacts and products to EditLeadModal */}
//             {leadToEdit && (
//                 <EditLeadModal
//                     isOpen={isEditModalOpen}
//                     onClose={handleCloseEditModal}
//                     onSave={handleSaveEditedLead}
//                     initialData={leadToEdit}
//                     isSubmitting={router.processing}
//                     contacts={contacts} // Pass contacts
//                     products={products} // Pass products
//                 />
//             )}

//             {isDeleteModalOpen && leadToDelete && (
//                 <DeleteLeadModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={handleCloseDeleteModal}
//                     onDelete={handleDeleteLeadConfirmed}
//                     lead={leadToDelete}
//                     isSubmitting={router.processing}
//                 />
//             )}
//         </div>
//     );
// };

// export default LeadsIndex;


import React, { useState, useEffect } from 'react';
import MySidebar from '../../Layout/Sidebar';
import EditLeadModal from './editlead'; // Asumsi editlead.tsx mengekspor modal
import DeleteLeadModal from './deletelead'; // Asumsi deletelead.tsx mengekspor modal
import { LeadDatas, ContactOption, ProductOption } from '@/components/Leads/types';
import TableRowTransactionLead from '@/components/Tabel/TabelRowLeads';
import BoardHeader from './boardheader'; // Asumsi komponen ini ada
import { usePage, router, useForm, Head } from '@inertiajs/react';
import Swal from 'sweetalert2';

// Interface untuk respons setelah membuat lead baru, jika ada.
// Meskipun router.reload biasanya akan me-refresh semua data.
interface CreateLeadDataResponse extends LeadDatas { }

// Interface untuk payload data saat mengedit lead.
// Menyesuaikan dengan data yang akan dikirim ke backend.
interface EditLeadDataPayload {
    name?: string; // Tidak dikirim dalam payload, diambil dari contact_id
    company_name?: string; // Tidak dikirim dalam payload, diambil dari contact_id
    product_id?: string | null;
    product_name?: string | null; // Tidak dikirim dalam payload, diambil dari product_id
    current_price?: number | null;
    qty?: number | null;
    grand_total?: number | null; // Dihitung di sisi server
    notes?: string;
    deadline?: string | null;
    column_id?: string; // Ini bisa diperbarui via `updateStatus`
    contact_id?: string; // Ditambahkan untuk kejelasan
    discount_amount?: number | null; // Ditambahkan untuk kejelasan
}

// Interface untuk props yang diterima dari Inertia
interface LeadsIndexProps {
    kanbanData: {
        id: string;
        title: string;
        leads: LeadDatas[];
    }[];
    columns: { id: string; name: string }[]; // Menggunakan 'name' untuk nama kolom, sesuai dengan backend terbaru
    contacts: ContactOption[];
    products: ProductOption[];
}

const LeadsIndex: React.FC = () => {
    // Destrukturisasi properti yang diterima dari Inertia page props
    const { kanbanData, columns, contacts, products } = usePage<LeadsIndexProps>().props;

    // State untuk menyimpan daftar leads, diinisialisasi dari kanbanData
    const [leads, setLeads] = useState<LeadDatas[]>(() => {
        const allLeads = kanbanData.flatMap(col => col.leads);
        // Urutkan berdasarkan tanggal dibuat terbaru
        return allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });

    // State untuk fungsionalitas pencarian, paginasi, dan modal
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

    // Efek untuk memperbarui daftar leads ketika kanbanData berubah (misalnya, setelah reload Inertia)
    useEffect(() => {
        const allLeads = kanbanData.flatMap(col => col.leads);
        setLeads(allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    }, [kanbanData]);

    // Handler untuk perubahan input pencarian
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
    };

    // Filter leads berdasarkan searchTerm
    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.product?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Logika paginasi
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
    const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

    // Handler untuk menyimpan lead baru (dipicu dari BoardHeader -> AddLeadModal)
    const handleSaveNewLead = async (newlyCreatedLead: CreateLeadDataResponse) => {
        router.reload({
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Lead baru berhasil ditambahkan!', timer: 1500, showConfirmButton: false });
                setCurrentPage(1); // Kembali ke halaman pertama setelah penambahan
                // Trigger refresh untuk Segmentasi Pasar
                localStorage.setItem('segmentasi_needs_refresh', 'true');
            },
            onError: (errors) => {
                console.error("Failed to add lead:", errors);
                Swal.fire({ icon: 'error', title: 'Gagal!', text: `Gagal menambahkan lead: ${Object.values(errors).join(', ')} ` });
            }
        });
    };

    // Handler untuk membuka modal edit
    const handleOpenEditModal = (lead: LeadDatas) => {
        setLeadToEdit(lead);
        setIsEditModalOpen(true);
    };

    // Handler untuk menutup modal edit
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setLeadToEdit(null);
    };

    // Handler untuk menyimpan lead yang diedit (dipicu dari EditLeadModal)
    // router.reload di dalam modal akan me-refresh data secara otomatis
    const handleSaveEditedLead = async (updatedLeadData: LeadDatas) => {
        Swal.fire({ icon: 'success', title: 'Lead berhasil diperbarui!', timer: 1500, showConfirmButton: false });
        handleCloseEditModal();
        // Router.reload dari dalam modal EditLeadModal akan menangani refresh data.
        // Jika tidak ada router.reload di modal, Anda bisa memanggil router.reload() di sini.
    };

    // Handler untuk membuka modal hapus
    const handleOpenDeleteModal = (lead: LeadDatas) => {
        setLeadToDelete(lead);
        setIsDeleteModalOpen(true);
    };

    // Handler untuk menutup modal hapus
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setLeadToDelete(null);
    };

    // Handler untuk konfirmasi hapus lead
    // const handleDeleteLeadConfirmed = async () => {
    //     if (!leadToDelete) return;
    //     router.delete(`/kanban/leads/ ${leadToDelete.id} `, {
    //         onSuccess: () => {
    //             Swal.fire({ icon: 'success', title: 'Lead berhasil dihapus!', timer: 1500, showConfirmButton: false });
    //             handleCloseDeleteModal();
    //             router.reload(); // Reload halaman setelah hapus
    //         },
    //         onError: (errors) => {
    //             console.error("Failed to delete lead:", errors);
    //             Swal.fire({ icon: 'error', title: 'Gagal!', text: `Gagal menghapus lead: ${Object.values(errors).join(', ')} ` });
    //         },
    //     });
    // };

    const handleDeleteModalConfirm = (leadId: string) => {
        router.delete(`/kanban/leads/${leadId}`, {
            onSuccess: () => {
                setLeads(prev => prev.filter(l => l.id !== leadId));
                Swal.fire({ icon: 'success', title: 'Lead dihapus!', timer: 1500, showConfirmButton: false });
            },
        });
        setIsDeleteModalOpen(false);
    };

    // Handler untuk mengubah kolom (status) lead
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
            preserveScroll: true, // Pertahankan posisi scroll
            preserveState: true, // Pertahankan state form (jika ada)
        });
    };

    return (
        <>
            <Head title={getCurrentViewTitle()} />
            <div className="flex min-h-screen">
                <MySidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                {/* BoardHeader yang menerima props contacts, products, dan columns */}
                <BoardHeader
                    onSave={handleSaveNewLead}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    contacts={contacts}
                    products={products}
                    columns={columns}
                />
                <main className="flex-1 p-6 pt-1 p-3">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {filteredLeads.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">Tidak ada lead yang cocok dengan pencarian Anda.</p>
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
                                                onDetail={() => { /* Implementasi detail view logic di sini jika diperlukan */ }}
                                                onColumnChange={handleColumnChange}
                                                columns={columns}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Kontrol Paginasi */}
                    {filteredLeads.length > leadsPerPage && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50">
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`px - 4 py - 2 rounded - lg shadow - md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'} `}
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

            {/* Modal Edit Lead, menerima props contacts dan products */}
            {leadToEdit && (
                <EditLeadModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveEditedLead}
                    initialData={leadToEdit}
                    isSubmitting={router.processing}
                    contacts={contacts}
                    products={products}
                    columns={columns} // Juga pass columns ke EditLeadModal
                />
            )}

            {/* Modal Delete Lead */}
            {isDeleteModalOpen && leadToDelete && (
                // <DeleteLeadModal
                //     isOpen={isDeleteModalOpen}
                //     onClose={handleCloseDeleteModal}
                //     onDelete={handleDeleteLeadConfirmed}
                //     lead={leadToDelete}
                //     isSubmitting={router.processing}
                // />
                <DeleteLeadModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteModalConfirm}
                    lead={leadToDelete}
                />
            )}
        </div>
    </>
    );
};

export default LeadsIndex;

