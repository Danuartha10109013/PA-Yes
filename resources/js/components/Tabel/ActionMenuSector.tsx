// ActionMenuSector.tsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sector as SectorType } from '@/components/Types/types'; // Import SectorType

interface ActionMenuSectorProps {
    sector: SectorType; // Now takes a SectorType object
    onEdit: (sector: SectorType) => void; // Pass the sector to the handler
    onDelete: (sector: SectorType) => void; // Pass the sector to the handler
    onDetail: (sector: SectorType) => void; // Pass the sector to the handler
}

const ActionMenuSector: React.FC<ActionMenuSectorProps> = ({ sector, onEdit, onDelete, onDetail }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

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

    const toggleMenu = () => {
        setIsOpen((prev) => {
            const newState = !prev;
            if (newState && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + window.scrollY + 5, // 5px offset below button
                    left: rect.left + window.scrollX - 120 + rect.width, // Adjust left for menu width (W-28 = 112px, so 120 is fine)
                });
            }
            return newState;
        });
    };

    const handleEditClick = () => {
        setIsOpen(false); // Close the dropdown menu
        onEdit(sector); // Call the onEdit handler from props, passing the sector
    };

    const handleDeleteClick = () => {
        setIsOpen(false); // Close the dropdown menu
        onDelete(sector); // Call the onDelete handler from props, passing the sector
    };

    const handleDetailClick = () => {
        setIsOpen(false); // Close the dropdown menu
        onDetail(sector); // Call the onDetail handler from props, passing the sector
    };

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
                <li
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleDetailClick}
                >
                    Detail
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
                &#x22EE;
            </button>

            {/* Render dropdown using createPortal if open and dropdown-root exists */}
            {isOpen && document.getElementById('dropdown-root') && createPortal(dropdown, document.getElementById('dropdown-root')!)}
        </>
    );
};

export default ActionMenuSector;
