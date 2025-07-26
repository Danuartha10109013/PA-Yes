import React, { useState, useEffect } from 'react';
import MySidebar from '../../Layout/Sidebar';
import SectorSalesChart from '@/components/dashboard/RevenueChart'; // Import the new chart component
import ReportControls from '../../Layout/Navbar/NavbarSegmen'; // Import the ReportControls component

// Define the interface for the SegmentasiPasar data
interface SegmentasiPasar {
    id: string;
    sector_id: string;
    sector_name: string;
    jumlah_item: number;
    total_penjualan: number;
    total_transaksi: number;
    kriteria_jumlah_item: string;
    kriteria_total_penjualan: string;
    kriteria_total_transaksi: string;
    status: string;
    month: number;
    year: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

// SegmentasiPasarTableRow component (unchanged)
interface SegmentasiPasarTableRowProps {
    segmentasiPasar: SegmentasiPasar;
}

const SegmentasiPasarTableRow: React.FC<SegmentasiPasarTableRowProps> = ({ segmentasiPasar }) => {
    const statusColorClass = segmentasiPasar.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';





    return (
        <tr className="bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors duration-200 ease-in-out">
            <td className="py-3 px-6 rounded-l-xl">
                <div className="flex items-center">
                    <div className="ml-0">
                        <p className="text-sm font-semibold text-[#344767]">{segmentasiPasar.sector_name || 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">
                <p className="text-sm font-semibold">{segmentasiPasar.jumlah_item}</p>
            </td>
            <td className="py-3 px-4">
                <p className="text-sm font-semibold">Rp{segmentasiPasar.total_penjualan.toLocaleString('id-ID')}</p>
            </td>
            <td className="py-3 px-4">
                <p className="text-sm font-semibold">{segmentasiPasar.total_transaksi.toLocaleString('id-ID')}</p>
            </td>
            <td className="py-3 px-4">
                <p className="text-sm font-semibold">{segmentasiPasar.kriteria_jumlah_item}</p>
            </td>
            <td className="py-3 px-4">
                <p className="text-sm font-semibold">{segmentasiPasar.kriteria_total_penjualan}</p>
            </td>
            <td className="py-3 px-4">
                <p className="text-sm font-semibold">{segmentasiPasar.kriteria_total_transaksi}</p>
            </td>
            <td className="py-3 px-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColorClass}`}>
                    {segmentasiPasar.status}
                </span>
            </td>
            <td className="py-3 px-4">
                <p className="text-sm text-gray-700">{new Date(segmentasiPasar.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </td>
            <td className="py-3 px-6 rounded-r-xl">
                <p className="text-sm text-gray-700">{new Date(segmentasiPasar.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </td>
        </tr>
    );
};

const SegmentasiPasarList: React.FC = () => {
    const [segmentasiPasar, setSegmentasiPasar] = useState<SegmentasiPasar[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const [sortColumn, setSortColumn] = useState<keyof SegmentasiPasar | null>(null); // State for sorted column
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // State for sort direction
    const [averages, setAverages] = useState<{
        avg_jumlah_item: number;
        avg_total_penjualan: number;
        avg_total_transaksi: number;
    } | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Filtered segmentasi pasar data based on search query
    const filteredSegmentasiPasar = segmentasiPasar.filter(item =>
        item.sector_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kriteria_jumlah_item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kriteria_total_penjualan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kriteria_total_transaksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorted and filtered segmentasi pasar data
    const sortedFilteredSegmentasiPasar = [...filteredSegmentasiPasar].sort((a, b) => {
        if (!sortColumn) return 0;

        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // Handle null or undefined values: place nulls/undefineds at the end
        if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

        // Special handling for numeric fields (jumlah_item, total_penjualan, total_transaksi)
        if (sortColumn === 'jumlah_item' || sortColumn === 'total_penjualan' || sortColumn === 'total_transaksi') {
            const numA = parseFloat(String(aValue));
            const numB = parseFloat(String(bValue));
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

        // Fallback for other comparable types
        if (aValue < bValue) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedFilteredSegmentasiPasar.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedFilteredSegmentasiPasar.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    // Auto-refresh data setiap 30 detik
    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, 30000); // 30 detik

        return () => clearInterval(interval);
    }, []);

    // Listen untuk perubahan di halaman lain (Manage Leads, Kanban, dll)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'segmentasi_needs_refresh' && e.newValue === 'true') {
                // Refresh data ketika ada perubahan di halaman lain
                refreshData();
                // Reset flag
                localStorage.removeItem('segmentasi_needs_refresh');
            }
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Refresh data ketika user kembali ke tab ini
                refreshData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const fetchSegmentasiPasar = async () => {
        try {
            const response = await fetch('/segmentasi?show=arsip');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const { data } = await response.json();
            setSegmentasiPasar(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred while fetching segmentasi pasar data');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchAverages = async () => {
        try {
            const response = await fetch('/segmentasi/averages');

            if (!response.ok) {
                throw new Error(`Failed to fetch averages: ${response.status}`);
            }

            const data = await response.json();
            setAverages(data);
        } catch (err) {
            console.error('Failed to load averages', err);
        }
    };

    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            await fetchSegmentasiPasar();
            await fetchAverages();
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSegmentasiPasar();
        fetchAverages();
    }, []);

    // Prepare data for the line chart
    const chartData = segmentasiPasar
        .filter(item => item.updated_at !== null && item.updated_at !== undefined && !isNaN(parseFloat(item.total_penjualan))) // Filter out items with missing date or invalid sales
        .map(item => ({
            sector: item.sector_name || 'Unknown Sector', // Provide a fallback name
            date: new Date(item.updated_at), // Convert to Date object
            totalSales: parseFloat(item.total_penjualan),
        }))
        .filter(item => !isNaN(item.date.getTime())); // Filter out any items where Date conversion resulted in "Invalid Date"

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleSort = (column: keyof SegmentasiPasar) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc'); // Default to ascending when sorting a new column
        }
        setCurrentPage(1); // Reset to first page on sort
    };

    // Helper to render sort icon
    const renderSortIcon = (column: keyof SegmentasiPasar) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? <i className="fas fa-arrow-up ml-2 text-blue-500"></i> : <i className="fas fa-arrow-down ml-2 text-blue-500"></i>;
        }
        return null;
    };

    const handlePrintPdf = () => {
        console.log('Printing segmentasi pasar to PDF...');
        // Example: If you have a backend endpoint for PDF export
        window.open('/segmentasi/export-pdf', '_blank');
    };

    const handlePrintExcel = () => {
        console.log('Printing segmentasi pasar to Excel...');
        // Example: If you have a backend endpoint for Excel export
        window.open('/segmentasi/export-excel', '_blank');
    };

    return (
        <div className="flex min-h-screen">
            <MySidebar />

            <main className="flex-1 p-6">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <h2 className="text-[#344767] font-semibold text-2xl">
                                Daftar Segmentasi Pasar
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                    Terakhir diperbarui: {lastUpdate.toLocaleTimeString('id-ID')}
                                </span>
                                {isRefreshing && (
                                    <span className="text-xs text-blue-500 flex items-center gap-1">
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Memperbarui...
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Manual Refresh Button */}
                            <button
                                onClick={refreshData}
                                disabled={isRefreshing}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                <i className={`fas ${isRefreshing ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i>
                                {isRefreshing ? 'Memperbarui...' : 'Refresh'}
                            </button>
                            <ReportControls
                                searchQuery={searchQuery}
                                onSearchChange={handleSearchChange}
                                onPrintPdf={handlePrintPdf}
                                onPrintExcel={handlePrintExcel}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
                        {loading ? (
                            <p className="p-6 text-center text-gray-600">Memuat data segmentasi pasar...</p>
                        ) : error ? (
                            <p className="p-6 text-center text-red-500">Error: {error}</p>
                        ) : sortedFilteredSegmentasiPasar.length === 0 ? (
                            <p className="p-6 text-center text-gray-500">Belum ada data segmentasi pasar yang ditemukan.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-xs font-semibold text-[#98A2B3] uppercase">
                                            <th className="text-left pl-6 py-3 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('sector_name')}>
                                                Nama Sektor {renderSortIcon('sector_name')}
                                            </th>
                                            <th className="text-left py-3 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('jumlah_item')}>
                                                Jumlah Item {renderSortIcon('jumlah_item')}
                                            </th>
                                            <th className="text-left py-3 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('total_penjualan')}>
                                                Total Penjualan {renderSortIcon('total_penjualan')}
                                            </th>
                                            <th className="text-left py-3 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('total_transaksi')}>
                                                Total Transaksi {renderSortIcon('total_transaksi')}
                                            </th>
                                            <th className="text-left py-3 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('kriteria_jumlah_item')}>
                                                K-Jumlah Item {renderSortIcon('kriteria_jumlah_item')}
                                            </th>
                                            <th className="text-left py-3 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('kriteria_total_penjualan')}>
                                                K-Total Penjualan {renderSortIcon('kriteria_total_penjualan')}
                                            </th>
                                            <th className="text-left py-3 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('kriteria_total_transaksi')}>
                                                K-Total Transaksi {renderSortIcon('kriteria_total_transaksi')}
                                            </th>
                                            <th className="text-left py-3 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('status')}>
                                                Status {renderSortIcon('status')}
                                            </th>
                                            <th className="text-left py-3 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('created_at')}>
                                                Dibuat Pada {renderSortIcon('created_at')}
                                            </th>
                                            <th className="text-left py-3 pr-6 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('updated_at')}>
                                                Diperbarui Pada {renderSortIcon('updated_at')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-[#344767]">
                                        {currentItems.map((item) => (
                                            <SegmentasiPasarTableRow key={item.id} segmentasiPasar={item} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    {/* {averages && (
                        <div className="mt-4 px-6 text-sm text-gray-700">
                            <h3 className="font-semibold text-gray-800 mb-2">Rata-rata Bulan Ini:</h3>
                            <ul className="list-disc list-inside">
                                <li><span className="font-medium">Jumlah Item:</span> {averages.avg_jumlah_item}</li>
                                <li><span className="font-medium">Total Penjualan:</span> Rp{averages.avg_total_penjualan.toLocaleString('id-ID')}</li>
                                <li><span className="font-medium">Total Transaksi:</span> {Math.round(averages.avg_total_transaksi)}</li>
                            </ul>
                        </div>
                    )} */}


                    {sortedFilteredSegmentasiPasar.length > itemsPerPage && (
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

                {/* Render the line chart component */}
                {/* <div className="mt-8">
                    {loading ? (
                        <p className="p-6 text-center text-gray-600">Memuat grafik...</p>
                    ) : error ? (
                        <p className="p-6 text-center text-red-500">Error memuat grafik: {error}</p>
                    ) : (
                        <SectorSalesChart data={chartData} />
                    )}
                </div> */}
            </main>
        </div>
    );
};

export default SegmentasiPasarList;
