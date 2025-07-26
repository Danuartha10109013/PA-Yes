// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import TableRowSector from '../../components/Tabel/TabelRowSector';
// import MySidebar from '../../Layout/Sidebar';
// import AddSectorModal from './addsector';
// import EditSectorModal from './editsector';
// import DeleteSectorModal from './deletesector';
// import { SectorData, Sector as SectorType } from '@/components/Types/types';
// import Search from '@/components/Search/search';
// import Swal from 'sweetalert2';


// const SectorsIndex: React.FC = () => {
//     const [sectors, setSectors] = useState<SectorType[]>([]);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [sectorToEdit, setSectorToEdit] = useState<SectorType | null>(null);
//     const [sectorToDelete, setSectorToDelete] = useState<SectorType | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [sectorsPerPage] = useState(10);

//     const fetchSectors = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch('/sectors');
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }
//             const data: SectorType[] = await response.json();
//             const sortedData = data.sort((a, b) =>
//                 new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//             );
//             setSectors(sortedData);
//         } catch (err: any) {
//             setError(`Gagal memuat sektor: ${err.message}`);
//             console.error('Error fetching sectors:', err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchSectors();
//     }, [fetchSectors]);

//     const filteredSectors = useMemo(() => {
//         return sectors.filter(sector =>
//             sector.name.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//     }, [sectors, searchQuery]);

//     const indexOfLastSector = currentPage * sectorsPerPage;
//     const indexOfFirstSector = indexOfLastSector - sectorsPerPage;
//     const currentSectors = filteredSectors.slice(indexOfFirstSector, indexOfLastSector);
//     const totalPages = Math.ceil(filteredSectors.length / sectorsPerPage);

//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchQuery]);

//     const paginate = useCallback((page: number) => setCurrentPage(page), []);
//     const nextPage = useCallback(() => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), [totalPages]);
//     const prevPage = useCallback(() => setCurrentPage((prev) => Math.max(prev - 1, 1)), []);

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(event.target.value);
//     };

//     const handleOpenAddModal = () => setIsAddModalOpen(true);
//     const handleCloseAddModal = () => setIsAddModalOpen(false);

//     const handleOpenEditModal = (sector: SectorType) => {
//         setSectorToEdit(sector);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setSectorToEdit(null);
//     };

//     const handleOpenDeleteModal = (sector: SectorType) => {
//         setSectorToDelete(sector);
//         setIsDeleteModalOpen(true);
//     };

//     const handleCloseDeleteModal = () => {
//         setIsDeleteModalOpen(false);
//         setSectorToDelete(null);
//     };

//     const handleSaveEditedSector = async (updatedSectorData: SectorData) => {
//         try {
//             await fetchSectors();
//             // alert('Sektor berhasil diperbarui!');
//             await Swal.fire({
//                 icon: 'success',
//                 title: 'Sektor berhasil diperbarui!',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//             handleCloseEditModal();
//         } catch (err: any) {
//             // alert(`Gagal memperbarui sektor: ${err.message}`);
//             await Swal.fire({
//                 icon: 'error',
//                 title: 'Gagal memperbarui sektor',
//                 text: err.message || 'Terjadi kesalahan',
//             });
//             console.error('Error saving edited sector:', err);
//             throw err;
//         }
//     };

//     const handleDeleteSectorConfirmed = async () => {
//         setIsSubmitting(true);
//         setError(null);
//         if (!sectorToDelete) {
//             setError('Tidak ada sektor yang dipilih untuk dihapus.');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             const response = await fetch(`/sectors/${sectorToDelete.id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//                 body: JSON.stringify({ updated_at: new Date().toISOString() }),
//             });

//             if (!response.ok) {
//                 const isJson = response.headers.get('content-type')?.includes('application/json');
//                 const errorData = isJson ? await response.json() : await response.text();
//                 throw new Error(isJson ? errorData.message : `Server error: ${errorData}`);
//             }

//             await fetchSectors();
//             // alert('Sektor berhasil dihapus!');
//             await Swal.fire({
//                 icon: 'success',
//                 title: 'Sektor berhasil dihapus!',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//             handleCloseDeleteModal();
//         } catch (err: any) {
//             setError(err.message || 'Terjadi kesalahan saat menghapus sektor.');
//             // alert(`Gagal menghapus sektor: ${err.message}`);
//             await Swal.fire({
//                 icon: 'error',
//                 title: 'Gagal menghapus sektor',
//                 text: err.message || 'Terjadi kesalahan',
//             });
//             console.error('Error saat hapus sektor:', err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleSaveNewSector = async (newSectorData: SectorData) => {
//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             const response = await fetch('/sectors', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//                 body: JSON.stringify(newSectorData),
//             });

//             if (!response.ok) {
//                 const isJson = response.headers.get('content-type')?.includes('application/json');
//                 const errorData = isJson ? await response.json() : await response.text();
//                 throw new Error(isJson ? errorData.message : `Server error: ${errorData}`);
//             }

//             await fetchSectors();
//             setCurrentPage(1);
//             // alert('Sektor baru berhasil ditambahkan!');
//             await Swal.fire({
//                 icon: 'success',
//                 title: 'Sektor baru berhasil ditambahkan!',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//             handleCloseAddModal();
//         } catch (err: any) {
//             setError(`Gagal menambahkan sektor: ${err.message}`);
//             // alert(`Gagal menambahkan sektor: ${err.message}`);
//             await Swal.fire({
//                 icon: 'error',
//                 title: 'Gagal menambahkan sektor',
//                 text: err.message,
//             });
//             console.error('Error adding sector:', err);
//             throw err;
//         }
//     };

//     return (
//         <div className="flex min-h-screen">
//             <MySidebar />

//             {/* <main className="flex-1 p-6">
//                 <div className="w-full max-w-5xl mx-auto">
//                     <div className="mb-4">
//                         <h2 className="text-[#344767] font-semibold text-lg mb-2">
//                             Daftar Kontak Perusahaan
//                         </h2>
//                         <div className="flex flex-col md:flex-row justify-between gap-4">
//                             <Search
//                                 searchQuery={searchQuery}
//                                 onSearchChange={handleSearchChange}
//                             />
//                             <button
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full md:w-auto"
//                                 onClick={handleOpenAddModal}
//                             >
//                                 + Tambah Kontak
//                             </button>
//                         </div>
//                     </div>




//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         {loading ? (
//                             <p className="p-4 text-center text-gray-600">Memuat data sektor...</p>
//                         ) : error ? (
//                             <p className="p-4 text-center text-red-500">Error: {error}</p>
//                         ) : filteredSectors.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">
//                                 Tidak ada data sektor yang cocok dengan pencarian Anda.
//                             </p>
//                         ) : (
//                             <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
//                                 <table className="min-w-full border-separate border-spacing-y-2">
//                                     <thead>
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2">NAMA SEKTOR</th>
//                                             <th className="text-left py-2">BACKGROUND COLOR</th>
//                                             <th className="text-left py-2">TEXT COLOR</th>
//                                             <th className="text-left py-2">CREATED AT</th>
//                                             <th className="text-left py-2">UPDATED AT</th>
//                                             <th className="py-2 pr-6 text-right">AKSI</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentSectors.map((sector) => (
//                                             <TableRowSector
//                                                 key={sector.id}
//                                                 {...sector}
//                                                 onEdit={handleOpenEditModal}
//                                                 onDelete={handleOpenDeleteModal}
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>


//                     {filteredSectors.length > sectorsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             <button
//                                 onClick={prevPage}
//                                 disabled={currentPage === 1}
//                                 className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 Sebelumnya
//                             </button>
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <button
//                                     key={`page-${index + 1}`}
//                                     onClick={() => paginate(index + 1)}
//                                     className={`px-4 py-2 rounded-lg shadow-md transition-colors ${currentPage === index + 1
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-white text-gray-700 hover:bg-gray-200'
//                                         }`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             ))}
//                             <button
//                                 onClick={nextPage}
//                                 disabled={currentPage === totalPages}
//                                 className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 Berikutnya
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </main> */}
//             <main className="flex-1 p-6 overflow-hidden flex flex-col">
//                 <div className="flex-1 flex flex-col overflow-hidden">
//                     <div className="mb-4">
//                         <h2 className="text-[#344767] font-semibold text-lg mb-2">
//                             Daftar sektor
//                         </h2>
//                         <div className="flex flex-col md:flex-row justify-between gap-4">
//                             <Search
//                                 searchQuery={searchQuery}
//                                 onSearchChange={handleSearchChange}
//                             />
//                             <button
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full md:w-auto"
//                                 onClick={handleOpenAddModal}
//                             >
//                                 + Tambah Sektor
//                             </button>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-md flex-1 overflow-hidden flex flex-col">
//                         {loading ? (
//                             <p className="p-4 text-center text-gray-600">Memuat data sektor...</p>
//                         ) : error ? (
//                             <p className="p-4 text-center text-red-500">Error: {error}</p>
//                         ) : filteredSectors.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">
//                                 Tidak ada data sektor yang cocok dengan pencarian Anda.
//                             </p>
//                         ) : (
//                             <div className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 flex-1">
//                                 <table className="min-w-full border-separate border-spacing-y-2">
//                                     <thead>
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2">NAMA SEKTOR</th>
//                                             <th className="text-left py-2">BACKGROUND COLOR</th>
//                                             <th className="text-left py-2">TEXT COLOR</th>
//                                             <th className="text-left py-2">CREATED AT</th>
//                                             <th className="text-left py-2">UPDATED AT</th>
//                                             <th className="py-2 pr-6 text-right">AKSI</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentSectors.map((sector) => (
//                                             <TableRowSector
//                                                 key={sector.id}
//                                                 {...sector}
//                                                 onEdit={handleOpenEditModal}
//                                                 onDelete={handleOpenDeleteModal}
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {filteredSectors.length > sectorsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             {/* Pagination here */}
//                         </div>
//                     )}
//                 </div>
//             </main>


//             {/* Modals */}
//             <AddSectorModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSave={handleSaveNewSector} />

//             {sectorToEdit && (
//                 <EditSectorModal
//                     isOpen={isEditModalOpen}
//                     onClose={handleCloseEditModal}
//                     onSave={handleSaveEditedSector}
//                     initialData={sectorToEdit}
//                 />
//             )}

//             {isDeleteModalOpen && sectorToDelete && (
//                 <DeleteSectorModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={handleCloseDeleteModal}
//                     onDelete={handleDeleteSectorConfirmed}
//                     sector={sectorToDelete}
//                     isSubmitting={isSubmitting}
//                 />
//             )}
//         </div>
//     );
// };

// export default SectorsIndex;


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePage, useForm, Head } from '@inertiajs/react';
import TableRowSector from '@/components/Tabel/TabelRowSector';
import MySidebar from '@/Layout/Sidebar';
import Search from '@/components/Search/search';
import AddSectorModal from './addsector';
import EditSectorModal from './editsector';
import DeleteSectorModal from './deletesector';
import Swal from 'sweetalert2';
import { Sector as SectorType, SectorData } from '@/components/Types/types';

const SectorsIndex: React.FC = () => {
    const { props } = usePage<{ sectors: SectorType[] }>();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sectorsPerPage] = useState(10);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [sectorToEdit, setSectorToEdit] = useState<SectorType | null>(null);
    const [sectorToDelete, setSectorToDelete] = useState<SectorType | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const sectors = useMemo(() => props.sectors, [props.sectors]);

    const filteredSectors = useMemo(() => {
        return sectors.filter(sector =>
            sector.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [sectors, searchQuery]);

    const indexOfLast = currentPage * sectorsPerPage;
    const indexOfFirst = indexOfLast - sectorsPerPage;
    const currentSectors = filteredSectors.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredSectors.length / sectorsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const paginate = useCallback((page: number) => setCurrentPage(page), []);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleOpenEditModal = (sector: SectorType) => {
        setSectorToEdit(sector);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setSectorToEdit(null);
        setIsEditModalOpen(false);
    };

    const handleOpenDeleteModal = (sector: SectorType) => {
        setSectorToDelete(sector);
        setIsDeleteModalOpen(true);
    };
    const handleCloseDeleteModal = () => {
        setSectorToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const { post, put, delete: destroy } = useForm<SectorData>();

    const handleSaveNewSector = async (data: SectorData) => {
        post('/sectors', {
            data,
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Sektor ditambahkan', timer: 2000, showConfirmButton: false });
                handleCloseAddModal();
            },
            onError: (errors) => {
                Swal.fire({ icon: 'error', title: 'Gagal menambahkan sektor', text: Object.values(errors).join(', ') });
            }
        });
    };

    const handleSaveEditedSector = async (data: SectorData) => {
        if (!sectorToEdit) return;

        put(`/sectors/${sectorToEdit.id}`, {
            data,
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Sektor diperbarui', timer: 2000, showConfirmButton: false });
                handleCloseEditModal();
            },
            onError: (errors) => {
                Swal.fire({ icon: 'error', title: 'Gagal mengubah sektor', text: Object.values(errors).join(', ') });
            }
        });
    };

    const handleDeleteSectorConfirmed = () => {
        if (!sectorToDelete) return;

        setIsSubmitting(true);

        destroy(`/sectors/${sectorToDelete.id}`, {
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Sektor dihapus', timer: 2000, showConfirmButton: false });
                handleCloseDeleteModal();
            },
            onError: (errors) => {
                Swal.fire({ icon: 'error', title: 'Gagal menghapus sektor', text: Object.values(errors).join(', ') });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Sektor - Tappp" />
            <div className="flex min-h-screen">
                <MySidebar />
                <main className="flex-1 p-6 overflow-hidden flex flex-col">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="mb-4">
                        <h2 className="text-[#344767] font-semibold text-lg mb-2">
                            Daftar Sektor
                        </h2>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <Search
                                searchQuery={searchQuery}
                                onSearchChange={handleSearchChange}
                            />
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full md:w-auto"
                                onClick={handleOpenAddModal}
                            >
                                + Tambah Sektor
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md flex-1 overflow-hidden flex flex-col">
                        {filteredSectors.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">
                                Tidak ada data sektor yang cocok dengan pencarian Anda.
                            </p>
                        ) : (
                            <div className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 flex-1">
                                <table className="min-w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-xs font-semibold text-[#98A2B3]">
                                            <th className="text-left pl-6 py-2">NAMA SEKTOR</th>
                                            <th className="text-left py-2">BACKGROUND COLOR</th>
                                            <th className="text-left py-2">TEXT COLOR</th>
                                            <th className="text-left py-2">CREATED AT</th>
                                            <th className="text-left py-2">UPDATED AT</th>
                                            <th className="py-2 pr-6 text-right">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-[#344767]">
                                        {currentSectors.map((sector) => (
                                            <TableRowSector
                                                key={sector.id}
                                                {...sector}
                                                onEdit={handleOpenEditModal}
                                                onDelete={handleOpenDeleteModal}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {filteredSectors.length > sectorsPerPage && (
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
                                    key={`page-${index + 1}`}
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

            {/* Modals */}
            <AddSectorModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSave={handleSaveNewSector} />

            {sectorToEdit && (
                <EditSectorModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveEditedSector}
                    initialData={sectorToEdit}
                />
            )}

            {isDeleteModalOpen && sectorToDelete && (
                <DeleteSectorModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onDelete={handleDeleteSectorConfirmed}
                    sector={sectorToDelete}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    </>
    );
};

export default SectorsIndex;
