// // resources/js/Pages/Products/addproduct.tsx
// import React, { useEffect, useState } from 'react';
// import ReusableModal from '@/components/Modal/modal';
// import { ProductData } from '@/components/Types/types';

// interface AddProductModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     // Changed onSave to expect FormData, as the POST request will be made in ProductsIndex
//     onSave: (data: FormData) => Promise<void>; // Expects a FormData object
//     isSubmitting: boolean; // Add this prop to control the submit button
// }

// type FormState = {
//     name: string;
//     slug: string;
//     price: number | null;
//     description: string | null;
//     image: string | null; // This will hold the file name, not the actual file data
// };

// const generateSlug = (text: string): string =>
//     text
//         .toLowerCase()
//         .trim()
//         .replace(/[^\w\s-]/g, '')
//         .replace(/\s+/g, '-')
//         .replace(/-+/g, '-');

// const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave, isSubmitting }) => {
//     const [form, setForm] = useState<FormState>({
//         name: '',
//         slug: '',
//         price: null,
//         description: null,
//         image: null,
//     });

//     const [fileInput, setFileInput] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [slugEdited, setSlugEdited] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     // Removed isSubmitting from here as it's now controlled by the parent

//     useEffect(() => {
//         if (isOpen) {
//             setForm({ name: '', slug: '', price: null, description: null, image: null });
//             setFileInput(null);
//             setImagePreview(null);
//             setSlugEdited(false);
//             setError(null);
//             // setIsSubmitting(false); // Removed
//         }
//     }, [isOpen]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value, type } = e.target;

//         setForm(prev => {
//             const newForm = {
//                 ...prev,
//                 [name]: value === '' ? null : (type === 'number' ? Number(value) : value),
//             };

//             if (name === 'name' && !slugEdited) {
//                 newForm.slug = generateSlug(value);
//             }

//             if (name === 'slug') setSlugEdited(true);
//             return newForm;
//         });
//     };

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setFileInput(file);
//         setForm(prev => ({ ...prev, image: file.name }));
//         setImagePreview(URL.createObjectURL(file));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);

//         if (!form.name || !form.slug || form.price === null) {
//             setError('Nama, slug, dan harga wajib diisi.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('name', form.name);
//         formData.append('slug', form.slug);
//         formData.append('price', form.price.toString());
//         if (form.description) formData.append('description', form.description);
//         if (fileInput) {
//             formData.append('image', fileInput);
//         }


//         try {
//             await onSave(formData); // Call the onSave prop with FormData
//             // onSave will handle the actual API call and closing the modal on success
//         } catch (err: any) {
//             // Error handling from the parent component's onSave
//             setError(err.message || 'Terjadi kesalahan saat menyimpan produk.');
//         }
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Tambah Produk Baru"
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting} // Pass the prop here
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {error && <div className="text-red-500 mb-4">{error}</div>}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label htmlFor="name" className="block font-semibold">Nama *</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             required
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="slug" className="block font-semibold">Slug *</label>
//                         <input
//                             type="text"
//                             id="slug"
//                             name="slug"
//                             value={form.slug}
//                             onChange={handleChange}
//                             required
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="price" className="block font-semibold">Harga *</label>
//                         <input
//                             type="number"
//                             id="price"
//                             name="price"
//                             value={form.price ?? ''}
//                             onChange={handleChange}
//                             required
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="image" className="block font-semibold">Upload Gambar</label>
//                         <input
//                             type="file"
//                             id="image"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             disabled={isSubmitting}
//                         />
//                         {imagePreview && (
//                             <img
//                                 src={imagePreview}
//                                 alt="Preview"
//                                 className="mt-2 rounded shadow max-h-48 object-contain"
//                             />
//                         )}
//                     </div>

//                     <div className="md:col-span-2">
//                         <label htmlFor="description" className="block font-semibold">Deskripsi</label>
//                         <textarea
//                             id="description"
//                             name="description"
//                             value={form.description ?? ''}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             rows={3}
//                             disabled={isSubmitting}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default AddProductModal;


// resources/js/Pages/Products/addproduct.tsx
import React, { useEffect, useState } from 'react';
import ReusableModal from '@/components/Modal/modal';
import { useForm } from '@inertiajs/react';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FormData) => Promise<void>; // Still used from parent
    isSubmitting: boolean;
}

const generateSlug = (text: string): string =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const AddProductModal: React.FC<AddProductModalProps> = ({
    isOpen,
    onClose,
    onSave,
    isSubmitting,
}) => {
    const { data, setData, reset, errors } = useForm<{
        name: string;
        slug: string;
        price: number | null;
        description: string | null;
        image: File | null;
    }>({
        name: '',
        slug: '',
        price: null,
        description: null,
        image: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [slugEdited, setSlugEdited] = useState(false);

    useEffect(() => {
        if (isOpen) {
            reset();
            setImagePreview(null);
            setSlugEdited(false);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let val: any = value === '' ? null : value;
        if (type === 'number') val = Number(value);

        setData(name as keyof typeof data, val);

        if (name === 'name' && !slugEdited) {
            const generatedSlug = generateSlug(value);
            setData('slug', generatedSlug);
        }

        if (name === 'slug') {
            setSlugEdited(true);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('image', file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('slug', data.slug);
        formData.append('price', String(data.price));
        if (data.description) formData.append('description', data.description);
        if (data.image) formData.append('image', data.image);

        await onSave(formData); // actual post still handled in parent
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Produk Baru"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Simpan"
            cancelLabel="Batal"
        >
            <div className="max-h-[80vh] overflow-y-auto pr-2">
                {/* Validation error alert */}
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
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="slug" className="block font-semibold">Slug *</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={data.slug}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block font-semibold">Harga *</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={data.price ?? ''}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block font-semibold">Upload Gambar</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={isSubmitting}
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-2 rounded shadow max-h-48 object-contain"
                            />
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block font-semibold">Deskripsi</label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description ?? ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={3}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default AddProductModal;
