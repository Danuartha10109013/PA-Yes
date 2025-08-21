// import React, { useState } from 'react';
// import { ColumnData, LeadDatas } from './types'; // Ensure this path is correct
// import LeadCard from './KanbanCard'; // Ensure this path is correct
// import AddLeadModal from '@/Pages/Kanban/addlead'; // Ensure this path is correct and consistent

// interface LeadColumnProps {
//     column: ColumnData;
//     leads: LeadDatas[]; // Array of leads specifically for this column
//     onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => void;
//     onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
//     onDragOver: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
//     onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
//     onDrop: (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => void;
//     isDragOver: boolean;
//     onAddLead: (newLead: LeadDatas) => void; // Function to add a new lead to the BoardView state
//     onEditLeadSuccess: (lead: LeadDatas) => void; // Callback for successful lead edit
//     onDeleteLead: (lead: LeadDatas) => void; // Callback to trigger lead deletion modal
// }

// const LeadColumn: React.FC<LeadColumnProps> = ({
//     column,
//     leads, // The leads array filtered specifically for this column
//     onDragStart,
//     onDragEnd,
//     onDragOver,
//     onDragLeave,
//     onDrop,
//     isDragOver,
//     onAddLead,
//     onEditLeadSuccess,
//     onDeleteLead,
// }) => {
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

//     const handleOpenAddLeadModal = () => {
//         setIsAddLeadModalOpen(true);
//     };

//     const handleCloseAddLeadModal = () => {
//         setIsAddLeadModalOpen(false);
//     };

//     const handleSaveLeadFromModal = (newLead: LeadDatas) => {
//         // This function simply passes the new lead up to the BoardView's onAddLead handler
//         onAddLead(newLead);
//         // The modal will close automatically after onSave in AddLeadModal is successful
//     };

//     return (
//         <div
//             className={`flex flex-col ${column.bgColor} rounded-md w-64 min-w-[16rem] max-h-[28rem]
//                          ${isDragOver ? 'border-2 border-blue-500 shadow-lg' : column.borderColor}`}
//             data-column-id={column.id}
//             onDragOver={(e) => onDragOver(e, column.id)}
//             onDragLeave={(e) => onDragLeave(e)}
//             onDrop={(e) => onDrop(e, column.id)}
//         >
//             {/* Column Header */}
//             <div className={`flex items-center px-3 py-1 border-b ${column.borderColor} text-xs font-semibold ${column.titleColor}`}>
//                 <div className="flex items-center space-x-2">
//                     <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${column.dotBorderColor} ${column.dotBgColor} ${column.dotTextColor} text-[10px] font-extrabold`}>
//                         {column.dotBgColor === 'bg-transparent' ? '◌' : '●'}
//                     </div>
//                     <span>{column.title.toUpperCase()}</span>
//                     <span className={`ml-2 ${column.titleColor} font-normal`}>{leads.length}</span>
//                 </div>
//                 <div className="ml-auto flex space-x-2">
//                     <button className={`${column.titleColor} hover:text-gray-900 text-lg font-bold`}>...</button>
//                     <button
//                         className={`${column.titleColor} hover:text-gray-900 text-lg font-bold`}
//                         onClick={handleOpenAddLeadModal}
//                     >
//                         +
//                     </button>
//                 </div>
//             </div>

//             {/* Leads Container (Scrollable) */}
//             <div
//                 className="flex flex-col p-3 flex-grow overflow-y-auto"
//             >
//                 <div className="cards-container space-y-2">
//                     {/* Render LeadCards for leads in this column */}
//                     {leads.map((lead) => (
//                         <LeadCard
//                             key={lead.id} // Essential for React list rendering
//                             lead={lead}
//                             onDragStart={onDragStart}
//                             onDragEnd={onDragEnd}
//                             onEditLeadSuccess={onEditLeadSuccess} // Pass the edit success handler down
//                             onDeleteLead={onDeleteLead} // Pass the delete handler down
//                         />
//                     ))}
//                 </div>
//                 {/* Add Lead button at the bottom of the column */}
//                 <button
//                     className={`${column.addLeadColor} text-sm font-semibold mt-2 text-left select-none hover:underline`}
//                     onClick={handleOpenAddLeadModal}
//                 >
//                     + Add Lead
//                 </button>
//             </div>

//             {/* Add Lead Modal */}
//             <AddLeadModal
//                 isOpen={isAddLeadModalOpen}
//                 onClose={handleCloseAddLeadModal}
//                 onSave={handleSaveLeadFromModal}
//                 initialColumnId={column.id}
//             />
//         </div>
//     );
// };

// export default LeadColumn;


// import React, { useState } from 'react';
// import { ColumnData, LeadDatas } from './types';
// import LeadCard from './KanbanCard';
// import AddLeadModal from '@/Pages/Kanban/addlead';

// interface LeadColumnProps {
//     column: ColumnData;
//     leads: LeadDatas[];
//     onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => void;
//     onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
//     onDragOver: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
//     onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
//     onDrop: (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => void;
//     isDragOver: boolean;
//     onAddLead: (newLead: LeadDatas) => void;
//     onEditLeadSuccess: (lead: LeadDatas) => void;
//     onDeleteLead: (lead: LeadDatas) => void;
// }

// const LeadColumn: React.FC<LeadColumnProps> = ({
//     column,
//     leads,
//     onDragStart,
//     onDragEnd,
//     onDragOver,
//     onDragLeave,
//     onDrop,
//     isDragOver,
//     onAddLead,
//     onEditLeadSuccess,
//     onDeleteLead,
// }) => {
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

//     const handleOpenAddLeadModal = () => setIsAddLeadModalOpen(true);
//     const handleCloseAddLeadModal = () => setIsAddLeadModalOpen(false);

//     const handleSaveLeadFromModal = (newLead: LeadDatas) => {
//         onAddLead(newLead);
//     };

//     return (
//         <div
//             className={`flex flex-col ${column.bgColor} rounded-md w-64 min-w-[16rem] max-h-[28rem]
//                         ${isDragOver ? 'border-2 border-blue-500 shadow-lg' : column.borderColor}`}
//             data-column-id={column.id}
//             onDragOver={(e) => {
//                 e.preventDefault(); // ✅ Agar bisa menerima drop
//                 onDragOver(e, column.id);
//             }}
//             onDragLeave={(e) => onDragLeave(e)}
//             onDrop={(e) => {
//                 e.preventDefault(); // ✅ WAJIB
//                 console.log("🔥 Drop terjadi di kolom:", column.id); // ✅ Debug
//                 onDrop(e, column.id);
//             }}
//         >
//             {/* Header */}
//             <div className={`flex items-center px-3 py-1 border-b ${column.borderColor} text-xs font-semibold ${column.titleColor}`}>
//                 <div className="flex items-center space-x-2">
//                     <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${column.dotBorderColor} ${column.dotBgColor} ${column.dotTextColor} text-[10px] font-extrabold`}>
//                         {column.dotBgColor === 'bg-transparent' ? '◌' : '●'}
//                     </div>
//                     <span>{column.title.toUpperCase()}</span>
//                     <span className={`ml-2 ${column.titleColor} font-normal`}>{leads.length}</span>
//                 </div>
//                 <div className="ml-auto flex space-x-2">
//                     <button className={`${column.titleColor} hover:text-gray-900 text-lg font-bold`}>...</button>
//                     <button
//                         className={`${column.titleColor} hover:text-gray-900 text-lg font-bold`}
//                         onClick={handleOpenAddLeadModal}
//                     >
//                         +
//                     </button>
//                 </div>
//             </div>

//             {/* Cards Container */}
//             <div className="flex flex-col p-3 flex-grow overflow-y-auto">
//                 <div className="cards-container space-y-2">
//                     {leads.map((lead) => (
//                         <LeadCard
//                             key={lead.id}
//                             lead={lead}
//                             onDragStart={onDragStart}
//                             onDragEnd={onDragEnd}
//                             onEditLeadSuccess={onEditLeadSuccess}
//                             onDeleteLead={onDeleteLead}
//                         />
//                     ))}
//                 </div>
//                 <button
//                     className={`${column.addLeadColor} text-sm font-semibold mt-2 text-left select-none hover:underline`}
//                     onClick={handleOpenAddLeadModal}
//                 >
//                     + Add Lead
//                 </button>
//             </div>

//             {/* Modal */}
//             <AddLeadModal
//                 isOpen={isAddLeadModalOpen}
//                 onClose={handleCloseAddLeadModal}
//                 onSave={handleSaveLeadFromModal}
//                 initialColumnId={column.id}
//             />
//         </div>
//     );
// };

// export default LeadColumn;


// import React, { useState } from 'react';
// import { ColumnData, LeadDatas } from './types'; // Ensure this path is correct relative to LeadColumn.tsx
// import LeadCard from './KanbanCard'; // Ensure this path is correct relative to LeadColumn.tsx
// import AddLeadModal from '@/Pages/Kanban/addlead'; // Ensure this path is correct and consistent

// interface LeadColumnProps {
//     column: ColumnData;
//     leads: LeadDatas[]; // Array of leads specifically for this column
//     onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => void;
//     onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
//     onDragOver: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
//     onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
//     onDrop: (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => void;
//     isDragOver: boolean;
//     onAddLead: (newLead: LeadDatas) => void; // Function to add a new lead to the BoardView state
//     onEditLeadSuccess: (lead: LeadDatas) => void; // Callback for successful lead edit
//     onDeleteLead: (lead: LeadDatas) => void; // Callback to trigger lead deletion modal
// }

// const LeadColumn: React.FC<LeadColumnProps> = ({
//     column,
//     leads, // The leads array filtered specifically for this column
//     onDragStart,
//     onDragEnd,
//     onDragOver,
//     onDragLeave,
//     onDrop,
//     isDragOver,
//     onAddLead,
//     onEditLeadSuccess,
//     onDeleteLead,
// }) => {
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

//     const handleOpenAddLeadModal = () => setIsAddLeadModalOpen(true);
//     const handleCloseAddLeadModal = () => setIsAddLeadModalOpen(false);

//     const handleSaveLeadFromModal = (newLead: LeadDatas) => {
//         // This function simply passes the new lead up to the BoardView's onAddLead handler
//         onAddLead(newLead);
//         // The modal will close automatically after onSave in AddLeadModal is successful
//     };

//     return (
//         <div
//             className={`flex flex-col ${column.bgColor} rounded-md w-64 min-w-[16rem] max-h-[28rem]
//                          ${isDragOver ? 'border-2 border-blue-500 shadow-lg' : column.borderColor}`}
//             data-column-id={column.id}
//             onDragOver={(e) => {
//                 e.preventDefault(); // Crucial to allow dropping
//                 onDragOver(e, column.id);
//             }}
//             onDragLeave={(e) => onDragLeave(e)}
//             onDrop={(e) => {
//                 e.preventDefault(); // Crucial to allow dropping
//                 console.log("🔥 Drop occurred on column:", column.id); // Debug log
//                 onDrop(e, column.id);
//             }}
//         >
//             {/* Column Header */}
//             <div className={`flex items-center px-3 py-1 border-b ${column.borderColor} text-xs font-semibold ${column.titleColor}`}>
//                 <div className="flex items-center space-x-2">
//                     <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${column.dotBorderColor} ${column.dotBgColor} ${column.dotTextColor} text-[10px] font-extrabold`}>
//                         {column.dotBgColor === 'bg-transparent' ? '◌' : '●'}
//                     </div>
//                     <span>{column.title.toUpperCase()}</span>
//                     <span className={`ml-2 ${column.titleColor} font-normal`}>{leads.length}</span>
//                 </div>
//                 <div className="ml-auto flex space-x-2">
//                     <button className={`${column.titleColor} hover:text-gray-900 text-lg font-bold`}>...</button>
//                     <button
//                         className={`${column.titleColor} hover:text-gray-900 text-lg font-bold`}
//                         onClick={handleOpenAddLeadModal}
//                     >
//                         +
//                     </button>
//                 </div>
//             </div>

//             {/* Leads Container (Scrollable) */}
//             <div
//                 className="flex flex-col p-3 flex-grow overflow-y-auto"
//             >
//                 <div className="cards-container space-y-2">
//                     {/* Render LeadCards for leads in this column */}
//                     {leads.map((lead) => (
//                         <LeadCard
//                             key={lead.id} // Essential for React list rendering
//                             lead={lead}
//                             onDragStart={onDragStart}
//                             onDragEnd={onDragEnd}
//                             onEditLeadSuccess={onEditLeadSuccess} // Pass the edit success handler down
//                             onDeleteLead={onDeleteLead} // Pass the delete handler down
//                         />
//                     ))}
//                 </div>
//                 {/* Add Lead button at the bottom of the column */}
//                 <button
//                     className={`${column.addLeadColor} text-sm font-semibold mt-2 text-left select-none hover:underline`}
//                     onClick={handleOpenAddLeadModal}
//                 >
//                     + Add Lead
//                 </button>
//             </div>

//             {/* Add Lead Modal */}
//             <AddLeadModal
//                 isOpen={isAddLeadModalOpen}
//                 onClose={handleCloseAddLeadModal}
//                 onSave={handleSaveLeadFromModal}
//                 initialColumnId={column.id}
//             />
//         </div>
//     );
// };

// export default LeadColumn;


// import React from 'react'; // Hapus useState karena tidak lagi digunakan untuk modal lokal
// import { ColumnData, LeadDatas } from './types';
// import LeadCard from './KanbanCard';

// interface LeadColumnProps {
//     column: ColumnData;
//     leads: LeadDatas[];
//     onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => void;
//     onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
//     onDragOver: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
//     onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
//     onDrop: (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => void;
//     isDragOver: boolean;
//     // Ubah tipe onAddLead agar menerima columnId
//     onAddLead: (columnId: string) => void;
//     onEditLeadSuccess: (lead: LeadDatas) => void;
//     onDeleteLead: (lead: LeadDatas) => void;
// }

// const LeadColumn: React.FC<LeadColumnProps> = ({
//     column,
//     leads,
//     onDragStart,
//     onDragEnd,
//     onDragOver,
//     onDragLeave,
//     onDrop,
//     isDragOver,
//     onAddLead, // Gunakan prop yang sudah diubah
//     onEditLeadSuccess,
//     onDeleteLead,
// }) => {
//     // Hapus state lokal isAddLeadModalOpen dan handler-nya
//     // const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
//     // const handleOpenAddLeadModal = () => setIsAddLeadModalOpen(true);
//     // const handleCloseAddLeadModal = () => setIsAddLeadModalOpen(false);
//     // const handleSaveLeadFromModal = (newLead: LeadDatas) => {
//     //     onAddLead(newLead);
//     // };

//     return (
//         <div
//             className={`flex flex-col ${column.bgColor} rounded-md w-64 min-w-[16rem] max-h-[28rem]
//                          ${isDragOver ? 'border-2 border-blue-500 shadow-lg' : column.borderColor}`}
//             data-column-id={column.id}
//             onDragOver={(e) => {
//                 e.preventDefault();
//                 onDragOver(e, column.id);
//             }}
//             onDragLeave={(e) => onDragLeave(e)}
//             onDrop={(e) => {
//                 e.preventDefault();
//                 console.log("🔥 Drop occurred on column:", column.id);
//                 onDrop(e, column.id);
//             }}
//         >
//             {/* Column Header */}
//             <div className={`flex items-center px-3 py-1 border-b ${column.borderColor} text-xs font-semibold ${column.titleColor}`}>
//                 <div className="flex items-center space-x-2">
//                     <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${column.dotBorderColor} ${column.dotBgColor} ${column.dotTextColor} text-[10px] font-extrabold`}>
//                         {column.dotBgColor === 'bg-transparent' ? '◌' : '●'}
//                     </div>
//                     <span>{column.title.toUpperCase()}</span>
//                     <span className={`ml-2 ${column.titleColor} font-normal`}>{leads.length}</span>
//                 </div>
//                 <div className="ml-auto flex space-x-2">
//                     <button className={`${column.titleColor} hover:text-gray-900 text-lg font-bold`}>...</button>
//                     <button
//                         className={`${column.titleColor} hover:text-gray-900 text-lg font-bold`}
//                         onClick={() => onAddLead(column.id)} // Panggil prop onAddLead dengan column.id
//                     >
//                         +
//                     </button>
//                 </div>
//             </div>

//             {/* Leads Container (Scrollable) */}
//             <div
//                 className="flex flex-col p-3 flex-grow overflow-y-auto"
//             >
//                 <div className="cards-container space-y-2">
//                     {/* Render LeadCards for leads in this column */}
//                     {leads.map((lead) => (
//                         <LeadCard
//                             key={lead.id}
//                             lead={lead}
//                             onDragStart={onDragStart}
//                             onDragEnd={onDragEnd}
//                             onEditLeadSuccess={onEditLeadSuccess}
//                             onDeleteLead={onDeleteLead}
//                         />
//                     ))}
//                 </div>
//                 {/* Add Lead button at the bottom of the column */}
//                 <button
//                     className={`${column.addLeadColor} text-sm font-semibold mt-2 text-left select-none hover:underline`}
//                     onClick={() => onAddLead(column.id)} // Panggil prop onAddLead dengan column.id
//                 >
//                     + Add Lead
//                 </button>
//             </div>

//             {/* Hapus AddLeadModal dari sini */}
//         </div>
//     );
// };

// export default LeadColumn;


// LeadColumn.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ColumnData, LeadDatas, ContactOption, ProductOption } from './types'; // Make sure to import ContactOption and ProductOption
import LeadCard from './KanbanCard';

interface LeadColumnProps {
    column: ColumnData;
    leads: LeadDatas[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => void;
    isDragOver: boolean;
    onAddLead: (columnId: string) => void;
    onEditLeadSuccess: (lead: LeadDatas) => void;
    onDeleteLead: (lead: LeadDatas) => void;
    // Add new props for contacts and products
    contacts: ContactOption[];
    products: ProductOption[];
    // Only keep edit column action
    onEditColumn?: (column: ColumnData) => void;
}

const LeadColumn: React.FC<LeadColumnProps> = ({
    column,
    leads,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    isDragOver,
    onAddLead,
    onEditLeadSuccess,
    onDeleteLead,
    // Destructure new props
    contacts,
    products,
    onEditColumn,
}) => {
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const columnMenuRef = useRef<HTMLDivElement>(null);
    const columnMenuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                columnMenuRef.current &&
                !columnMenuRef.current.contains(event.target as Node) &&
                columnMenuButtonRef.current &&
                !columnMenuButtonRef.current.contains(event.target as Node)
            ) {
                setIsColumnMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleColumnMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsColumnMenuOpen(prev => !prev);
    };

    const handleColumnAction = (action: string) => {
        setIsColumnMenuOpen(false);
        if (action === 'edit' && onEditColumn) {
            onEditColumn(column);
            return;
        }
        console.log(`Column action clicked: ${action} for column: ${column.title}`);
    };
    return (
        <div
            className={`flex flex-col ${column.bgColor} rounded-md w-64 min-w-[16rem] max-h-[28rem]
                         ${isDragOver ? 'border-2 border-blue-500 shadow-lg' : column.borderColor}`}
            data-column-id={column.id}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver(e, column.id);
            }}
            onDragLeave={(e) => onDragLeave(e)}
            onDrop={(e) => {
                e.preventDefault();
                console.log("🔥 Drop occurred on column:", column.id);
                onDrop(e, column.id);
            }}
        >
            {/* Column Header */}
            <div className={`flex items-center px-3 py-1 border-b ${column.borderColor} text-xs font-semibold ${column.titleColor}`}>
                <div className="flex items-center space-x-2">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${column.dotBorderColor} ${column.dotBgColor} ${column.dotTextColor} text-[10px] font-extrabold`}>
                        {column.dotBgColor === 'bg-transparent' ? '◌' : '●'}
                    </div>
                    <span>{column.title.toUpperCase()}</span>
                    <span className={`ml-2 ${column.titleColor} font-normal`}>{leads.length}</span>
                </div>
                <div className="ml-auto flex space-x-2 relative">
                    <button 
                        ref={columnMenuButtonRef}
                        className={`${column.titleColor} hover:text-gray-900 text-lg font-bold transition-colors`}
                        onClick={toggleColumnMenu}
                        title="Column options"
                    >
                        ⋯
                    </button>
                    
                    {isColumnMenuOpen && (
                        <div
                            ref={columnMenuRef}
                            className="absolute top-6 right-0 bg-white border border-gray-200 rounded-md shadow-lg text-xs w-32 z-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ul className="text-[#344767]">
                                <li
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleColumnAction('edit')}
                                >
                                    <i className="fas fa-edit mr-2"></i>
                                    Edit Column
                                </li>
                            </ul>
                        </div>
                    )}
                    
                    <button
                        className={`${column.titleColor} hover:text-gray-900 text-lg font-bold`}
                        onClick={() => onAddLead(column.id)}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Leads Container (Scrollable) */}
            <div
                className="flex flex-col p-3 flex-grow overflow-y-auto"
            >
                <div className="cards-container space-y-2">
                    {/* Render LeadCards for leads in this column */}
                    {leads.map((lead) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onEditLeadSuccess={onEditLeadSuccess}
                            onDeleteLead={onDeleteLead}
                            // Pass the contacts and products props down
                            contacts={contacts}
                            products={products}
                        />
                    ))}
                </div>
                {/* Add Lead button at the bottom of the column */}
                <button
                    className={`${column.addLeadColor} text-sm font-semibold mt-2 text-left select-none hover:underline`}
                    onClick={() => onAddLead(column.id)}
                >
                    + Add Lead
                </button>
            </div>
        </div>
    );
};

export default LeadColumn;
