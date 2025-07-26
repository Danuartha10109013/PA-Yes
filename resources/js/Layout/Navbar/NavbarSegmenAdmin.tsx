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
        router.visit('/admin/SegmentasiPasar?show=arsip');
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
