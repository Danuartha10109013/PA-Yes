import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MySidebar from '../../../Layout/SidebarAdmin'; // Assuming this path is correct
import ReportControls from '../../../Layout/Navbar/NavbarReport'; // Adjust path based on your project structure

// Define the interfaces for your data
interface Transaction {
    id: string; // Assuming UUIDs for IDs
    trx: string;
    column_id: string | null;
    product_id: string | null;
    contact_id: string | null;
    current_price: string; // Or number
    qty: number;
    grand_total: string; // Or number
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    column_name: string | null; // From TransactionResource when column is loaded
    contact_name: string | null; // From TransactionResource when contact is loaded
    product_name: string | null; // From TransactionResource when product is loaded
}

interface Report {
    id: string; // Assuming UUIDs for IDs
    transaction_id: string;
    trx: string; // Direct property
    contact_name: string | null; // Direct property
    company_name: string | null; // Direct property
    product_name: string | null; // Direct property
    qty: number;
    total: string;
    status: string | null; // From the Report model
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    transaction: Transaction; // Nested object
}

// ReportTableRow component to render each row
// interface ReportTableRowProps {
//     report: Report;
// }

// const ReportTableRow: React.FC<ReportTableRowProps> = ({ report }) => {
//     const status = report.status || 'Unknown'; // Fallback if status is null
//     const statusColorClass = status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

//     type Props = {
//   report: Report;
// };

type Props = {
    report: Report;
};

const ReportTableRow = ({ report }: Props) => {
    // Helper function to render value or "-"
    const displayValue = (value: any) => {
        return value !== null && value !== undefined && value !== '' ? value : '-';
    };

    //     return (
    //         <tr className="bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors duration-200 ease-in-out">
    //             <td className="py-3 px-6 rounded-l-xl">
    //                 <div className="flex items-center">
    //                     <div className="ml-0">
    //                         <p className="text-sm font-semibold text-[#344767]">{report.trx}</p>
    //                     </div>
    //                 </div>
    //             </td>
    //             <td className="py-3 px-4">
    //                 <p className="text-sm font-semibold">{report.contact_name}</p>
    //             </td>
    //             <td className="py-3 px-4">
    //                 <p className="text-sm font-semibold">{report.company_name}</p>
    //             </td>
    //             <td className="py-3 px-4">
    //                 <p className="text-sm font-semibold">{report.product_name}</p>
    //             </td>
    //             <td className="py-3 px-4">
    //                 <p className="text-sm font-semibold">{report.qty}</p>
    //             </td>
    //             <td className="py-3 px-4">
    //                 <p className="text-sm font-semibold">Rp{parseFloat(report.total).toLocaleString('id-ID')}</p>
    //             </td>
    //             <td className="py-3 px-4">
    //                 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColorClass}`}>
    //                     {report.status || 'N/A'}
    //                 </span>
    //             </td>
    //             <td className="py-3 px-4">
    //                 <p className="text-sm text-gray-700">{new Date(report.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
    //             </td>
    //             <td className="py-3 px-6 rounded-r-xl">
    //                 <p className="text-sm text-gray-700">{new Date(report.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
    //             </td>
    //         </tr>
    //     );
    // };
    return (
        <tr className="bg-white hover:bg-gray-50 transition-colors">
            <td className="pl-6 py-2">{displayValue(report.trx)}</td>
            <td className="py-2">{displayValue(report.contact_name)}</td>
            <td className="py-2">{displayValue(report.company_name)}</td>
            <td className="py-2">{displayValue(report.product_name)}</td>
            <td className="py-2">{displayValue(report.qty)}</td>
            <td className="py-2">Rp. {displayValue(report.total)}</td>
            <td className="py-2">{displayValue(report.status)}</td>
            <td className="py-2">{new Date(report.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
            <td className="py-2 pr-6">{new Date(report.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
        </tr>
    );
};

const ReportsList: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const [sortColumn, setSortColumn] = useState<keyof Report | null>(null); // State for sorted column
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // State for sort direction

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState<number>(1);
    const reportsPerPage = 10;

    // Filtered reports based on search query
    const filteredReports = reports.filter(report =>
        report.trx.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.contact_name && report.contact_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (report.company_name && report.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (report.product_name && report.product_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (report.status && report.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sorted and filtered reports
    const sortedFilteredReports = [...filteredReports].sort((a, b) => {
        if (!sortColumn) return 0;

        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // Handle null or undefined values: place nulls/undefineds at the end
        if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

        // Special handling for 'total' (string representing a number)
        if (sortColumn === 'total') {
            const numA = parseFloat(String(aValue));
            const numB = parseFloat(String(bValue));
            if (sortDirection === 'asc') {
                return numA - numB;
            } else {
                return numB - numA;
            }
        }
        // Special handling for 'qty' (number)
        if (sortColumn === 'qty') {
            const numA = aValue as number;
            const numB = bValue as number;
            if (sortDirection === 'asc') {
                return numA - numB;
            } else {
                return numB - numA;
            }
        }
        // Special handling for dates ('created_at', 'updated_at')
        if (sortColumn === 'created_at' || sortColumn === 'updated_at') {
            const dateA = new Date(String(aValue)).getTime();
            const dateB = new Date(String(bValue)).getTime();
            if (sortDirection === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        }

        // Generic string comparison for other string fields
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        // Fallback for other comparable types (though mostly covered above)
        if (aValue < bValue) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = sortedFilteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(sortedFilteredReports.length / reportsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    // --- End Pagination State ---

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // In a real application, consider adding authentication headers
                const response = await fetch('/admin/report'); // Use the API route you defined

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // API Resource returns data in a 'data' wrapper for collections
                const { data } = await response.json();
                setReports(data); // Directly set the data, no manual mapping needed
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    // Corrected handleSort function
    const handleSort = (column: keyof Report) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc'); // Default to ascending when sorting a new column
        }
        setCurrentPage(1); // Reset to first page on sort
    };

    // Helper to render sort icon
    const renderSortIcon = (column: keyof Report) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? <i className="fas fa-arrow-up ml-2 text-blue-500"></i> : <i className="fas fa-arrow-down ml-2 text-blue-500"></i>;
        }
        return null;
    };

    // --- Print Handlers ---
    const handlePrintPdf = () => {
        console.log('Printing reports to PDF...');
        // Directly open the backend PDF export URL
        window.open('/reports/export-pdf', '_blank');
    };

    const handlePrintExcel = () => {
        console.log('Printing reports to Excel...');
        // Directly open the backend Excel export URL
        window.open('/reports/export-excel', '_blank');
    };
    // --- End Print Handlers ---

    return (
        <>
            <Head title="Laporan Transaksi - Tappp" />
            <div className="flex min-h-screen">
                <MySidebar />

                <main className="flex-1 p-6">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[#344767] font-semibold text-lg">
                            Daftar Laporan Transaksi
                        </h2>
                        {/* Use the reusable ReportControls component */}
                        <ReportControls
                            searchQuery={searchQuery}
                            onSearchChange={handleSearchChange}
                            onPrintPdf={handlePrintPdf}
                            onPrintExcel={handlePrintExcel}
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {loading ? (
                            <p className="p-4 text-center text-gray-600">Memuat data laporan...</p>
                        ) : error ? (
                            <p className="p-4 text-center text-red-500">Error: {error}</p>
                        ) : sortedFilteredReports.length === 0 ? ( // Check sortedFilteredReports length
                            <p className="p-4 text-center text-gray-500">Belum ada data laporan yang ditemukan untuk pencarian ini.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-xs font-semibold text-[#98A2B3]">
                                            {/* Explicitly cast string literals to keyof Report for onClick */}
                                            <th className="text-left pl-6 py-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('trx' as keyof Report)}>
                                                TRX TRANSAKSI {renderSortIcon('trx')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('contact_name' as keyof Report)}>
                                                NAMA CUSTOMER {renderSortIcon('contact_name')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('company_name' as keyof Report)}>
                                                PERUSAHAAN {renderSortIcon('company_name')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('product_name' as keyof Report)}>
                                                PRODUK {renderSortIcon('product_name')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('qty' as keyof Report)}>
                                                KUANTITAS {renderSortIcon('qty')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('total' as keyof Report)}>
                                                TOTAL {renderSortIcon('total')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('status' as keyof Report)}>
                                                STATUS {renderSortIcon('status')}
                                            </th>
                                            <th className="text-left py-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('created_at' as keyof Report)}>
                                                CREATED AT {renderSortIcon('created_at')}
                                            </th>
                                            <th className="text-left py-2 pr-6 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('updated_at' as keyof Report)}>
                                                UPDATE AT {renderSortIcon('updated_at')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-[#344767]">
                                        {currentReports.map((report) => (
                                            <ReportTableRow key={report.id} report={report} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {sortedFilteredReports.length > reportsPerPage && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sebelumnya
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-4 py-2 rounded-lg shadow-md transition-colors ${currentPage === index + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Berikutnya
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    </>
    );
};

export default ReportsList;
