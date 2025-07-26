// // resources/js/components/TableRow.tsx
// import React from 'react';
// import ActionMenu from './ActionMenu';

// type TableRowProps = {
//   id: number;
//   name: string;
//   email: string | null;
//   company_name: string | null;
//   phone: string | null;
//   address: string | null;
//   created_at: string;
//   updated_at: string;
//   sector?: {
//     id: number;
//     name: string;
//   } | null;
// };

// const TableRow: React.FC<TableRowProps> = ({
//   id,
//   name,
//   email,
//   company_name,
//   phone,
//   address,
//   created_at,
//   updated_at,
//   sector,
// }) => {
//   return (
//     <tr className="bg-white border border-[#E9ECEF] rounded-lg">
//       <td className="pl-6 py-3 leading-tight">
//         <div className="font-semibold">{name}</div>
//         <div className="text-xs text-[#98A2B3] truncate max-w-xs">{email || '-'}</div>
//       </td>
//       <td className="py-3 text-sm">{company_name}</td> {/* Ganti jika ada properti 'company' sebenarnya */}
//       <td className="py-3 text-xs text-[#344767]">{created_at}</td>
//       <td className="py-3 text-xs text-[#344767]">{updated_at}</td>
//       <td className="relative py-3 pr-6 text-right">
//         <ActionMenu contactId={id} />
//          contact={selectedContact}
//         onEditSave={handleSaveUpdate}
//         onDelete={handleDeleteContact}
//       </td>
//     </tr>
//   );
// };

// export default TableRow;


// resources/js/components/TableRow.tsx
// import React from 'react';
// import ActionMenu from './ActionMenu';
// import { ContactData } from '@/components/Types/types';

// type TableRowProps = {
//   id: number;
//   name: string;
//   email: string | null;
//   company_name: string | null;
//   phone: string | null;
//   address: string | null;
//   created_at: string;
//   updated_at: string;
//   sector?: {
//     id: number;
//     name: string;
//   } | null;
//   onEditSave: (updated: ContactData) => Promise<void>;
//   onDelete: (id: number) => void;
// };

// const TableRow: React.FC<TableRowProps> = ({
//   id,
//   name,
//   email,
//   company_name,
//   phone,
//   address,
//   created_at,
//   updated_at,
//   sector,
//   onEditSave,
//   onDelete,
// }) => {
//   return (
//     <tr className="bg-white border border-[#E9ECEF] rounded-lg">
//       <td className="pl-6 py-3 leading-tight">
//         <div className="font-semibold">{name}</div>
//         <div className="text-xs text-[#98A2B3] truncate max-w-xs">{email || '-'}</div>
//       </td>
//       <td className="py-3 text-sm">{company_name}</td>
//       <td className="py-3 text-xs text-[#344767]">{created_at}</td>
//       <td className="py-3 text-xs text-[#344767]">{updated_at}</td>
//       <td className="relative py-3 pr-6 text-right">
//         <ActionMenu
//           contact={{
//             id,
//             name,
//             email: email || '',
//             company_name: company_name || '',
//             phone: phone || '',
//             address: address || '',
//             created_at,
//             updated_at,
//             deleted_at: null,
//             sector_id: sector?.id || 0,
//             sector: sector || null,
//           }}
//           onEditSave={onEditSave}
//           onDelete={onDelete}
//         />
//       </td>
//     </tr>
//   );
// };

// export default TableRow;


// src/components/Tabel/TabelRow.tsx
// import React from 'react';
// import ActionMenu from './ActionMenu';
// import { ContactData, Contact as ContactType } from '@/components/Types/types'; // Import ContactType

// type TableRowProps = {
//     id: number;
//     name: string;
//     email: string | null;
//     company_name: string | null;
//     phone: string | null;
//     address: string | null;
//     created_at: string;
//     updated_at: string;
//     sector?: {
//         id: number;
//         name: string;
//     } | null;
//     // Changed onEditSave to onEdit to better reflect its purpose (opening modal)
//     // It now receives the full ContactType object
//     onEdit: (contact: ContactType) => void;
//     onDelete: (id: number) => void;
// };

// const TableRow: React.FC<TableRowProps> = ({
//     id,
//     name,
//     email,
//     company_name,
//     phone,
//     address,
//     created_at,
//     updated_at,
//     sector,
//     onEdit, // Renamed prop
//     onDelete,
// }) => {
//     // Construct the full ContactType object to pass to ActionMenu
//     const contactFull: ContactType = {
//         id,
//         name,
//         email: email || '',
//         company_name: company_name || '',
//         phone: phone || '',
//         address: address || '',
//         created_at,
//         updated_at,
//         deleted_at: null, // Assuming this is not present for active contacts
//         sector_id: sector?.id || 0, // Ensure sector_id is passed if sector exists
//         sector: sector || null,
//     };

//     return (
//         <tr className="bg-white border border-[#E9ECEF] rounded-lg">
//             <td className="pl-6 py-3 leading-tight">
//                 <div className="font-semibold">{name}</div>
//                 <div className="text-xs text-[#98A2B3] truncate max-w-xs">{email || '-'}</div>
//             </td>
//             <td className="py-3 text-sm">{company_name}</td>
//             <td className="py-3 text-xs text-[#344767]">{created_at}</td>
//             <td className="py-3 text-xs text-[#344767]">{updated_at}</td>
//             <td className="relative py-3 pr-6 text-right">
//                 <ActionMenu
//                     contact={contactFull} // Pass the complete contact object
//                     onEdit={onEdit} // Pass the onEdit handler
//                     onDelete={onDelete}
//                 />
//             </td>
//         </tr>
//     );
// };

// export default TableRow;


// import React from 'react';
// import ActionMenu from './ActionMenu';
// import { ContactData, Contact as ContactType } from '@/components/Types/types';

// type TableRowProps = {
//     id: number;
//     name: string;
//     email: string | null;
//     company_name: string | null;
//     phone: string | null;
//     address: string | null;
//     created_at: string;
//     updated_at: string;
//     sector?: {
//         id: number;
//         name: string;
//     } | null;
//     // onEdit now receives the full ContactType object
//     onEdit: (contact: ContactType) => void;
//     onDelete: (contact: ContactType) => void; // Changed to pass full contact to delete handler
// };

// const TableRow: React.FC<TableRowProps> = ({
//     id,
//     name,
//     email,
//     company_name,
//     phone,
//     address,
//     created_at,
//     updated_at,
//     sector,
//     onEdit,
//     onDelete,
// }) => {
//     // Construct the full ContactType object to pass to ActionMenu
//     const contactFull: ContactType = {
//         id,
//         name,
//         email: email || '',
//         company_name: company_name || '',
//         phone: phone || '',
//         address: address || '',
//         created_at,
//         updated_at,
//         deleted_at: null, // Assuming this is not present for active contacts
//         sector_id: sector?.id || 0, // Ensure sector_id is passed if sector exists
//         sector: sector || null,
//     };

//     return (
//         <tr className="bg-white border border-[#E9ECEF] rounded-lg">
//             <td className="pl-6 py-3 leading-tight">
//                 <div className="font-semibold">{name}</div>
//                 <div className="text-xs text-[#98A2B3] truncate max-w-xs">{email || '-'}</div>
//             </td>
//             <td className="py-3 text-sm">{company_name}</td>
//             <td className="py-3 text-xs text-[#344767]">{created_at}</td>
//             <td className="py-3 text-xs text-[#344767]">{updated_at}</td>
//             <td className="relative py-3 pr-6 text-right">
//                 <ActionMenu
//                     contact={contactFull} // Pass the complete contact object
//                     onEdit={onEdit} // Pass the onEdit handler
//                     onDelete={onDelete} // Pass the onDelete handler
//                 />
//             </td>
//         </tr>
//     );
// };

// export default TableRow;


// TableRow.tsx
// import React from 'react';
// import ActionMenu from './ActionMenu';
// import { UUID } from "crypto";
// import { ContactData, Contact as ContactType } from '@/components/Types/types';

// type TableRowProps = {
//     id: UUID;
//     name: string;
//     email: string | null;
//     company_name: string | null;
//     phone: string | null;
//     address: string | null;
//     created_at: string;
//     updated_at: string;
//     sector?: {
//         id: UUID;
//         name: string;
//     } | null;
//     onEdit: (contact: ContactType) => void;
//     onDelete: (contact: ContactType) => void;
//     onDetail: (contact: ContactType) => void; // <-- Add new prop for detail
// };

// const TableRow: React.FC<TableRowProps> = ({
//     id,
//     name,
//     email,
//     company_name,
//     phone,
//     address,
//     created_at,
//     updated_at,
//     sector,
//     onEdit,
//     onDelete,
//     onDetail, // <-- Destructure the new prop
// }) => {
//     const contactFull: ContactType = {
//         id,
//         name,
//         email: email || '',
//         company_name: company_name || '',
//         phone: phone || '',
//         address: address || '',
//         created_at,
//         updated_at,
//         deleted_at: null,
//         sector_id: sector?.id || '',
//         sector: sector || null,
//     };

//     return (
//         <tr className="bg-white border border-[#E9ECEF] rounded-lg">
//             <td className="pl-6 py-3 leading-tight">
//                 <div className="font-semibold">{name}</div>
//                 <div className="text-xs text-[#98A2B3] truncate max-w-xs">{email || '-'}</div>
//             </td>
//             <td className="py-3 text-sm">{company_name}</td>
//             <td className="py-3 text-xs text-[#344767]">{new Date(created_at).toLocaleString()}</td>
//             <td className="py-3 text-xs text-[#344767]">{new Date(updated_at).toLocaleString()}</td>
//             <td className="relative py-3 pr-6 text-right">
//                 <ActionMenu
//                     contact={contactFull}
//                     onEdit={onEdit}
//                     onDelete={onDelete}
//                     onDetail={onDetail} // <-- Pass the onDetail handler to ActionMenu
//                 />
//             </td>
//         </tr>
//     );
// };

// export default TableRow;



// components/Tabel/TabelRow.tsx
// import React from 'react';
// import ActionMenu from './ActionMenu';
// import { UUID } from "crypto";
// import { ContactData, Contact as ContactType } from '@/components/Types/types';

// type TableRowProps = {
//     id: UUID;
//     name: string;
//     email: string | null;
//     company_name: string | null;
//     phone: string | null;
//     address: string | null;
//     created_at: string;
//     updated_at: string;
//     sector?: {
//         id: UUID;
//         name: string;
//     } | null;
//     onEdit: (contact: ContactType) => void;
//     onDelete: (contact: ContactType) => void;
//     onDetail: (contact: ContactType) => void;
//     onAddToTransaction: (contact: ContactType) => void; // <-- Add new prop for adding to transaction
// };

// const TableRow: React.FC<TableRowProps> = ({
//     id,
//     name,
//     email,
//     company_name,
//     phone,
//     address,
//     created_at,
//     updated_at,
//     sector,
//     onEdit,
//     onDelete,
//     onDetail,
//     onAddToTransaction, // <-- Destructure the new prop
// }) => {
//     const contactFull: ContactType = {
//         id,
//         name,
//         email: email || '',
//         company_name: company_name || '',
//         phone: phone || '',
//         address: address || '',
//         created_at,
//         updated_at,
//         deleted_at: null,
//         sector_id: sector?.id || '',
//         sector: sector || null,
//     };

//     return (
//         <tr className="bg-white border border-[#E9ECEF] rounded-lg">
//             <td className="pl-6 py-3 leading-tight">
//                 <div className="font-semibold">{name}</div>
//                 <div className="text-xs text-[#98A2B3] truncate max-w-xs">{email || '-'}</div>
//             </td>
//             <td className="py-3 text-sm">{company_name}</td>
//             <td className="py-3 text-xs text-[#344767]">{new Date(created_at).toLocaleString()}</td>
//             <td className="py-3 text-xs text-[#344767]">{new Date(updated_at).toLocaleString()}</td>
//             <td className="relative py-3 pr-6 text-right">
//                 <ActionMenu
//                     contact={contactFull}
//                     onEdit={onEdit}
//                     onDelete={onDelete}
//                     onDetail={onDetail}
//                     onAddToTransaction={onAddToTransaction} // <-- Pass the new handler
//                 />
//             </td>
//         </tr>
//     );
// };

// export default TableRow;


// import React from 'react';
// import ActionMenu from './ActionMenu';
// import { UUID } from 'crypto'; // Assuming UUID type is here or similar
// import { Contact as ContactType, ColumnData } from '@/components/Types/types';

// type TableRowProps = {
//     id: UUID;
//     name: string;
//     email: string | null;
//     company_name: string | null;
//     phone: string | null;
//     address: string | null;
//     created_at: string;
//     updated_at: string;
//     sector?: {
//         id: UUID;
//         name: string;
//     } | null;
//     onEdit: (contact: ContactType) => void;
//     onDelete: (contact: ContactType) => void;
//     onDetail: (contact: ContactType) => void;
//     onAddToTransaction: (contact: ContactType) => void; // This prop's presence is consistent
//     availableColumns: ColumnData[]; // New prop
//     loadingColumns: boolean; // New prop
// };

// const TableRow: React.FC<TableRowProps> = ({
//     id,
//     name,
//     email,
//     company_name,
//     phone,
//     address,
//     created_at,
//     updated_at,
//     sector,
//     onEdit,
//     onDelete,
//     onDetail,
//     onAddToTransaction, // Destructure the prop
//     availableColumns,   // Destructure the prop
//     loadingColumns,     // Destructure the prop
// }) => {
//     // Lengkapi objek contact untuk ActionMenu
//     const contactFull: ContactType = {
//         id,
//         name,
//         email: email || '',
//         company_name: company_name || '',
//         phone: phone || '',
//         address: address || '',
//         created_at,
//         updated_at,
//         deleted_at: null, // Assuming this is always null for active contacts
//         sector_id: sector?.id || '', // Ensure sector_id is populated if sector exists
//         sector: sector || null,
//     };

//     return (
//         <tr className="bg-white border border-[#E9ECEF] rounded-lg">
//             <td className="pl-6 py-3 leading-tight">
//                 <div className="font-semibold">{name}</div>
//                 <div className="text-xs text-[#98A2B3] truncate max-w-xs">
//                     {email || '-'}
//                 </div>
//             </td>
//             <td className="py-3 text-sm">{company_name || '-'}</td>
//             <td className="py-3 text-xs text-[#344767]">
//                 {new Date(created_at).toLocaleString()}
//             </td>
//             <td className="py-3 text-xs text-[#344767]">
//                 {new Date(updated_at).toLocaleString()}
//             </td>
//             <td className="relative py-3 pr-6 text-right">
//                 <ActionMenu
//                     contact={contactFull}
//                     onEdit={onEdit}
//                     onDelete={onDelete}
//                     onDetail={onDetail}
//                     onAddToTransaction={onAddToTransaction} // Still passed, though not directly used by ActionMenu's internal logic
//                     availableColumns={availableColumns} // Pass availableColumns
//                     loadingColumns={loadingColumns} // Pass loadingColumns
//                 />
//             </td>
//         </tr>
//     );
// };

// export default TableRow;


import React from 'react';
import ActionMenu from './ActionMenu';
import { Contact as ContactType, ColumnData } from '@/components/Types/types';

type TableRowProps = {
    id: string; // Changed to string for UUID consistency
    name: string;
    email: string | null;
    company_name: string | null;
    phone: string | null;
    social_media: string | null; // Added social_media prop
    address: string | null;
    created_at: string;
    updated_at: string;
    sector?: {
        id: string; // Changed to string for UUID consistency
        name: string;
    } | null;
    onEdit: (contact: ContactType) => void;
    onDelete: (contact: ContactType) => void;
    onDetail: (contact: ContactType) => void;
    onAddToTransaction: (contact: ContactType) => void;
    availableColumns: ColumnData[];
    loadingColumns: boolean;
};

const TableRow: React.FC<TableRowProps> = ({
    id,
    name,
    email,
    company_name,
    phone,
    social_media, // Destructure social_media
    address,
    created_at,
    updated_at,
    sector,
    onEdit,
    onDelete,
    onDetail,
    onAddToTransaction,
    availableColumns,
    loadingColumns,
}) => {
    // Complete the contact object for ActionMenu
    const contactFull: ContactType = {
        id,
        name,
        email: email || null, // Ensure null for empty string or null
        company_name: company_name || null, // Ensure null for empty string or null
        phone: phone || null, // Ensure null for empty string or null
        social_media: social_media || null, // Include social_media here
        address: address || null, // Ensure null for empty string or null
        created_at,
        updated_at,
        deleted_at: null, // Assuming this is always null for active contacts
        sector_id: sector?.id || '', // Ensure sector_id is populated if sector exists
        sector: sector || null,
    };

    return (
        <tr className="bg-white border border-[#E9ECEF] rounded-lg">
            <td className="pl-6 py-3 leading-tight">
                <div className="font-semibold">{name}</div>
                <div className="text-xs text-[#98A2B3] truncate max-w-xs">
                    {email || '-'}
                    {/* You could optionally display social media here too */}
                    {/* {social_media && <span className="block">{social_media}</span>} */}
                </div>
            </td>
            <td className="py-3 text-sm">{company_name || '-'}</td>
            <td className="py-3 text-xs text-[#344767]">
                {new Date(created_at).toLocaleString('id-ID')} {/* Added 'id-ID' for Indonesian locale */}
            </td>
            <td className="py-3 text-xs text-[#344767]">
                {new Date(updated_at).toLocaleString('id-ID')} {/* Added 'id-ID' for Indonesian locale */}
            </td>
            <td className="relative py-3 pr-6 text-right">
                <ActionMenu
                    contact={contactFull}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDetail={onDetail}
                    onAddToTransaction={onAddToTransaction}
                    availableColumns={availableColumns}
                    loadingColumns={loadingColumns}
                />
            </td>
        </tr>
    );
};

export default TableRow;
