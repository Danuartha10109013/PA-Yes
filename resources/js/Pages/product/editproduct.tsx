// import React, { useEffect, useState } from 'react';
// import ReusableModal from '@/components/Modal/modal';
// import { Product, ProductData } from '@/components/Types/types';

// // Fungsi generateSlug yang sudah Anda berikan
// const generateSlug = (text: string): string =>
//     text
//         .toLowerCase() // Mengubah semua karakter menjadi huruf kecil
//         .trim() // Menghapus spasi di awal dan akhir string
//         .replace(/[^\w\s-]/g, '') // Menghapus semua karakter non-kata, non-spasi, dan non-strip
//         .replace(/\s+/g, '-') // Mengubah satu atau lebih spasi menjadi satu strip
//         .replace(/-+/g, '-'); // Mengubah satu atau lebih strip menjadi satu strip

// interface EditProductModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave?: (data: Product) => Promise<void>;
//     initialData: Product;
// }

// const EditProductModal: React.FC<EditProductModalProps> = ({
//     isOpen,
//     onClose,
//     onSave,
//     initialData,
// }) => {
//     const [form, setForm] = useState<Product>({
//         ...initialData,
//         description: initialData.description ?? null,
//         image: initialData.image ?? null,
//     });
//     // State untuk melacak apakah slug sudah diubah secara manual
//     const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(false);

//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//     useEffect(() => {
//         if (isOpen) {
//             setForm({
//                 ...initialData,
//                 description: initialData.description ?? null,
//                 image: initialData.image ?? null,
//             });
//             // Reset status edit manual saat modal dibuka
//             setIsSlugManuallyEdited(false);
//             setError(null);
//             setIsSubmitting(false);
//         }
//     }, [isOpen, initialData]);

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => {
//         const { name, value } = e.target;
//         setForm(prev => {
//             const updatedForm = { ...prev };

//             if (name === 'name') {
//                 updatedForm.name = value;
//                 // Hanya update slug otomatis jika belum diubah manual
//                 if (!isSlugManuallyEdited) {
//                     updatedForm.slug = generateSlug(value);
//                 }
//             } else if (name === 'slug') {
//                 updatedForm.slug = value === '' ? null : value;
//                 // Set flag bahwa slug diubah manual
//                 setIsSlugManuallyEdited(true);
//             } else {
//                 updatedForm[name as keyof Product] = value === '' ? null : value;
//             }

//             return updatedForm;
//         });
//     };

//     const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setForm(prev => ({
//             ...prev,
//             price: parseFloat(value) || 0, // Ensure price is always a number
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError(null);

//         // Basic client-side validation
//         if (!form.name || !form.slug || form.price === undefined || form.price === null) {
//             setError('Name, slug, and price are required.');
//             setIsSubmitting(false);
//             return;
//         }

//         if (isNaN(form.price)) {
//             setError('Price must be a valid number.');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             const payload: ProductData = {
//                 name: form.name,
//                 slug: form.slug!, // Pastikan slug tidak null karena sudah divalidasi
//                 price: form.price,
//                 description: form.description ?? undefined,
//                 image: form.image ?? undefined,
//             };

//             const response = await fetch(`/products/${initialData.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//                 body: JSON.stringify(payload),
//             });

//             if (!response.ok) {
//                 const errData = await response.json();
//                 throw new Error(errData.message || 'Failed to save product.');
//             }

//             const { product: savedProduct }: { product: Product } = await response.json();

//             if (onSave) {
//                 await onSave(savedProduct);
//             }

//             onClose();
//         } catch (err: any) {
//             setError(err.message || 'Failed to update product.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Edit Product"
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//             submitLabel="Save"
//             cancelLabel="Cancel"
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {error && <div className="text-red-500 mb-4">{error}</div>}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block font-semibold">Name *</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-semibold">Slug *</label>
//                         <input
//                             type="text"
//                             name="slug"
//                             value={form.slug ?? ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-semibold">Price *</label>
//                         <input
//                             type="number"
//                             name="price"
//                             value={form.price}
//                             onChange={handlePriceChange}
//                             className="w-full border rounded px-3 py-2"
//                             required
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Description</label>
//                         <textarea
//                             name="description"
//                             value={form.description ?? ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             rows={3}
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Image URL</label>
//                         <input
//                             type="text"
//                             name="image"
//                             value={form.image ?? ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default EditProductModal;


// import React, { useEffect, useRef, useState } from 'react';
// import { useForm } from '@inertiajs/react';
// import ReusableModal from '@/components/Modal/modal';
// import { Product } from '@/components/Types/types';

// interface EditProductModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     initialData: Product;
// }

// const generateSlug = (text: string): string =>
//     text
//         .toLowerCase()
//         .trim()
//         .replace(/[^\w\s-]/g, '')
//         .replace(/\s+/g, '-')
//         .replace(/-+/g, '-');

// const EditProductModal: React.FC<EditProductModalProps> = ({
//     isOpen,
//     onClose,
//     initialData,
// }) => {
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

//     const {
//         data,
//         setData,
//         post,
//         processing,
//         reset,
//         errors,
//         clearErrors,
//     } = useForm({
//         name: initialData.name,
//         slug: initialData.slug ?? '',
//         price: initialData.price,
//         description: initialData.description ?? '',
//         image: null as File | null,
//     });

//     useEffect(() => {
//         if (isOpen) {
//             setData({
//                 name: initialData.name,
//                 slug: initialData.slug ?? '',
//                 price: initialData.price,
//                 description: initialData.description ?? '',
//                 image: null,
//             });
//             setIsSlugManuallyEdited(false);
//             clearErrors();
//         }
//     }, [isOpen, initialData]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;

//         if (name === 'name') {
//             setData('name', value);
//             if (!isSlugManuallyEdited) {
//                 setData('slug', generateSlug(value));
//             }
//         } else if (name === 'slug') {
//             setData('slug', value);
//             setIsSlugManuallyEdited(true);
//         } else if (name === 'price') {
//             setData('price', parseFloat(value));
//         } else {
//             setData(name as keyof typeof data, value);
//         }
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             setData('image', e.target.files[0]);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('name', data.name);
//         formData.append('slug', data.slug);
//         formData.append('price', data.price.toString());
//         formData.append('description', data.description);
//         if (data.image) {
//             formData.append('image', data.image);
//         }
//         formData.append('_method', 'PUT'); // Untuk spoofing PUT method

//         post(`/products/${initialData.id}`, {
//             data: formData,
//             forceFormData: true,
//             onSuccess: () => {
//                 onClose();
//                 reset();
//             },
//         });
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Edit Product"
//             onSubmit={handleSubmit}
//             isSubmitting={processing}
//             submitLabel="Save"
//             cancelLabel="Cancel"
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {Object.values(errors).length > 0 && (
//                     <div className="text-red-500 mb-4">
//                         {Object.values(errors).map((error, i) => (
//                             <div key={i}>{error}</div>
//                         ))}
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block font-semibold">Name *</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={data.name}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-semibold">Slug *</label>
//                         <input
//                             type="text"
//                             name="slug"
//                             value={data.slug}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-semibold">Price *</label>
//                         <input
//                             type="number"
//                             name="price"
//                             value={data.price}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Description</label>
//                         <textarea
//                             name="description"
//                             value={data.description}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             rows={3}
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Image</label>
//                         <input
//                             type="file"
//                             name="image"
//                             accept="image/*"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                         {initialData.image && (
//                             <div className="mt-2">
//                                 <p className="text-sm text-gray-600">Gambar saat ini:</p>
//                                 <img src={initialData.image} alt="Current" className="h-24 mt-1" />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default EditProductModal;


// import React, { useEffect, useRef, useState } from 'react';
// import { useForm } from '@inertiajs/react';
// import ReusableModal from '@/components/Modal/modal';
// import { Product } from '@/components/Types/types';

// interface EditProductModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     initialData: Product;
// }

// const generateSlug = (text: string): string =>
//     text
//         .toLowerCase()
//         .trim()
//         .replace(/[^\w\s-]/g, '')
//         .replace(/\s+/g, '-')
//         .replace(/-+/g, '-');

// const EditProductModal: React.FC<EditProductModalProps> = ({
//     isOpen,
//     onClose,
//     initialData,
// }) => {
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

//     const {
//         data,
//         setData,
//         post,
//         processing,
//         reset,
//         errors,
//         clearErrors,
//     } = useForm({
//         name: initialData.name,
//         slug: initialData.slug ?? '',
//         price: initialData.price,
//         description: initialData.description ?? '',
//         image: null as File | null,
//     });

//     useEffect(() => {
//         if (isOpen) {
//             setData({
//                 name: initialData.name,
//                 slug: initialData.slug ?? '',
//                 price: initialData.price,
//                 description: initialData.description ?? '',
//                 image: null,
//             });
//             setIsSlugManuallyEdited(false);
//             clearErrors();
//         }
//     }, [isOpen, initialData]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;

//         if (name === 'name') {
//             setData('name', value);
//             if (!isSlugManuallyEdited) {
//                 setData('slug', generateSlug(value));
//             }
//         } else if (name === 'slug') {
//             setData('slug', value);
//             setIsSlugManuallyEdited(true);
//         } else if (name === 'price') {
//             setData('price', parseFloat(value));
//         } else {
//             setData(name as keyof typeof data, value);
//         }
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             setData('image', e.target.files[0]);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('name', data.name);
//         formData.append('slug', data.slug);
//         formData.append('price', data.price.toString());
//         formData.append('description', data.description);
//         if (data.image) {
//             formData.append('image', data.image);
//         }
//         formData.append('_method', 'PUT'); // Spoofing PUT method

//         post(`/products/${initialData.id}`, {
//             data: formData,
//             forceFormData: true,
//             onSuccess: () => {
//                 onClose();
//                 reset();
//             },
//         });
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Edit Produk"
//             onSubmit={handleSubmit}
//             isSubmitting={processing}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {Object.keys(errors).length > 0 && (
//                     <div className="text-red-500 mb-4">
//                         {Object.values(errors).map((err, idx) => (
//                             <div key={idx}>{err}</div>
//                         ))}
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label htmlFor="name" className="block font-semibold">Nama *</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={data.name}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             disabled={processing}
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="slug" className="block font-semibold">Slug *</label>
//                         <input
//                             type="text"
//                             name="slug"
//                             value={data.slug}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             disabled={processing}
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="price" className="block font-semibold">Harga *</label>
//                         <input
//                             type="number"
//                             name="price"
//                             value={data.price}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             disabled={processing}
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="image" className="block font-semibold">Upload Gambar</label>
//                         <input
//                             type="file"
//                             name="image"
//                             accept="image/*"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             disabled={processing}
//                         />
//                         {initialData.image && (
//                             <div className="mt-2">
//                                 <p className="text-sm text-gray-600">Gambar saat ini:</p>
//                                 <img src={initialData.image} alt="Current" className="h-24 mt-1 rounded shadow object-contain" />
//                             </div>
//                         )}
//                     </div>

//                     <div className="md:col-span-2">
//                         <label htmlFor="description" className="block font-semibold">Deskripsi</label>
//                         <textarea
//                             name="description"
//                             value={data.description}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             rows={3}
//                             disabled={processing}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default EditProductModal;


import React, { useEffect, useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import ReusableModal from '@/components/Modal/modal';
import { Product } from '@/components/Types/types';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Product;
}

const generateSlug = (text: string): string =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const EditProductModal: React.FC<EditProductModalProps> = ({
    isOpen,
    onClose,
    initialData,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const {
        data,
        setData,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        name: initialData.name,
        slug: initialData.slug ?? '',
        price: initialData.price,
        description: initialData.description ?? '',
        image: null as File | null,
    });

    useEffect(() => {
        if (isOpen) {
            setData({
                name: initialData.name,
                slug: initialData.slug ?? '',
                price: initialData.price,
                description: initialData.description ?? '',
                image: null,
            });
            setIsSlugManuallyEdited(false);
            clearErrors();
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'name') {
            setData('name', value);
            if (!isSlugManuallyEdited) {
                setData('slug', generateSlug(value));
            }
        } else if (name === 'slug') {
            setData('slug', value);
            setIsSlugManuallyEdited(true);
        } else if (name === 'price') {
            setData('price', parseFloat(value));
        } else {
            setData(name as keyof typeof data, value);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData('image', e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('slug', data.slug);
        formData.append('price', data.price.toString());
        formData.append('description', data.description ?? '');
        if (data.image) {
            formData.append('image', data.image);
        }

        // Spoofing method PUT agar diterima Laravel
        formData.append('_method', 'PUT');

        router.post(`/products/${initialData.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Produk"
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitLabel="Simpan"
            cancelLabel="Batal"
        >
            <div className="max-h-[80vh] overflow-y-auto pr-2">
                {Object.keys(errors).length > 0 && (
                    <div className="text-red-500 mb-4">
                        {Object.values(errors).map((err, idx) => (
                            <div key={idx}>{err}</div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold">Nama *</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={processing}
                        />
                    </div>

                    <div>
                        <label htmlFor="slug" className="block font-semibold">Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={data.slug}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={processing}
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block font-semibold">Harga *</label>
                        <input
                            type="number"
                            name="price"
                            value={data.price}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={processing}
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block font-semibold">Upload Gambar</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={processing}
                        />
                        {initialData.image && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">Gambar saat ini:</p>
                                <img
                                    src={initialData.image}
                                    alt="Current"
                                    className="h-24 mt-1 rounded shadow object-contain"
                                />
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block font-semibold">Deskripsi</label>
                        <textarea
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={3}
                            disabled={processing}
                        />
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default EditProductModal;
