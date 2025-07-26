// import React, { useState } from 'react';
// import { router, usePage } from "@inertiajs/react";
// import AddLeadModal from '@/Pages/Kanban/Universal/addlead';
// import { LeadDatas } from '@/components/Leads/types';

// // Define the type for the possible view modes, mapping to your route names
// type ViewRoute = 'kanban.leads' | 'arsip.leads' | 'list.leads';

// interface BoardHeaderProps {
//     onSave: (newLead: LeadDatas) => void; // Prop for handling new lead addition
//     searchTerm: string; // Prop for the current search term
//     onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Prop for handling search input changes
// }

// const BoardHeader: React.FC<BoardHeaderProps> = ({ onSave, searchTerm, onSearchChange }) => {
//     const { url } = usePage(); // Get current URL from Inertia
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false); // State for modal visibility
//     // NEW STATE: State untuk mengontrol apakah search bar terbuka
//     const [isSearchOpen, setIsSearchOpen] = useState(false);

//     // Helper to determine if a button is active based on the current URL
//     const isActive = (routeSegment: string) => url.includes(routeSegment);

//     // Helper to get dynamic button classes
//     const getButtonClasses = (routeSegment: string) => {
//         const baseClasses = "flex items-center space-x-1 hover:text-gray-900";
//         const activeClasses = "text-blue-700 font-semibold";
//         return `${baseClasses} ${isActive(routeSegment) ? activeClasses : 'text-gray-600'}`;
//     };

//     // Function to handle navigation
//     const navigateToView = (routeName: ViewRoute) => {
//         router.visit(route(routeName));
//     };

//     // Handler for Add Lead Modal
//     const handleOpenAddLeadModal = () => {
//         console.log("Opening modal...");
//         setIsAddLeadModalOpen(true);
//     };

//     const handleCloseAddLeadModal = () => {
//         console.log("Closing modal...");
//         setIsAddLeadModalOpen(false);
//     };

//     const handleSaveLeadFromModal = (newLead: LeadDatas) => {
//         // Call the prop function to update the parent component's state
//         onSave(newLead);
//         // Ensure the modal closes after successful save
//         handleCloseAddLeadModal();
//     };

//     // NEW FUNCTION: Toggle search bar visibility
//     const toggleSearchBar = () => {
//         setIsSearchOpen(prev => !prev);
//         // Opsional: Jika search bar ditutup, kosongkan searchTerm
//         if (isSearchOpen) {
//             onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
//         }
//     };

//     return (
//         <div className="p-3 max-w-full overflow-x-auto">
//             {/* View Toggles */}
//             <div className="flex items-center space-x-3 text-sm select-none">
//                 <button
//                     className={getButtonClasses('list-leads')}
//                     onClick={() => navigateToView('list.leads')}
//                 >
//                     <i className="fas fa-list-alt"></i>
//                     <span>List</span>
//                 </button>
//                 <button
//                     className={getButtonClasses('kanban-leads')}
//                     onClick={() => navigateToView('kanban.leads')}
//                 >
//                     <i className="fas fa-columns"></i>
//                     <span>Board</span>
//                 </button>
//                 <button
//                     className={getButtonClasses('arsip-leads')}
//                     onClick={() => navigateToView('arsip.leads')}
//                 >
//                     <i className="fas fa-archive"></i>
//                     <span>Archive</span>
//                 </button>
//                 {/* "Add New Lead" button */}
//                 <span
//                     className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
//                     onClick={handleOpenAddLeadModal}
//                 >
//                     + Add New Lead
//                 </span>
//             </div>

//             {/* Filters and Actions */}
//             <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
//                 <div className="flex items-center space-x-2 ml-auto">
//                     {/* Search Input Container */}
//                     <div className={`relative transition-all duration-300 ease-in-out overflow-hidden
//                                       ${isSearchOpen ? 'w-48' : 'w-0'} `}>
//                         <input
//                             type="text"
//                             placeholder="Search leads..."
//                             value={searchTerm}
//                             onChange={onSearchChange}
//                             // Class `block` added to ensure input takes up space when open
//                             className={`pl-8 pr-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500
//                                         ${isSearchOpen ? 'block w-full' : 'hidden'}`}
//                         />
//                         {/* Search icon inside the input for better UX */}
//                         {isSearchOpen && (
//                             <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//                         )}
//                     </div>

//                     <button className="flex items-center space-x-1 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
//                         <span>Filter</span>
//                     </button>
//                     <button className="flex items-center space-x-1 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
//                         <span>Sort</span>
//                     </button>
//                     {/* Toggle button for search bar */}
//                     <button
//                         className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
//                         onClick={toggleSearchBar}
//                         aria-label={isSearchOpen ? "Close search" : "Open search"}
//                     >
//                         {isSearchOpen ? '✕' : '🔍'}
//                     </button>
//                 </div>
//             </div>

//             {/* AddLeadModal */}
//             {isAddLeadModalOpen && (
//                 <AddLeadModal
//                     isOpen={isAddLeadModalOpen}
//                     onClose={handleCloseAddLeadModal}
//                     onSave={handleSaveLeadFromModal}
//                     initialColumnId="default-column-id" // You might want to pass a real default column ID here
//                 />
//             )}
//         </div>
//     );
// };

// export default BoardHeader;


// import React, { useState } from 'react';
// import { router, usePage } from '@inertiajs/react';
// import AddLeadModal from '@/Pages/Kanban/Universal/addlead';
// import { LeadDatas } from '@/components/Leads/types';

// interface BoardHeaderProps {
//     onSave: (newLead: LeadDatas) => void;
//     searchTerm: string;
//     onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const BoardHeader: React.FC<BoardHeaderProps> = ({ onSave, searchTerm, onSearchChange }) => {
//     const { url } = usePage(); // Ambil URL dari Inertia
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
//     const [isSearchOpen, setIsSearchOpen] = useState(false);

//     // Cek apakah route saat ini aktif berdasarkan path
//     const isActive = (path: string) => url.startsWith(path);

//     // Beri class active jika route cocok
//     const getButtonClasses = (path: string) => {
//         const baseClasses = 'flex items-center space-x-1 hover:text-gray-900';
//         const activeClasses = 'text-blue-700 font-semibold';
//         return `${baseClasses} ${isActive(path) ? activeClasses : 'text-gray-600'}`;
//     };

//     const navigateToView = (path: string) => {
//         router.visit(path);
//     };

//     const handleOpenAddLeadModal = () => {
//         setIsAddLeadModalOpen(true);
//     };

//     const handleCloseAddLeadModal = () => {
//         setIsAddLeadModalOpen(false);
//     };

//     const handleSaveLeadFromModal = (newLead: LeadDatas) => {
//         onSave(newLead);
//         handleCloseAddLeadModal();
//     };

//     const toggleSearchBar = () => {
//         setIsSearchOpen(prev => !prev);
//         if (isSearchOpen) {
//             onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
//         }
//     };

//     return (
//         <div className="p-3 max-w-full overflow-x-auto">
//             {/* View Toggles */}
//             <div className="flex items-center space-x-3 text-sm select-none">
//                 <button
//                     className={getButtonClasses('/list/leads')}
//                     onClick={() => navigateToView('/list/leads')}
//                 >
//                     <i className="fas fa-list-alt"></i>
//                     <span>List</span>
//                 </button>
//                 <button
//                     className={getButtonClasses('/kanban/leads')}
//                     onClick={() => navigateToView('/kanban/leads')}
//                 >
//                     <i className="fas fa-columns"></i>
//                     <span>Board</span>
//                 </button>
//                 <button
//                     className={url.includes('/leads/arsip?show=arsip') ? 'text-blue-700 font-semibold flex items-center space-x-1 hover:text-gray-900' : 'text-gray-600 flex items-center space-x-1 hover:text-gray-900'}
//                     onClick={() => navigateToView('/leads/arsip?show=arsip')}
//                 >
//                     <i className="fas fa-archive"></i>
//                     <span>Archive</span>
//                 </button>

//                 {/* Add Lead */}
//                 <span
//                     className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
//                     onClick={handleOpenAddLeadModal}
//                 >
//                     + Add New Lead
//                 </span>
//             </div>

//             {/* Filters and Actions */}
//             <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
//                 <div className="flex items-center space-x-2 ml-auto">
//                     {/* Search Input */}
//                     <div className={`relative transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? 'w-48' : 'w-0'}`}>
//                         <input
//                             type="text"
//                             placeholder="Search leads..."
//                             value={searchTerm}
//                             onChange={onSearchChange}
//                             className={`pl-8 pr-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${isSearchOpen ? 'block w-full' : 'hidden'}`}
//                         />
//                         {isSearchOpen && (
//                             <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//                         )}
//                     </div>

//                     {/* <button className="flex items-center space-x-1 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
//                         <span>Filter</span>
//                     </button>
//                     <button className="flex items-center space-x-1 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
//                         <span>Sort</span>
//                     </button> */}

//                     {/* Search Toggle Button */}
//                     <button
//                         className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
//                         onClick={toggleSearchBar}
//                         aria-label={isSearchOpen ? 'Close search' : 'Open search'}
//                     >
//                         {isSearchOpen ? '✕' : '🔍'}
//                     </button>
//                 </div>
//             </div>

//             {/* AddLeadModal */}
//             {isAddLeadModalOpen && (
//                 <AddLeadModal
//                     isOpen={isAddLeadModalOpen}
//                     onClose={handleCloseAddLeadModal}
//                     onSave={handleSaveLeadFromModal}
//                     initialColumnId="default-column-id"
//                 />
//             )}
//         </div>
//     );
// };

// export default BoardHeader;


// import React, { useState } from 'react';
// import { router, usePage } from '@inertiajs/react';
// import AddLeadModal from '@/Pages/Kanban/Universal/addlead';
// import { LeadDatas } from '@/components/Leads/types';

// interface BoardHeaderProps {
//     onSave: (newLead: LeadDatas) => void;
//     searchTerm: string;
//     onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const BoardHeader: React.FC<BoardHeaderProps> = ({ onSave, searchTerm, onSearchChange }) => {
//     const { url } = usePage(); // Ambil URL dari Inertia
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
//     const [isSearchOpen, setIsSearchOpen] = useState(false);

//     const isArchivePage = url.includes('/list/leads');

//     const isActive = (path: string) => url.startsWith(path);
//     const navigateToView = (path: string) => router.visit(path);

//     const getButtonClasses = (active: boolean) => {
//         const baseClasses = 'flex items-center space-x-1 hover:text-gray-900';
//         const activeClasses = 'text-blue-700 font-semibold';
//         return `${baseClasses} ${active ? activeClasses : 'text-gray-600'}`;
//     };

//     const handleOpenAddLeadModal = () => setIsAddLeadModalOpen(true);
//     const handleCloseAddLeadModal = () => setIsAddLeadModalOpen(false);
//     const handleSaveLeadFromModal = (newLead: LeadDatas) => {
//         onSave(newLead);
//         handleCloseAddLeadModal();
//     };

//     const toggleSearchBar = () => {
//         setIsSearchOpen(prev => !prev);
//         if (isSearchOpen) {
//             onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
//         }
//     };

//     return (
//         <div className="p-3 max-w-full overflow-x-auto">
//             {/* View Toggles */}
//             <div className="flex items-center space-x-3 text-sm select-none">
//                 {/* <button
//                     className={getButtonClasses(isActive('/list/leads'))}
//                     onClick={() => navigateToView('/list/leads')}
//                 > */}
//                 <button
//                     className={getButtonClasses(
//                         url.startsWith('/list/leads') && !url.includes('show=arsip')
//                     )}
//                     onClick={() => navigateToView('/list/leads')}
//                 >
//                     <i className="fas fa-list-alt"></i>
//                     <span>List</span>
//                 </button>
//                 <button
//                     className={getButtonClasses(isActive('/kanban/leads'))}
//                     onClick={() => navigateToView('/kanban/leads')}
//                 >
//                     <i className="fas fa-columns"></i>
//                     <span>Board</span>
//                 </button>
//                 {/* <button
//                     className={getButtonClasses(!url.includes('filter='))}
//                     onClick={() => navigateToView('/list/leads?show=arsip')}
//                 >
//                     <i className="fas fa-boxes"></i>
//                     <span>All</span>
//                 </button> */}
//                 <button
//                     // className={getButtonClasses(url.includes('filter=dealing'))}
//                     // onClick={() => navigateToView('/list/leads?show=arsip&filter=dealing')}
//                     className={getButtonClasses(isArchivePage && url.includes('filter=dealing'))}
//                     onClick={() => navigateToView('/list/leads?show=arsip&filter=dealing')}
//                 >
//                     <i className="fas fa-handshake"></i>
//                     <span>Dealing</span>
//                 </button>
//                 <button
//                     // className={getButtonClasses(url.includes('filter=junk'))}
//                     // onClick={() => navigateToView('/list/leads?show=arsip&filter=junk')}
//                     className={getButtonClasses(isArchivePage && url.includes('filter=junk'))}
//                     onClick={() => navigateToView('/list/leads?show=arsip&filter=junk')}
//                 >
//                     <i className="fas fa-trash-alt"></i>
//                     <span>Junk</span>
//                 </button>
//                 {/* <button
//                     className={getButtonClasses(url.includes('/leads/arsip'))}
//                     onClick={() => navigateToView('/leads/arsip?show=arsip')}
//                 >
//                     <i className="fas fa-archive"></i>
//                     <span>Archive</span>
//                 </button> */}

//                 {/* Filter buttons: Only show on archive page
//                 {isArchivePage && (
//                     <>
//                         <button
//                             className={getButtonClasses(!url.includes('filter='))}
//                             onClick={() => navigateToView('/leads/arsip?show=arsip')}
//                         >
//                             <i className="fas fa-boxes"></i>
//                             <span>All</span>
//                         </button>
//                         <button
//                             className={getButtonClasses(url.includes('filter=dealing'))}
//                             onClick={() => navigateToView('/leads/arsip?show=arsip&filter=dealing')}
//                         >
//                             <i className="fas fa-handshake"></i>
//                             <span>Dealing</span>
//                         </button>
//                         <button
//                             className={getButtonClasses(url.includes('filter=junk'))}
//                             onClick={() => navigateToView('/leads/arsip?show=arsip&filter=junk')}
//                         >
//                             <i className="fas fa-trash-alt"></i>
//                             <span>Junk</span>
//                         </button>
//                     </>
//                 )} */}

//                 {/* Add Lead */}
//                 <span
//                     className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
//                     onClick={handleOpenAddLeadModal}
//                 >
//                     + Add New Lead
//                 </span>
//             </div>

//             {/* Filters and Actions */}
//             <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
//                 <div className="flex items-center space-x-2 ml-auto">
//                     {/* Search Input */}
//                     <div className={`relative transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? 'w-48' : 'w-0'}`}>
//                         <input
//                             type="text"
//                             placeholder="Search leads..."
//                             value={searchTerm}
//                             onChange={onSearchChange}
//                             className={`pl-8 pr-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${isSearchOpen ? 'block w-full' : 'hidden'}`}
//                         />
//                         {isSearchOpen && (
//                             <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//                         )}
//                     </div>

//                     <button className="flex items-center space-x-1 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
//                         <span>Filter</span>
//                     </button>
//                     <button className="flex items-center space-x-1 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100">
//                         <span>Sort</span>
//                     </button>

//                     {/* Search Toggle Button */}
//                     <button
//                         className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
//                         onClick={toggleSearchBar}
//                         aria-label={isSearchOpen ? 'Close search' : 'Open search'}
//                     >
//                         {isSearchOpen ? '✕' : '🔍'}
//                     </button>
//                 </div>
//             </div>

//             {/* AddLeadModal */}
//             {isAddLeadModalOpen && (
//                 <AddLeadModal
//                     isOpen={isAddLeadModalOpen}
//                     onClose={handleCloseAddLeadModal}
//                     onSave={handleSaveLeadFromModal}
//                     initialColumnId="default-column-id"
//                 />
//             )}
//         </div>
//     );
// };

// export default BoardHeader;


import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AddLeadModal from '@/Pages/Kanban/Universal/addlead';
import { LeadDatas, ContactOption, ProductOption, ColumnOption } from '@/components/Leads/types';

interface BoardHeaderProps {
    onSave: (newLead: LeadDatas) => void;
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    contacts: ContactOption[];
    products: ProductOption[];
    columns: ColumnOption[];
    onAddColumn?: () => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({
    onSave,
    searchTerm,
    onSearchChange,
    contacts,
    products,
    columns,
    onAddColumn
}) => {
    const { url } = usePage();
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isArchivePage = url.includes('/list/leads');

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
            {/* View Switcher */}
            <div className="flex items-center space-x-3 text-sm select-none">
                <button
                    className={getButtonClasses(
                        url.startsWith('/list/leads') && !url.includes('show=arsip')
                    )}
                    onClick={() => navigateToView('/list/leads')}
                >
                    <i className="fas fa-list-alt"></i>
                    <span>List</span>
                </button>
                <button
                    className={getButtonClasses(isActive('/kanban/leads'))}
                    onClick={() => navigateToView('/kanban/leads')}
                >
                    <i className="fas fa-columns"></i>
                    <span>Board</span>
                </button>
                <button
                    className={getButtonClasses(isArchivePage && url.includes('filter=dealing'))}
                    onClick={() => navigateToView('/list/leads?show=arsip&filter=dealing')}
                >
                    <i className="fas fa-handshake"></i>
                    <span>Dealing</span>
                </button>
                <button
                    className={getButtonClasses(isArchivePage && url.includes('filter=junk'))}
                    onClick={() => navigateToView('/list/leads?show=arsip&filter=junk')}
                >
                    <i className="fas fa-trash-alt"></i>
                    <span>Junk</span>
                </button>

                {/* Add New Lead Button */}
                <span
                    className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={handleOpenAddLeadModal}
                >
                    + Add New Lead
                </span>

                {/* Add New Column Button */}
                {onAddColumn && (
                    <span
                        className="font-semibold text-gray-700 cursor-pointer hover:text-green-600 transition-colors"
                        onClick={onAddColumn}
                    >
                        + Add Column
                    </span>
                )}
            </div>

            {/* Filters, Search */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                <div className="flex items-center space-x-2 ml-auto">
                    {/* Search Field */}
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

                    {/* Search Toggle */}
                    <button
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
                        onClick={toggleSearchBar}
                        aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                    >
                        {isSearchOpen ? '✕' : '🔍'}
                    </button>
                </div>
            </div>

            {/* Add Lead Modal */}
            {isAddLeadModalOpen && (
                <AddLeadModal
                    isOpen={isAddLeadModalOpen}
                    onClose={handleCloseAddLeadModal}
                    onSave={handleSaveLeadFromModal}
                    contacts={contacts}
                    products={products}
                    columns={columns}
                />
            )}
        </div>
    );
};

export default BoardHeader;
