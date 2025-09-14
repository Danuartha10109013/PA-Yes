// import React, { useState, useEffect } from 'react';
// import LeadColumn from '@/components/Leads/KanbanColumn'; // Ensure path is correct
// import { LeadDatas, ColumnData } from '@/components/Leads/types';
// import MySidebar from '../../Layout/Sidebar';
// import AddLeadModal from './addlead'; // Ensure path is correct and consistent with BoardHeader/LeadColumn
// import DeleteLeadModal from './deletelead';
// import BoardHeader from './boardheader'; // Import the BoardHeader component
// import Swal from 'sweetalert2';

// const BoardView: React.FC = () => {
//     const [columns, setColumns] = useState<ColumnData[]>([]);
//     const [leads, setLeads] = useState<LeadDatas[]>([]);
//     const [draggedLead, setDraggedLead] = useState<LeadDatas | null>(null);
//     const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // State for managing the Delete Lead Modal
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);

//     // New state for search term
//     const [searchTerm, setSearchTerm] = useState<string>('');

//     useEffect(() => {
//         const fetchKanbanData = async () => {
//             try {
//                 const response = await fetch('/kanban/leads');
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json(); // data is an array of columns, each with a 'leads' array

//                 // Map columns
//                 setColumns(data.map((col: any) => ({
//                     id: col.id,
//                     title: col.title,
//                     // Add default properties if not available from backend or names differ
//                     bgColor: col.bgColor || 'bg-gray-100',
//                     borderColor: col.borderColor || 'border-gray-300',
//                     titleColor: col.titleColor || 'text-gray-600',
//                     dotBorderColor: col.dotBorderColor || 'border-gray-400',
//                     dotBgColor: col.dotBgColor || 'bg-transparent',
//                     dotTextColor: col.dotTextColor || 'text-gray-400',
//                     addLeadColor: col.addLeadColor || 'text-gray-700',
//                 })));

//                 // FlatMap leads from all columns and ensure they conform to LeadDatas interface
//                 const allLeads: LeadDatas[] = data.flatMap((col: any) =>
//                     col.leads.map((lead: any) => ({
//                         // Mapping to ensure property names and data types match LeadDatas
//                         id: lead.id,
//                         trx: lead.trx || `TRX-${lead.id ? lead.id.substring(0, 8) : Math.random().toString(36).substring(2, 10)}`, // Fallback for trx
//                         name: lead.name,
//                         company_name: lead.company_name,
//                         product: lead.product,
//                         product_id: lead.product_id,
//                         deadline: lead.deadline, // Should already be in YYYY-MM-DD format
//                         current_price: parseFloat(lead.current_price),
//                         qty: parseInt(lead.qty),
//                         grand_total: parseFloat(lead.grand_total),
//                         notes: lead.notes,
//                         columnId: lead.columnId || lead.column_id || col.id, // Secure from 'columnId' or 'column_id' or parent column ID
//                         sector: lead.sector || null,
//                         sector_id: lead.sector_id || null,
//                         sectorColor: lead.sectorColor || lead.sector_color || null,
//                         assigneeInitials: lead.assigneeInitials || null,
//                         assigneeBgColor: lead.assigneeBgColor || null,
//                         created_at: lead.created_at, // Should already be in ISO string format
//                         updated_at: lead.updated_at, // Should already be in ISO string format
//                         contact_id: lead.contact_id,
//                         phone: lead.phone || '',
//                         email: lead.email || '',
//                         social_media: lead.social_media || [],
//                         address: lead.address || [],
//                     }))
//                 );
//                 setLeads(allLeads);
//             } catch (err: any) {
//                 console.error("Failed to fetch Kanban data:", err);
//                 setError(err.message || "Failed to load Kanban board.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchKanbanData();

//         const handleOutsideClick = (e: MouseEvent) => {
//             const dropdowns = document.querySelectorAll('.dropdown.open');
//             dropdowns.forEach(el => {
//                 if (!el.contains(e.target as Node)) {
//                     el.classList.remove('open');
//                 }
//             });
//         };
//         document.addEventListener('click', handleOutsideClick);

//         const handleKeyDown = (e: KeyboardEvent) => {
//             if (e.key === 'Escape') {
//                 document.querySelectorAll('.dropdown.open').forEach(el => {
//                     el.classList.remove('open');
//                 });
//             }
//         };
//         document.addEventListener('keydown', handleKeyDown);

//         return () => {
//             document.removeEventListener('click', handleOutsideClick);
//             document.removeEventListener('keydown', handleKeyDown);
//         };
//     }, []);

//     const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => {
//         setDraggedLead(lead);
//         e.dataTransfer.effectAllowed = 'move';
//         e.dataTransfer.setData('text/plain', lead.id);
//     };

//     const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
//         setDraggedLead(null);
//         setDragOverColumnId(null);
//     };

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
//         e.preventDefault();
//         if (draggedLead && draggedLead.columnId !== columnId) {
//             setDragOverColumnId(columnId);
//         }
//     };

//     const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//         const target = e.currentTarget as HTMLElement;
//         if (!target.contains(e.relatedTarget as Node)) {
//             setDragOverColumnId(null);
//         }
//     };

//     const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
//         e.preventDefault();
//         setDragOverColumnId(null);

//         if (!draggedLead) return;
//         if (draggedLead.columnId === targetColumnId) return;

//         const originalLead = draggedLead;
//         const originalColumnId = draggedLead.columnId;

//         // Optimistic UI update
//         setLeads(prevLeads =>
//             prevLeads.map(lead =>
//                 lead.id === originalLead.id ? { ...lead, columnId: targetColumnId } : lead
//             )
//         );

//         const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//         if (!csrfToken) {
//             console.error("CSRF token not found. Aborting update.");
//             setError("Security error: CSRF token missing.");
//             // Rollback UI
//             setLeads(prevLeads =>
//                 prevLeads.map(lead =>
//                     lead.id === originalLead.id ? { ...lead, columnId: originalColumnId } : lead
//                 )
//             );
//             return;
//         }

//         const payload = {
//             leadId: originalLead.id,
//             newColumnId: targetColumnId,
//         };

//         try {
//             const response = await fetch('/kanban/leads/update-column', {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     'X-CSRF-TOKEN': csrfToken,
//                 },
//                 body: JSON.stringify(payload),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to update lead column on the server.');
//             }

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Updated!',
//                 text: 'Lead berhasil diperbarui!',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//             console.log('✅ Lead column successfully updated on the server.');
//         } catch (err: any) {
//             console.error("❌ Error updating lead column:", err);
//             setError(`Failed to move lead: ${err.message}`);

//             // Rollback UI if API call fails
//             setLeads(prevLeads =>
//                 prevLeads.map(lead =>
//                     lead.id === originalLead.id ? { ...lead, columnId: originalColumnId } : lead
//                 )
//             );

//         }
//     };

//     const handleAddLead = (newLead: LeadDatas) => {
//         setLeads(prevLeads => [...prevLeads, newLead]);
//     };

//     // Handler to open the delete modal
//     const handleDeleteLead = (lead: LeadDatas) => {
//         setLeadToDelete(lead);
//         setIsDeleteModalOpen(true);
//     };

//     // Handler to close the delete modal
//     const handleDeleteModalClose = () => {
//         setIsDeleteModalOpen(false);
//         setLeadToDelete(null); // Clear the lead to delete
//     };

//     // Handler for confirming deletion from the modal
//     const handleDeleteModalConfirm = async (leadId: string) => {
//         const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//         if (!csrfToken) {
//             console.error("CSRF token not found. Aborting deletion.");
//             setError("Security error: CSRF token missing.");
//             handleDeleteModalClose();
//             return;
//         }

//         try {
//             const response = await fetch(`/kanban/leads/${leadId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     'X-CSRF-TOKEN': csrfToken,
//                 },
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to delete lead from the server.');
//             }

//             // Remove the lead from the state after successful deletion
//             setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Deleted!',
//                 text: 'Lead berhasil dihapus.',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//             handleDeleteModalClose(); // Close the modal
//         } catch (err: any) {
//             console.error("❌ Error deleting lead:", err);
//             setError(`Failed to delete lead: ${err.message}`);
//             handleDeleteModalClose(); // Close the modal even on error
//         }
//     };

//     const handleEditLeadSuccess = (updatedLead: LeadDatas) => {
//         setLeads(prevLeads =>
//             prevLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead))
//         );
//     };

//     // Handler for search input change
//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(event.target.value);
//     };

//     // Filtered leads based on search term - *** THIS IS THE FIXED SECTION ***
//     const filteredLeads = leads.filter(lead => {
//         const lowerCaseSearchTerm = searchTerm.toLowerCase();

//         // Use nullish coalescing operator (??) to treat null/undefined values as empty strings
//         const leadName = lead.name ?? '';
//         const companyName = lead.company_name ?? '';
//         const productName = lead.product ?? '';
//         const trxId = lead.trx ?? ''; // Assuming trx can be null/undefined as well

//         return (
//             leadName.toLowerCase().includes(lowerCaseSearchTerm) ||
//             companyName.toLowerCase().includes(lowerCaseSearchTerm) ||
//             productName.toLowerCase().includes(lowerCaseSearchTerm) ||
//             trxId.toLowerCase().includes(lowerCaseSearchTerm)
//         );
//     });


//     if (error) {
//         return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
//     }

//     return (
//         <div className="flex h-screen overflow-hidden">
//             <MySidebar />
//             <div className="flex flex-col flex-1 overflow-hidden">
//                 <BoardHeader onSave={handleAddLead} searchTerm={searchTerm} onSearchChange={handleSearchChange} />

//                 <div className="flex space-x-4 overflow-x-auto pb-2 pt-1 p-3">
//                     {columns.map((column) => (
//                         <LeadColumn
//                             key={column.id}
//                             column={column}
//                             // Pass filteredLeads to each column
//                             leads={filteredLeads.filter((lead) => lead.columnId === column.id)}
//                             onDragStart={handleDragStart}
//                             onDragEnd={handleDragEnd}
//                             onDragOver={handleDragOver}
//                             onDragLeave={handleDragLeave}
//                             onDrop={handleDrop}
//                             isDragOver={dragOverColumnId === column.id}
//                             onAddLead={handleAddLead}
//                             onEditLeadSuccess={handleEditLeadSuccess}
//                             onDeleteLead={handleDeleteLead}
//                         />
//                     ))}
//                 </div>
//             </div>

//             <DeleteLeadModal
//                 isOpen={isDeleteModalOpen}
//                 onClose={handleDeleteModalClose}
//                 onDelete={handleDeleteModalConfirm}
//                 lead={leadToDelete}
//             />
//         </div>
//     );
// };

// export default BoardView;

// resources/js/Pages/Kanban/BoardView.tsx
// import React, { useEffect, useState } from 'react';
// import { Head, router, usePage } from '@inertiajs/react';

// import LeadColumn from '@/components/Leads/KanbanColumn';
// import { LeadDatas, ColumnData } from '@/components/Leads/types';
// import MySidebar from '../../Layout/Sidebar';
// import AddLeadModal from './addlead';
// import DeleteLeadModal from './deletelead';
// import BoardHeader from './boardheader';
// import Swal from 'sweetalert2';

// const BoardView: React.FC = () => {
//     const { kanbanData }: any = usePage().props;

//     const [columns, setColumns] = useState<ColumnData[]>([]);
//     const [leads, setLeads] = useState<LeadDatas[]>([]);
//     const [draggedLead, setDraggedLead] = useState<LeadDatas | null>(null);
//     const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const { props } = usePage();
//     const errors = props.errors as { message?: string };
//     const success = props.success as string | undefined;


//     useEffect(() => {
//         if (errors?.message) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Gagal!',
//                 text: errors.message,
//             });
//         } else if (success) {
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Berhasil!',
//                 text: success,
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//         }
//     }, [errors, success]);

//     useEffect(() => {
//         setColumns(kanbanData.map((col: any) => ({
//             id: col.id,
//             title: col.title,
//             bgColor: col.bgColor || 'bg-gray-100',
//             borderColor: col.borderColor || 'border-gray-300',
//             titleColor: col.titleColor || 'text-gray-600',
//             dotBorderColor: col.dotBorderColor || 'border-gray-400',
//             dotBgColor: col.dotBgColor || 'bg-transparent',
//             dotTextColor: col.dotTextColor || 'text-gray-400',
//             addLeadColor: col.addLeadColor || 'text-gray-700',
//         })));


//         const allLeads: LeadDatas[] = kanbanData.flatMap((col: any) =>
//             col.leads.map((lead: any) => ({
//                 ...lead,
//                 columnId: lead.columnId || col.id,
//             }))
//         );
//         setLeads(allLeads);
//     }, [kanbanData]);

//     const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => {
//         setDraggedLead(lead);
//         e.dataTransfer.effectAllowed = 'move';
//     };

//     const handleDragEnd = () => setDraggedLead(null);

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
//         e.preventDefault();
//         setDragOverColumnId(columnId);
//     };

//     const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//         if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
//             setDragOverColumnId(null);
//         }
//     };

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
//         e.preventDefault();
//         setDragOverColumnId(null);

//         if (!draggedLead || draggedLead.columnId === targetColumnId) return;

//         const originalLead = draggedLead;

//         setLeads(prev =>
//             prev.map(lead => lead.id === originalLead.id ? { ...lead, columnId: targetColumnId } : lead)
//         );

//         router.put('/kanban/leads/update-column', {
//             leadId: originalLead.id,
//             newColumnId: targetColumnId,
//         }, {
//             onSuccess: () => {
//                 Swal.fire({ icon: 'success', title: 'Lead dipindahkan!', timer: 1500, showConfirmButton: false });
//             },
//             onError: () => {
//                 setError('Failed to move lead.');
//                 setLeads(prev =>
//                     prev.map(lead => lead.id === originalLead.id ? { ...lead, columnId: originalLead.columnId } : lead)
//                 );
//             }
//         });
//     };

//     const handleAddLead = (newLead: LeadDatas) => setLeads(prev => [...prev, newLead]);

//     const handleDeleteLead = (lead: LeadDatas) => {
//         setLeadToDelete(lead);
//         setIsDeleteModalOpen(true);
//     };

//     const handleDeleteModalConfirm = (leadId: string) => {
//         router.delete(`/kanban/leads/${leadId}`, {
//             onSuccess: () => {
//                 setLeads(prev => prev.filter(l => l.id !== leadId));
//                 Swal.fire({ icon: 'success', title: 'Lead dihapus!', timer: 1500, showConfirmButton: false });
//             },
//             onError: () => setError('Failed to delete lead.'),
//         });
//         setIsDeleteModalOpen(false);
//     };

//     const filteredLeads = leads.filter((lead) =>
//         [lead.name, lead.company_name, lead.trx, lead.product]
//             .some(field => (field || '').toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     return (
//         <>
//             <Head title="Kanban Board" />
//             <div className="flex h-screen overflow-hidden">
//                 <MySidebar />
//                 <div className="flex flex-col flex-1 overflow-hidden">
//                     <BoardHeader
//                         onSave={handleAddLead}
//                         searchTerm={searchTerm}
//                         onSearchChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <div className="flex space-x-4 overflow-x-auto pb-2 pt-1 p-3">
//                         {columns.map(column => (
//                             <LeadColumn
//                                 key={column.id}
//                                 column={column}
//                                 leads={filteredLeads.filter(l => l.columnId === column.id)}
//                                 onDragStart={handleDragStart}
//                                 onDragEnd={handleDragEnd}
//                                 onDragOver={handleDragOver}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={handleDrop}
//                                 isDragOver={dragOverColumnId === column.id}
//                                 onAddLead={handleAddLead}
//                                 onEditLeadSuccess={(updated) =>
//                                     setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
//                                 }
//                                 onDeleteLead={handleDeleteLead}
//                             />
//                         ))}
//                     </div>
//                 </div>
//                 <DeleteLeadModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={() => setIsDeleteModalOpen(false)}
//                     onDelete={handleDeleteModalConfirm}
//                     lead={leadToDelete}
//                 />
//             </div>
//         </>
//     );
// };

// export default BoardView;


// resources/js/Pages/Kanban/index.tsx

// import React, { useEffect, useState } from 'react';
// import { Head, router, usePage } from '@inertiajs/react';
// import Swal from 'sweetalert2';

// // Import komponen dan tipe
// import LeadColumn from '@/components/Leads/KanbanColumn';
// import { LeadDatas, ColumnData, ContactOption, ProductOption } from '@/components/Leads/types'; // Import tipe yang sudah diperbaiki
// import MySidebar from '../../Layout/Sidebar';
// import AddLeadModal from './addlead';
// import DeleteLeadModal from './deletelead';
// import BoardHeader from './boardheader';

// const BoardView: React.FC = () => {
//     // Destrukturisasi props dari usePage().props, dengan default array kosong
//     // untuk memastikan contacts dan products selalu berupa array.
//     // kanbanData juga dibuat opsional di tipe untuk kompatibilitas Inertia.PageProps.
//     const {
//         kanbanData,
//         contacts: initialContacts = [],
//         products: initialProducts = [],
//     }: {
//         kanbanData?: any[]; // kanbanData dibuat opsional di tipe
//         contacts?: ContactOption[];
//         products?: ProductOption[];
//         errors?: any; // Menggunakan 'any' untuk errors jika strukturnya kompleks/tidak fix
//         success?: string;
//     } = usePage().props;

//     console.log('contacts:', initialContacts);
//     console.log('products:', initialProducts);


//     const [columns, setColumns] = useState<ColumnData[]>([]);
//     const [leads, setLeads] = useState<LeadDatas[]>([]);
//     const [draggedLead, setDraggedLead] = useState<LeadDatas | null>(null);
//     const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null); // Tipe yang benar: LeadDatas | null
//     const [error, setError] = useState<string | null>(null);

//     // State untuk AddLeadModal
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
//     const [addLeadInitialColumnId, setAddLeadInitialColumnId] = useState<string>('');

//     // Akses errors dan success dari page props untuk SweetAlert
//     const { props } = usePage();
//     const errors = props.errors as { message?: string };
//     const success = props.success as string | undefined;

//     // Efek untuk menampilkan pesan SweetAlert
//     useEffect(() => {
//         if (errors?.message) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Gagal!',
//                 text: errors.message,
//             });
//         } else if (success) {
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Berhasil!',
//                 text: success,
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//         }
//     }, [errors, success]);

//     // Efek untuk menginisialisasi kolom dan lead dari kanbanData
//     useEffect(() => {
//         if (kanbanData) { // Pastikan kanbanData tidak undefined sebelum memproses
//             setColumns(kanbanData.map((col: any) => ({
//                 id: col.id,
//                 title: col.title,
//                 bgColor: col.bgColor || 'bg-gray-100',
//                 borderColor: col.borderColor || 'border-gray-300',
//                 titleColor: col.titleColor || 'text-gray-600',
//                 dotBorderColor: col.dotBorderColor || 'border-gray-400',
//                 dotBgColor: col.dotBgColor || 'bg-transparent',
//                 dotTextColor: col.dotTextColor || 'text-gray-400',
//                 addLeadColor: col.addLeadColor || 'text-gray-700',
//             })));

//             const allLeads: LeadDatas[] = kanbanData.flatMap((col: any) =>
//                 col.leads.map((lead: any) => ({
//                     ...lead,
//                     columnId: lead.columnId || col.id,
//                     // Pastikan social_media dan address adalah string atau null
//                     social_media: typeof lead.social_media === 'string' ? lead.social_media : (lead.social_media ? JSON.stringify(lead.social_media) : null),
//                     address: typeof lead.address === 'string' ? lead.address : (lead.address ? JSON.stringify(lead.address) : null),
//                 }))
//             );
//             setLeads(allLeads);
//         }
//     }, [kanbanData]); // Dependensi pada kanbanData

//     const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => {
//         setDraggedLead(lead);
//         e.dataTransfer.effectAllowed = 'move';
//     };

//     const handleDragEnd = () => setDraggedLead(null);

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
//         e.preventDefault();
//         setDragOverColumnId(columnId);
//     };

//     const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//         if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
//             setDragOverColumnId(null);
//         }
//     };

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
//         e.preventDefault();
//         setDragOverColumnId(null);

//         if (!draggedLead || draggedLead.columnId === targetColumnId) return;

//         const originalLead = draggedLead;

//         setLeads(prev =>
//             prev.map(lead => lead.id === originalLead.id ? { ...lead, columnId: targetColumnId } : lead)
//         );

//         router.put('/kanban/leads/update-column', {
//             leadId: originalLead.id,
//             newColumnId: targetColumnId,
//         }, {
//             onSuccess: () => {
//                 Swal.fire({ icon: 'success', title: 'Lead dipindahkan!', timer: 1500, showConfirmButton: false });
//             },
//             onError: () => {
//                 setError('Failed to move lead.');
//                 setLeads(prev =>
//                     prev.map(lead => lead.id === originalLead.id ? { ...lead, columnId: originalLead.columnId } : lead)
//                 );
//             }
//         });
//     };

//     // Fungsi untuk membuka Add Lead Modal
//     const openAddLeadModal = (columnId: string = '') => {
//         setAddLeadInitialColumnId(columnId);
//         setIsAddLeadModalOpen(true);
//     };

//     // Fungsi untuk menutup Add Lead Modal
//     const handleCloseAddLeadModal = () => {
//         setIsAddLeadModalOpen(false);
//         setAddLeadInitialColumnId(''); // Reset initial column ID
//     };

//     // Fungsi untuk menangani penyimpanan lead baru (setelah panggilan API berhasil)
//     const handleSaveNewLead = (newLead: LeadDatas) => {
//         setLeads(prev => [...prev, newLead]);
//     };

//     const handleDeleteLead = (lead: LeadDatas) => {
//         setLeadToDelete(lead);
//         setIsDeleteModalOpen(true);
//     };

//     const handleDeleteModalConfirm = (leadId: string) => {
//         router.delete(`/kanban/leads/${leadId}`, {
//             onSuccess: () => {
//                 setLeads(prev => prev.filter(l => l.id !== leadId));
//                 Swal.fire({ icon: 'success', title: 'Lead dihapus!', timer: 1500, showConfirmButton: false });
//             },
//             onError: () => setError('Failed to delete lead.'),
//         });
//         setIsDeleteModalOpen(false);
//     };

//     const filteredLeads = leads.filter((lead) =>
//         [lead.name, lead.company_name, lead.trx, lead.product]
//             .some(field => (field || '').toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     return (
//         <>
//             <Head title="Kanban Board" />
//             <div className="flex h-screen overflow-hidden">
//                 <MySidebar />
//                 <div className="flex flex-col flex-1 overflow-hidden">
//                     <BoardHeader
//                         onAddLeadClick={() => openAddLeadModal('')} // Prop onAddLeadClick
//                         searchTerm={searchTerm}
//                         onSearchChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <div className="flex space-x-4 overflow-x-auto pb-2 pt-1 p-3">
//                         {columns.map(column => (
//                             <LeadColumn
//                                 key={column.id}
//                                 column={column}
//                                 leads={filteredLeads.filter(l => l.columnId === column.id)}
//                                 onDragStart={handleDragStart}
//                                 onDragEnd={handleDragEnd}
//                                 onDragOver={handleDragOver}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={handleDrop}
//                                 isDragOver={dragOverColumnId === column.id}
//                                 onAddLead={() => openAddLeadModal(column.id)}
//                                 onEditLeadSuccess={(updated) =>
//                                     setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
//                                 }
//                                 onDeleteLead={handleDeleteLead}
//                             />
//                         ))}
//                     </div>
//                 </div>
//                 <AddLeadModal
//                     isOpen={isAddLeadModalOpen}
//                     onClose={handleCloseAddLeadModal}
//                     onSave={handleSaveNewLead}
//                     initialColumnId={addLeadInitialColumnId}
//                     contacts={initialContacts} // ✅ Ini penting
//                     products={initialProducts} // ✅ Ini penting
//                 />
//                 <DeleteLeadModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={() => setIsDeleteModalOpen(false)}
//                     onDelete={handleDeleteModalConfirm}
//                     lead={leadToDelete}
//                 />
//             </div>
//         </>
//     );
// };

// export default BoardView;


// import React, { useEffect, useState } from 'react';
// import { Head, router, usePage } from '@inertiajs/react';
// import Swal from 'sweetalert2';

// import LeadColumn from '@/components/Leads/KanbanColumn';
// import { LeadDatas, ColumnData, ContactOption, ProductOption } from '@/components/Leads/types';
// import MySidebar from '../../Layout/Sidebar';
// import AddLeadModal from './addlead';
// import DeleteLeadModal from './deletelead';
// import BoardHeader from './boardheader';

// const BoardView: React.FC = () => {
//     const {
//         kanbanData,
//         contacts: contactsFromPage = [],
//         products: productsFromPage = [],
//         errors,
//         success,
//     } = usePage().props;



//     const [contacts, setContacts] = useState<ContactOption[]>([]);
//     const [products, setProducts] = useState<ProductOption[]>([]);


//     // useEffect(() => {
//     //     console.log('✅ contactsFromPage:', contactsFromPage);
//     //     console.log('✅ productsFromPage:', productsFromPage);
//     //     setContacts(contactsFromPage);
//     //     setProducts(productsFromPage);
//     // }, [contactsFromPage, productsFromPage]);

//     useEffect(() => {
//         console.log('✅ contactsFromPage:', contactsFromPage);
//         console.log('✅ productsFromPage:', productsFromPage);
//         setContacts(contactsFromPage);
//         setProducts(productsFromPage);
//     }, [contactsFromPage, productsFromPage]);


//     const [columns, setColumns] = useState<ColumnData[]>([]);
//     const [leads, setLeads] = useState<LeadDatas[]>([]);
//     const [draggedLead, setDraggedLead] = useState<LeadDatas | null>(null);
//     const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
//     const [addLeadInitialColumnId, setAddLeadInitialColumnId] = useState<string>('');

//     useEffect(() => {
//         if (errors?.message) {
//             Swal.fire({ icon: 'error', title: 'Gagal!', text: errors.message });
//         } else if (success) {
//             Swal.fire({ icon: 'success', title: 'Berhasil!', text: success, timer: 2000, showConfirmButton: false });
//         }
//     }, [errors, success]);

//     useEffect(() => {
//         if (kanbanData) {
//             setColumns(kanbanData.map((col: any) => ({
//                 id: col.id,
//                 title: col.title,
//                 bgColor: col.bgColor || 'bg-gray-100',
//                 borderColor: col.borderColor || 'border-gray-300',
//                 titleColor: col.titleColor || 'text-gray-600',
//                 dotBorderColor: col.dotBorderColor || 'border-gray-400',
//                 dotBgColor: col.dotBgColor || 'bg-transparent',
//                 dotTextColor: col.dotTextColor || 'text-gray-400',
//                 addLeadColor: col.addLeadColor || 'text-gray-700',
//             })));

//             const allLeads: LeadDatas[] = kanbanData.flatMap((col: any) =>
//                 col.leads.map((lead: any) => ({
//                     ...lead,
//                     columnId: lead.columnId || col.id,
//                     social_media: typeof lead.social_media === 'string' ? lead.social_media : (lead.social_media ? JSON.stringify(lead.social_media) : null),
//                     address: typeof lead.address === 'string' ? lead.address : (lead.address ? JSON.stringify(lead.address) : null),
//                 }))
//             );
//             setLeads(allLeads);
//         }
//     }, [kanbanData]);

//     const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => {
//         setDraggedLead(lead);
//         e.dataTransfer.effectAllowed = 'move';
//     };

//     const handleDragEnd = () => setDraggedLead(null);

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
//         e.preventDefault();
//         setDragOverColumnId(columnId);
//     };

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
//         e.preventDefault();
//         setDragOverColumnId(null);

//         if (!draggedLead || draggedLead.columnId === targetColumnId) return;

//         const originalLead = draggedLead;

//         setLeads(prev => prev.map(lead =>
//             lead.id === originalLead.id ? { ...lead, columnId: targetColumnId } : lead
//         ));

//         router.put('/kanban/leads/update-column', {
//             leadId: originalLead.id,
//             newColumnId: targetColumnId,
//         }, {
//             onSuccess: () => {
//                 Swal.fire({ icon: 'success', title: 'Lead dipindahkan!', timer: 1500, showConfirmButton: false });
//             },
//             onError: () => {
//                 setLeads(prev => prev.map(lead =>
//                     lead.id === originalLead.id ? { ...lead, columnId: originalLead.columnId } : lead
//                 ));
//             }
//         });
//     };

//     const openAddLeadModal = (columnId = '') => {
//         setAddLeadInitialColumnId(columnId);
//         setIsAddLeadModalOpen(true);
//     };

//     const handleCloseAddLeadModal = () => {
//         setIsAddLeadModalOpen(false);
//         setAddLeadInitialColumnId('');
//     };

//     const handleSaveNewLead = (newLead: LeadDatas) => {
//         setLeads(prev => [...prev, newLead]);
//     };

//     const handleDeleteLead = (lead: LeadDatas) => {
//         setLeadToDelete(lead);
//         setIsDeleteModalOpen(true);
//     };

//     const handleDeleteModalConfirm = (leadId: string) => {
//         router.delete(`/kanban/leads/${leadId}`, {
//             onSuccess: () => {
//                 setLeads(prev => prev.filter(l => l.id !== leadId));
//                 Swal.fire({ icon: 'success', title: 'Lead dihapus!', timer: 1500, showConfirmButton: false });
//             },
//         });
//         setIsDeleteModalOpen(false);
//     };

//     const filteredLeads = leads.filter((lead) =>
//         [lead.name, lead.company_name, lead.trx, lead.product]
//             .some(field => (field || '').toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     console.log('Passing contacts to AddLeadModal:', contacts);
//     console.log('Passing products to AddLeadModal:', products);

//     return (
//         <>
//             <Head title="Kanban Board" />
//             <div className="flex h-screen overflow-hidden">
//                 <MySidebar />
//                 <div className="flex flex-col flex-1 overflow-hidden">
//                     <BoardHeader
//                         onAddLeadClick={() => openAddLeadModal('')}
//                         searchTerm={searchTerm}
//                         onSearchChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <div className="flex space-x-4 overflow-x-auto p-3">
//                         {columns.map(column => (
//                             <LeadColumn
//                                 key={column.id}
//                                 column={column}
//                                 leads={filteredLeads.filter(l => l.columnId === column.id)}
//                                 onDragStart={handleDragStart}
//                                 onDragEnd={handleDragEnd}
//                                 onDragOver={handleDragOver}
//                                 onDrop={handleDrop}
//                                 isDragOver={dragOverColumnId === column.id}
//                                 onAddLead={() => openAddLeadModal(column.id)}
//                                 onEditLeadSuccess={(updated) =>
//                                     setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
//                                 }
//                                 onDeleteLead={handleDeleteLead}
//                             />
//                         ))}
//                     </div>
//                 </div>

//                 <AddLeadModal
//                     // key={isAddLeadModalOpen ? 'open' : 'closed'}
//                     isOpen={isAddLeadModalOpen}
//                     onClose={handleCloseAddLeadModal}
//                     onSave={handleSaveNewLead}
//                     initialColumnId={addLeadInitialColumnId}
//                     contacts={contacts}
//                     products={products}
//                 />

//                 <DeleteLeadModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={() => setIsDeleteModalOpen(false)}
//                     onDelete={handleDeleteModalConfirm}
//                     lead={leadToDelete}
//                 />
//             </div>
//         </>
//     );
// };

// export default BoardView;


// import React, { useEffect, useState } from 'react';
// import { Head, router, usePage } from '@inertiajs/react';
// import Swal from 'sweetalert2';

// import LeadColumn from '@/components/Leads/KanbanColumn';
// import { LeadDatas, ColumnData, ContactOption, ProductOption } from '@/components/Leads/types';
// import MySidebar from '../../Layout/Sidebar';
// import AddLeadModal from './addlead'; // Pastikan path ini benar
// import DeleteLeadModal from './deletelead';
// import BoardHeader from './boardheader';

// const BoardView: React.FC = () => {
//     const {
//         kanbanData,
//         contacts: contactsFromPage = [],
//         products: productsFromPage = [],
//         errors,
//         success,
//     } = usePage().props;

//     const [contacts, setContacts] = useState<ContactOption[]>([]);
//     const [products, setProducts] = useState<ProductOption[]>([]);

//     useEffect(() => {
//         console.log('✅ BoardView - contactsFromPage:', contactsFromPage);
//         console.log('✅ BoardView - productsFromPage:', productsFromPage);
//         setContacts(contactsFromPage);
//         setProducts(productsFromPage);
//     }, [contactsFromPage, productsFromPage]);


//     const [columns, setColumns] = useState<ColumnData[]>([]);
//     const [leads, setLeads] = useState<LeadDatas[]>([]);
//     const [draggedLead, setDraggedLead] = useState<LeadDatas | null>(null);
//     const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);

//     // State untuk AddLeadModal utama di BoardView
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
//     const [addLeadInitialColumnId, setAddLeadInitialColumnId] = useState<string>('');

//     useEffect(() => {
//         if (errors?.message) {
//             Swal.fire({ icon: 'error', title: 'Gagal!', text: errors.message });
//         } else if (success) {
//             Swal.fire({ icon: 'success', title: 'Berhasil!', text: success, timer: 2000, showConfirmButton: false });
//         }
//     }, [errors, success]);

//     useEffect(() => {
//         if (kanbanData) {
//             setColumns(kanbanData.map((col: any) => ({
//                 id: col.id,
//                 title: col.title,
//                 bgColor: col.bgColor || 'bg-gray-100',
//                 borderColor: col.borderColor || 'border-gray-300',
//                 titleColor: col.titleColor || 'text-gray-600',
//                 dotBorderColor: col.dotBorderColor || 'border-gray-400',
//                 dotBgColor: col.dotBgColor || 'bg-transparent',
//                 dotTextColor: col.dotTextColor || 'text-gray-400',
//                 addLeadColor: col.addLeadColor || 'text-gray-700',
//             })));

//             const allLeads: LeadDatas[] = kanbanData.flatMap((col: any) =>
//                 col.leads.map((lead: any) => ({
//                     ...lead,
//                     columnId: lead.columnId || col.id,
//                     social_media: typeof lead.social_media === 'string' ? lead.social_media : (lead.social_media ? JSON.stringify(lead.social_media) : null),
//                     address: typeof lead.address === 'string' ? lead.address : (lead.address ? JSON.stringify(lead.address) : null),
//                 }))
//             );
//             setLeads(allLeads);
//         }
//     }, [kanbanData]);

//     const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => {
//         setDraggedLead(lead);
//         e.dataTransfer.effectAllowed = 'move';
//     };

//     const handleDragEnd = () => setDraggedLead(null);

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
//         e.preventDefault();
//         setDragOverColumnId(columnId);
//     };

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
//         e.preventDefault();
//         setDragOverColumnId(null);

//         if (!draggedLead || draggedLead.columnId === targetColumnId) return;

//         const originalLead = draggedLead;

//         setLeads(prev => prev.map(lead =>
//             lead.id === originalLead.id ? { ...lead, columnId: targetColumnId } : lead
//         ));

//         router.put('/kanban/leads/update-column', {
//             leadId: originalLead.id,
//             newColumnId: targetColumnId,
//         }, {
//             onSuccess: () => {
//                 Swal.fire({ icon: 'success', title: 'Lead dipindahkan!', timer: 1500, showConfirmButton: false });
//             },
//             onError: () => {
//                 setLeads(prev => prev.map(lead =>
//                     lead.id === originalLead.id ? { ...lead, columnId: originalLead.columnId } : lead
//                 ));
//             }
//         });
//     };

//     // Fungsi ini akan dipanggil oleh BoardHeader dan LeadColumn untuk membuka modal utama
//     const openAddLeadModal = (columnId = '') => {
//         setAddLeadInitialColumnId(columnId);
//         setIsAddLeadModalOpen(true);
//     };

//     const handleCloseAddLeadModal = () => {
//         setIsAddLeadModalOpen(false);
//         setAddLeadInitialColumnId(''); // Reset kolom inisial saat modal ditutup
//     };

//     const handleSaveNewLead = (newLead: LeadDatas) => {
//         setLeads(prev => [...prev, newLead]);
//     };

//     const handleDeleteLead = (lead: LeadDatas) => {
//         setLeadToDelete(lead);
//         setIsDeleteModalOpen(true);
//     };

//     const handleDeleteModalConfirm = (leadId: string) => {
//         router.delete(`/kanban/leads/${leadId}`, {
//             onSuccess: () => {
//                 setLeads(prev => prev.filter(l => l.id !== leadId));
//                 Swal.fire({ icon: 'success', title: 'Lead dihapus!', timer: 1500, showConfirmButton: false });
//             },
//         });
//         setIsDeleteModalOpen(false);
//     };

//     // const filteredLeads = leads.filter((lead) =>
//     //     [lead.name, lead.company_name, lead.trx, lead.product]
//     //         .some(field => (field || '').toLowerCase().includes(searchTerm.toLowerCase()))
//     // );
//     const filteredLeads = leads.filter((lead) => {
//         if (!lead) return false;

//         const name = lead.name ?? '';
//         const companyName = lead.company_name ?? '';
//         const trx = lead.trx ?? '';
//         const productName = typeof lead.product === 'string'
//             ? lead.product
//             : lead.product?.name ?? '';

//         return [name, companyName, trx, productName]
//             .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));
//     });


//     return (
//         <>
//             <Head title="Kanban Board" />
//             <div className="flex h-screen overflow-hidden">
//                 <MySidebar />
//                 <div className="flex flex-col flex-1 overflow-hidden">
//                     <BoardHeader
//                         onAddLeadClick={() => openAddLeadModal('')} // Panggil fungsi utama openAddLeadModal
//                         searchTerm={searchTerm}
//                         onSearchChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <div className="flex space-x-4 overflow-x-auto p-3">
//                         {columns.map(column => (
//                             <LeadColumn
//                                 key={column.id}
//                                 column={column}
//                                 leads={filteredLeads.filter(l => l.columnId === column.id)}
//                                 onDragStart={handleDragStart}
//                                 onDragEnd={handleDragEnd}
//                                 onDragOver={handleDragOver}
//                                 onDrop={handleDrop}
//                                 isDragOver={dragOverColumnId === column.id}
//                                 onAddLead={() => openAddLeadModal(column.id)} // Panggil fungsi utama openAddLeadModal
//                                 onEditLeadSuccess={(updated) =>
//                                     setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
//                                 }
//                                 onDeleteLead={handleDeleteLead}
//                             />
//                         ))}
//                     </div>
//                 </div>

//                 {/* Ini adalah SATU-SATUNYA AddLeadModal yang dirender */}
//                 <AddLeadModal
//                     // Hapus key={isAddLeadModalOpen ? 'open' : 'closed'}
//                     // Agar modal tidak di-remounting setiap kali dibuka/ditutup
//                     isOpen={isAddLeadModalOpen}
//                     onClose={handleCloseAddLeadModal}
//                     onSave={handleSaveNewLead}
//                     initialColumnId={addLeadInitialColumnId}
//                     contacts={contacts} // Prop ini akan selalu punya data jika sudah dimuat
//                     products={products} // Prop ini akan selalu punya data jika sudah dimuat
//                 />

//                 <DeleteLeadModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={() => setIsDeleteModalOpen(false)}
//                     onDelete={handleDeleteModalConfirm}
//                     lead={leadToDelete}
//                 />
//             </div>
//         </>
//     );
// };

// export default BoardView;


// BoardView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { usePage, router, Head } from '@inertiajs/react';
import LeadColumn from '@/components/Leads/KanbanColumn';
import { LeadDatas, ColumnData, ContactOption, ProductOption } from '@/components/Leads/types';
import MySidebar from '../../Layout/Sidebar';
import AddLeadModal from './addlead';
import DeleteLeadModal from './deletelead';
import DetailLeadModal from './detaillead';
import BoardHeader from './boardheader';
import EditColumnModal from './EditColumnModal';
import { Breadcrumbs } from '../../components/breadcrumbs';
import Swal from 'sweetalert2';

// Helper function untuk safe JSON parsing
const safeJsonParse = (str: string | null | undefined) => {
    if (!str) return null;
    try {
        return JSON.parse(str);
    } catch (e) {
        console.warn('Failed to parse JSON:', str);
        return null;
    }
};

const BoardView: React.FC = () => {
    const {
        kanbanData,
        contacts: contactsFromPage = [], // Rename to avoid conflict with state
        products: productsFromPage = [], // Rename to avoid conflict with state
        errors,
        success,
    } = usePage().props;

    const [contacts, setContacts] = useState<ContactOption[]>([]);
    const [products, setProducts] = useState<ProductOption[]>([]);

    useEffect(() => {
        console.log('✅ BoardView - contactsFromPage:', contactsFromPage);
        console.log('✅ BoardView - productsFromPage:', productsFromPage);
        setContacts(contactsFromPage as ContactOption[]);
        setProducts(productsFromPage as ProductOption[]);
    }, [contactsFromPage, productsFromPage]);

    const [columns, setColumns] = useState<ColumnData[]>([]);
    const [leads, setLeads] = useState<LeadDatas[]>([]);
    const [draggedLead, setDraggedLead] = useState<LeadDatas | null>(null);
    const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);

    // State untuk AddLeadModal utama di BoardView
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const [addLeadInitialColumnId, setAddLeadInitialColumnId] = useState<string>('');

    // (Removed) AddColumnModal state
    // State untuk EditColumnModal
    const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
    const [columnToEdit, setColumnToEdit] = useState<ColumnData | null>(null);

    // State untuk menentukan view yang aktif
    const { url } = usePage();
    const getCurrentViewTitle = () => {
        if (url.includes('/list/leads')) {
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
        } else if (url.includes('/kanban/leads')) {
            return 'Kanban Board - Tappp';
        }
        return 'Leads - Tappp';
    };

    const getCurrentViewBreadcrumb = () => {
        if (url.includes('/list/leads')) {
            if (url.includes('show=arsip')) {
                if (url.includes('filter=dealing')) {
                    return 'Dealing';
                } else if (url.includes('filter=junk')) {
                    return 'Junk';
                } else {
                    return 'Arsip';
                }
            } else {
                return 'List';
            }
        } else if (url.includes('/kanban/leads')) {
            return 'Board';
        }
        return 'Board';
    };

    const getCurrentViewUrl = () => {
        if (url.includes('/list/leads')) {
            if (url.includes('show=arsip')) {
                if (url.includes('filter=dealing')) {
                    return '/kanban/leads?filter=dealing';
                } else if (url.includes('filter=junk')) {
                    return '/kanban/leads?filter=junk';
                } else {
                    return '/kanban/arsip';
                }
            } else {
                return '/kanban/list';
            }
        } else if (url.includes('/kanban/leads')) {
            return '/kanban';
        }
        return '/kanban';
    };

    useEffect(() => {
        if (errors?.message) {
            const msg = typeof errors.message === 'string' ? errors.message : '';
            Swal.fire({ icon: 'error', title: 'Gagal!', text: msg });
        } else if (success) {
            const msg = typeof success === 'string' ? success : '';
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: msg, timer: 2000, showConfirmButton: false });
        }
    }, [errors, success]);

    useEffect(() => {
        if (kanbanData && Array.isArray(kanbanData)) {
            console.log('✅ Processing kanbanData:', kanbanData);

            setColumns(
                kanbanData.map((col: any) => ({
                    id: col.id,
                    title: col.title,
                    bgColor: col.bgColor || 'bg-gray-100',
                    borderColor: col.borderColor || 'border-gray-300',
                    titleColor: col.titleColor || 'text-gray-600',
                    dotBorderColor: col.dotBorderColor || 'border-gray-400',
                    dotBgColor: col.dotBgColor || 'bg-transparent',
                    dotTextColor: col.dotTextColor || 'text-gray-400',
                    addLeadColor: col.addLeadColor || 'text-gray-700',
                })),
            );

            const allLeads: LeadDatas[] = kanbanData.flatMap((col: any) => {
                console.log(`✅ Processing column ${col.title}:`, col.leads);
                return col.leads.map((lead: any) => ({
                    ...lead,
                    columnId: lead.columnId || col.id,

                    // ✅ Perbaikan: parse jika bentuk string JSON
                    social_media:
                        typeof lead.social_media === 'string' ? (safeJsonParse(lead.social_media) ?? lead.social_media) : (lead.social_media ?? null),

                    address: typeof lead.address === 'string' ? (safeJsonParse(lead.address) ?? lead.address) : (lead.address ?? null),
                }));
            });

            console.log('✅ Final allLeads:', allLeads);
            setLeads(allLeads);
        } else {
            console.warn('⚠️ kanbanData is not available or not an array:', kanbanData);
        }
    }, [kanbanData]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => {
        setDraggedLead(lead);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => setDraggedLead(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
        e.preventDefault();
        setDragOverColumnId(columnId);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
            setDragOverColumnId(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
        e.preventDefault();
        setDragOverColumnId(null);

        if (!draggedLead || draggedLead.columnId === targetColumnId) return;

        const originalLead = draggedLead;

        setLeads((prev) => prev.map((lead) => (lead.id === originalLead.id ? { ...lead, columnId: targetColumnId } : lead)));

        router.put(
            '/kanban/leads/update-column',
            {
                leadId: originalLead.id,
                newColumnId: targetColumnId,
            },
            {
                onSuccess: () => {
                    Swal.fire({ icon: 'success', title: 'Lead dipindahkan!', timer: 1500, showConfirmButton: false });
                    // Refresh data from server to ensure consistency
                    router.reload({ only: ['kanbanData'] });
                    // Trigger refresh untuk Segmentasi Pasar
                    localStorage.setItem('segmentasi_needs_refresh', 'true');
                },
                onError: () => {
                    setLeads((prev) => prev.map((lead) => (lead.id === originalLead.id ? { ...lead, columnId: originalLead.columnId } : lead)));
                },
            },
        );
    };

    // Fungsi ini akan dipanggil oleh BoardHeader dan LeadColumn untuk membuka modal utama
    const openAddLeadModal = (columnId = '') => {
        setAddLeadInitialColumnId(columnId);
        setIsAddLeadModalOpen(true);
    };

    const handleCloseAddLeadModal = () => {
        setIsAddLeadModalOpen(false);
        setAddLeadInitialColumnId(''); // Reset kolom inisial saat modal ditutup
    };

    const handleSaveNewLead = (newLead: LeadDatas) => {
        setLeads((prev) => [...prev, newLead]);
        // Trigger refresh untuk Segmentasi Pasar
        localStorage.setItem('segmentasi_needs_refresh', 'true');
    };

    const handleDeleteLead = (lead: LeadDatas) => {
        setLeadToDelete(lead);
        setIsDeleteModalOpen(true);
    };

    // Column action handlers
    const handleEditColumn = (column: ColumnData) => {
        setColumnToEdit(column);
        setIsEditColumnModalOpen(true);
    };

    const handleCloseEditColumnModal = () => {
        setIsEditColumnModalOpen(false);
        setColumnToEdit(null);
    };

    const handleEditColumnSuccess = () => {
        router.reload({ only: ['kanbanData'] });
        // Trigger refresh untuk Segmentasi Pasar
        localStorage.setItem('segmentasi_needs_refresh', 'true');
    };

    const handleDuplicateColumn = (column: ColumnData) => {
        Swal.fire({
            title: 'Duplicate Column',
            text: `Are you sure you want to duplicate "${column.title}" column?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Duplicate',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    `/columns/${column.id}/duplicate`,
                    {},
                    {
                        onSuccess: () => {
                            Swal.fire('Success!', 'Column duplicated successfully.', 'success');
                            router.reload({ only: ['kanbanData'] });
                        },
                        onError: (errors) => {
                            Swal.fire('Error!', Object.values(errors).join(', '), 'error');
                        },
                    },
                );
            }
        });
    };

    // Archive/Delete column actions removed per request

    const handleDeleteModalConfirm = (leadId: string) => {
        router.delete(`/kanban/leads/${leadId}`, {
            onSuccess: () => {
                setLeads((prev) => prev.filter((l) => l.id !== leadId));
                Swal.fire({ icon: 'success', title: 'Lead dihapus!', timer: 1500, showConfirmButton: false });
            },
        });
        setIsDeleteModalOpen(false);
    };

    // (Removed) AddColumnModal handlers

    const filteredLeads = leads.filter((lead) => {
        if (!lead) return false;

        const name = lead.name ?? '';
        const companyName = lead.company_name ?? '';
        const trx = lead.trx ?? '';
        const productName = typeof lead.product === 'string' ? lead.product : ((lead as any).product?.name ?? '');

        return [name, companyName, trx, productName].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    // Exclude columns JUNK and DEALING and any leads inside them
    const excludedColumnIds = useMemo(() => {
        return new Set(
            columns
                .filter((c) => {
                    const title = (c.title || '').toString().trim().toUpperCase();
                    return title === 'JUNK' || title === 'DEALING';
                })
                .map((c) => c.id),
        );
    }, [columns]);

    const visibleLeads = useMemo(() => {
        return filteredLeads.filter((l) => !excludedColumnIds.has(l.columnId));
    }, [filteredLeads, excludedColumnIds]);

    return (
        <>
            <Head title={getCurrentViewTitle()} />
            <div className="flex h-screen overflow-hidden">
                <MySidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <BoardHeader
                        onSave={handleSaveNewLead}
                        searchTerm={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        contacts={contacts}
                        products={products}
                        columns={columns.map((c) => ({ id: c.id, name: c.title }))}
                    />
                    {/* <div className="px-6 pt-3">
                        <Breadcrumbs
                            breadcrumbs={[
                                { title: 'Dashboard', href: '/dashboard' },
                                { title: 'Manage Leads', href: '/kanban/leads' },
                                { title: getCurrentViewBreadcrumb(), href: getCurrentViewUrl() },
                            ]}
                        />
                    </div> */}
                    <div className="flex space-x-4 overflow-x-auto p-3">
                        {columns.map((column) => {
                            const isExcluded = excludedColumnIds.has(column.id);
                            const columnLeads = isExcluded ? [] : visibleLeads.filter((l) => l.columnId === column.id);
                            return (
                                <LeadColumn
                                    key={column.id}
                                    column={column}
                                    leads={columnLeads}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    isDragOver={dragOverColumnId === column.id}
                                    onAddLead={() => openAddLeadModal(column.id)}
                                    onEditLeadSuccess={(updated) => setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))}
                                    onDeleteLead={handleDeleteLead}
                                    // Pass contacts and products to LeadColumn
                                    contacts={contacts}
                                    products={products}
                                    onEditColumn={handleEditColumn}
                                />
                            );
                        })}
                    </div>
                </div>

                <AddLeadModal
                    isOpen={isAddLeadModalOpen}
                    onClose={handleCloseAddLeadModal}
                    onSave={handleSaveNewLead}
                    initialColumnId={addLeadInitialColumnId}
                    contacts={contacts}
                    products={products}
                />

                {leadToDelete && (
                    <DeleteLeadModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onDelete={handleDeleteModalConfirm}
                        lead={leadToDelete}
                    />
                )}

                <EditColumnModal
                    isOpen={isEditColumnModalOpen}
                    onClose={handleCloseEditColumnModal}
                    onSuccess={handleEditColumnSuccess}
                    column={columnToEdit}
                />
            </div>
        </>
    );
};

export default BoardView;
