// import React, { useState, useEffect, useCallback } from 'react';
// import MySidebar from '../../Layout/Sidebar';
// import AddProductModal from './addproduct';
// import EditProductModal from './editproduct';
// import DeleteProductModal from './deleteproduct';
// import { ProductData, Product as ProductType } from '@/components/Types/types';
// import TableRowProduct from '@/components/Tabel/TabelRowProduct';
// import Search from '@/components/Search/search'; // Import komponen search
// import Swal from 'sweetalert2';


// const ProductsIndex: React.FC = () => {
//     const [products, setProducts] = useState<ProductType[]>([]);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [productToEdit, setProductToEdit] = useState<ProductType | null>(null);
//     const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const [currentPage, setCurrentPage] = useState(1);
//     const [productsPerPage] = useState(10);

//     const [searchQuery, setSearchQuery] = useState<string>(''); // Search state

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(event.target.value);
//         setCurrentPage(1);
//     };

//     const fetchProducts = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch('/products');
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }
//             const data: ProductType[] = await response.json();
//             const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//             setProducts(sortedData);
//         } catch (err: any) {
//             setError(`Gagal memuat produk: ${err.message}`);
//             console.error('Error fetching products:', err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchProducts();
//     }, [fetchProducts]);

//     const filteredProducts = products.filter((product) =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         product.price.toString().includes(searchQuery)
//     );

//     const indexOfLastProduct = currentPage * productsPerPage;
//     const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//     const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
//     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
//     const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
//     const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

//     const handleOpenAddModal = () => setIsAddModalOpen(true);
//     const handleCloseAddModal = () => setIsAddModalOpen(false);

//     const handleSaveNewProduct = async (formData: FormData) => {
//         setIsSubmitting(true);
//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             const response = await fetch('/products', {
//                 method: 'POST',
//                 headers: {
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//                 body: formData,
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }

//             await fetchProducts();
//             setCurrentPage(1);
//             // alert('Produk baru berhasil ditambahkan!');
//             await Swal.fire({
//                 icon: 'success',
//                 title: 'Produk baru berhasil ditambahkan!',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//             handleCloseAddModal();
//         } catch (err: any) {
//             setError(`Gagal menambahkan produk: ${err.message}`);
//             // alert(`Gagal menambahkan produk: ${err.message}`);
//             await Swal.fire({
//                 icon: 'error',
//                 title: 'Gagal menambahkan produk',
//                 text: err.message,
//             });
//             console.error('Error adding product:', err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleOpenEditModal = (product: ProductType) => {
//         setProductToEdit(product);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setProductToEdit(null);
//     };

//     const handleSaveEditedProduct = async (updatedProductData: ProductData) => {
//         setIsSubmitting(true);
//         try {
//             if (!productToEdit) throw new Error("Produk tidak ditemukan.");
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             const response = await fetch(`/products/${productToEdit.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//                 body: JSON.stringify(updatedProductData),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }

//             await fetchProducts();
//             // alert('Produk berhasil diperbarui!');
//             await Swal.fire({
//                 icon: 'success',
//                 title: 'Produk berhasil diperbarui!',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//             handleCloseEditModal();
//         } catch (err: any) {
//             // alert(`Gagal memperbarui produk: ${err.message}`);
//             await Swal.fire({
//                 icon: 'error',
//                 title: 'Gagal memperbarui produk',
//                 text: err.message,
//             });
//             console.error('Error saving edited product:', err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleOpenDeleteModal = (product: ProductType) => {
//         setProductToDelete(product);
//         setIsDeleteModalOpen(true);
//     };

//     const handleCloseDeleteModal = () => {
//         setIsDeleteModalOpen(false);
//         setProductToDelete(null);
//     };

//     const handleDeleteProductConfirmed = async () => {
//         setIsSubmitting(true);
//         if (!productToDelete) {
//             setError('Tidak ada produk dipilih.');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             const response = await fetch(`/products/${productToDelete.id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//             });

//             if (!response.ok) {
//                 const errData = await response.json().catch(() => null);
//                 throw new Error(errData?.message || 'Gagal menghapus produk.');
//             }

//             await fetchProducts();
//             // alert('Produk berhasil dihapus!');
//             await Swal.fire({
//                 icon: 'success',
//                 title: 'Produk berhasil dihapus!',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//             handleCloseDeleteModal();
//         } catch (err: any) {
//             setError(err.message || 'Terjadi kesalahan saat menghapus produk.');
//             // alert(`Gagal menghapus produk: ${err.message}`);
//             await Swal.fire({
//                 icon: 'error',
//                 title: 'Gagal menghapus produk',
//                 text: err.message,
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="flex min-h-screen">
//             <MySidebar />

//             {/* <main className="flex-1 p-6">
//                 <div className="w-full max-w-5xl mx-auto">
//                     <div className="mb-4">
//                         <h2 className="text-[#344767] font-semibold text-lg mb-2">Daftar Produk</h2>
//                         <div className="flex flex-col md:flex-row justify-between gap-4">
//                             <Search
//                                 searchQuery={searchQuery}
//                                 onSearchChange={handleSearchChange}
//                             />
//                             <button
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full md:w-auto"
//                                 onClick={handleOpenAddModal}
//                             >
//                                 + Tambah Produk
//                             </button>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         {loading ? (
//                             <p className="p-4 text-center text-gray-600">Memuat data produk...</p>
//                         ) : error ? (
//                             <p className="p-4 text-center text-red-500">Error: {error}</p>
//                         ) : filteredProducts.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">Tidak ada produk ditemukan.</p>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full border-separate border-spacing-y-2">
//                                     <thead>
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2">NAMA</th>
//                                             <th className="text-left py-2">HARGA</th>
//                                             <th className="text-left py-2">DESKRIPSI</th>
//                                             <th className="text-left py-2">GAMBAR</th>
//                                             <th className="text-left py-2">CREATED AT</th>
//                                             <th className="text-left py-2">UPDATED AT</th>
//                                             <th className="py-2 pr-6 text-right">AKSI</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentProducts.map((product) => (
//                                             <TableRowProduct
//                                                 key={product.id}
//                                                 id={product.id}
//                                                 name={product.name}
//                                                 slug={product.slug}
//                                                 price={product.price}
//                                                 description={product.description}
//                                                 image={product.image}
//                                                 created_at={product.created_at}
//                                                 updated_at={product.updated_at}
//                                                 onEdit={() => handleOpenEditModal(product)}
//                                                 onDelete={() => handleOpenDeleteModal(product)}
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {filteredProducts.length > productsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">Sebelumnya</button>
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <button
//                                     key={index + 1}
//                                     onClick={() => paginate(index + 1)}
//                                     className={`px-4 py-2 rounded-lg shadow-md transition-colors ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             ))}
//                             <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">Berikutnya</button>
//                         </div>
//                     )}
//                 </div>
//             </main> */}
//             <main className="flex-1 p-6 overflow-hidden flex flex-col">
//                 <div className="flex-1 flex flex-col overflow-hidden">
//                     <div className="mb-4">
//                         <h2 className="text-[#344767] font-semibold text-lg mb-2">Daftar Produk</h2>
//                         <div className="flex flex-col md:flex-row justify-between gap-4">
//                             <Search
//                                 searchQuery={searchQuery}
//                                 onSearchChange={handleSearchChange}
//                             />
//                             <button
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full md:w-auto"
//                                 onClick={handleOpenAddModal}
//                             >
//                                 + Tambah Produk
//                             </button>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-md flex-1 overflow-hidden flex flex-col">
//                         {loading ? (
//                             <p className="p-4 text-center text-gray-600">Memuat data produk...</p>
//                         ) : error ? (
//                             <p className="p-4 text-center text-red-500">Error: {error}</p>
//                         ) : filteredProducts.length === 0 ? (
//                             <p className="p-4 text-center text-gray-500">Tidak ada produk ditemukan.</p>
//                         ) : (
//                             <div className="overflow-x-auto flex-1 overflow-y-auto">
//                                 <table className="min-w-full border-separate border-spacing-y-2">
//                                     <thead>
//                                         <tr className="text-xs font-semibold text-[#98A2B3]">
//                                             <th className="text-left pl-6 py-2">NAMA</th>
//                                             <th className="text-left py-2">HARGA</th>
//                                             <th className="text-left py-2">DESKRIPSI</th>
//                                             <th className="text-left py-2">GAMBAR</th>
//                                             <th className="text-left py-2">CREATED AT</th>
//                                             <th className="text-left py-2">UPDATED AT</th>
//                                             <th className="py-2 pr-6 text-right">AKSI</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-sm text-[#344767]">
//                                         {currentProducts.map((product) => (
//                                             <TableRowProduct
//                                                 key={product.id}
//                                                 id={product.id}
//                                                 name={product.name}
//                                                 slug={product.slug}
//                                                 price={product.price}
//                                                 description={product.description}
//                                                 image={product.image}
//                                                 created_at={product.created_at}
//                                                 updated_at={product.updated_at}
//                                                 onEdit={() => handleOpenEditModal(product)}
//                                                 onDelete={() => handleOpenDeleteModal(product)}
//                                             />
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {filteredProducts.length > productsPerPage && (
//                         <div className="flex justify-center items-center mt-6 space-x-2">
//                             {/* Pagination buttons */}
//                         </div>
//                     )}
//                 </div>
//             </main>


//             <AddProductModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSave={handleSaveNewProduct} isSubmitting={isSubmitting} />
//             {productToEdit && <EditProductModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} onSave={handleSaveEditedProduct} initialData={productToEdit} isSubmitting={isSubmitting} />}
//             {isDeleteModalOpen && productToDelete && <DeleteProductModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onDelete={handleDeleteProductConfirmed} product={productToDelete} isSubmitting={isSubmitting} />}
//         </div>
//     );
// };

// export default ProductsIndex;


import React, { useState } from 'react';
import { usePage, useForm, router, Head } from '@inertiajs/react';
import MySidebar from '@/Layout/Sidebar';
import AddProductModal from './addproduct';
import EditProductModal from './editproduct';
import DetailProductModal from './detailproduct';
import DeleteProductModal from './deleteproduct';
import TableRowProduct from '@/components/Tabel/TabelRowProduct';
import Search from '@/components/Search/search';
import Swal from 'sweetalert2';
import { Product as ProductType } from '@/components/Types/types';

interface PageProps {
    products: ProductType[];
}

const ProductsIndex: React.FC = () => {
    const { products: allProducts } = usePage<PageProps>().props;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<ProductType | null>(null);
    const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);
    const [productToDetail, setProductToDetail] = useState<ProductType | null>(null);


    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const { processing, setData, reset } = useForm();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.price.toString().includes(searchQuery)
    );

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleSaveNewProduct = async (formData: FormData) => {
        router.post('/products', formData, {
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Produk berhasil ditambahkan!', timer: 2000, showConfirmButton: false });
                handleCloseAddModal();
            },
            onError: (errors) => {
                Swal.fire({ icon: 'error', title: 'Gagal menambahkan produk', text: errors.message || 'Terjadi kesalahan' });
            },
        });
    };

    const handleOpenEditModal = (product: ProductType) => {
        setProductToEdit(product);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setProductToEdit(null);
        setIsEditModalOpen(false);
    };

    const handleSaveEditedProduct = async (data: Partial<ProductType>) => {
        if (!productToEdit) return;

        router.put(`/products/${productToEdit.id}`, data, {
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Produk berhasil diperbarui!', timer: 2000, showConfirmButton: false });
                handleCloseEditModal();
            },
            onError: (errors) => {
                Swal.fire({ icon: 'error', title: 'Gagal memperbarui produk', text: errors.message || 'Terjadi kesalahan' });
            },
        });
    };

    const handleOpenDeleteModal = (product: ProductType) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setProductToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDeleteProductConfirmed = () => {
        if (!productToDelete) return;

        router.delete(`/products/${productToDelete.id}`, {
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Produk berhasil dihapus!', timer: 2000, showConfirmButton: false });
                handleCloseDeleteModal();
            },
            onError: (errors) => {
                Swal.fire({ icon: 'error', title: 'Gagal menghapus produk', text: errors.message || 'Terjadi kesalahan' });
            },
        });
    };

    const handleOpenDetailDrawer = (product: ProductType) => {
        setProductToDetail(product);
        setIsDetailDrawerOpen(true);
    };

    const handleCloseDetailDrawer = () => {
        setProductToDetail(null);
        setIsDetailDrawerOpen(false);
    };

    const paginate = (page: number) => setCurrentPage(page);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    return (
        <>
            <Head title="Produk - Tappp" />
            <div className="flex min-h-screen">
                <MySidebar />
                <main className="flex-1 p-6 overflow-hidden flex flex-col">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="mb-4">
                        <h2 className="text-[#344767] font-semibold text-lg mb-2">Daftar Produk</h2>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <Search searchQuery={searchQuery} onSearchChange={handleSearchChange} />
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md w-full md:w-auto"
                                onClick={handleOpenAddModal}
                            >
                                + Tambah Produk
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md flex-1 overflow-hidden flex flex-col">
                        {filteredProducts.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">Tidak ada produk ditemukan.</p>
                        ) : (
                            <div className="overflow-x-auto flex-1 overflow-y-auto">
                                <table className="min-w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-xs font-semibold text-[#98A2B3]">
                                            <th className="text-left pl-6 py-2">NAMA</th>
                                            <th className="text-left py-2">HARGA</th>
                                            <th className="text-left py-2">DESKRIPSI</th>
                                            <th className="text-left py-2">GAMBAR</th>
                                            <th className="text-left py-2">CREATED AT</th>
                                            <th className="text-left py-2">UPDATED AT</th>
                                            <th className="py-2 pr-6 text-right">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-[#344767]">
                                        {currentProducts.map(product => (
                                            <TableRowProduct
                                                key={product.id}
                                                {...product}
                                                onEdit={() => handleOpenEditModal(product)}
                                                onDelete={() => handleOpenDeleteModal(product)}
                                                onDetail={() => handleOpenDetailDrawer(product)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {filteredProducts.length > productsPerPage && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50">Sebelumnya</button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-4 py-2 rounded-lg shadow-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button onClick={nextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 disabled:opacity-50">Berikutnya</button>
                        </div>
                    )}
                </div>
            </main>

            <AddProductModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSave={handleSaveNewProduct} isSubmitting={processing} />
            {productToEdit && <EditProductModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} onSave={handleSaveEditedProduct} initialData={productToEdit} isSubmitting={processing} />}
            {productToDelete && <DeleteProductModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onDelete={handleDeleteProductConfirmed} product={productToDelete} isSubmitting={processing} />}
            {productToDetail && <DetailProductModal isOpen={isDetailDrawerOpen} onClose={handleCloseDetailDrawer} product={productToDetail}/>}
        </div>
    </>
    );
};

export default ProductsIndex;
