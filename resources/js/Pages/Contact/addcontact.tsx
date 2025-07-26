// import React, { useEffect, useState } from 'react';
// import ReusableModal from '@/components/Modal/modal';
// import { ContactData, Sector } from '@/components/Types/types';
// import Select from 'react-select';

// interface AddContactModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (data: ContactData) => Promise<void>;
// }

// type FormState = {
//     name: string;
//     email: string | null;
//     company_name: string | null;
//     phone: string | null;
//     social_media: string | null;
//     sector_id: string | null;
//     address: string | null;
// };

// const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onSave }) => {
//     const [form, setForm] = useState<FormState>({
//         name: '',
//         email: '',
//         company_name: '',
//         phone: '',
//         social_media: '',
//         sector_id: null,
//         address: '',
//     });

//     const [sectors, setSectors] = useState<Sector[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//     useEffect(() => {
//         if (isOpen) {
//             setForm({
//                 name: '', email: '', company_name: '', phone: '', social_media: '', sector_id: null, address: ''
//             });
//             setError(null);
//             setIsSubmitting(false);

//             fetch('/sectors')
//                 .then(res => res.json())
//                 .then(data => setSectors(data))
//                 .catch(() => setError('Failed to fetch sector data.'));
//         }
//     }, [isOpen]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setForm(prev => ({
//             ...prev,
//             [name]: value === '' ? null : value
//         }));
//     };

//     const handleSelectChange = (selected: any) => {
//         setForm(prev => ({ ...prev, sector_id: selected?.value ?? null }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         if (!form.name) {
//             setError('Name is required.');
//             setIsSubmitting(false);
//             return;
//         }

//         if (!form.sector_id) {
//             setError('Sector is required.');
//             setIsSubmitting(false);
//             return;
//         }

//         const dataToSend: ContactData = {
//             name: form.name,
//             email: form.email,
//             company_name: form.company_name,
//             phone: form.phone,
//             social_media: form.social_media,
//             sector_id: form.sector_id,
//             address: form.address,
//         };

//         try {
//             await onSave(dataToSend);
//             onClose();
//         } catch (saveError: any) {
//             if (saveError.message) {
//                 setError(saveError.message);
//             } else {
//                 setError('Failed to save contact. Please try again.');
//             }
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Add New Contact"
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//             submitLabel="Save"
//             cancelLabel="Cancel"
//             wide // custom prop untuk buat modal lebar (lihat di bawah)
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {error && <div className="text-red-500 mb-4">{error}</div>}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="block font-semibold">Name *</label>
//                         <input
//                             name="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-semibold">Email</label>
//                         <input
//                             name="email"
//                             type="email"
//                             value={form.email ?? ''}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-semibold">Company</label>
//                         <input
//                             name="company_name"
//                             value={form.company_name ?? ''}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-semibold">Phone</label>
//                         <input
//                             name="phone"
//                             type="tel"
//                             value={form.phone ?? ''}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                         />
//                     </div>
//                     <div className="col-span-2">
//                         <label className="block font-semibold">Social Media</label>
//                         <input
//                             name="social_media"
//                             type="url"
//                             value={form.social_media ?? ''}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                             placeholder="e.g., https://linkedin.com/in/username"
//                         />
//                     </div>
//                     <div className="col-span-2">
//                         <label className="block font-semibold">Sector *</label>
//                         <Select
//                             options={sectors.map(sector => ({
//                                 value: sector.id,
//                                 label: sector.name
//                             }))}
//                             onChange={handleSelectChange}
//                             value={form.sector_id
//                                 ? { value: form.sector_id, label: sectors.find(s => s.id === form.sector_id)?.name || '' }
//                                 : null}
//                             placeholder="Select Sector"
//                             isClearable
//                             menuShouldScrollIntoView={false}
//                             menuPosition="fixed"
//                             menuPlacement="auto"
//                             className="text-sm"
//                             styles={{
//                                 control: base => ({ ...base, minHeight: '34px' }),
//                                 dropdownIndicator: base => ({ ...base, padding: 4 }),
//                                 clearIndicator: base => ({ ...base, padding: 4 }),
//                             }}
//                         />
//                     </div>
//                     <div className="col-span-2">
//                         <label className="block font-semibold">Address</label>
//                         <textarea
//                             name="address"
//                             value={form.address ?? ''}
//                             onChange={handleChange}
//                             rows={2}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default AddContactModal;


// import React, { useEffect, useState } from 'react';
// import ReusableModal from '@/components/Modal/modal';
// import { Sector } from '@/components/Types/types';
// import Select from 'react-select';
// import { useForm } from '@inertiajs/react';

// interface AddContactModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave?: () => void; // Optional if you use useForm directly
// }

// const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose }) => {
//     const { data, setData, post, reset, processing, errors, clearErrors } = useForm({
//         name: '',
//         email: '',
//         company_name: '',
//         phone: '',
//         social_media: '',
//         sector_id: '',
//         address: '',
//     });

//     const [sectors, setSectors] = useState<Sector[]>([]);
//     const [loadingSectors, setLoadingSectors] = useState(false);

//     useEffect(() => {
//         if (isOpen) {
//             reset();
//             clearErrors();
//             setLoadingSectors(true);
//             fetch('/sectors')
//                 .then(res => res.json())
//                 .then(data => setSectors(data))
//                 .catch(() => { })
//                 .finally(() => setLoadingSectors(false));
//         }
//     }, [isOpen]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setData(name as keyof typeof data, value);
//     };

//     const handleSelectChange = (selected: any) => {
//         setData('sector_id', selected?.value ?? '');
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         post('/contacts', {
//             preserveScroll: true,
//             onSuccess: () => {
//                 onClose();
//             },
//         });
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Add New Contact"
//             onSubmit={handleSubmit}
//             isSubmitting={processing}
//             submitLabel="Save"
//             cancelLabel="Cancel"
//             wide
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {Object.values(errors).length > 0 && (
//                     <div className="text-red-500 mb-4">
//                         {Object.values(errors).map((err, i) => (
//                             <div key={i}>{err}</div>
//                         ))}
//                     </div>
//                 )}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="block font-semibold">Name *</label>
//                         <input
//                             name="name"
//                             value={data.name}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-semibold">Email</label>
//                         <input
//                             name="email"
//                             type="email"
//                             value={data.email}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-semibold">Company</label>
//                         <input
//                             name="company_name"
//                             value={data.company_name}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-semibold">Phone</label>
//                         <input
//                             name="phone"
//                             type="tel"
//                             value={data.phone}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                         />
//                     </div>
//                     <div className="col-span-2">
//                         <label className="block font-semibold">Social Media</label>
//                         <input
//                             name="social_media"
//                             type="url"
//                             value={data.social_media}
//                             onChange={handleChange}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                             placeholder="e.g., https://linkedin.com/in/username"
//                         />
//                     </div>
//                     <div className="col-span-2">
//                         <label className="block font-semibold">Sector *</label>
//                         <Select
//                             options={sectors.map(sector => ({
//                                 value: sector.id,
//                                 label: sector.name
//                             }))}
//                             onChange={handleSelectChange}
//                             value={data.sector_id
//                                 ? { value: data.sector_id, label: sectors.find(s => s.id === data.sector_id)?.name || '' }
//                                 : null}
//                             placeholder="Select Sector"
//                             isClearable
//                             isDisabled={loadingSectors}
//                             menuShouldScrollIntoView={false}
//                             menuPosition="fixed"
//                             menuPlacement="auto"
//                             className="text-sm"
//                             styles={{
//                                 control: base => ({ ...base, minHeight: '34px' }),
//                                 dropdownIndicator: base => ({ ...base, padding: 4 }),
//                                 clearIndicator: base => ({ ...base, padding: 4 }),
//                             }}
//                         />
//                     </div>
//                     <div className="col-span-2">
//                         <label className="block font-semibold">Address</label>
//                         <textarea
//                             name="address"
//                             value={data.address}
//                             onChange={handleChange}
//                             rows={2}
//                             className="w-full border px-3 py-1 text-sm rounded"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default AddContactModal;


// import React, { useEffect } from 'react';
// import ReusableModal from '@/components/Modal/modal';
// import { Sector } from '@/components/Types/types';
// import Select from 'react-select';
// import { useForm } from '@inertiajs/react';

// interface AddContactModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     sectors: Sector[]; // Sektor diterima dari props
// }

// const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, sectors }) => {
//     const { data, setData, post, reset, processing, errors, clearErrors } = useForm({
//         name: '',
//         email: '',
//         company_name: '',
//         phone: '',
//         social_media: '',
//         sector_id: '',
//         address: '',
//     });

//     useEffect(() => {
//         if (isOpen) {
//             reset();
//             clearErrors();
//         }
//     }, [isOpen]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setData(name as keyof typeof data, value);
//     };

//     const handleSelectChange = (selected: any) => {
//         setData('sector_id', selected?.value ?? '');
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         post('/contacts', {
//             preserveScroll: true,
//             onSuccess: () => {
//                 onClose();
//             },
//         });
//     };

//     const selectedSector = sectors.find(s => String(s.id) === String(data.sector_id));

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Tambah Kontak Baru"
//             onSubmit={handleSubmit}
//             isSubmitting={processing}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//             wide
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {Object.values(errors).length > 0 && (
//                     <div className="text-red-500 mb-4">
//                         {Object.values(errors).map((err, i) => (
//                             <div key={i}>{err}</div>
//                         ))}
//                     </div>
//                 )}
//                 <div className="grid grid-cols-2 gap-4">
//                     <input name="name" value={data.name} onChange={handleChange} placeholder="Nama" className="border p-2 rounded" required />
//                     <input name="email" value={data.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
//                     <input name="company_name" value={data.company_name} onChange={handleChange} placeholder="Perusahaan" className="border p-2 rounded" />
//                     <input name="phone" value={data.phone} onChange={handleChange} placeholder="Telepon" className="border p-2 rounded" />
//                     <input name="social_media" value={data.social_media} onChange={handleChange} placeholder="Sosial Media" className="border p-2 rounded col-span-2" />
//                     <Select
//                         options={sectors.map(sector => ({ value: sector.id, label: sector.name }))}
//                         value={selectedSector ? { value: selectedSector.id, label: selectedSector.name } : null}
//                         onChange={handleSelectChange}
//                         placeholder="Pilih sektor"
//                         isClearable
//                         className="col-span-2"
//                         styles={{
//                             control: base => ({ ...base, minHeight: '34px' }),
//                         }}
//                     />
//                     <textarea name="address" value={data.address} onChange={handleChange} placeholder="Alamat" rows={2} className="border p-2 rounded col-span-2" />
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default AddContactModal;

import React, { useEffect } from 'react';
import ReusableModal from '@/components/Modal/modal';
import { Sector } from '@/components/Types/types';
import Select from 'react-select';
import { useForm } from '@inertiajs/react';

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectors: Sector[]; // Sektor diterima dari props
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, sectors }) => {
    const { data, setData, post, reset, processing, errors, clearErrors } = useForm({
        name: '',
        email: '',
        company_name: '',
        phone: '',
        social_media: '',
        sector_id: '',
        address: '',
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    const handleSelectChange = (selected: any) => {
        setData('sector_id', selected?.value ?? '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contacts', {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const selectedSector = sectors.find(s => String(s.id) === String(data.sector_id));

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Kontak Baru"
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitLabel="Simpan"
            cancelLabel="Batal"
            wide
        >
            <div className="max-h-[80vh] overflow-y-auto pr-2">
                {Object.values(errors).length > 0 && (
                    <div className="text-red-500 mb-4">
                        {Object.values(errors).map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <input
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Nama"
                        className="border p-2 rounded"
                    />
                    <input
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="border p-2 rounded"
                    />
                    <input
                        name="company_name"
                        value={data.company_name}
                        onChange={handleChange}
                        placeholder="Perusahaan"
                        className="border p-2 rounded"
                    />
                    <input
                        name="phone"
                        value={data.phone}
                        onChange={handleChange}
                        placeholder="Telepon"
                        className="border p-2 rounded"
                    />
                    <input
                        name="social_media"
                        value={data.social_media}
                        onChange={handleChange}
                        placeholder="Sosial Media"
                        className="border p-2 rounded col-span-2"
                    />
                    <Select
                        options={sectors.map(sector => ({ value: sector.id, label: sector.name }))}
                        value={selectedSector ? { value: selectedSector.id, label: selectedSector.name } : null}
                        onChange={handleSelectChange}
                        placeholder="Pilih sektor"
                        isClearable
                        className="col-span-2 z-50"
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                        menuPosition="fixed"
                        styles={{
                            control: base => ({ ...base, minHeight: '34px' }),
                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                        }}
                    />
                    <textarea
                        name="address"
                        value={data.address}
                        onChange={handleChange}
                        placeholder="Alamat"
                        rows={2}
                        className="border p-2 rounded col-span-2"
                    />
                </div>
            </div>
        </ReusableModal>
    );
};

export default AddContactModal;
