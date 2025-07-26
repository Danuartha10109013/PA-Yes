// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';

// const ActionMenu: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [position, setPosition] = useState({ top: 0, left: 0 });
//   const menuRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(event.target as Node) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     }

//     window.addEventListener('click', handleClickOutside);
//     return () => {
//       window.removeEventListener('click', handleClickOutside);
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen((prev) => {
//       const newState = !prev;
//       if (newState && buttonRef.current) {
//         const rect = buttonRef.current.getBoundingClientRect();
//         setPosition({
//           top: rect.bottom + window.scrollY,
//           left: rect.left + window.scrollX - 120 + rect.width, // adjust for right alignment
//         });
//       }
//       return newState;
//     });
//   };

//   const dropdown = (
//     <div
//       ref={menuRef}
//       className="absolute w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//       style={{
//         top: position.top,
//         left: position.left,
//         position: 'absolute',
//       }}
//     >
//       <ul className="text-xs text-[#344767]">
//         <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
//         <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Hapus</li>
//         <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Detail</li>
//       </ul>
//     </div>
//   );

//   return (
//     <>
//       <button
//         ref={buttonRef}
//         aria-haspopup="true"
//         aria-expanded={isOpen}
//         className="text-[#344767] text-xl font-bold focus:outline-none"
//         onClick={toggleMenu}
//       >
//         &#x22EE;
//       </button>
//       {isOpen && createPortal(dropdown, document.getElementById('dropdown-root')!)}
//     </>
//   );
// };

// export default ActionMenu;


// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import EditContactModal from '@/Pages/Contact/editcontact';
// import DeleteContactModal from '@/Pages/Contact/deletecontact';
// import { ContactData } from '@/components/Types/types';

// interface ActionMenuProps {
//   contact: ContactData | null;
//   onEditSave: (updated: ContactData) => Promise<void>;
//   onDelete: (id: number) => void;
// }

// const ActionMenu: React.FC<ActionMenuProps> = ({ contact, onEditSave, onDelete }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [position, setPosition] = useState({ top: 0, left: 0 });
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const menuRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(event.target as Node) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     }

//     window.addEventListener('click', handleClickOutside);
//     return () => {
//       window.removeEventListener('click', handleClickOutside);
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen((prev) => {
//       const newState = !prev;
//       if (newState && buttonRef.current) {
//         const rect = buttonRef.current.getBoundingClientRect();
//         setPosition({
//           top: rect.bottom + window.scrollY,
//           left: rect.left + window.scrollX - 120 + rect.width,
//         });
//       }
//       return newState;
//     });
//   };

//   const handleEdit = () => {
//     if (!contact) return;
//     setIsOpen(false);
//     setShowEditModal(true);
//   };

//   const handleDelete = () => {
//     if (!contact) return;
//     setIsOpen(false);
//     setShowDeleteModal(true);
//   };

//   const dropdown = (
//     <div
//       ref={menuRef}
//       className="absolute w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//       style={{
//         top: position.top,
//         left: position.left,
//         position: 'absolute',
//       }}
//     >
//       <ul className="text-xs text-[#344767]">
//         <li
//           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={handleEdit}
//         >
//           Edit
//         </li>
//         <li
//           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={handleDelete}
//         >
//           Hapus
//         </li>
//         <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
//           Detail
//         </li>
//       </ul>
//     </div>
//   );

//   if (!contact) return null; // 🛡️ Hindari render jika data belum tersedia

//   return (
//     <>
//       <button
//         ref={buttonRef}
//         aria-haspopup="true"
//         aria-expanded={isOpen}
//         className="text-[#344767] text-xl font-bold focus:outline-none"
//         onClick={toggleMenu}
//       >
//         &#x22EE;
//       </button>

//       {isOpen && createPortal(dropdown, document.getElementById('dropdown-root')!)}

//       {/* Edit Modal */}
//       {showEditModal && contact && (
//         <EditContactModal
//           isOpen={showEditModal}
//           onClose={() => setShowEditModal(false)}
//           onSave={onEditSave}
//           initialData={contact}
//         />
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && contact && (
//         <DeleteContactModal
//           isOpen={showDeleteModal}
//           onClose={() => setShowDeleteModal(false)}
//           onDelete={onDelete}
//           contact={contact}
//         />
//       )}
//     </>
//   );
// };

// export default ActionMenu;


// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { Contact as ContactType } from '@/components/Types/types';

// interface ActionMenuProps {
//   contact: ContactType; // Use ContactType
//   onEdit: (contact: ContactType) => void; // Pass the contact to the handler
//   onDelete: (contact: ContactType) => void; // Pass the contact to the handler
// }

// const ActionMenu: React.FC<ActionMenuProps> = ({ contact, onEdit, onDelete }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [position, setPosition] = useState({ top: 0, left: 0 });

//   const menuRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(event.target as Node) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     }

//     window.addEventListener('click', handleClickOutside);
//     return () => {
//       window.removeEventListener('click', handleClickOutside);
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen((prev) => {
//       const newState = !prev;
//       if (newState && buttonRef.current) {
//         const rect = buttonRef.current.getBoundingClientRect();
//         // Adjust position to open the dropdown correctly relative to the button
//         setPosition({
//           top: rect.bottom + window.scrollY + 5, // 5px offset below button
//           left: rect.left + window.scrollX - 120 + rect.width, // Adjust left for menu width
//         });
//       }
//       return newState;
//     });
//   };

//   const handleEditClick = () => {
//     setIsOpen(false); // Close the dropdown menu
//     onEdit(contact); // Call the onEdit handler from props, passing the contact
//   };

//   const handleDeleteClick = () => {
//     setIsOpen(false); // Close the dropdown menu
//     onDelete(contact); // Call the onDelete handler from props, passing the contact
//   };

//   const dropdown = (
//     <div
//       ref={menuRef}
//       className="absolute w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//       style={{
//         top: position.top,
//         left: position.left,
//         position: 'absolute', // Ensures correct positioning when portaled
//       }}
//     >
//       <ul className="text-xs text-[#344767]">
//         <li
//           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={handleEditClick}
//         >
//           Edit
//         </li>
//         <li
//           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={handleDeleteClick}
//         >
//           Hapus
//         </li>
//         <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
//           Detail
//         </li>
//       </ul>
//     </div>
//   );

//   return (
//     <>
//       <button
//         ref={buttonRef}
//         aria-haspopup="true"
//         aria-expanded={isOpen}
//         className="text-[#344767] text-xl font-bold focus:outline-none"
//         onClick={toggleMenu}
//       >
//         &#x22EE;
//       </button>

//       {/* Render dropdown using createPortal if open and dropdown-root exists */}
//       {isOpen && document.getElementById('dropdown-root') && createPortal(dropdown, document.getElementById('dropdown-root')!)}
//       {/* Modals are now rendered in ContactsIndex, so remove them from here */}
//     </>
//   );
// };

// export default ActionMenu;


// ActionMenu.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { Contact as ContactType } from '@/components/Types/types';

// interface ActionMenuProps {
//   contact: ContactType;
//   onEdit: (contact: ContactType) => void;
//   onDelete: (contact: ContactType) => void;
//   onDetail: (contact: ContactType) => void; // <-- Add new prop for detail
// }

// const ActionMenu: React.FC<ActionMenuProps> = ({ contact, onEdit, onDelete, onDetail }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [position, setPosition] = useState({ top: 0, left: 0 });

//   const menuRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(event.target as Node) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     }

//     window.addEventListener('click', handleClickOutside);
//     return () => {
//       window.removeEventListener('click', handleClickOutside);
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen((prev) => {
//       const newState = !prev;
//       if (newState && buttonRef.current) {
//         const rect = buttonRef.current.getBoundingClientRect();
//         setPosition({
//           top: rect.bottom + window.scrollY + 5,
//           left: rect.left + window.scrollX - 120 + rect.width,
//         });
//       }
//       return newState;
//     });
//   };

//   const handleEditClick = () => {
//     setIsOpen(false);
//     onEdit(contact);
//   };

//   const handleDeleteClick = () => {
//     setIsOpen(false);
//     onDelete(contact);
//   };

//   const handleDetailClick = () => { // <-- New handler for detail
//     setIsOpen(false);
//     onDetail(contact);
//   };

//   const dropdown = (
//     <div
//       ref={menuRef}
//       className="absolute w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//       style={{
//         top: position.top,
//         left: position.left,
//         position: 'absolute',
//       }}
//     >
//       <ul className="text-xs text-[#344767]">
//         <li
//           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={handleEditClick}
//         >
//           Edit
//         </li>
//         <li
//           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={handleDeleteClick}
//         >
//           Hapus
//         </li>
//         <li
//           className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={handleDetailClick}
//         >
//           Detail
//         </li>
//       </ul>
//     </div>
//   );

//   return (
//     <>
//       <button
//         ref={buttonRef}
//         aria-haspopup="true"
//         aria-expanded={isOpen}
//         className="text-[#344767] text-xl font-bold focus:outline-none"
//         onClick={toggleMenu}
//       >
//         &#x22EE;
//       </button>

//       {isOpen && document.getElementById('dropdown-root') && createPortal(dropdown, document.getElementById('dropdown-root')!)}
//     </>
//   );
// };

// export default ActionMenu;

// components/Tabel/ActionMenu.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { Contact as ContactType, ColumnData } from '@/components/Types/types'; // Import ColumnData
// import { UUID } from 'crypto';

// interface ActionMenuProps {
//     contact: ContactType;
//     onEdit: (contact: ContactType) => void;
//     onDelete: (contact: ContactType) => void;
//     onDetail: (contact: ContactType) => void;
//     onAddToTransaction: (contactId: UUID, columnId: UUID) => void; // Perbarui prop
//     availableColumns: ColumnData[]; // <-- Tambahkan prop ini
//     loadingColumns: boolean; // <-- Tambahkan prop ini
// }

// const ActionMenu: React.FC<ActionMenuProps> = ({
//     contact,
//     onEdit,
//     onDelete,
//     onDetail,
//     onAddToTransaction,
//     availableColumns, // Destructure prop
//     loadingColumns, // Destructure prop
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [showColumnSelection, setShowColumnSelection] = useState(false); // New state
//     const [position, setPosition] = useState({ top: 0, left: 0 });

//     const menuRef = useRef<HTMLDivElement>(null);
//     const buttonRef = useRef<HTMLButtonElement>(null);

//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (
//                 menuRef.current &&
//                 !menuRef.current.contains(event.target as Node) &&
//                 buttonRef.current &&
//                 !buttonRef.current.contains(event.target as Node)
//             ) {
//                 setIsOpen(false);
//                 setShowColumnSelection(false); // Reset
//             }
//         }

//         window.addEventListener('click', handleClickOutside);
//         return () => {
//             window.removeEventListener('click', handleClickOutside);
//         };
//     }, []);

//     const toggleMenu = () => {
//         setIsOpen((prev) => {
//             const newState = !prev;
//             if (newState && buttonRef.current) {
//                 const rect = buttonRef.current.getBoundingClientRect();
//                 setPosition({
//                     top: rect.bottom + window.scrollY + 5,
//                     left: rect.left + window.scrollX - 120 + rect.width,
//                 });
//             }
//             return newState;
//         });
//         setShowColumnSelection(false); // Ensure column selection is hidden when main menu toggles
//     };

//     const handleEditClick = () => {
//         setIsOpen(false);
//         onEdit(contact);
//     };

//     const handleDeleteClick = () => {
//         setIsOpen(false);
//         onDelete(contact);
//     };

//     const handleDetailClick = () => {
//         setIsOpen(false);
//         onDetail(contact);
//     };

//     const handleAddToTransactionClick = () => {
//         // Instead of calling onAddToTransaction directly, show column selection
//         setShowColumnSelection(true);
//     };

//     const handleColumnSelect = (columnId: UUID) => {
//         onAddToTransaction(contact.id, columnId);
//         setIsOpen(false); // Close main menu
//         setShowColumnSelection(false); // Hide column selection
//     };

//     const dropdownContent = showColumnSelection ? (
//         <ul className="text-xs text-[#344767]">
//             <li className="px-3 py-2 font-bold bg-gray-100">Pilih Kolom:</li>
//             {loadingColumns ? (
//                 <li className="px-3 py-2 text-gray-500">Memuat...</li>
//             ) : availableColumns.length === 0 ? (
//                 <li className="px-3 py-2 text-gray-500">Tidak ada kolom.</li>
//             ) : (
//                 availableColumns.map((column) => (
//                     <li
//                         key={column.id}
//                         className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleColumnSelect(column.id)}
//                     >
//                         {column.name}
//                     </li>
//                 ))
//             )}
//         </ul>
//     ) : (
//         <ul className="text-xs text-[#344767]">
//             <li
//                 className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={handleEditClick}
//             >
//                 Edit
//             </li>
//             <li
//                 className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={handleDeleteClick}
//             >
//                 Hapus
//             </li>
//             <li
//                 className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={handleDetailClick}
//             >
//                 Detail
//             </li>
//             <li
//                 className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium"
//                 onClick={handleAddToTransactionClick}
//             >
//                 + Tambah ke Transaksi
//             </li>
//         </ul>
//     );

//     const dropdown = (
//         <div
//             ref={menuRef}
//             className="absolute w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//             style={{
//                 top: position.top,
//                 left: position.left,
//                 position: 'absolute',
//             }}
//         >
//             {dropdownContent}
//         </div>
//     );

//     return (
//         <>
//             <button
//                 ref={buttonRef}
//                 aria-haspopup="true"
//                 aria-expanded={isOpen}
//                 className="text-[#344767] text-xl font-bold focus:outline-none"
//                 onClick={toggleMenu}
//             >
//                 &#x22EE;
//             </button>

//             {isOpen && document.getElementById('dropdown-root') && createPortal(dropdown, document.getElementById('dropdown-root')!)}
//         </>
//     );
// };

// export default ActionMenu;

// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { Contact, ColumnData } from '@/components/Types/types';
// import { UUID } from 'crypto'; // Assuming UUID type is here or similar
// import axios from 'axios';

// interface ActionMenuProps {
//     contact: Contact;
//     onEdit: (contact: Contact) => void;
//     onDelete: (contact: Contact) => void;
//     onDetail: (contact: Contact) => void;
//     // The onAddToTransaction prop is not directly invoked by ActionMenu's logic
//     // but is kept for consistency if it's part of a broader interface pattern.
//     // Its main purpose here is to signify that the "Add to Transaction" option exists.
//     onAddToTransaction: (contact: Contact) => void;
//     availableColumns: ColumnData[]; // New prop
//     loadingColumns: boolean; // New prop
// }

// const ActionMenu: React.FC<ActionMenuProps> = ({
//     contact,
//     onEdit,
//     onDelete,
//     onDetail,
//     // onAddToTransaction, // Not directly used in this component's logic, can be removed if not needed for pattern
//     availableColumns,
//     loadingColumns,
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [showColumnSelection, setShowColumnSelection] = useState(false);
//     const [position, setPosition] = useState({ top: 0, left: 0 });
//     const [adding, setAdding] = useState(false);

//     const menuRef = useRef<HTMLDivElement>(null);
//     const buttonRef = useRef<HTMLButtonElement>(null);

//     useEffect(() => {
//         const handleClickOutside = (e: PointerEvent) => {
//             const path = e.composedPath();
//             if (
//                 menuRef.current &&
//                 !path.includes(menuRef.current) &&
//                 buttonRef.current &&
//                 !path.includes(buttonRef.current)
//             ) {
//                 setIsOpen(false);
//                 setShowColumnSelection(false);
//             }
//         };

//         window.addEventListener('pointerdown', handleClickOutside);
//         return () => window.removeEventListener('pointerdown', handleClickOutside);
//     }, []);

//     const toggleMenu = () => {
//         setIsOpen(prev => {
//             const newState = !prev;
//             if (newState && buttonRef.current) {
//                 const rect = buttonRef.current.getBoundingClientRect();
//                 // Adjust position to appear to the left of the button, or adjust as needed
//                 // This logic might need further refinement based on screen edges.
//                 setPosition({
//                     top: rect.bottom + window.scrollY + 5,
//                     left: rect.right + window.scrollX - 150, // Adjust 150 based on menu width
//                 });
//             }
//             return newState;
//         });
//         setShowColumnSelection(false); // Close column selection when main menu toggles
//     };

//     const handleAddToTransactionClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         setShowColumnSelection(true);
//     };

//     const handleColumnSelect = async (columnId: UUID) => {
//         setAdding(true);
//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             const response = await axios.post('/addleads', { // Use axios for convenience
//                 contact_id: contact.id,
//                 column_id: columnId,
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//             });

//             // Improved alert based on backend response status/message
//             if (response.status === 200) { // Assuming 200 for update/move
//                 alert(response.data.message || 'Kontak berhasil dipindahkan ke kolom baru.');
//             } else if (response.status === 201) { // Assuming 201 for new creation
//                 alert(response.data.message || 'Transaksi berhasil ditambahkan.');
//             } else {
//                 alert('Operasi transaksi berhasil.'); // Generic success
//             }

//             // Optionally, refresh contacts or update local state after successful operation
//             // For now, it simply closes the menu. A full refresh might be needed in ContactsIndex.
//         } catch (error: any) {
//             if (error.response?.status === 409) {
//                 alert(error.response.data.message || 'Kontak ini sudah berada di kolom lain.');
//             } else {
//                 alert(`Gagal menambahkan transaksi: ${error.message || 'Terjadi kesalahan tidak diketahui.'}`);
//                 console.error('Error adding transaction:', error);
//             }
//         } finally {
//             setAdding(false);
//             setIsOpen(false); // Close main menu
//             setShowColumnSelection(false); // Close column selection
//         }
//     };

//     const handleEditClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onEdit(contact);
//         setIsOpen(false);
//     };

//     const handleDeleteClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onDelete(contact);
//         setIsOpen(false);
//     };

//     const handleDetailClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onDetail(contact);
//         setIsOpen(false);
//     };

//     const dropdownContent = showColumnSelection ? (
//         <ul className="text-xs text-[#344767]">
//             <li className="px-3 py-2 font-bold bg-gray-100">Pilih Status:</li>
//             {loadingColumns ? (
//                 <li className="px-3 py-2 text-gray-500">Memuat...</li>
//             ) : availableColumns.length === 0 ? (
//                 <li className="px-3 py-2 text-gray-500">Tidak ada kolom.</li>
//             ) : (
//                 availableColumns.map(column => (
//                     <li
//                         key={column.id}
//                         className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleColumnSelect(column.id)}
//                     >
//                         {adding ? 'Menambahkan...' : column.name}
//                     </li>
//                 ))
//             )}
//         </ul>
//     ) : (
//         <ul className="text-xs text-[#344767]">
//             <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleEditClick}>Edit</li>
//             <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDeleteClick}>Hapus</li>
//             <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDetailClick}>Detail</li>
//             <li
//                 className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium"
//                 onClick={handleAddToTransactionClick}
//             >
//                 + Add Leads
//             </li>
//         </ul>
//     );

//     const dropdown = (
//         <div
//             ref={menuRef}
//             className="absolute w-44 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
//             style={{ top: position.top, left: position.left }}
//         >
//             {dropdownContent}
//         </div>
//     );

//     return (
//         <>
//             <button
//                 ref={buttonRef}
//                 aria-haspopup="true"
//                 aria-expanded={isOpen}
//                 className="text-[#344767] text-xl font-bold focus:outline-none"
//                 onClick={toggleMenu}
//             >
//                 &#x22EE;
//             </button>
//             {isOpen && document.getElementById('dropdown-root') &&
//                 createPortal(dropdown, document.getElementById('dropdown-root')!)}
//         </>
//     );
// };

// export default ActionMenu;


// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { Contact, ColumnData } from '@/components/Types/types';
// import { UUID } from 'crypto';
// import axios from 'axios';
// import Swal from 'sweetalert2'; // Import SweetAlert2 for better user feedback

// interface ActionMenuProps {
//     contact: Contact;
//     onEdit: (contact: Contact) => void;
//     onDelete: (contact: Contact) => void;
//     onDetail: (contact: Contact) => void;
//     availableColumns: ColumnData[];
//     loadingColumns: boolean;
//     // New prop to trigger a refresh of contacts in the parent component
//     onLeadAdded: (newLeadData: any) => void;
// }

// const ActionMenu: React.FC<ActionMenuProps> = ({
//     contact,
//     onEdit,
//     onDelete,
//     onDetail,
//     availableColumns,
//     loadingColumns,
//     onLeadAdded, // Destructure the new prop
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [showColumnSelection, setShowColumnSelection] = useState(false);
//     const [position, setPosition] = useState({ top: 0, left: 0 });
//     const [isAddingLead, setIsAddingLead] = useState(false); // Renamed for clarity

//     const menuRef = useRef<HTMLDivElement>(null);
//     const buttonRef = useRef<HTMLButtonElement>(null);

//     useEffect(() => {
//         const handleClickOutside = (e: PointerEvent) => {
//             const path = e.composedPath();
//             if (
//                 menuRef.current &&
//                 !path.includes(menuRef.current) &&
//                 buttonRef.current &&
//                 !path.includes(buttonRef.current)
//             ) {
//                 setIsOpen(false);
//                 setShowColumnSelection(false);
//             }
//         };

//         window.addEventListener('pointerdown', handleClickOutside);
//         return () => window.removeEventListener('pointerdown', handleClickOutside);
//     }, []);

//     const toggleMenu = () => {
//         setIsOpen(prev => {
//             const newState = !prev;
//             if (newState && buttonRef.current) {
//                 const rect = buttonRef.current.getBoundingClientRect();
//                 // Position the menu to the left of the button, considering scroll
//                 setPosition({
//                     top: rect.bottom + window.scrollY + 5,
//                     left: rect.left + window.scrollX - 150, // Adjust 150 based on menu width for left alignment
//                 });
//             }
//             return newState;
//         });
//         setShowColumnSelection(false); // Close column selection when main menu toggles
//     };

//     const handleAddToTransactionClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         setShowColumnSelection(true);
//     };

//     const handleColumnSelect = async (columnId: UUID) => {
//         setIsAddingLead(true); // Set loading state
//         try {
//             const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

//             const response = await axios.post('/addleads', {
//                 contact_id: contact.id,
//                 column_id: columnId,
//                 name: contact.name, // Pass contact name
//                 company_name: contact.company_name, // Pass company name
//                 // You might need to pass other relevant contact/product details here
//                 // if your backend requires them for new transaction creation.
//                 // For example, if adding a lead means creating a product entry too:
//                 // product_id: null, // Or an existing product ID if applicable
//                 // product_name: 'Default Product', // Or from a selection if available
//                 // current_price: 0,
//                 // qty: 1,
//                 // deadline: null,
//                 // notes: 'Added from action menu',
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//             });

//             if (response.status === 201) {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Success!',
//                     text: response.data.message || 'Lead successfully added to the column.',
//                     showConfirmButton: false,
//                     timer: 1500,
//                 });
//                 onLeadAdded(response.data); // Trigger parent to update/refresh leads
//             } else {
//                 // Handle other successful but unexpected statuses if necessary
//                 Swal.fire({
//                     icon: 'info',
//                     title: 'Info',
//                     text: response.data.message || 'Transaction operation successful.',
//                     showConfirmButton: false,
//                     timer: 2000,
//                 });
//             }
//         } catch (error: any) {
//             console.error('Error adding transaction:', error);
//             const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
//             const validationErrors = error.response?.data?.errors;

//             let errorDetails = '';
//             if (validationErrors) {
//                 errorDetails = Object.values(validationErrors).flat().join('\n');
//             }

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Failed to Add Lead',
//                 text: `${errorMessage}\n${errorDetails}`,
//                 showConfirmButton: true,
//             });
//         } finally {
//             setIsAddingLead(false); // Reset loading state
//             setIsOpen(false); // Close main menu
//             setShowColumnSelection(false); // Close column selection
//         }
//     };

//     const handleEditClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onEdit(contact);
//         setIsOpen(false);
//     };

//     const handleDeleteClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onDelete(contact);
//         setIsOpen(false);
//     };

//     const handleDetailClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onDetail(contact);
//         setIsOpen(false);
//     };

//     const dropdownContent = showColumnSelection ? (
//         <ul className="text-xs text-[#344767]">
//             <li className="px-3 py-2 font-bold bg-gray-100">Select Status:</li>
//             {loadingColumns ? (
//                 <li className="px-3 py-2 text-gray-500">Loading...</li>
//             ) : availableColumns.length === 0 ? (
//                 <li className="px-3 py-2 text-gray-500">No columns available.</li>
//             ) : (
//                 availableColumns.map(column => (
//                     <li
//                         key={column.id}
//                         className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleColumnSelect(column.id)}
//                         disabled={isAddingLead} // Disable during API call
//                     >
//                         {isAddingLead ? 'Adding...' : column.name}
//                     </li>
//                 ))
//             )}
//         </ul>
//     ) : (
//         <ul className="text-xs text-[#344767]">
//             <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleEditClick}>Edit</li>
//             <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDeleteClick}>Delete</li>
//             <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDetailClick}>Detail</li>
//             <li
//                 className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium"
//                 onClick={handleAddToTransactionClick}
//                 // Disable if currently adding a lead
//                 style={{ pointerEvents: isAddingLead ? 'none' : 'auto', opacity: isAddingLead ? 0.6 : 1 }}
//             >
//                 {isAddingLead ? 'Adding Lead...' : '+ Add Leads'}
//             </li>
//         </ul>
//     );

//     const dropdown = (
//         <div
//             ref={menuRef}
//             className="absolute w-44 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
//             style={{ top: position.top, left: position.left }}
//         >
//             {dropdownContent}
//         </div>
//     );

//     return (
//         <>
//             <button
//                 ref={buttonRef}
//                 aria-haspopup="true"
//                 aria-expanded={isOpen}
//                 className="text-[#344767] text-xl font-bold focus:outline-none"
//                 onClick={toggleMenu}
//             >
//                 &#x22EE;
//             </button>
//             {isOpen && document.getElementById('dropdown-root') &&
//                 createPortal(dropdown, document.getElementById('dropdown-root')!)}
//         </>
//     );
// };

// export default ActionMenu;

// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { Contact, ColumnData } from '@/components/Types/types';
// import { UUID } from 'crypto';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// interface ActionMenuProps {
//     contact: Contact;
//     onEdit: (contact: Contact) => void;
//     onDelete: (contact: Contact) => void;
//     onDetail: (contact: Contact) => void;
//     availableColumns: ColumnData[];
//     loadingColumns: boolean;
//     onLeadAdded?: (newLeadData: any) => void; // ✅ make it optional
// }

// const ActionMenu: React.FC<ActionMenuProps> = ({
//     contact,
//     onEdit,
//     onDelete,
//     onDetail,
//     availableColumns,
//     loadingColumns,
//     onLeadAdded = () => { }, // ✅ fallback to no-op if not provided
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [showColumnSelection, setShowColumnSelection] = useState(false);
//     const [position, setPosition] = useState({ top: 0, left: 0 });
//     const [isAddingLead, setIsAddingLead] = useState(false);

//     const menuRef = useRef<HTMLDivElement>(null);
//     const buttonRef = useRef<HTMLButtonElement>(null);

//     useEffect(() => {
//         const handleClickOutside = (e: PointerEvent) => {
//             const path = e.composedPath();
//             if (
//                 menuRef.current &&
//                 !path.includes(menuRef.current) &&
//                 buttonRef.current &&
//                 !path.includes(buttonRef.current)
//             ) {
//                 setIsOpen(false);
//                 setShowColumnSelection(false);
//             }
//         };

//         window.addEventListener('pointerdown', handleClickOutside);
//         return () => window.removeEventListener('pointerdown', handleClickOutside);
//     }, []);

//     const toggleMenu = () => {
//         setIsOpen(prev => {
//             const newState = !prev;
//             if (newState && buttonRef.current) {
//                 const rect = buttonRef.current.getBoundingClientRect();
//                 setPosition({
//                     top: rect.bottom + window.scrollY + 5,
//                     left: rect.left + window.scrollX - 150,
//                 });
//             }
//             return newState;
//         });
//         setShowColumnSelection(false);
//     };

//     const handleAddToTransactionClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         setShowColumnSelection(true);
//     };

//     const handleColumnSelect = async (columnId: UUID) => {
//         setIsAddingLead(true);
//         try {
//             const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

//             const response = await axios.post('/addleads', {
//                 contact_id: contact.id,
//                 column_id: columnId,
//                 name: contact.name,
//                 company_name: contact.company_name,
//                 // other optional fields can go here
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//             });

//             if (response.status === 201) {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Success!',
//                     text: response.data.message || 'Lead berhasil ditambahkan.',
//                     showConfirmButton: false,
//                     timer: 1500,
//                 });

//                 // ✅ Ensure it's a function before calling
//                 if (typeof onLeadAdded === 'function') {
//                     onLeadAdded(response.data);
//                 } else {
//                     console.warn('onLeadAdded is not a function', onLeadAdded);
//                 }
//             } else {
//                 Swal.fire({
//                     icon: 'info',
//                     title: 'Info',
//                     text: response.data.message || 'Transaction succeeded.',
//                     showConfirmButton: false,
//                     timer: 2000,
//                 });
//             }
//         } catch (error: any) {
//             console.error('Error adding transaction:', error);
//             const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
//             const validationErrors = error.response?.data?.errors;

//             let errorDetails = '';
//             if (validationErrors) {
//                 errorDetails = Object.values(validationErrors).flat().join('\n');
//             }

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Failed to Add Lead',
//                 text: `${errorMessage}\n${errorDetails}`,
//                 showConfirmButton: true,
//             });
//         } finally {
//             setIsAddingLead(false);
//             setIsOpen(false);
//             setShowColumnSelection(false);
//         }
//     };

//     const handleEditClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onEdit(contact);
//         setIsOpen(false);
//     };

//     const handleDeleteClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onDelete(contact);
//         setIsOpen(false);
//     };

//     const handleDetailClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onDetail(contact);
//         setIsOpen(false);
//     };

//     const dropdownContent = showColumnSelection ? (
//         <ul className="text-xs text-[#344767]">
//             <li className="px-3 py-2 font-bold bg-gray-100">Select Status:</li>
//             {loadingColumns ? (
//                 <li className="px-3 py-2 text-gray-500">Loading...</li>
//             ) : availableColumns.length === 0 ? (
//                 <li className="px-3 py-2 text-gray-500">No columns available.</li>
//             ) : (
//                 availableColumns.map(column => (
//                     <li
//                         key={column.id}
//                         className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleColumnSelect(column.id)}
//                         style={{ pointerEvents: isAddingLead ? 'none' : 'auto' }}
//                     >
//                         {isAddingLead ? 'Adding...' : column.name}
//                     </li>
//                 ))
//             )}
//         </ul>
//     ) : (
//         <ul className="text-xs text-[#344767]">
//             <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleEditClick}>Edit</li>
//             <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDeleteClick}>Hapus</li>
//             <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDetailClick}>Detail</li>
//             <li
//                 className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium"
//                 onClick={handleAddToTransactionClick}
//                 style={{ pointerEvents: isAddingLead ? 'none' : 'auto', opacity: isAddingLead ? 0.6 : 1 }}
//             >
//                 {isAddingLead ? 'Adding Lead...' : '+ Add Leads'}
//             </li>
//         </ul>
//     );

//     const dropdown = (
//         <div
//             ref={menuRef}
//             className="absolute w-44 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
//             style={{ top: position.top, left: position.left }}
//         >
//             {dropdownContent}
//         </div>
//     );

//     return (
//         <>
//             <button
//                 ref={buttonRef}
//                 aria-haspopup="true"
//                 aria-expanded={isOpen}
//                 className="text-[#344767] text-xl font-bold focus:outline-none"
//                 onClick={toggleMenu}
//             >
//                 &#x22EE;
//             </button>
//             {isOpen && document.getElementById('dropdown-root') &&
//                 createPortal(dropdown, document.getElementById('dropdown-root')!)}
//         </>
//     );
// };

// export default ActionMenu;


import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Contact, ColumnData } from '@/components/Types/types';
import { UUID } from 'crypto';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface ActionMenuProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (contact: Contact) => void;
    onDetail: (contact: Contact) => void;
    availableColumns: ColumnData[];
    loadingColumns: boolean;
    onLeadAdded?: (newLeadData: any) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
    contact,
    onEdit,
    onDelete,
    onDetail,
    availableColumns,
    loadingColumns,
    onLeadAdded = () => { },
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showColumnSelection, setShowColumnSelection] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isAddingLead, setIsAddingLead] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: PointerEvent) => {
            const path = e.composedPath();
            if (
                menuRef.current &&
                !path.includes(menuRef.current) &&
                buttonRef.current &&
                !path.includes(buttonRef.current)
            ) {
                setIsOpen(false);
                setShowColumnSelection(false);
            }
        };

        window.addEventListener('pointerdown', handleClickOutside);
        return () => window.removeEventListener('pointerdown', handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setIsOpen(prev => {
            const newState = !prev;
            if (newState && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + window.scrollY + 5,
                    left: rect.left + window.scrollX - 150,
                });
            }
            return newState;
        });
        setShowColumnSelection(false);
    };

    const handleAddToTransactionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowColumnSelection(true);
    };

    const handleColumnSelect = (columnId: UUID) => {
        setIsAddingLead(true);

        router.post('/addleads', {
            contact_id: contact.id,
            column_id: columnId,
            name: contact.name,
            company_name: contact.company_name,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: page.props?.flash?.message || 'Lead berhasil ditambahkan.',
                    showConfirmButton: false,
                    timer: 1500,
                });

                if (typeof onLeadAdded === 'function') {
                    onLeadAdded((page as any).props?.newLeadData ?? {});
                }
            },
            onError: (errors) => {
                const messages = Object.values(errors).flat().join('\n');
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Lead',
                    text: messages || 'Terjadi kesalahan saat menambahkan lead.',
                });
            },
            onFinish: () => {
                setIsAddingLead(false);
                setIsOpen(false);
                setShowColumnSelection(false);
            }
        });
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(contact);
        setIsOpen(false);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(contact);
        setIsOpen(false);
    };

    const handleDetailClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDetail(contact);
        setIsOpen(false);
    };

    const dropdownContent = showColumnSelection ? (
        <ul className="text-xs text-[#344767]">
            <li className="px-3 py-2 font-bold bg-gray-100">Select Status:</li>
            {loadingColumns ? (
                <li className="px-3 py-2 text-gray-500">Loading...</li>
            ) : availableColumns.length === 0 ? (
                <li className="px-3 py-2 text-gray-500">No columns available.</li>
            ) : (
                availableColumns.map(column => (
                    <li
                        key={column.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleColumnSelect(column.id)}
                        style={{ pointerEvents: isAddingLead ? 'none' : 'auto' }}
                    >
                        {isAddingLead ? 'Adding...' : column.name}
                    </li>
                ))
            )}
        </ul>
    ) : (
        <ul className="text-xs text-[#344767]">
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleEditClick}>Edit</li>
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDeleteClick}>Hapus</li>
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDetailClick}>Detail</li>
            <li
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium"
                onClick={handleAddToTransactionClick}
                style={{ pointerEvents: isAddingLead ? 'none' : 'auto', opacity: isAddingLead ? 0.6 : 1 }}
            >
                {isAddingLead ? 'Adding Lead...' : '+ Add Leads'}
            </li>
        </ul>
    );

    const dropdown = (
        <div
            ref={menuRef}
            className="absolute w-44 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
            style={{ top: position.top, left: position.left }}
        >
            {dropdownContent}
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className="text-[#344767] text-xl font-bold focus:outline-none"
                onClick={toggleMenu}
            >
                &#x22EE;
            </button>
            {isOpen && document.getElementById('dropdown-root') &&
                createPortal(dropdown, document.getElementById('dropdown-root')!)}
        </>
    );
};

export default ActionMenu;
