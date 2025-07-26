// import React, { useEffect, useState } from 'react';
// import ReusableModal from '@/components/Modal/modal';
// import { SectorData } from '@/components/Types/types';

// interface AddSectorModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (data: SectorData) => Promise<void>;
// }

// type FormState = {
//     name: string | null;
//     bg_color: string | null;
//     text_color: string | null;
// };

// const AddSectorModal: React.FC<AddSectorModalProps> = ({ isOpen, onClose, onSave }) => {
//     const [form, setForm] = useState<FormState>({
//         name: '',
//         bg_color: '',
//         text_color: '',
//     });

//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//     useEffect(() => {
//         if (isOpen) {
//             setForm({ // Reset form when modal opens
//                 name: '', bg_color: '', text_color: '',
//             });
//             setError(null); // Clear previous errors
//             setIsSubmitting(false); // Reset submitting state
//         }
//     }, [isOpen]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setForm(prev => ({
//             ...prev,
//             [name]: value === '' ? null : value,
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError(null); // Clear previous errors on new submission attempt

//         if (!form.name || form.name.trim() === '') {
//             setError('Nama sektor wajib diisi.');
//             setIsSubmitting(false);
//             return;
//         }

//         const data: SectorData = {
//             name: form.name,
//             bg_color: form.bg_color || undefined,
//             text_color: form.text_color || undefined,
//         };

//         try {
//             await onSave(data);
//             // onClose will be called by the parent (SectorsIndex) upon successful save
//         } catch (saveError: any) {
//             console.error('Failed to save sector in modal:', saveError);
//             setError(saveError.message || 'Gagal menyimpan sektor. Silakan coba lagi.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Tambah Sektor Baru"
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {error && <div className="text-red-500 mb-4">{error}</div>}

//                 <div className="grid grid-cols-1 gap-4">
//                     <div>
//                         <label htmlFor="name" className="block font-semibold">Nama Sektor *</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={form.name ?? ''}
//                             onChange={handleChange}
//                             required
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="bg_color" className="block font-semibold">Warna Background (Tailwind Class)</label>
//                         <input
//                             type="text"
//                             id="bg_color"
//                             name="bg_color"
//                             value={form.bg_color ?? ''}
//                             onChange={handleChange}
//                             placeholder="Contoh: bg-blue-600"
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                         />
//                         <p className="text-sm text-gray-500 mt-1">
//                             Biarkan kosong untuk warna otomatis.
//                         </p>
//                     </div>

//                     <div>
//                         <label htmlFor="text_color" className="block font-semibold">Warna Teks (Tailwind Class)</label>
//                         <input
//                             type="text"
//                             id="text_color"
//                             name="text_color"
//                             value={form.text_color ?? ''}
//                             onChange={handleChange}
//                             placeholder="Contoh: text-white"
//                             className="w-full border border-gray-300 rounded px-3 py-2"
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

// export default AddSectorModal;


// import React, { useEffect } from 'react';
// import { useForm } from '@inertiajs/react';
// import ReusableModal from '@/components/Modal/modal';
// import Swal from 'sweetalert2';

// interface AddSectorModalProps {
//     isOpen: boolean;
//     onClose: () => void;
// }

// const AddSectorModal: React.FC<AddSectorModalProps> = ({ isOpen, onClose }) => {
//     const { data, setData, post, processing, reset, errors } = useForm({
//         name: '',
//         bg_color: '',
//         text_color: '',
//     });

//     // Reset form saat modal dibuka
//     useEffect(() => {
//         if (isOpen) reset();
//     }, [isOpen]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setData(name as keyof typeof data, value);
//     };

//     // const handleSubmit = (e: React.FormEvent) => {
//     //     e.preventDefault();

//     //     post('/sectors', {
//     //         onSuccess: () => {
//     //             reset();      // reset form
//     //             onClose();    // tutup modal
//     //         },
//     //     });
//     // };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         post('/sectors', {
//             onSuccess: () => {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Sektor berhasil ditambahkan',
//                     timer: 2000,
//                     showConfirmButton: false
//                 });
//                 reset();
//                 onClose();
//             },
//             onError: (errors) => {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Gagal menambahkan sektor',
//                     text: Object.values(errors).join(', ')
//                 });
//             }
//         });
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Tambah Sektor Baru"
//             onSubmit={handleSubmit}
//             isSubmitting={processing}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 <div className="grid grid-cols-1 gap-4">
//                     <div>
//                         <label htmlFor="name" className="block font-semibold">
//                             Nama Sektor *
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             id="name"
//                             value={data.name}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                             required
//                         />
//                         {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//                     </div>

//                     <div>
//                         <label htmlFor="bg_color" className="block font-semibold">
//                             Warna Background (Tailwind Class)
//                         </label>
//                         <input
//                             type="text"
//                             name="bg_color"
//                             id="bg_color"
//                             value={data.bg_color}
//                             onChange={handleChange}
//                             placeholder="Contoh: bg-blue-600"
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                         />
//                         {errors.bg_color && <p className="text-red-500 text-sm mt-1">{errors.bg_color}</p>}
//                         <p className="text-sm text-gray-500 mt-1">Biarkan kosong untuk default warna.</p>
//                     </div>

//                     <div>
//                         <label htmlFor="text_color" className="block font-semibold">
//                             Warna Teks (Tailwind Class)
//                         </label>
//                         <input
//                             type="text"
//                             name="text_color"
//                             id="text_color"
//                             value={data.text_color}
//                             onChange={handleChange}
//                             placeholder="Contoh: text-white"
//                             className="w-full border border-gray-300 rounded px-3 py-2"
//                         />
//                         {errors.text_color && <p className="text-red-500 text-sm mt-1">{errors.text_color}</p>}
//                         <p className="text-sm text-gray-500 mt-1">Biarkan kosong untuk default warna.</p>
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default AddSectorModal;


import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import ReusableModal from '@/components/Modal/modal';
import Swal from 'sweetalert2';

interface AddSectorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Preset warna yang sama dengan model
const bgColorOptions = [
    { label: 'Biru', value: '#1D4ED8' },
    { label: 'Hijau', value: '#16A34A' },
    { label: 'Kuning', value: '#FACC15' },
    { label: 'Merah', value: '#DC2626' },
    { label: 'Ungu', value: '#7C3AED' },
    { label: 'Custom', value: 'custom' },
    { label: 'Acak (Default)', value: '' },
];

const textColorOptions = [
    { label: 'Putih', value: '#FFFFFF' },
    { label: 'Hitam', value: '#000000' },
    { label: 'Custom', value: 'custom' },
    { label: 'Acak (Default)', value: '' },
];

const AddSectorModal: React.FC<AddSectorModalProps> = ({ isOpen, onClose }) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        bg_color: '',
        text_color: '',
    });

    const [isCustomBg, setIsCustomBg] = useState(false);
    const [isCustomText, setIsCustomText] = useState(false);

    useEffect(() => {
        if (isOpen) {
            reset();
            setIsCustomBg(false);
            setIsCustomText(false);
        }
    }, [isOpen]);

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

        post('/sectors', {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Sektor berhasil ditambahkan',
                    timer: 2000,
                    showConfirmButton: false,
                });
                reset();
                onClose();
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal menambahkan sektor',
                    text: Object.values(errors).join(', '),
                });
            },
        });
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Sektor Baru"
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitLabel="Simpan"
            cancelLabel="Batal"
        >
            <div className="max-h-[80vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 gap-4">
                    {/* Nama sektor */}
                    <div>
                        <label htmlFor="name" className="block font-semibold">
                            Nama Sektor *
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={data.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Warna background */}
                    <div>
                        <label className="block font-semibold">Warna Background</label>
                        <select
                            name="bg_color"
                            value={isCustomBg ? 'custom' : data.bg_color}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Pilih Warna...</option>
                            {bgColorOptions.map((opt) => (
                                <option key={opt.label} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {isCustomBg && (
                            <input
                                type="text"
                                name="bg_color"
                                placeholder="Contoh: #FF00FF atau bg-blue-600"
                                value={data.bg_color}
                                onChange={handleChange}
                                className="w-full mt-2 border border-gray-300 rounded px-3 py-2"
                            />
                        )}

                        {!isCustomBg && data.bg_color && (
                            <div
                                className="w-10 h-5 mt-2 rounded border"
                                style={{ backgroundColor: data.bg_color }}
                            />
                        )}

                        {errors.bg_color && <p className="text-red-500 text-sm mt-1">{errors.bg_color}</p>}
                    </div>

                    {/* Warna teks */}
                    <div>
                        <label className="block font-semibold">Warna Teks</label>
                        <select
                            name="text_color"
                            value={isCustomText ? 'custom' : data.text_color}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Pilih Warna...</option>
                            {textColorOptions.map((opt) => (
                                <option key={opt.label} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        {isCustomText && (
                            <input
                                type="text"
                                name="text_color"
                                placeholder="Contoh: #FFFFFF atau text-white"
                                value={data.text_color}
                                onChange={handleChange}
                                className="w-full mt-2 border border-gray-300 rounded px-3 py-2"
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

                        {errors.text_color && <p className="text-red-500 text-sm mt-1">{errors.text_color}</p>}
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default AddSectorModal;
