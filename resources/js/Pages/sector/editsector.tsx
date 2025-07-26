// import React, { useEffect, useState } from 'react';
// import ReusableModal from '@/components/Modal/modal';
// import { Sector as SectorType } from '@/components/Types/types'; // Using 'Sector' for existing data, 'SectorData' for payload

// interface EditSectorModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave?: (data: SectorType) => Promise<void>; // Prop to call after successful save
//     initialData: SectorType; // Expects a full SectorType object
// }

// const EditSectorModal: React.FC<EditSectorModalProps> = ({
//     isOpen,
//     onClose,
//     onSave,
//     initialData,
// }) => {
//     // Initialize form state with initialData, ensuring nulls are handled for inputs
//     const [form, setForm] = useState<Omit<SectorType, 'created_at' | 'updated_at' | 'deleted_at'>>({
//         id: initialData.id,
//         name: initialData.name,
//         bg_color: initialData.bg_color ?? '', // Ensure empty string for input if null
//         text_color: initialData.text_color ?? '', // Ensure empty string for input if null
//     });

//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//     useEffect(() => {
//         if (isOpen) {
//             // Reset form and error state when modal opens, using initialData
//             setForm({
//                 id: initialData.id,
//                 name: initialData.name,
//                 bg_color: initialData.bg_color ?? '',
//                 text_color: initialData.text_color ?? '',
//             });
//             setError(null);
//             setIsSubmitting(false);
//         }
//     }, [isOpen, initialData]); // Depend on initialData to reset when a new sector is selected for edit

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // No select for sectors
//     ) => {
//         const { name, value } = e.target;
//         setForm(prev => ({
//             ...prev,
//             [name]: value === '' ? null : value, // Treat empty string as null
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError(null);

//         // Basic form validation for name
//         if (!form.name || form.name.trim() === '') {
//             setError('Nama sektor wajib diisi.');
//             setIsSubmitting(false);
//             return;
//         }

//         // Ensure ID exists for the PUT request
//         if (!initialData.id) {
//             setError('Data sektor tidak valid (ID tidak tersedia).');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             // Construct payload with only mutable fields, plus updated_at
//             const payload = {
//                 name: form.name,
//                 bg_color: form.bg_color || undefined, // Send undefined if empty to allow backend default
//                 text_color: form.text_color || undefined, // Send undefined if empty to allow backend default
//                 updated_at: new Date().toISOString(), // Update updated_at timestamp
//             };

//             const response = await fetch(`/sectors/${initialData.id}`, {
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
//                 console.error("Server error:", errData);
//                 throw new Error(errData.message || 'Gagal menyimpan perubahan.');
//             }

//             const { sector: savedData } = await response.json(); // Assuming your API returns { sector: updatedSectorData }

//             // Call the onSave prop, which will trigger data re-fetching in SectorsIndex
//             if (onSave) await onSave(savedData);
//             onClose(); // Close the modal
//         } catch (err: any) {
//             console.error("Error saving sector:", err);
//             setError(err.message || 'Gagal menyimpan perubahan.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Edit Sektor"
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {error && <div className="text-red-500 mb-4">{error}</div>}

//                 <div className="grid grid-cols-1 gap-4"> {/* Simplified grid */}
//                     {/* Nama Sektor */}
//                     <div>
//                         <label htmlFor="name" className="block font-semibold">Nama Sektor *</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={form.name ?? ''}
//                             onChange={handleChange}
//                             required
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     {/* Warna Background */}
//                     <div>
//                         <label htmlFor="bg_color" className="block font-semibold">Warna Background (Tailwind Class)</label>
//                         <input
//                             type="text"
//                             id="bg_color"
//                             name="bg_color"
//                             value={form.bg_color ?? ''}
//                             onChange={handleChange}
//                             placeholder="Contoh: bg-blue-600"
//                             className="w-full border rounded px-3 py-2"
//                         />
//                         <p className="text-sm text-gray-500 mt-1">
//                             Biarkan kosong untuk warna otomatis.
//                         </p>
//                     </div>

//                     {/* Warna Teks */}
//                     <div>
//                         <label htmlFor="text_color" className="block font-semibold">Warna Teks (Tailwind Class)</label>
//                         <input
//                             type="text"
//                             id="text_color"
//                             name="text_color"
//                             value={form.text_color ?? ''}
//                             onChange={handleChange}
//                             placeholder="Contoh: text-white"
//                             className="w-full border rounded px-3 py-2"
//                         />
//                         <p className="text-sm text-gray-500 mt-1">
//                             Biarkan kosong untuk warna otomatis.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default EditSectorModal;


// import React, { useEffect } from 'react';
// import { useForm } from '@inertiajs/react';
// import ReusableModal from '@/components/Modal/modal';
// import { Sector as SectorType } from '@/components/Types/types';
// import Swal from 'sweetalert2';

// interface EditSectorModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     initialData: SectorType;
// }

// const EditSectorModal: React.FC<EditSectorModalProps> = ({
//     isOpen,
//     onClose,
//     initialData,
// }) => {
//     const {
//         data,
//         setData,
//         put,
//         processing,
//         errors,
//         reset,
//     } = useForm({
//         name: initialData.name || '',
//         bg_color: initialData.bg_color || '',
//         text_color: initialData.text_color || '',
//     });

//     // Reset data setiap kali modal dibuka
//     useEffect(() => {
//         if (isOpen && initialData) {
//             setData({
//                 name: initialData.name || '',
//                 bg_color: initialData.bg_color || '',
//                 text_color: initialData.text_color || '',
//             });
//         }
//     }, [isOpen, initialData]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setData(name as keyof typeof data, value);
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         put(`/sectors/${initialData.id}`, {
//             onSuccess: () => {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Sektor berhasil diperbaharui',
//                     timer: 2000,
//                     showConfirmButton: false
//                 });
//                 reset();
//                 onClose();
//             },
//             onError: (errors) => {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Gagal memperbaharui sektor',
//                     text: Object.values(errors).join(', ')
//                 });
//             }
//         });
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Edit Sektor"
//             onSubmit={handleSubmit}
//             isSubmitting={processing}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 <div className="grid grid-cols-1 gap-4">
//                     {/* Nama Sektor */}
//                     <div>
//                         <label htmlFor="name" className="block font-semibold">Nama Sektor *</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={data.name}
//                             onChange={handleChange}
//                             required
//                             className="w-full border rounded px-3 py-2"
//                         />
//                         {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//                     </div>

//                     {/* Warna Background */}
//                     <div>
//                         <label htmlFor="bg_color" className="block font-semibold">Warna Background</label>
//                         <input
//                             type="text"
//                             id="bg_color"
//                             name="bg_color"
//                             value={data.bg_color}
//                             onChange={handleChange}
//                             placeholder="Contoh: bg-blue-600"
//                             className="w-full border rounded px-3 py-2"
//                         />
//                         {errors.bg_color && <p className="text-red-500 text-sm mt-1">{errors.bg_color}</p>}
//                     </div>

//                     {/* Warna Teks */}
//                     <div>
//                         <label htmlFor="text_color" className="block font-semibold">Warna Teks</label>
//                         <input
//                             type="text"
//                             id="text_color"
//                             name="text_color"
//                             value={data.text_color}
//                             onChange={handleChange}
//                             placeholder="Contoh: text-white"
//                             className="w-full border rounded px-3 py-2"
//                         />
//                         {errors.text_color && <p className="text-red-500 text-sm mt-1">{errors.text_color}</p>}
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default EditSectorModal;


import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import ReusableModal from '@/components/Modal/modal';
import { Sector as SectorType } from '@/components/Types/types';
import Swal from 'sweetalert2';

interface EditSectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: SectorType;
}

// Preset warna sama seperti di model
const bgColorOptions = [
    { label: 'Biru', value: '#1D4ED8' },
    { label: 'Hijau', value: '#16A34A' },
    { label: 'Kuning', value: '#FACC15' },
    { label: 'Merah', value: '#DC2626' },
    { label: 'Ungu', value: '#7C3AED' },
    { label: 'Custom', value: 'custom' },
];

const textColorOptions = [
    { label: 'Putih', value: '#FFFFFF' },
    { label: 'Hitam', value: '#000000' },
    { label: 'Custom', value: 'custom' },
];

const EditSectorModal: React.FC<EditSectorModalProps> = ({
    isOpen,
    onClose,
    initialData,
}) => {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        bg_color: '',
        text_color: '',
    });

    const [isCustomBg, setIsCustomBg] = useState(false);
    const [isCustomText, setIsCustomText] = useState(false);

    // Reset saat modal dibuka
    useEffect(() => {
        if (isOpen && initialData) {
            setData({
                name: initialData.name || '',
                bg_color: initialData.bg_color || '',
                text_color: initialData.text_color || '',
            });

            // Deteksi apakah isian awal bukan dari preset
            const bgPreset = bgColorOptions.map(opt => opt.value);
            const textPreset = textColorOptions.map(opt => opt.value);

            setIsCustomBg(!bgPreset.includes(initialData.bg_color));
            setIsCustomText(!textPreset.includes(initialData.text_color));
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'bg_color') {
            if (value === 'custom') {
                setIsCustomBg(true);
                setData('bg_color', '');
            } else {
                setIsCustomBg(false);
                setData('bg_color', value);
            }
        } else if (name === 'text_color') {
            if (value === 'custom') {
                setIsCustomText(true);
                setData('text_color', '');
            } else {
                setIsCustomText(false);
                setData('text_color', value);
            }
        } else {
            setData(name as keyof typeof data, value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/sectors/${initialData.id}`, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Sektor berhasil diperbarui',
                    timer: 2000,
                    showConfirmButton: false,
                });
                reset();
                onClose();
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal memperbarui sektor',
                    text: Object.values(errors).join(', '),
                });
            },
        });
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Sektor"
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitLabel="Simpan"
            cancelLabel="Batal"
        >
            <div className="max-h-[80vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 gap-4">
                    {/* Nama Sektor */}
                    <div>
                        <label htmlFor="name" className="block font-semibold">
                            Nama Sektor *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Warna Background */}
                    <div>
                        <label className="block font-semibold">Warna Background</label>
                        <select
                            name="bg_color"
                            value={isCustomBg ? 'custom' : data.bg_color}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">Pilih Warna...</option>
                            {bgColorOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {isCustomBg && (
                            <input
                                type="text"
                                name="bg_color"
                                placeholder="Contoh: #FF00FF"
                                value={data.bg_color}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded px-3 py-2"
                            />
                        )}

                        {!isCustomBg && data.bg_color && (
                            <div
                                className="w-10 h-5 mt-2 rounded border"
                                style={{ backgroundColor: data.bg_color }}
                            />
                        )}

                        {errors.bg_color && (
                            <p className="text-red-500 text-sm mt-1">{errors.bg_color}</p>
                        )}
                    </div>

                    {/* Warna Teks */}
                    <div>
                        <label className="block font-semibold">Warna Teks</label>
                        <select
                            name="text_color"
                            value={isCustomText ? 'custom' : data.text_color}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">Pilih Warna...</option>
                            {textColorOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {isCustomText && (
                            <input
                                type="text"
                                name="text_color"
                                placeholder="Contoh: #FFFFFF"
                                value={data.text_color}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded px-3 py-2"
                            />
                        )}

                        {!isCustomText && data.text_color && (
                            <p
                                className="text-sm mt-2 font-semibold"
                                style={{ color: data.text_color }}
                            >
                                Contoh teks
                            </p>
                        )}

                        {errors.text_color && (
                            <p className="text-red-500 text-sm mt-1">{errors.text_color}</p>
                        )}
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default EditSectorModal;
