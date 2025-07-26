// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { LeadDatas as TransactionLeadType } from '@/components/Leads/types'; // Import LeadDatas as TransactionLeadType

// interface ActionMenuTransactionLeadProps {
//     lead: TransactionLeadType; // Now takes a TransactionLeadType object
//     onEdit: (lead: TransactionLeadType) => void; // Pass the lead to the handler
//     onDelete: (lead: TransactionLeadType) => void; // Pass the lead to the handler
//     onDetail: (lead: TransactionLeadType) => void; // Added back for detail view
// }

// const ActionMenuTransactionLead: React.FC<ActionMenuTransactionLeadProps> = ({ lead, onEdit, onDelete, onDetail }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [position, setPosition] = useState({ top: 0, left: 0 });

//     const menuRef = useRef<HTMLDivElement>(null);
//     const buttonRef = useRef<HTMLButtonElement>(null);

//     // Effect to handle clicks outside the menu to close it
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (
//                 menuRef.current &&
//                 !menuRef.current.contains(event.target as Node) &&
//                 buttonRef.current &&
//                 !buttonRef.current.contains(event.target as Node)
//             ) {
//                 setIsOpen(false);
//             }
//         }

//         window.addEventListener('click', handleClickOutside);
//         return () => {
//             window.removeEventListener('click', handleClickOutside);
//         };
//     }, []);

//     // Toggle menu visibility and calculate its position
//     const toggleMenu = () => {
//         setIsOpen((prev) => {
//             const newState = !prev;
//             if (newState && buttonRef.current) {
//                 const rect = buttonRef.current.getBoundingClientRect();
//                 // Calculate position to appear next to the button or slightly offset
//                 // Adjust left for menu width (w-28 = 112px, so 120 is a good offset for right alignment)
//                 setPosition({
//                     top: rect.bottom + window.scrollY + 5, // 5px offset below button
//                     left: rect.left + window.scrollX - 120 + rect.width, // Align right edge with button's right edge
//                 });
//             }
//             return newState;
//         });
//     };

//     // Handlers for menu item clicks
//     const handleEditClick = () => {
//         setIsOpen(false); // Close the dropdown menu
//         onEdit(lead); // Call the onEdit handler from props, passing the current lead
//     };

//     const handleDeleteClick = () => {
//         setIsOpen(false); // Close the dropdown menu
//         onDelete(lead); // Call the onDelete handler from props, passing the current lead
//     };

//     const handleDetailClick = () => {
//         setIsOpen(false); // Close the dropdown menu
//         onDetail(lead); // Call the onDetail handler from props, passing the current lead
//     };

//     // The dropdown menu content, to be portaled
//     const dropdown = (
//         <div
//             ref={menuRef}
//             className="absolute w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//             style={{
//                 top: position.top,
//                 left: position.left,
//                 position: 'absolute', // Ensures correct positioning when portaled
//             }}
//         >
//             <ul className="text-xs text-[#344767]">
//                 <li
//                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={handleDetailClick}
//                 >
//                     Detail
//                 </li>
//                 <li
//                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={handleEditClick}
//                 >
//                     Edit
//                 </li>
//                 <li
//                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={handleDeleteClick}
//                 >
//                     Hapus
//                 </li>
//             </ul>
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
//                 &#x22EE; {/* This is the vertical ellipsis character */}
//             </button>

//             {/* Render dropdown using createPortal if open and dropdown-root exists */}
//             {isOpen && document.getElementById('dropdown-root') && createPortal(dropdown, document.getElementById('dropdown-root')!)}
//         </>
//     );
// };

// export default ActionMenuTransactionLead;


import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LeadDatas as TransactionLeadType } from '@/components/Leads/types';

interface ActionMenuTransactionLeadProps {
    lead: TransactionLeadType; // Now takes a TransactionLeadType object
    onEdit: (lead: TransactionLeadType) => void; // Pass the lead to the handler
    onDelete: (lead: TransactionLeadType) => void; // Pass the lead to the handler
    onDetail: (lead: TransactionLeadType) => void; // Added back for detail view
}

const ActionMenuTransactionLead: React.FC<ActionMenuTransactionLeadProps> = ({ lead, onEdit, onDelete, onDetail }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Effect to handle clicks outside the menu to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Toggle menu visibility and calculate its position
    const toggleMenu = () => {
        setIsOpen((prev) => {
            const newState = !prev;
            if (newState && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                // Calculate position to appear next to the button or slightly offset
                // Adjust left for menu width (w-28 = 112px, so 120 is a good offset for right alignment)
                setPosition({
                    top: rect.bottom + window.scrollY + 5, // 5px offset below button
                    left: rect.left + window.scrollX - 120 + rect.width, // Align right edge with button's right edge
                });
            }
            return newState;
        });
    };

    // Handlers for menu item clicks
    const handleEditClick = () => {
        setIsOpen(false); // Close the dropdown menu
        onEdit(lead); // Call the onEdit handler from props, passing the current lead
    };

    const handleDeleteClick = () => {
        setIsOpen(false); // Close the dropdown menu
        onDelete(lead); // Call the onDelete handler from props, passing the current lead
    };

    const handleDetailClick = () => {
        setIsOpen(false); // Close the dropdown menu
        onDetail(lead); // Call the onDetail handler from props, passing the current lead
    };

    // The dropdown menu content, to be portaled
    const dropdown = (
        <div
            ref={menuRef}
            className="absolute w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            style={{
                top: position.top,
                left: position.left,
                position: 'absolute', // Ensures correct positioning when portaled
            }}
        >
            <ul className="text-xs text-[#344767]">
                <li
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleDetailClick}
                >
                    Detail
                </li>
                <li
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleEditClick}
                >
                    Edit
                </li>
                <li
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleDeleteClick}
                >
                    Hapus
                </li>
            </ul>
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
                &#x22EE; {/* This is the vertical ellipsis character */}
            </button>

            {/* Render dropdown using createPortal if open and dropdown-root exists */}
            {isOpen && document.getElementById('dropdown-root') && createPortal(dropdown, document.getElementById('dropdown-root')!)}
        </>
    );
};

export default ActionMenuTransactionLead;
