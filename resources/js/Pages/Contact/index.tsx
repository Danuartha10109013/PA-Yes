// import React, { useState, useEffect, useCallback } from 'react';
// import TableRow from '@/components/Tabel/TabelRow';
// import MySidebar from '../../Layout/Sidebar';
// import AddContactModal from './addcontact';
// import EditContactModal from './editcontact';
// import DeleteContactModal from './deletecontact';
// import ContactDetailDrawer from './detailcontact';
// import { ContactData, Contact as ContactType, ColumnData } from '@/components/Types/types'; // Import ColumnData
// import Search from '@/components/Search/search'
// import { usePage } from "@inertiajs/react";
// import { router } from '@inertiajs/react'; // pastikan sudah di-import di atas
// import Swal from 'sweetalert2';

// const ContactsIndex: React.FC = () => {
//     const [contacts, setContacts] = useState<ContactType[]>([]);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
//     const [contactToEdit, setContactToEdit] = useState<ContactType | null>(null);
//     const [contactToDelete, setContactToDelete] = useState<ContactType | null>(null);
//     const [contactToViewDetail, setContactToViewDetail] = useState<ContactType | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const { props } = usePage();
//     const user = props.auth?.user;
//     console.log('Logged in user:', user);

//     // --- Search and Sort State ---
//     const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
//     const [sortColumn, setSortColumn] = useState<keyof ContactType | null>(null); // State for sorted column
//     const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // State for sort direction
//     // --- End Search and Sort State ---

//     const [currentPage, setCurrentPage] = useState(1);
//     const [contactsPerPage] = useState(10);

//     // --- State for Columns (for Add to Transaction) ---
//     const [availableColumns, setAvailableColumns] = useState<ColumnData[]>([]);
//     const [loadingColumns, setLoadingColumns] = useState(false);
//     // --- End State for Columns ---


//     const fetchContacts = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch('/contacts');
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }
//             const data: ContactType[] = await response.json();
//             // Sort contacts by created_at in descending order initially if no other sort is applied
//             const initialSortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//             setContacts(initialSortedData);
//         } catch (err: any) {
//             setError(`Gagal memuat kontak: ${err.message}`);
//             console.error('Error fetching contacts:', err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // Function to fetch columns for the "Add to Transaction" feature
//     const fetchColumns = useCallback(async () => {
//         setLoadingColumns(true);
//         try {
//             const response = await fetch('/columns'); // Adjust this endpoint as needed
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
//             setAvailableColumns(data);
//         } catch (err) {
//             console.error('Error fetching columns:', err);
//             // Optionally set an error state for column fetching
//         } finally {
//             setLoadingColumns(false);
//         }
//     }, []);


//     useEffect(() => {
//         fetchContacts();
//         fetchColumns(); // Fetch columns on component mount
//     }, [fetchContacts, fetchColumns]); // Add fetchColumns to dependency array

//     // --- Search and Sort Logic ---
//     const filteredContacts = contacts.filter(contact =>
//         contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.company_name && contact.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.phone && contact.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.address && contact.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.sector && String(contact.sector.name).toLowerCase().includes(searchQuery.toLowerCase())) // Make sure to search sector.name
//     );

//     const sortedFilteredContacts = [...filteredContacts].sort((a, b) => {
//         if (!sortColumn) return 0;

//         const aValue = a[sortColumn];
//         const bValue = b[sortColumn];

//         // Handle null or undefined values: place nulls/undefineds at the end
//         if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
//         if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

//         // Special handling for dates ('created_at', 'updated_at')
//         if (sortColumn === 'created_at' || sortColumn === 'updated_at') {
//             const dateA = new Date(String(aValue)).getTime();
//             const dateB = new Date(String(bValue)).getTime();
//             if (sortDirection === 'asc') {
//                 return dateA - dateB;
//             } else {
//                 return dateB - dateA;
//             }
//         }

//         // Special handling for 'sector' name
//         if (sortColumn === 'sector') {
//             const sectorNameA = a.sector?.name || '';
//             const sectorNameB = b.sector?.name || '';
//             return sortDirection === 'asc' ? sectorNameA.localeCompare(sectorNameB) : sectorNameB.localeCompare(sectorNameA);
//         }


//         // Generic string comparison for other string fields
//         if (typeof aValue === 'string' && typeof bValue === 'string') {
//             return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
//         }

//         // Fallback for other comparable types (e.g., numbers, though not explicitly in ContactType for sorting)
//         if (aValue < bValue) {
//             return sortDirection === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//             return sortDirection === 'asc' ? 1 : -1;
//         }
//         return 0;
//     });

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(event.target.value);
//         setCurrentPage(1); // Reset to first page on search
//     };

//     const handleSort = (column: keyof ContactType) => {
//         if (sortColumn === column) {
//             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortColumn(column);
//             setSortDirection('asc'); // Default to ascending when sorting a new column
//         }
//         setCurrentPage(1); // Reset to first page on sort
//     };

//     // Helper to render sort icon
//     const renderSortIcon = (column: keyof ContactType) => {
//         if (sortColumn === column) {
//             return sortDirection === 'asc' ? <i className="fas fa-arrow-up ml-2 text-blue-500"></i> : <i className="fas fa-arrow-down ml-2 text-blue-500"></i>;
//         }
//         return null;
//     };
//     // --- End Search and Sort Logic ---

//     const indexOfLastContact = currentPage * contactsPerPage;
//     const indexOfFirstContact = indexOfLastContact - contactsPerPage;
//     const currentContacts = sortedFilteredContacts.slice(indexOfFirstContact, indexOfLastContact);
//     const totalPages = Math.ceil(sortedFilteredContacts.length / contactsPerPage); // Calculate based on sortedFilteredContacts

//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
//     const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
//     const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

//     // --- Add Contact Handlers ---
//     const handleOpenAddModal = () => setIsAddModalOpen(true);
//     const handleCloseAddModal = () => setIsAddModalOpen(false);

//     // --- Edit Contact Handlers ---
//     const handleOpenEditModal = (contact: ContactType) => {
//         setContactToEdit(contact);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setContactToEdit(null);
//     };

//     // const handleSaveEditedContact = async (updatedContactData: ContactData) => {
//     //     try {
//     //         await fetchContacts();
//     //         // alert('Kontak berhasil diperbarui!');
//     //         Swal.fire({
//     //             icon: 'success',
//     //             title: 'Berhasil!',
//     //             text: 'Kontak berhasil diperbarui.',
//     //             timer: 2000,
//     //             showConfirmButton: false,
//     //         });
//     //         handleCloseEditModal();
//     //     } catch (err: any) {
//     //         // alert(`Gagal memperbarui kontak: ${err.message}`);
//     //         Swal.fire({
//     //             icon: 'error',
//     //             title: 'Gagal!',
//     //             text: err.message || 'Terjadi kesalahan saat menyimpan perubahan.',
//     //         });
//     //         console.error('Error saving edited contact:', err);
//     //         throw err;
//     //     }
//     // };
//     const handleSaveEditedContact = async (updatedContactData: ContactData) => {
//         if (!contactToEdit?.id) {
//             Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Kontak tidak valid.' });
//             return;
//         }

//         const cleanData = Object.fromEntries(
//             Object.entries(updatedContactData).map(([key, val]) => [
//                 key,
//                 typeof val === 'string' && val.trim() === '' ? null : val
//             ])
//         );

//         router.put(`/contacts/${contactToEdit.id}`, cleanData, {
//             preserveScroll: true,
//             onSuccess: () => {
//                 fetchContacts();
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Berhasil!',
//                     text: 'Kontak berhasil diperbarui.',
//                     timer: 2000,
//                     showConfirmButton: false,
//                 });
//                 handleCloseEditModal();
//             },
//             onError: (errors) => {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Validasi Gagal!',
//                     text: Object.values(errors).flat().join('; '),
//                 });
//             },
//             onFinish: () => {
//                 setIsSubmitting(false);
//             }
//         });
//     };

//     // --- Delete Contact Handlers ---
//     const handleOpenDeleteModal = (contact: ContactType) => {
//         setContactToDelete(contact);
//         setIsDeleteModalOpen(true);
//     };

//     const handleCloseDeleteModal = () => {
//         setIsDeleteModalOpen(false);
//         setContactToDelete(null);
//     };

//     // const handleDeleteContactConfirmed = async () => {
//     //     setIsSubmitting(true);
//     //     setError(null);

//     //     if (!contactToDelete) {
//     //         setError('Tidak ada kontak yang dipilih untuk dihapus.');
//     //         setIsSubmitting(false);
//     //         return;
//     //     }

//     //     try {
//     //         const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//     //         // DELETE requests typically don't send a body or require 'updated_at' for a successful delete.
//     //         // If your backend specifically requires a body, you can keep it, but it's unusual for DELETE.
//     //         // Sending it here just in case your backend is custom-configured.
//     //         const payload = {
//     //             updated_at: new Date().toISOString(),
//     //         };

//     //         console.log("Payload yang dikirim untuk DELETE:", payload);

//     //         const response = await fetch(`/contacts/${contactToDelete.id}`, {
//     //             method: 'DELETE',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //                 'Accept': 'application/json',
//     //                 ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//     //             },
//     //             // Removed body as DELETE usually doesn't need it. Add back if your backend requires.
//     //             // body: JSON.stringify(payload),
//     //         });

//     //         if (!response.ok) {
//     //             let errData = null;
//     //             try {
//     //                 errData = await response.json();
//     //             } catch {
//     //                 // response bukan JSON, abaikan
//     //             }
//     //             throw new Error(errData?.message || 'Gagal menghapus kontak.');
//     //         }

//     //         // No need to parse JSON if the backend returns an empty 204 No Content
//     //         // or just a success message without data.
//     //         // let result = null;
//     //         // try {
//     //         //     if (response.headers.get('content-type')?.includes('application/json')) {
//     //         //         result = await response.json();
//     //         //     }
//     //         // } catch {
//     //         //     // Abaikan error parse JSON
//     //         // }
//     //         // console.log('Hapus berhasil:', result); // Only log if parsing result

//     //         console.log('Hapus berhasil.');


//     //         await fetchContacts();
//     //         // alert('Kontak berhasil dihapus!');
//     //         Swal.fire({
//     //             icon: 'success',
//     //             title: 'Deleted!',
//     //             text: 'Kontak berhasil dihapus.',
//     //             timer: 2000,
//     //             showConfirmButton: false,
//     //         });
//     //         handleCloseDeleteModal();
//     //     } catch (err: any) {
//     //         setError(err.message || 'Terjadi kesalahan saat menghapus kontak.');
//     //         alert(`Gagal menghapus kontak: ${err.message}`);
//     //         console.error('Error saat hapus kontak:', err);
//     //     } finally {
//     //         setIsSubmitting(false);
//     //     }
//     // };

//     const handleDeleteContactConfirmed = async () => {
//         setIsSubmitting(true);
//         setError(null);

//         if (!contactToDelete) {
//             setError('Tidak ada kontak yang dipilih untuk dihapus.');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             // Kirim request DELETE via Inertia router
//             router.delete(`/contacts/${contactToDelete.id}`, {
//                 preserveScroll: true,
//                 onSuccess: () => {
//                     Swal.fire({
//                         icon: 'success',
//                         title: 'Deleted!',
//                         text: 'Kontak berhasil dihapus.',
//                         timer: 2000,
//                         showConfirmButton: false,
//                     });
//                     handleCloseDeleteModal();
//                 },
//                 onError: (errors) => {
//                     setError(errors.message || 'Terjadi kesalahan saat menghapus kontak.');
//                     alert(`Gagal menghapus kontak: ${errors.message}`);
//                 },
//                 onFinish: () => {
//                     setIsSubmitting(false);
//                 },
//             });
//         } catch (err: any) {
//             setError(err.message || 'Terjadi kesalahan tak terduga.');
//             alert(`Gagal menghapus kontak: ${err.message}`);
//             console.error('Error saat hapus kontak:', err);
//             setIsSubmitting(false);
//         }
//     };


//     // --- Detail Contact Handlers ---
//     const handleOpenDetailDrawer = (contact: ContactType) => {
//         setContactToViewDetail(contact);
//         setIsDetailDrawerOpen(true);
//     };

//     const handleCloseDetailDrawer = () => {
//         setIsDetailDrawerOpen(false);
//         setContactToViewDetail(null);
//     };

//     // --- Save New Contact Handler ---
//     // const handleSaveNewContact = async (newContactData: ContactData) => {
//     //     try {
//     //         const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//     //         const response = await fetch('/contacts', {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //                 'Accept': 'application/json',
//     //                 ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//     //             },
//     //             body: JSON.stringify(newContactData),
//     //         });

//     //         if (!response.ok) {
//     //             const errorData = await response.json();
//     //             throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     //         }

//     //         const result = await response.json();
//     //         console.log('Contact created:', result.contact);

//     //         await fetchContacts();
//     //         setCurrentPage(1);
//     //         alert('Kontak baru berhasil ditambahkan!');
//     //         handleCloseAddModal();
//     //     } catch (err: any) {
//     //         setError(`Gagal menambahkan kontak: ${err.message}`);
//     //         alert(`Gagal menambahkan kontak: ${err.message}`);
//     //         console.error('Error adding contact:', err);
//     //         throw err;
//     //     }
//     // };

//     // const handleSaveNewContact = async (newContactData: ContactData) => {
//     //     try {
//     //         const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//     //         // Konversi nilai string kosong ("") menjadi null agar validasi Laravel tidak gagal
//     //         const cleanData: { [key: string]: any } = Object.fromEntries(
//     //             Object.entries(newContactData).map(([key, value]) => [
//     //                 key,
//     //                 typeof value === 'string' && value.trim() === '' ? null : value
//     //             ])
//     //         );

//     //         const response = await fetch('/contacts', {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //                 'Accept': 'application/json',
//     //                 ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//     //             },
//     //             body: JSON.stringify(cleanData),
//     //         });

//     //         if (!response.ok) {
//     //             const errorData = await response.json();
//     //             throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     //         }

//     //         const result = await response.json();
//     //         console.log('Contact created:', result.contact);

//     //         await fetchContacts();
//     //         setCurrentPage(1);
//     //         // alert('Kontak baru berhasil ditambahkan!');
//     //         Swal.fire({
//     //             icon: 'success',
//     //             title: 'Berhasil!',
//     //             text: 'Kontak baru berhasil ditambahkan!',
//     //             timer: 2000,
//     //             showConfirmButton: false,
//     //         });
//     //         handleCloseAddModal();
//     //     } catch (err: any) {
//     //         setError(`Gagal menambahkan kontak: ${err.message}`);
//     //         // alert(`Gagal menambahkan kontak: ${err.message}`);
//     //         Swal.fire({
//     //             icon: 'error',
//     //             title: 'Gagal!',
//     //             text: `Gagal menambahkan kontak: ${err.message}`,
//     //         });
//     //         console.error('Error adding contact:', err);
//     //         throw err;
//     //     }
//     // };

//     const handleSaveNewContact = async (newContactData: ContactData) => {
//         try {
//             // Bersihkan data string kosong menjadi null
//             const cleanData: { [key: string]: any } = Object.fromEntries(
//                 Object.entries(newContactData).map(([key, value]) => [
//                     key,
//                     typeof value === 'string' && value.trim() === '' ? null : value
//                 ])
//             );

//             router.post('/contacts', cleanData, {
//                 preserveScroll: true,
//                 onSuccess: () => {
//                     fetchContacts(); // refresh daftar kontak
//                     Swal.fire({
//                         icon: 'success',
//                         title: 'Berhasil!',
//                         text: 'Kontak baru berhasil ditambahkan!',
//                         timer: 2000,
//                         showConfirmButton: false,
//                     });
//                     handleCloseAddModal();
//                 },
//                 onError: (errors) => {
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Gagal!',
//                         text: 'Validasi gagal. Mohon periksa data kontak.',
//                     });
//                     console.error('Validation errors:', errors);
//                 },
//                 onFinish: () => {
//                     setIsSubmitting(false);
//                 }
//             });
//         } catch (err: any) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Gagal!',
//                 text: `Terjadi kesalahan: ${err.message}`,
//             });
//             console.error('Error adding contact:', err);
//             setIsSubmitting(false);
//         }
//     };


//     // Placeholder for onAddToTransaction, the actual logic is in ActionMenu
//     const handleAddToTransaction = (contact: ContactType) => {
//         // This function doesn't need to do anything specific here
//         // as the column selection and actual API call are handled within ActionMenu.
//         // It's primarily passed down to satisfy the TableRow prop type.
//     };

//     return (
//         <div className="flex min-h-screen">
//             <MySidebar />

//             {/* <main className="flex-1 p-6"> */}
//             <main className="flex-1 px-4 py-6">
//                 {/* <div className="w-full max-w-5xl mx-auto"> */}
//                 <div className="w-full mx-auto">
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-[#344767] font-semibold text-lg">
//                             Daftar Kontak
//                         </h2>
//                         <div className="flex items-center space-x-4">
//                             {/* Integrate Search here, passing only the search-related props */}
//                             <Search
//                                 searchQuery={searchQuery}
//                                 onSearchChange={handleSearchChange}
//                             />
//                             <button
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
//                                 onClick={handleOpenAddModal}
//                             >
//                                 + Tambah Kontak
//                             </button>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         {loading ? (
//                             <p className="p-4 text-center text-gray-600">Memuat data kontak...</p>
//                         ) : error ? (
//                             <p className="p-4 text-center text-red-500">Error: {error}</p>
//                         ) : sortedFilteredContacts.length === 0 ? ( // Check sortedFilteredContacts length
//                             <p className="p-4 text-center text-gray-500">Belum ada data kontak yang ditemukan untuk pencarian ini.</p>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 {/* <table className="min-w-full border-separate border-spacing-y-2"> */}
//                                 <table className="w-full border-separate border-spacing-y-2">
//                                     <thead className="sticky top-0 bg-white z-10">
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th
//                                                 className="text-left pl-6 py-2 cursor-pointer hover:text-blue-500 transition-colors"
//                                                 onClick={() => handleSort('name')}
//                                             >
//                                                 NAMA / EMAIL {renderSortIcon('name')}
//                                             </th>
//                                             <th
//                                                 className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors"
//                                                 onClick={() => handleSort('company_name')}
//                                             >
//                                                 PERUSAHAAN {renderSortIcon('company_name')}
//                                             </th>
//                                             <th
//                                                 className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors"
//                                                 onClick={() => handleSort('created_at')}
//                                             >
//                                                 CREATED AT {renderSortIcon('created_at')}
//                                             </th>
//                                             <th
//                                                 className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors"
//                                                 onClick={() => handleSort('updated_at')}
//                                             >
//                                                 UPDATED AT {renderSortIcon('updated_at')}
//                                             </th>
//                                             <th className="py-2 pr-6 text-right">AKSI</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentContacts.map((contact) => (
//                                             <TableRow
//                                                 key={contact.id}
//                                                 id={contact.id}
//                                                 name={contact.name}
//                                                 email={contact.email || ''}
//                                                 company_name={contact.company_name}
//                                                 created_at={contact.created_at}
//                                                 updated_at={contact.updated_at}
//                                                 phone={contact.phone || ''}
//                                                 address={contact.address || ''}
//                                                 sector={contact.sector || null} // Pass sector object
//                                                 onEdit={handleOpenEditModal}
//                                                 onDelete={handleOpenDeleteModal}
//                                                 onDetail={handleOpenDetailDrawer}
//                                                 onAddToTransaction={handleAddToTransaction} // Pass this
//                                                 availableColumns={availableColumns} // Pass this
//                                                 loadingColumns={loadingColumns} // Pass this
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {/* Pagination Controls */}
//                     {sortedFilteredContacts.length > contactsPerPage && ( // Check sortedFilteredContacts length for pagination
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             <button
//                                 onClick={prevPage}
//                                 disabled={currentPage === 1}
//                                 className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 Sebelumnya
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
//                                 Berikutnya
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </main>

//             {/* Add New Contact Modal */}
//             <AddContactModal
//                 isOpen={isAddModalOpen}
//                 onClose={handleCloseAddModal}
//                 onSave={handleSaveNewContact}
//             />

//             {/* Edit Contact Modal */}
//             {contactToEdit && (
//                 <EditContactModal
//                     isOpen={isEditModalOpen}
//                     onClose={handleCloseEditModal}
//                     onSave={handleSaveEditedContact}
//                     initialData={contactToEdit}
//                 />
//             )}

//             {/* Delete Contact Modal */}
//             {isDeleteModalOpen && contactToDelete && (
//                 <DeleteContactModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={handleCloseDeleteModal}
//                     onDelete={handleDeleteContactConfirmed}
//                     contact={contactToDelete}
//                 />
//             )}

//             {/* Contact Detail Drawer */}
//             <ContactDetailDrawer
//                 isOpen={isDetailDrawerOpen}
//                 onClose={handleCloseDetailDrawer}
//                 contact={contactToViewDetail}
//             />
//         </div>
//     );
// };

// export default ContactsIndex;


// import React, { useState } from 'react';
// import TableRow from '@/components/Tabel/TabelRow';
// import MySidebar from '../../Layout/Sidebar';
// import AddContactModal from './addcontact';
// import EditContactModal from './editcontact';
// import DeleteContactModal from './deletecontact';
// import ContactDetailDrawer from './detailcontact';
// import Search from '@/components/Search/search';
// import { usePage, router } from '@inertiajs/react';
// import Swal from 'sweetalert2';
// import { ContactData, Contact as ContactType, ColumnData } from '@/components/Types/types';

// const ContactsIndex: React.FC = () => {
//     const { props } = usePage();
//     const contactsFromProps = props.contacts as ContactType[];
//     const user = props.auth?.user;

//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
//     const [contactToEdit, setContactToEdit] = useState<ContactType | null>(null);
//     const [contactToDelete, setContactToDelete] = useState<ContactType | null>(null);
//     const [contactToViewDetail, setContactToViewDetail] = useState<ContactType | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const [searchQuery, setSearchQuery] = useState('');
//     const [sortColumn, setSortColumn] = useState<keyof ContactType | null>(null);
//     const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [contactsPerPage] = useState(10);

//     const filteredContacts = contactsFromProps.filter(contact =>
//         contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (contact.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.company_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.phone?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.address?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.sector?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

//     const sortedFilteredContacts = [...filteredContacts].sort((a, b) => {
//         if (!sortColumn) return 0;

//         const aValue = a[sortColumn];
//         const bValue = b[sortColumn];

//         if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
//         if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

//         if (sortColumn === 'created_at' || sortColumn === 'updated_at') {
//             return sortDirection === 'asc'
//                 ? new Date(String(aValue)).getTime() - new Date(String(bValue)).getTime()
//                 : new Date(String(bValue)).getTime() - new Date(String(aValue)).getTime();
//         }

//         if (sortColumn === 'sector') {
//             const nameA = a.sector?.name || '';
//             const nameB = b.sector?.name || '';
//             return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
//         }

//         if (typeof aValue === 'string' && typeof bValue === 'string') {
//             return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
//         }

//         return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
//     });

//     const handleSort = (column: keyof ContactType) => {
//         if (sortColumn === column) {
//             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortColumn(column);
//             setSortDirection('asc');
//         }
//         setCurrentPage(1);
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(e.target.value);
//         setCurrentPage(1);
//     };

//     const renderSortIcon = (column: keyof ContactType) => {
//         if (sortColumn === column) {
//             return sortDirection === 'asc'
//                 ? <i className="fas fa-arrow-up ml-2 text-blue-500"></i>
//                 : <i className="fas fa-arrow-down ml-2 text-blue-500"></i>;
//         }
//         return null;
//     };

//     const indexOfLastContact = currentPage * contactsPerPage;
//     const indexOfFirstContact = indexOfLastContact - contactsPerPage;
//     const currentContacts = sortedFilteredContacts.slice(indexOfFirstContact, indexOfLastContact);
//     const totalPages = Math.ceil(sortedFilteredContacts.length / contactsPerPage);

//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
//     const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
//     const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

//     const handleOpenAddModal = () => setIsAddModalOpen(true);
//     const handleCloseAddModal = () => setIsAddModalOpen(false);

//     const handleOpenEditModal = (contact: ContactType) => {
//         setContactToEdit(contact);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setContactToEdit(null);
//         setIsEditModalOpen(false);
//     };

//     const handleSaveEditedContact = async (data: ContactData) => {
//         if (!contactToEdit?.id) return;
//         const cleanData = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, typeof v === 'string' && v.trim() === '' ? null : v]));

//         router.put(`/contacts/${contactToEdit.id}`, cleanData, {
//             preserveScroll: true,
//             onSuccess: () => {
//                 router.reload();
//                 Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Kontak berhasil diperbarui.', timer: 2000, showConfirmButton: false });
//                 handleCloseEditModal();
//             },
//             onError: (errors) => {
//                 Swal.fire({ icon: 'error', title: 'Validasi Gagal!', text: Object.values(errors).flat().join('; ') });
//             },
//             onFinish: () => setIsSubmitting(false),
//         });
//     };

//     const handleOpenDeleteModal = (contact: ContactType) => {
//         setContactToDelete(contact);
//         setIsDeleteModalOpen(true);
//     };

//     const handleCloseDeleteModal = () => {
//         setContactToDelete(null);
//         setIsDeleteModalOpen(false);
//     };

//     const handleDeleteContactConfirmed = () => {
//         if (!contactToDelete?.id) return;

//         router.delete(`/contacts/${contactToDelete.id}`, {
//             preserveScroll: true,
//             onSuccess: () => {
//                 router.reload();
//                 Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Kontak berhasil dihapus.', timer: 2000, showConfirmButton: false });
//                 handleCloseDeleteModal();
//             },
//             onError: (errors) => Swal.fire({ icon: 'error', title: 'Gagal!', text: errors.message || 'Gagal menghapus kontak.' }),
//             onFinish: () => setIsSubmitting(false),
//         });
//     };

//     const handleOpenDetailDrawer = (contact: ContactType) => {
//         setContactToViewDetail(contact);
//         setIsDetailDrawerOpen(true);
//     };

//     const handleCloseDetailDrawer = () => {
//         setContactToViewDetail(null);
//         setIsDetailDrawerOpen(false);
//     };

//     const handleSaveNewContact = (data: ContactData) => {
//         const cleanData = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, typeof v === 'string' && v.trim() === '' ? null : v]));

//         router.post('/contacts', cleanData, {
//             preserveScroll: true,
//             onSuccess: () => {
//                 router.reload();
//                 Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Kontak baru berhasil ditambahkan!', timer: 2000, showConfirmButton: false });
//                 handleCloseAddModal();
//             },
//             onError: (errors) => Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Validasi gagal. Mohon periksa data kontak.' }),
//             onFinish: () => setIsSubmitting(false),
//         });
//     };

//     const handleAddToTransaction = () => { /* handled in ActionMenu */ };

//     const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         const formData = new FormData();
//         formData.append('file', file);

//         router.post('/contacts/import', formData, {
//             forceFormData: true,
//             preserveScroll: true,
//             onSuccess: () => {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Berhasil!',
//                     text: 'Kontak berhasil diimpor.',
//                     timer: 2000,
//                     showConfirmButton: false,
//                 });
//                 router.reload();
//             },
//             onError: () => {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Gagal!',
//                     text: 'Gagal mengimpor file. Periksa format Excel Anda.',
//                 });
//             },
//             onFinish: () => {
//                 e.target.value = ''; // reset input file
//             }
//         });
//     };


//     return (
//         <div className="flex min-h-screen">
//             <MySidebar />
//             <main className="flex-1 px-4 py-6">
//                 <div className="w-full mx-auto">
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-[#344767] font-semibold text-lg">Daftar Kontak</h2>
//                         <div className="flex items-center space-x-4">
//                             <Search searchQuery={searchQuery} onSearchChange={handleSearchChange} />
//                             <label className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md cursor-pointer">
//                                 📥 Import Kontak
//                                 <input
//                                     type="file"
//                                     accept=".xlsx,.xls,.csv"
//                                     onChange={(e) => handleImportFile(e)}
//                                     className="hidden"
//                                 />
//                             </label>
//                             <button
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
//                                 onClick={handleOpenAddModal}>
//                                 + Tambah Kontak
//                             </button>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         {sortedFilteredContacts.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">Belum ada data kontak ditemukan.</p>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="w-full border-separate border-spacing-y-2">
//                                     <thead className="sticky top-0 bg-white z-10">
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2 cursor-pointer" onClick={() => handleSort('name')}>
//                                                 NAMA / EMAIL {renderSortIcon('name')}
//                                             </th>
//                                             <th className="text-left py-2 cursor-pointer" onClick={() => handleSort('company_name')}>
//                                                 PERUSAHAAN {renderSortIcon('company_name')}
//                                             </th>
//                                             <th className="text-left py-2 cursor-pointer" onClick={() => handleSort('created_at')}>
//                                                 CREATED AT {renderSortIcon('created_at')}
//                                             </th>
//                                             <th className="text-left py-2 cursor-pointer" onClick={() => handleSort('updated_at')}>
//                                                 UPDATED AT {renderSortIcon('updated_at')}
//                                             </th>
//                                             <th className="py-2 pr-6 text-right">AKSI</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentContacts.map(contact => (
//                                             <TableRow
//                                                 key={contact.id}
//                                                 {...contact}
//                                                 onEdit={handleOpenEditModal}
//                                                 onDelete={handleOpenDeleteModal}
//                                                 onDetail={handleOpenDetailDrawer}
//                                                 onAddToTransaction={handleAddToTransaction}
//                                                 availableColumns={[]} // kosong, bisa isi jika perlu
//                                                 loadingColumns={false}
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {sortedFilteredContacts.length > contactsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md">
//                                 Sebelumnya
//                             </button>
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <button
//                                     key={index + 1}
//                                     onClick={() => paginate(index + 1)}
//                                     className={`px-4 py-2 rounded-lg shadow-md ${currentPage === index + 1
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-white text-gray-700 hover:bg-gray-200'
//                                         }`}>
//                                     {index + 1}
//                                 </button>
//                             ))}
//                             <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md">
//                                 Berikutnya
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </main>

//             <AddContactModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSave={handleSaveNewContact} />
//             {contactToEdit && (
//                 <EditContactModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} onSave={handleSaveEditedContact} initialData={contactToEdit} />
//             )}
//             {isDeleteModalOpen && contactToDelete && (
//                 <DeleteContactModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onDelete={handleDeleteContactConfirmed} contact={contactToDelete} />
//             )}
//             <ContactDetailDrawer isOpen={isDetailDrawerOpen} onClose={handleCloseDetailDrawer} contact={contactToViewDetail} />
//         </div>
//     );
// };

// export default ContactsIndex;

// import React, { useState } from 'react';
// import TableRow from '@/components/Tabel/TabelRow';
// import MySidebar from '../../Layout/Sidebar';
// import AddContactModal from './addcontact';
// import EditContactModal from './editcontact';
// import DeleteContactModal from './deletecontact';
// import ContactDetailDrawer from './detailcontact';
// import Search from '@/components/Search/search';
// import { usePage, router } from '@inertiajs/react';
// import Swal from 'sweetalert2';
// import { Contact as ContactType } from '@/components/Types/types';

// const ContactsIndex: React.FC = () => {
//     const { props } = usePage();
//     const contactsFromProps = props.contacts as ContactType[];

//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

//     const [contactToEdit, setContactToEdit] = useState<ContactType | null>(null);
//     const [contactToDelete, setContactToDelete] = useState<ContactType | null>(null);
//     const [contactToViewDetail, setContactToViewDetail] = useState<ContactType | null>(null);

//     const [searchQuery, setSearchQuery] = useState('');
//     const [sortColumn, setSortColumn] = useState<keyof ContactType | null>(null);
//     const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [contactsPerPage] = useState(10);

//     const filteredContacts = contactsFromProps.filter(contact =>
//         contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (contact.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.company_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.phone?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.address?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (contact.sector?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

//     const sortedFilteredContacts = [...filteredContacts].sort((a, b) => {
//         if (!sortColumn) return 0;

//         const aValue = a[sortColumn];
//         const bValue = b[sortColumn];

//         if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
//         if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

//         if (sortColumn === 'created_at' || sortColumn === 'updated_at') {
//             return sortDirection === 'asc'
//                 ? new Date(String(aValue)).getTime() - new Date(String(bValue)).getTime()
//                 : new Date(String(bValue)).getTime() - new Date(String(aValue)).getTime();
//         }

//         if (sortColumn === 'sector') {
//             const nameA = a.sector?.name || '';
//             const nameB = b.sector?.name || '';
//             return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
//         }

//         if (typeof aValue === 'string' && typeof bValue === 'string') {
//             return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
//         }

//         return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
//     });

//     const indexOfLastContact = currentPage * contactsPerPage;
//     const indexOfFirstContact = indexOfLastContact - contactsPerPage;
//     const currentContacts = sortedFilteredContacts.slice(indexOfFirstContact, indexOfLastContact);
//     const totalPages = Math.ceil(sortedFilteredContacts.length / contactsPerPage);

//     const handleSort = (column: keyof ContactType) => {
//         if (sortColumn === column) {
//             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortColumn(column);
//             setSortDirection('asc');
//         }
//         setCurrentPage(1);
//     };

//     const renderSortIcon = (column: keyof ContactType) => {
//         if (sortColumn === column) {
//             return sortDirection === 'asc'
//                 ? <i className="fas fa-arrow-up ml-2 text-blue-500"></i>
//                 : <i className="fas fa-arrow-down ml-2 text-blue-500"></i>;
//         }
//         return null;
//     };

//     const handleOpenEditModal = (contact: ContactType) => {
//         setContactToEdit(contact);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setContactToEdit(null);
//         setIsEditModalOpen(false);
//     };

//     const handleOpenDeleteModal = (contact: ContactType) => {
//         setContactToDelete(contact);
//         setIsDeleteModalOpen(true);
//     };

//     const handleCloseDeleteModal = () => {
//         setContactToDelete(null);
//         setIsDeleteModalOpen(false);
//     };

//     const handleDeleteContactConfirmed = () => {
//         if (!contactToDelete?.id) return;
//         router.delete(`/contacts/${contactToDelete.id}`, {
//             preserveScroll: true,
//             onSuccess: () => {
//                 Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Kontak berhasil dihapus.', timer: 2000, showConfirmButton: false });
//                 handleCloseDeleteModal();
//             },
//             onError: (errors) => Swal.fire({ icon: 'error', title: 'Gagal!', text: errors.message || 'Gagal menghapus kontak.' }),
//         });
//     };

//     const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         const formData = new FormData();
//         formData.append('file', file);

//         router.post('/contacts/import', formData, {
//             forceFormData: true,
//             preserveScroll: true,
//             onSuccess: () => {
//                 Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Kontak berhasil diimpor.', timer: 2000, showConfirmButton: false });
//                 router.reload();
//             },
//             onError: () => {
//                 Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Gagal mengimpor file. Periksa format Excel Anda.' });
//             },
//             onFinish: () => {
//                 e.target.value = '';
//             }
//         });
//     };

//     return (
//         <div className="flex min-h-screen">
//             <MySidebar />
//             <main className="flex-1 px-4 py-6">
//                 <div className="w-full mx-auto">
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-[#344767] font-semibold text-lg">Daftar Kontak</h2>
//                         <div className="flex items-center space-x-4">
//                             <Search searchQuery={searchQuery} onSearchChange={e => setSearchQuery(e.target.value)} />
//                             <label className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md cursor-pointer">
//                                 📥 Import Kontak
//                                 <input
//                                     type="file"
//                                     accept=".xlsx,.xls,.csv"
//                                     onChange={handleImportFile}
//                                     className="hidden"
//                                 />
//                             </label>
//                             <button
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
//                                 onClick={() => setIsAddModalOpen(true)}>
//                                 + Tambah Kontak
//                             </button>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         {sortedFilteredContacts.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">Belum ada data kontak ditemukan.</p>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="w-full border-separate border-spacing-y-2">
//                                     <thead className="sticky top-0 bg-white z-10">
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2 cursor-pointer" onClick={() => handleSort('name')}>
//                                                 NAMA / EMAIL {renderSortIcon('name')}
//                                             </th>
//                                             <th className="text-left py-2 cursor-pointer" onClick={() => handleSort('company_name')}>
//                                                 PERUSAHAAN {renderSortIcon('company_name')}
//                                             </th>
//                                             <th className="text-left py-2 cursor-pointer" onClick={() => handleSort('created_at')}>
//                                                 CREATED AT {renderSortIcon('created_at')}
//                                             </th>
//                                             <th className="text-left py-2 cursor-pointer" onClick={() => handleSort('updated_at')}>
//                                                 UPDATED AT {renderSortIcon('updated_at')}
//                                             </th>
//                                             <th className="py-2 pr-6 text-right">AKSI</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentContacts.map(contact => (
//                                             <TableRow
//                                                 key={contact.id}
//                                                 {...contact}
//                                                 onEdit={handleOpenEditModal}
//                                                 onDelete={handleOpenDeleteModal}
//                                                 onDetail={() => {
//                                                     setContactToViewDetail(contact);
//                                                     setIsDetailDrawerOpen(true);
//                                                 }}
//                                                 availableColumns={[]}
//                                                 loadingColumns={false}
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {sortedFilteredContacts.length > contactsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md">Sebelumnya</button>
//                             {[...Array(totalPages)].map((_, i) => (
//                                 <button
//                                     key={i}
//                                     onClick={() => setCurrentPage(i + 1)}
//                                     className={`px-4 py-2 rounded-lg shadow-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
//                                 >
//                                     {i + 1}
//                                 </button>
//                             ))}
//                             <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md">Berikutnya</button>
//                         </div>
//                     )}
//                 </div>
//             </main>

//             <AddContactModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
//             {contactToEdit && <EditContactModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} contact={contactToEdit} />}
//             {contactToDelete && <DeleteContactModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onDelete={handleDeleteContactConfirmed} contact={contactToDelete} />}
//             <ContactDetailDrawer isOpen={isDetailDrawerOpen} onClose={() => setIsDetailDrawerOpen(false)} contact={contactToViewDetail} />
//         </div>
//     );
// };

// export default ContactsIndex;


import React, { useState } from 'react';
import TableRow from '@/components/Tabel/TabelRow';
import MySidebar from '../../Layout/Sidebar';
import AddContactModal from './addcontact';
import EditContactModal from './editcontact';
import DeleteContactModal from './deletecontact';
import ContactDetailDrawer from './detailcontact';
import Search from '@/components/Search/search';
import { usePage, router, Head } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Contact as ContactType, Sector as SectorType } from '@/components/Types/types';

const ContactsIndex: React.FC = () => {
    const { props } = usePage();
    const contactsFromProps = props.contacts as ContactType[];
    const sectorsFromProps = props.sectors as SectorType[]; // ✅ ambil sectors dari props
    const columnsFromProps = props.columns as ColumnData[];


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

    const [contactToEdit, setContactToEdit] = useState<ContactType | null>(null);
    const [contactToDelete, setContactToDelete] = useState<ContactType | null>(null);
    const [contactToViewDetail, setContactToViewDetail] = useState<ContactType | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof ContactType | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(10);

    const filteredContacts = contactsFromProps.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (contact.company_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (contact.phone?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (contact.address?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (contact.sector?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const sortedFilteredContacts = [...filteredContacts].sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
        if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

        if (sortColumn === 'created_at' || sortColumn === 'updated_at') {
            return sortDirection === 'asc'
                ? new Date(String(aValue)).getTime() - new Date(String(bValue)).getTime()
                : new Date(String(bValue)).getTime() - new Date(String(aValue)).getTime();
        }

        if (sortColumn === 'sector') {
            const nameA = a.sector?.name || '';
            const nameB = b.sector?.name || '';
            return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });

    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = sortedFilteredContacts.slice(indexOfFirstContact, indexOfLastContact);
    const totalPages = Math.ceil(sortedFilteredContacts.length / contactsPerPage);

    const handleSort = (column: keyof ContactType) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    const renderSortIcon = (column: keyof ContactType) => {
        if (sortColumn === column) {
            return sortDirection === 'asc'
                ? <i className="fas fa-arrow-up ml-2 text-blue-500"></i>
                : <i className="fas fa-arrow-down ml-2 text-blue-500"></i>;
        }
        return null;
    };

    const handleOpenEditModal = (contact: ContactType) => {
        setContactToEdit(contact);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setContactToEdit(null);
        setIsEditModalOpen(false);
    };

    const handleOpenDeleteModal = (contact: ContactType) => {
        setContactToDelete(contact);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setContactToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDeleteContactConfirmed = () => {
        if (!contactToDelete?.id) return;
        router.delete(`/contacts/${contactToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Kontak berhasil dihapus.', timer: 2000, showConfirmButton: false });
                handleCloseDeleteModal();
            },
            onError: (errors) => Swal.fire({ icon: 'error', title: 'Gagal!', text: errors.message || 'Gagal menghapus kontak.' }),
        });
    };

    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        // router.post('/contacts/import', formData, {
        //     forceFormData: true,
        //     preserveScroll: true,
        //     onSuccess: () => {
        //         Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Kontak berhasil diimpor.', timer: 2000, showConfirmButton: false });
        //         router.reload();
        //     },
        //     // onError: () => {
        //     //     Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Gagal mengimpor file. Periksa format Excel Anda.' });
        //     // },
        //     onError: (errors) => {
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Gagal!',
        //             text: errors.message || 'Gagal mengimpor file. Periksa format Excel Anda.',
        //         });
        //     },
        //     onFinish: () => {
        //         e.target.value = '';
        //     }
        // });
        router.post('/contacts/import', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Kontak berhasil diimpor.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                router.reload();
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: errors.message || 'Gagal mengimpor file. Periksa format Excel Anda.',
                });
            },
            onFinish: () => {
                e.target.value = '';
            }
        });

    };

    return (
        <>
            <Head title="Kontak - Tappp" />
            <div className="flex min-h-screen">
                <MySidebar />
                <main className="flex-1 px-4 py-6">
                <div className="w-full mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[#344767] font-semibold text-lg">Daftar Kontak</h2>
                        <div className="flex items-center space-x-4">
                            <Search searchQuery={searchQuery} onSearchChange={e => setSearchQuery(e.target.value)} />
                            <label className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md cursor-pointer">
                                📥 Import Kontak
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleImportFile}
                                    className="hidden"
                                />
                            </label>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                                onClick={() => setIsAddModalOpen(true)}>
                                + Tambah Kontak
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {sortedFilteredContacts.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">Belum ada data kontak ditemukan.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-y-2">
                                    <thead className="sticky top-0 bg-white z-10">
                                        <tr className="text-xs font-semibold text-[#98A2B3]">
                                            <th className="text-left pl-6 py-2 cursor-pointer" onClick={() => handleSort('name')}>
                                                NAMA / EMAIL {renderSortIcon('name')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer" onClick={() => handleSort('company_name')}>
                                                PERUSAHAAN {renderSortIcon('company_name')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer" onClick={() => handleSort('created_at')}>
                                                CREATED AT {renderSortIcon('created_at')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer" onClick={() => handleSort('updated_at')}>
                                                UPDATED AT {renderSortIcon('updated_at')}
                                            </th>
                                            <th className="py-2 pr-6 text-right">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-[#344767]">
                                        {currentContacts.map(contact => (
                                            <TableRow
                                                key={contact.id}
                                                {...contact}
                                                onEdit={handleOpenEditModal}
                                                onDelete={handleOpenDeleteModal}
                                                onDetail={() => {
                                                    setContactToViewDetail(contact);
                                                    setIsDetailDrawerOpen(true);
                                                }}
                                                availableColumns={columnsFromProps} // ✅ gunakan data dari backend
                                                loadingColumns={false}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {sortedFilteredContacts.length > contactsPerPage && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md">Sebelumnya</button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 rounded-lg shadow-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md">Berikutnya</button>
                        </div>
                    )}
                </div>
            </main>

            <AddContactModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                sectors={sectorsFromProps} // ✅ Kirim props ke modal
            />

            {contactToEdit && (
                <EditContactModal
                    // isOpen={isEditModalOpen}
                    // onClose={handleCloseEditModal}
                    // contact={contactToEdit}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    sectors={sectorsFromProps}
                    initialData={contactToEdit}
                />
            )}

            {contactToDelete && (
                <DeleteContactModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onDelete={handleDeleteContactConfirmed}
                    contact={contactToDelete}
                />
            )}
            <ContactDetailDrawer isOpen={isDetailDrawerOpen} onClose={() => setIsDetailDrawerOpen(false)} contact={contactToViewDetail} />
        </div>
    </>
    );
};

export default ContactsIndex;
