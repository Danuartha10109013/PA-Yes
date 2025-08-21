import React, { useState, useEffect, useMemo } from 'react';
import { usePage, Head, router } from '@inertiajs/react';
import MySidebar from '../../Layout/Sidebar';
import ReportControls from '../../Layout/Navbar/NavbarSegmen';
import { Breadcrumbs } from '@/components/breadcrumbs';
import Swal from 'sweetalert2';

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

interface Props {
    segmentasi: SegmentasiPasar[];
    averages?: {
        avg_jumlah_item: number;
        avg_total_penjualan: number;
        avg_total_transaksi: number;
    };
    show?: 'aktif' | 'arsip';
}

const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
        case 'potensial tinggi':
            return 'bg-green-100 text-green-800';
        case 'potensial sedang':
            return 'bg-yellow-100 text-yellow-800';
        case 'potensial rendah':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-200 text-gray-600';
    }
};

const SegmentasiPasarTableRow: React.FC<{ segmentasiPasar: SegmentasiPasar }> = ({ segmentasiPasar }) => {
    const statusColorClass = getStatusColorClass(segmentasiPasar.status);

    const parseToNumber = (val: number | string | undefined | null) => {
        if (typeof val === 'number') return val;
        const num = parseFloat(val ?? '0');
        return isNaN(num) ? 0 : num;
    };

    return (
        <tr className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200">
            <td className="pl-6 py-4">
                <div className="font-semibold text-[#344767] text-sm">{segmentasiPasar.sector_name || 'N/A'}</div>
            </td>
            <td className="py-4">
                <div className="text-sm font-semibold">{segmentasiPasar.jumlah_item}</div>
            </td>
            <td className="py-4">
                <div className="text-sm font-semibold">Rp{parseToNumber(segmentasiPasar.total_penjualan).toLocaleString('id-ID')}</div>
            </td>
            <td className="py-4">
                <div className="text-sm font-semibold">{parseToNumber(segmentasiPasar.total_transaksi).toLocaleString('id-ID')}</div>
            </td>
            <td className="py-4">
                <div className="text-sm font-semibold">{segmentasiPasar.kriteria_jumlah_item}</div>
            </td>
            <td className="py-4">
                <div className="text-sm font-semibold">{segmentasiPasar.kriteria_total_penjualan}</div>
            </td>
            <td className="py-4">
                <div className="text-sm font-semibold">{segmentasiPasar.kriteria_total_transaksi}</div>
            </td>
            <td className="py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorClass}`}>
                    {segmentasiPasar.status}
                </span>
            </td>
            <td className="py-4">
                <div className="text-xs text-gray-500">{new Date(segmentasiPasar.created_at).toLocaleDateString('id-ID')}</div>
            </td>
            <td className="py-4 pr-6">
                <div className="text-sm font-semibold">{segmentasiPasar.month}</div>
            </td>
        </tr>
    );
};

const SegmentasiPasarList: React.FC<Props> = () => {
    const { props, url } = usePage();

    const segmentasiData = (props as any)?.segmentasi ?? [];
    const averagesData = (props as any)?.averages ?? null;
    const mode = (props as any)?.mode ?? 'current';

    const [segmentasiPasar, setSegmentasiPasar] = useState<SegmentasiPasar[]>(segmentasiData);
    const [averages, setAverages] = useState(averagesData);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof SegmentasiPasar | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);

    // Fallback averages computed from current data when backend averages are missing
    const computedAverages = useMemo(() => {
        if (!segmentasiPasar || segmentasiPasar.length === 0) {
            return {
                avg_jumlah_item: 0,
                avg_total_penjualan: 0,
                avg_total_transaksi: 0,
            };
        }
        const count = segmentasiPasar.length;
        const sumJumlahItem = segmentasiPasar.reduce((sum, item) => sum + (Number(item.jumlah_item) || 0), 0);
        const sumTotalPenjualan = segmentasiPasar.reduce((sum, item) => sum + (Number(item.total_penjualan) || 0), 0);
        const sumTotalTransaksi = segmentasiPasar.reduce((sum, item) => sum + (Number(item.total_transaksi) || 0), 0);
        return {
            avg_jumlah_item: sumJumlahItem / count,
            avg_total_penjualan: sumTotalPenjualan / count,
            avg_total_transaksi: sumTotalTransaksi / count,
        };
    }, [segmentasiPasar]);

    const effectiveAverages = useMemo(() => {
        const hasBackendAverages = averages && (
            typeof averages.avg_jumlah_item !== 'undefined' ||
            typeof averages.avg_total_penjualan !== 'undefined' ||
            typeof averages.avg_total_transaksi !== 'undefined'
        );
        return hasBackendAverages ? averages : computedAverages;
    }, [averages, computedAverages]);

    // Totals based on currently filtered data (to match visible list)
    // Note: defined after filteredData below; wrap in function and compute later
    const getTotals = (rows: SegmentasiPasar[]) => {
        const sumJumlahItem = rows.reduce((sum, item) => sum + (Number(item.jumlah_item) || 0), 0);
        const sumTotalPenjualan = rows.reduce((sum, item) => sum + (Number(item.total_penjualan) || 0), 0);
        const sumTotalTransaksi = rows.reduce((sum, item) => sum + (Number(item.total_transaksi) || 0), 0);
        return {
            jumlah_item: sumJumlahItem,
            total_penjualan: sumTotalPenjualan,
            total_transaksi: sumTotalTransaksi,
        };
    };

    // Averages helper based on a given set of rows (respects current filters)
    const getAveragesFromRows = (rows: SegmentasiPasar[]) => {
        const count = rows.length || 0;
        if (count === 0) {
            return {
                avg_jumlah_item: 0,
                avg_total_penjualan: 0,
                avg_total_transaksi: 0,
            };
        }
        const totals = getTotals(rows);
        return {
            avg_jumlah_item: totals.jumlah_item / count,
            avg_total_penjualan: totals.total_penjualan / count,
            avg_total_transaksi: totals.total_transaksi / count,
        };
    };

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

    // Update state ketika props berubah
    useEffect(() => {
        setSegmentasiPasar(segmentasiData);
        setAverages(averagesData);
        setLastUpdate(new Date());
    }, [segmentasiData, averagesData]);

    // Fungsi untuk refresh data
    const refreshData = () => {
        setIsRefreshing(true);
        router.reload({ 
            only: ['segmentasi', 'averages'],
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Data berhasil diperbarui!',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            },
            onFinish: () => {
                setIsRefreshing(false);
                setLastUpdate(new Date());
            }
        });
    };

    const itemsPerPage = 10;

    const safeLower = (val: string | null | undefined) => (val ?? '').toLowerCase();

    const filteredData = segmentasiPasar
        .filter((item) => {
            // Exclude rows if a column field exists and is JUNK or DEALING
            const anyItem = item as any;
            const rawColumn = anyItem?.column ?? anyItem?.column_name ?? anyItem?.columnName ?? anyItem?.status_column ?? '';
            const colUpper = String(rawColumn).trim().toUpperCase();
            if (colUpper === 'JUNK' || colUpper === 'DEALING') {
                return false;
            }
            return true;
        })
        .filter(item =>
            safeLower(item.sector_name).includes(searchQuery.toLowerCase()) ||
            safeLower(item.kriteria_jumlah_item).includes(searchQuery.toLowerCase()) ||
            safeLower(item.kriteria_total_penjualan).includes(searchQuery.toLowerCase()) ||
            safeLower(item.kriteria_total_transaksi).includes(searchQuery.toLowerCase()) ||
            safeLower(item.status).includes(searchQuery.toLowerCase())
        );

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

        if (['jumlah_item', 'total_penjualan', 'total_transaksi'].includes(sortColumn)) {
            const numA = parseFloat(String(aValue));
            const numB = parseFloat(String(bValue));
            return sortDirection === 'asc' ? numA - numB : numB - numA;
        }

        if (['created_at', 'updated_at'].includes(sortColumn)) {
            const dateA = new Date(String(aValue)).getTime();
            const dateB = new Date(String(bValue)).getTime();
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return 0;
    });

    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const renderSortIcon = (column: keyof SegmentasiPasar) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? <i className="fas fa-arrow-up ml-2 text-blue-500"></i> : <i className="fas fa-arrow-down ml-2 text-blue-500"></i>;
        }
        return null;
    };

    const parseToNumber = (val: number | string | undefined | null) => {
        if (typeof val === 'number') return val;
        const num = parseFloat(val ?? '0');
        return isNaN(num) ? 0 : num;
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <>
            <Head title="Segmentasi Pasar - Tappp" />
            <div className="flex min-h-screen">
                <MySidebar />
                <main className="flex-1 p-4 md:p-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex flex-col">
                            <h2 className="text-[#344767] font-semibold text-xl md:text-2xl">
                                Daftar Segmentasi Pasar
                            </h2>
                            <div className="mt-1">
                                <Breadcrumbs
                                    breadcrumbs={[
                                        { title: 'Dashboard', href: '/dashboard' },
                                        { title: 'Segmentasi Pasar', href: '/admin/SegmentasiPasar' },
                                        ...(mode === 'arsip' || url.includes('show=arsip')
                                            ? [{ title: 'Arsip', href: '/admin/SegmentasiPasar?show=arsip' }]
                                            : [])
                                    ]}
                                />
                            </div>
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
                            {(mode === 'arsip' || url.includes('show=arsip')) && (
                                <button
                                    onClick={() => {
                                        const pathname = window.location.pathname;
                                        router.get(pathname, {}, { replace: true, preserveScroll: true });
                                        setCurrentPage(1);
                                        setSearchQuery('');
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                                >
                                    <i className="fas fa-times"></i>
                                    Tutup Arsip
                                </button>
                            )}
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
                                onSearchChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                onPrintPdf={() => window.open('/segmentasi/export-pdf', '_blank')}
                                onPrintExcel={() => window.open('/segmentasi/export-excel', '_blank')}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {sortedData.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-500">Belum ada data segmentasi pasar yang ditemukan.</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden lg:block">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-separate border-spacing-y-2">
                                            <thead>
                                                <tr className="text-xs font-semibold text-[#98A2B3] uppercase">
                                                    {['sector_name', 'jumlah_item', 'total_penjualan', 'total_transaksi', 'kriteria_jumlah_item', 'kriteria_total_penjualan', 'kriteria_total_transaksi', 'status', 'created_at', 'month'].map(col => (
                                                        <th
                                                            key={col}
                                                            className="text-left py-3 px-4 cursor-pointer hover:text-blue-500 transition-colors"
                                                            onClick={() => {
                                                                setSortColumn(col as keyof SegmentasiPasar);
                                                                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                            }}
                                                        >
                                                            {col.replace(/_/g, ' ').toUpperCase()} {renderSortIcon(col as keyof SegmentasiPasar)}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-[#344767]">
                                                {paginatedData.map((item) => (
                                                    <SegmentasiPasarTableRow key={item.id} segmentasiPasar={item} />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden">
                                    <div className="p-4 space-y-4">
                                        {paginatedData.map((item) => (
                                            <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-[#344767] text-lg">{item.sector_name || 'N/A'}</h3>
                                                        <p className="text-gray-600 text-sm">Bulan: {item.month}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                                    <div>
                                                        <p className="font-medium text-gray-700">Jumlah Item:</p>
                                                        <p className="font-semibold">{item.jumlah_item}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-700">Total Transaksi:</p>
                                                        <p className="font-semibold">{parseToNumber(item.total_transaksi).toLocaleString('id-ID')}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="font-medium text-gray-700">Total Penjualan:</p>
                                                        <p className="font-semibold">Rp{parseToNumber(item.total_penjualan).toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
                                                    <div>
                                                        <p className="font-medium text-gray-700">K-Jumlah:</p>
                                                        <p>{item.kriteria_jumlah_item}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-700">K-Penjualan:</p>
                                                        <p>{item.kriteria_total_penjualan}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-700">K-Transaksi:</p>
                                                        <p>{item.kriteria_total_transaksi}</p>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    <p>Dibuat: {formatDate(item.created_at)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Averages Section */}
                    {mode !== 'arsip' && (
                        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Total Bulan Ini:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-blue-700">Jumlah Item</p>
                                    <p className="text-2xl font-bold text-blue-800">{Number(getTotals(filteredData).jumlah_item ?? 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-green-700">Total Penjualan</p>
                                    <p className="text-2xl font-bold text-green-800">Rp{Number(getTotals(filteredData).total_penjualan).toLocaleString('id-ID')}</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-purple-700">Total Transaksi</p>
                                    <p className="text-2xl font-bold text-purple-800">{Number(getTotals(filteredData).total_transaksi ?? 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                            {/* Filter-aware averages */}
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-800 mb-4 text-lg">Rata-rata Bulan Ini:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-sm font-medium text-blue-700">Jumlah Item</p>
                                        <p className="text-2xl font-bold text-blue-800">{Number(getAveragesFromRows(filteredData).avg_jumlah_item ?? 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <p className="text-sm font-medium text-green-700">Total Penjualan</p>
                                        <p className="text-2xl font-bold text-green-800">Rp{Number(getAveragesFromRows(filteredData).avg_total_penjualan).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <p className="text-sm font-medium text-purple-700">Total Transaksi</p>
                                        <p className="text-2xl font-bold text-purple-800">{Number(getAveragesFromRows(filteredData).avg_total_transaksi ?? 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {sortedData.length > itemsPerPage && (
                        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Sebelumnya
                                </button>
                                
                                <div className="flex items-center space-x-1">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    className={`px-3 py-2 rounded-lg shadow-md transition-colors text-sm ${
                                                        currentPage === pageNumber
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        } else if (
                                            pageNumber === currentPage - 2 ||
                                            pageNumber === currentPage + 2
                                        ) {
                                            return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>
                                
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Berikutnya
                                </button>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                                Halaman {currentPage} dari {totalPages} ({paginatedData.length} total data)
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    </>
    );
};

export default SegmentasiPasarList;
