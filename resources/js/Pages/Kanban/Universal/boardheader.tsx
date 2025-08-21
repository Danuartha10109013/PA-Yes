import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AddLeadModal from '@/Pages/Kanban/Universal/addlead';
import { LeadDatas } from '@/components/Leads/types';

interface BoardHeaderProps {
    onSave: (newLead: LeadDatas) => void;
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ onSave, searchTerm, onSearchChange }) => {
    const { url } = usePage(); // Ambil URL dari Inertia
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    // Aktif state untuk 4 tab saja
    const isListActive = url.startsWith('/list/leads') && !url.includes('filter=');
    const isBoardActive = url.startsWith('/kanban/leads');
    const isDealingActive = url.includes('filter=dealing');
    const isJunkActive = url.includes('filter=junk');
    const isActive = (path: string) => url.startsWith(path);
    const navigateToView = (path: string) => router.visit(path);

    const getButtonClasses = (active: boolean) => {
        const baseClasses = 'flex items-center space-x-1 hover:text-gray-900';
        const activeClasses = 'text-blue-700 font-semibold';
        return `${baseClasses} ${active ? activeClasses : 'text-gray-600'}`;
    };

    const handleOpenAddLeadModal = () => setIsAddLeadModalOpen(true);
    const handleCloseAddLeadModal = () => setIsAddLeadModalOpen(false);
    const handleSaveLeadFromModal = (newLead: LeadDatas) => {
        onSave(newLead);
        handleCloseAddLeadModal();
    };

    const toggleSearchBar = () => {
        setIsSearchOpen(prev => !prev);
        if (isSearchOpen) {
            onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <div className="p-3 max-w-full overflow-x-auto">
            {/* View Tabs (Consistent: List, Board, Dealing, Junk) */}
            <div className="flex items-center space-x-3 text-sm select-none">
                <button
                    className={getButtonClasses(isListActive)}
                    onClick={() => navigateToView('/list/leads')}
                >
                    <i className="fas fa-list-alt"></i>
                    <span>List</span>
                </button>
                <button
                    className={getButtonClasses(isBoardActive)}
                    onClick={() => navigateToView('/kanban/leads')}
                >
                    <i className="fas fa-columns"></i>
                    <span>Board</span>
                </button>
                <button
                    className={getButtonClasses(isDealingActive)}
                    onClick={() => navigateToView('/list/leads?show=arsip&filter=dealing')}
                >
                    <i className="fas fa-handshake"></i>
                    <span>Dealing</span>
                </button>
                <button
                    className={getButtonClasses(isJunkActive)}
                    onClick={() => navigateToView('/list/leads?show=arsip&filter=junk')}
                >
                    <i className="fas fa-trash-alt"></i>
                    <span>Junk</span>
                </button>

                {/* Add Lead */}
                <span
                    className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={handleOpenAddLeadModal}
                >
                    + Add New Lead
                </span>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                <div className="flex items-center space-x-2 ml-auto">
                    {/* Search Input */}
                    <div className={`relative transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? 'w-48' : 'w-0'}`}>
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={onSearchChange}
                            className={`pl-8 pr-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${isSearchOpen ? 'block w-full' : 'hidden'}`}
                        />
                        {isSearchOpen && (
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        )}
                    </div>

                    <button className="flex items-center space-x-1 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-1 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
                        <span>Sort</span>
                    </button>

                    {/* Search Toggle Button */}
                    <button
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
                        onClick={toggleSearchBar}
                        aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                    >
                        {isSearchOpen ? '✕' : '🔍'}
                    </button>
                </div>
            </div>

            {/* AddLeadModal */}
            {isAddLeadModalOpen && (
                <AddLeadModal
                    isOpen={isAddLeadModalOpen}
                    onClose={handleCloseAddLeadModal}
                    onSave={handleSaveLeadFromModal}
                    initialColumnId="default-column-id"
                />
            )}
        </div>
    );
};

export default BoardHeader;
