// // components/PageWithControls.tsx
// import React from 'react';
// import 'tailwindcss/tailwind.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import Breadcrumb from '@/components/Breadcrumb/bredcrumb';
// import Dropdown from '@/components/Dropdown/dropdown';

// const PageWithControls: React.FC = () => {
//     const breadcrumbItems = [
//         { name: 'Home', href: '#' },
//         { name: 'Library', href: '#' },
//         { name: 'Data' },
//     ];

//     return (
//         <div className="bg-white min-h-screen relative">
//             {/* Breadcrumb top left */}
//             <div className="absolute top-4 left-4">
//                 <Breadcrumb items={breadcrumbItems} />
//             </div>

//             {/* Search and controls top right */}
//             <div className="flex items-center space-x-4 p-4 absolute top-4 right-4">
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     className="w-64 h-12 rounded-full border border-transparent bg-white px-6 text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
//                 />
//                 <button
//                     aria-label="Search"
//                     className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center shadow-lg"
//                 >
//                     <i className="fas fa-search text-white text-lg"></i>
//                 </button>

//                 <Dropdown buttonContent={<i className="fas fa-sort text-white text-lg"></i>}>
//                     <li>
//                         <button type="button" className="block w-full text-left px-4 py-2 hover:bg-blue-100">
//                             Sort by A-Z
//                         </button>
//                     </li>
//                     <li>
//                         <button type="button" className="block w-full text-left px-4 py-2 hover:bg-blue-100">
//                             Sort by Time
//                         </button>
//                     </li>
//                 </Dropdown>

//                 <button
//                     aria-label="Archive"
//                     className="w-12 h-12 bg-blue-400 flex items-center justify-center shadow-lg"
//                 >
//                     <i className="fas fa-archive text-white text-lg"></i>
//                 </button>

//                 <Dropdown buttonContent={<i className="fas fa-print text-white text-lg"></i>}>
//                     <li>
//                         <button type="button" className="block w-full text-left px-4 py-2 hover:bg-blue-100">
//                             PDF
//                         </button>
//                     </li>
//                     <li>
//                         <button type="button" className="block w-full text-left px-4 py-2 hover:bg-blue-100">
//                             Excel
//                         </button>
//                     </li>
//                 </Dropdown>
//             </div>
//         </div>
//     );
// };

// export default PageWithControls;


// components/PageWithControls.tsx
// components/ReportControls/ReportControls.tsx
// components/ReportControls/ReportControls.tsx
// import React from 'react';
// import 'tailwindcss/tailwind.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import Dropdown from '../../components/Dropdown/dropdown'; // Adjust path if your Dropdown component is elsewhere

// interface ReportControlsProps {
//     searchQuery: string;
//     onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//     onPrintPdf: () => void;
//     onPrintExcel: () => void;
//     // You can add more props for sorting or other controls if needed
// }

// const ReportControls: React.FC<ReportControlsProps> = ({
//     searchQuery,
//     onSearchChange,
//     onPrintPdf,
//     onPrintExcel,
// }) => {
//     return (
//         <div className="flex items-center space-x-4">
//             {/* Search input field */}
//             <div className="relative">
//                 <input
//                     type="text"
//                     placeholder="Cari laporan..."
//                     value={searchQuery}
//                     onChange={onSearchChange}
//                     className="w-64 h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 />
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <i className="fas fa-search text-gray-400"></i>
//                 </div>
//             </div>

//             {/* Print Dropdown */}
//             <Dropdown buttonContent={
//                 <button
//                     aria-label="Print"
//                     className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center shadow-lg"
//                 >
//                     <i className="fas fa-print text-white text-lg"></i>
//                 </button>
//             }>
//                 <li>
//                     <button type="button" onClick={onPrintPdf} className="block w-full text-left px-4 py-2 hover:bg-blue-100">
//                         PDF
//                     </button>
//                 </li>
//                 <li>
//                     <button type="button" onClick={onPrintExcel} className="block w-full text-left px-4 py-2 hover:bg-blue-100">
//                         Excel
//                     </button>
//                 </li>
//             </Dropdown>

//             {/* Archive button (placeholder for functionality) */}
//             <button
//                 aria-label="Archive"
//                 className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center shadow-lg"
//                 title="Archive (functionality not implemented)"
//             >
//                 <i className="fas fa-archive text-white text-lg"></i>
//             </button>
//         </div>
//     );
// };

// export default ReportControls;


import React from 'react';
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Dropdown from '../../components/Dropdown/dropdown';
import { router } from "@inertiajs/react";

interface ReportControlsProps {
    searchQuery: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPrintPdf: () => void;
    onPrintExcel: () => void;
}

const ReportControls: React.FC<ReportControlsProps> = ({
    searchQuery,
    onSearchChange,
    onPrintPdf,
    onPrintExcel,
}) => {
    const handleArchiveClick = () => {
        router.visit('/reports-arsip');
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Cari laporan..."
                    value={searchQuery}
                    onChange={onSearchChange}
                    className="w-64 h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                </div>
            </div>

            <Dropdown
                buttonContent={
                    <button
                        aria-label="Print"
                        className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center shadow-lg"
                    >
                        <i className="fas fa-print text-white text-lg"></i>
                    </button>
                }
            >
                <li>
                    <button
                        type="button"
                        onClick={onPrintPdf}
                        className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                    >
                        PDF
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        onClick={onPrintExcel}
                        className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                    >
                        Excel
                    </button>
                </li>
            </Dropdown>

            <button
                aria-label="Archive"
                className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center shadow-lg"
                title="Archive"
                onClick={handleArchiveClick}
            >
                <i className="fas fa-archive text-white text-lg"></i>
            </button>
        </div>
    );
};

export default ReportControls;
