// import React, { useState, useEffect, useRef } from 'react';
// import { LeadDatas } from '@/components/Leads/types';
// import EditLeadModal from '@/Pages/Kanban/editlead';
// import LeadDetailDrawer from '@/Pages/Kanban/detaillead';
// import DeleteLeadModal from '@/Pages/Kanban/deletelead';

// interface LeadCardProps {
//     lead: LeadDatas;
//     onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => void;
//     onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
//     onEditLeadSuccess?: (lead: LeadDatas) => void;
//     onDeleteLead: (lead: LeadDatas) => void;
// }

// const LeadCard: React.FC<LeadCardProps> = ({
//     lead,
//     onDragStart,
//     onDragEnd,
//     onEditLeadSuccess,
//     onDeleteLead,
// }) => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const buttonRef = useRef<HTMLButtonElement>(null);

//     // Debug log: Cek nilai yang bermasalah
//     console.log('LeadCard rendering with assigneeInitials:', lead.assigneeInitials);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 dropdownRef.current &&
//                 !dropdownRef.current.contains(event.target as Node) &&
//                 buttonRef.current &&
//                 !buttonRef.current.contains(event.target as Node)
//             ) {
//                 setIsDropdownOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
//         e.stopPropagation();
//         setIsDropdownOpen((prev) => !prev);
//     };

//     const handleEditClick = () => {
//         setIsDropdownOpen(false);
//         setIsEditModalOpen(true);
//     };

//     const handleDeleteClick = () => {
//         setIsDropdownOpen(false);
//         onDeleteLead(lead);
//     };

//     const handleDetailClick = () => {
//         setIsDropdownOpen(false);
//         setIsDetailModalOpen(true);
//     };

//     const handleEditModalClose = () => setIsEditModalOpen(false);
//     const handleDetailModalClose = () => setIsDetailModalOpen(false);

//     const handleEditModalSave = async (updatedLead: LeadDatas) => {
//         if (onEditLeadSuccess) {
//             await onEditLeadSuccess(updatedLead);
//         }
//         setIsEditModalOpen(false);
//     };

//     const getDeadlineStatus = (deadline: string | null | undefined) => {
//         if (!deadline) return null;

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const deadlineDate = new Date(deadline);
//         deadlineDate.setHours(0, 0, 0, 0);

//         const dayDiff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

//         if (dayDiff < 0) {
//             return { text: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-100' };
//         } else if (dayDiff === 0) {
//             return { text: 'Due Today', color: 'text-orange-600', bgColor: 'bg-orange-100' };
//         } else if (dayDiff <= 3) {
//             return { text: `Due in ${dayDiff} days`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
//         } else {
//             const formattedDate = deadlineDate.toLocaleDateString('en-US', {
//                 month: 'short',
//                 day: 'numeric',
//                 year: 'numeric',
//             });
//             return { text: `Due: ${formattedDate}`, color: 'text-gray-600', bgColor: 'bg-gray-100' };
//         }
//     };

//     const deadlineStatus = getDeadlineStatus(lead.deadline);
//     console.log("Lead full data:", lead);


//     return (
//         <>
//             <div
//                 draggable
//                 className="group bg-white rounded-md p-3 shadow-sm cursor-pointer relative"
//                 style={{ cursor: 'grab', zIndex: isDropdownOpen ? 50 : 1 }}
//                 data-id={lead.id}
//                 onDragStart={(e) => onDragStart(e, lead)}
//                 onDragEnd={onDragEnd}
//             >
//                 {lead.sector && (
//                     <div className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded text-white ${lead.sectorColor} mb-1 select-none`}>
//                         {lead.sector}
//                     </div>
//                 )}

//                 <div className="text-sm font-semibold text-gray-800">Lead: {lead.name}</div>
//                 {lead.company_name && <div className="text-xs text-gray-500">Company: {lead.company_name}</div>}
//                 <div className="text-xs text-gray-500 mb-2">Product: {lead.product}</div>

//                 {deadlineStatus && (
//                     <div className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded ${deadlineStatus.bgColor} ${deadlineStatus.color} mb-3`}>
//                         <i className="far fa-calendar-alt"></i>
//                         <span>{deadlineStatus.text}</span>
//                     </div>
//                 )}

//                 <div className="absolute bottom-2 right-2">
//                     {/* <div
//                         className={`w-7 h-7 rounded-full ${lead.assigneeBgColor || 'bg-gray-400'} text-white flex items-center justify-center text-xs font-semibold select-none border border-black`}
//                     >
//                         {lead.assigneeInitials ? lead.assigneeInitials : '??'}
//                     </div> */}
//                     <div
//                         className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold select-none"
//                     >
//                         {lead.assigneeInitials ? lead.assigneeInitials : '??'}
//                     </div>

//                 </div>

//                 <button
//                     ref={buttonRef}
//                     className={`absolute top-2 right-2 text-gray-500 transition-opacity duration-200 cursor-pointer ${isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
//                     aria-label="Options"
//                     onClick={toggleDropdown}
//                 >
//                     <i className="fas fa-ellipsis-h"></i>
//                 </button>

//                 {isDropdownOpen && (
//                     <div
//                         ref={dropdownRef}
//                         className="absolute top-7 right-2 bg-white border border-gray-200 rounded shadow-md text-xs w-28 z-50"
//                         role="menu"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <button className="block w-full text-left px-3 py-1 hover:bg-gray-100" onClick={handleEditClick}>
//                             Edit
//                         </button>
//                         <button className="block w-full text-left px-3 py-1 hover:bg-gray-100" onClick={handleDetailClick}>
//                             Detail
//                         </button>
//                         <button className="block w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100" onClick={handleDeleteClick}>
//                             Hapus
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <EditLeadModal
//                 isOpen={isEditModalOpen}
//                 onClose={handleEditModalClose}
//                 onSave={handleEditModalSave}
//                 initialData={lead}
//             />

//             <LeadDetailDrawer
//                 isOpen={isDetailModalOpen}
//                 onClose={handleDetailModalClose}
//                 lead={lead}
//             />
//         </>
//     );
// };

// export default LeadCard;


// import React, { useState, useEffect, useRef } from 'react';
// import { LeadDatas } from '@/components/Leads/types';
// import EditLeadModal from '@/Pages/Kanban/editlead';
// import LeadDetailDrawer from '@/Pages/Kanban/detaillead';
// import DeleteLeadModal from '@/Pages/Kanban/deletelead';

// interface LeadCardProps {
//     lead: LeadDatas;
//     onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => void;
//     onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
//     onEditLeadSuccess?: (lead: LeadDatas) => void;
//     onDeleteLead: (lead: LeadDatas) => void;
// }

// const LeadCard: React.FC<LeadCardProps> = ({
//     lead,
//     onDragStart,
//     onDragEnd,
//     onEditLeadSuccess,
//     onDeleteLead,
// }) => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const buttonRef = useRef<HTMLButtonElement>(null);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 dropdownRef.current &&
//                 !dropdownRef.current.contains(event.target as Node) &&
//                 buttonRef.current &&
//                 !buttonRef.current.contains(event.target as Node)
//             ) {
//                 setIsDropdownOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
//         e.stopPropagation();
//         setIsDropdownOpen((prev) => !prev);
//     };

//     const handleEditClick = () => {
//         setIsDropdownOpen(false);
//         setIsEditModalOpen(true);
//     };

//     const handleDeleteClick = () => {
//         setIsDropdownOpen(false);
//         onDeleteLead(lead);
//     };

//     const handleDetailClick = () => {
//         setIsDropdownOpen(false);
//         setIsDetailModalOpen(true);
//     };

//     const handleEditModalClose = () => setIsEditModalOpen(false);
//     const handleDetailModalClose = () => setIsDetailModalOpen(false);

//     const handleEditModalSave = async (updatedLead: LeadDatas) => {
//         if (onEditLeadSuccess) {
//             await onEditLeadSuccess(updatedLead);
//         }
//         setIsEditModalOpen(false);
//     };

//     const getDeadlineStatus = (deadline: string | null | undefined) => {
//         if (!deadline) return null;

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const deadlineDate = new Date(deadline);
//         deadlineDate.setHours(0, 0, 0, 0);

//         const dayDiff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

//         if (dayDiff < 0) {
//             return { text: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-100' };
//         } else if (dayDiff === 0) {
//             return { text: 'Due Today', color: 'text-orange-600', bgColor: 'bg-orange-100' };
//         } else if (dayDiff <= 3) {
//             return { text: `Due in ${dayDiff} days`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
//         } else {
//             const formattedDate = deadlineDate.toLocaleDateString('en-US', {
//                 month: 'short',
//                 day: 'numeric',
//                 year: 'numeric',
//             });
//             return { text: `Due: ${formattedDate}`, color: 'text-gray-600', bgColor: 'bg-gray-100' };
//         }
//     };

//     const deadlineStatus = getDeadlineStatus(lead.deadline);

//     return (
//         <>
//             <div
//                 draggable
//                 className="group bg-white rounded-md p-3 shadow-sm cursor-pointer relative"
//                 style={{ cursor: 'grab', zIndex: isDropdownOpen ? 50 : 1 }}
//                 data-id={lead.id}
//                 onDragStart={(e) => onDragStart(e, lead)}
//                 onDragEnd={onDragEnd}
//             >
//                 {/* {lead.sector && (
//                     <div
//                         className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded mb-1 select-none"
//                         style={{
//                             backgroundColor: lead.sectorBgColor || '#999',
//                             color: lead.sectorTextColor || '#fff',
//                         }}
//                     >
//                         {lead.sector}
//                     </div>
//                 )} */}
//                 {lead.sector && (
//                     <div
//                         className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded mb-1 select-none"
//                         style={{
//                             backgroundColor: lead.sectorColor || '#6B7280',
//                             color: lead.sectorTextColor || '#ffffff',
//                         }}
//                     >
//                         {lead.sector}
//                     </div>
//                 )}


//                 <div className="text-sm font-semibold text-gray-800">Lead: {lead.name}</div>
//                 {lead.company_name && <div className="text-xs text-gray-500">Company: {lead.company_name}</div>}
//                 <div className="text-xs text-gray-500 mb-2">Product: {lead.product}</div>

//                 {deadlineStatus && (
//                     <div className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded ${deadlineStatus.bgColor} ${deadlineStatus.color} mb-3`}>
//                         <i className="far fa-calendar-alt"></i>
//                         <span>{deadlineStatus.text}</span>
//                     </div>
//                 )}

//                 <div className="absolute bottom-2 right-2">
//                     <div
//                         className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold select-none"
//                     >
//                         {lead.assigneeInitials || '??'}
//                     </div>
//                 </div>

//                 <button
//                     ref={buttonRef}
//                     className={`absolute top-2 right-2 text-gray-500 transition-opacity duration-200 cursor-pointer ${isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
//                     aria-label="Options"
//                     onClick={toggleDropdown}
//                 >
//                     <i className="fas fa-ellipsis-h"></i>
//                 </button>

//                 {isDropdownOpen && (
//                     <div
//                         ref={dropdownRef}
//                         className="absolute top-7 right-2 bg-white border border-gray-200 rounded shadow-md text-xs w-28 z-50"
//                         role="menu"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <button className="block w-full text-left px-3 py-1 hover:bg-gray-100" onClick={handleEditClick}>
//                             Edit
//                         </button>
//                         <button className="block w-full text-left px-3 py-1 hover:bg-gray-100" onClick={handleDetailClick}>
//                             Detail
//                         </button>
//                         <button className="block w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100" onClick={handleDeleteClick}>
//                             Hapus
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <EditLeadModal
//                 isOpen={isEditModalOpen}
//                 onClose={handleEditModalClose}
//                 onSave={handleEditModalSave}
//                 initialData={lead}
//             />

//             <LeadDetailDrawer
//                 isOpen={isDetailModalOpen}
//                 onClose={handleDetailModalClose}
//                 lead={lead}
//             />
//         </>
//     );
// };

// export default LeadCard;


// LeadCard.tsx
import React, { useState, useEffect, useRef } from 'react';
// import { LeadDatas } from '@/components/Leads/types'; // This line might be redundant if types are in the same file
import EditLeadModal from '@/Pages/Kanban/editlead';
import LeadDetailDrawer from '@/Pages/Kanban/detaillead';
import DeleteLeadModal from '@/Pages/Kanban/deletelead';

// Import your types from the same file or adjust path if 'types' is a separate file
import { LeadDatas, ContactOption, ProductOption } from '@/components/Leads/types'; // Assuming types.ts is in the same folder as types.d.ts or adjust path

interface LeadCardProps {
    lead: LeadDatas;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onEditLeadSuccess?: (lead: LeadDatas) => void;
    onDeleteLead: (lead: LeadDatas) => void;
    // Add new props for contacts and products
    contacts: ContactOption[];
    products: ProductOption[];
}

const LeadCard: React.FC<LeadCardProps> = ({
    lead,
    onDragStart,
    onDragEnd,
    onEditLeadSuccess,
    onDeleteLead,
    // Destructure new props
    contacts,
    products,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsDropdownOpen((prev) => !prev);
    };

    const handleEditClick = () => {
        setIsDropdownOpen(false);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = () => {
        setIsDropdownOpen(false);
        onDeleteLead(lead);
    };

    const handleDetailClick = () => {
        setIsDropdownOpen(false);
        setIsDetailModalOpen(true);
    };

    const handleEditModalClose = () => setIsEditModalOpen(false);
    const handleDetailModalClose = () => setIsDetailModalOpen(false);

    const handleEditModalSave = async (updatedLead: LeadDatas) => {
        if (onEditLeadSuccess) {
            await onEditLeadSuccess(updatedLead);
        }
        setIsEditModalOpen(false);
    };

    const getDeadlineStatus = (deadline: string | null | undefined) => {
        if (!deadline) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);

        const dayDiff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff < 0) {
            return { text: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-100' };
        } else if (dayDiff === 0) {
            return { text: 'Due Today', color: 'text-orange-600', bgColor: 'bg-orange-100' };
        } else if (dayDiff <= 3) {
            return { text: `Due in ${dayDiff} days`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
        } else {
            const formattedDate = deadlineDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
            return { text: `Due: ${formattedDate}`, color: 'text-gray-600', bgColor: 'bg-gray-100' };
        }
    };

    const deadlineStatus = getDeadlineStatus(lead.deadline);
    console.log("🔥 Lead data in LeadCard:", lead);

    return (
        <>
            <div
                draggable
                className="group bg-white rounded-md p-3 shadow-sm cursor-pointer relative"
                style={{ cursor: 'grab', zIndex: isDropdownOpen ? 50 : 1 }}
                data-id={lead.id}
                onDragStart={(e) => onDragStart(e, lead)}
                onDragEnd={onDragEnd}
            >
                {lead.sector && (
                    <div
                        className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded mb-1 select-none"
                        style={{
                            backgroundColor: lead.sectorColor || '#6B7280',
                            color: lead.sectorTextColor || '#ffffff',
                        }}
                    >
                        {lead.sector}
                    </div>
                )}


                <div className="text-sm font-semibold text-gray-800">Lead: {lead.name}</div>
                {lead.company_name && <div className="text-xs text-gray-500">Company: {lead.company_name}</div>}
                <div className="text-xs text-gray-500 mb-2">Product: {lead.product}</div>

                {deadlineStatus && (
                    <div className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded ${deadlineStatus.bgColor} ${deadlineStatus.color} mb-3`}>
                        <i className="far fa-calendar-alt"></i>
                        <span>{deadlineStatus.text}</span>
                    </div>
                )}

                <div className="absolute bottom-2 right-2">
                    <div
                        className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold select-none"
                    >
                        {lead.assigneeInitials || '??'}
                    </div>
                </div>

                <button
                    ref={buttonRef}
                    className={`absolute top-2 right-2 text-gray-500 transition-opacity duration-200 cursor-pointer ${isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    aria-label="Options"
                    onClick={toggleDropdown}
                >
                    <i className="fas fa-ellipsis-h"></i>
                </button>

                {isDropdownOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-7 right-2 bg-white border border-gray-200 rounded shadow-md text-xs w-28 z-50"
                        role="menu"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="block w-full text-left px-3 py-1 hover:bg-gray-100" onClick={handleEditClick}>
                            Edit
                        </button>
                        <button className="block w-full text-left px-3 py-1 hover:bg-gray-100" onClick={handleDetailClick}>
                            Detail
                        </button>
                        <button className="block w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100" onClick={handleDeleteClick}>
                            Hapus
                        </button>
                    </div>
                )}
            </div>

            <EditLeadModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                onSave={handleEditModalSave}
                initialData={lead}
                // Pass the contacts and products props down
                contacts={contacts}
                products={products}
            />

            <LeadDetailDrawer
                isOpen={isDetailModalOpen}
                onClose={handleDetailModalClose}
                lead={lead}
            />
        </>
    );
};

export default LeadCard;
