// import React, { useEffect, useState } from 'react';
// import ReusableModal from '@/components/Modal/modal';
// import { Contact, Sector, ContactData } from '@/components/Types/types'; // Import ContactData as well
// import Swal from 'sweetalert2';


// interface EditContactModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave?: (updatedContact: Contact) => Promise<void>; // onSave now expects the fully updated Contact type
//     initialData: Contact; // initialData expects Contact type, which includes all fields
// }

// const EditContactModal: React.FC<EditContactModalProps> = ({
//     isOpen,
//     onClose,
//     onSave,
//     initialData,
// }) => {
//     // Initialize form state with initialData, ensuring null for optional fields if undefined
//     // We use a partial Contact type here because not all fields are editable or needed for the form.
//     // The keys below are the fields that will be managed by the form.
//     const [form, setForm] = useState<Partial<Contact>>({
//         name: initialData.name,
//         email: initialData.email ?? null,
//         company_name: initialData.company_name ?? null,
//         phone: initialData.phone ?? null,
//         social_media: initialData.social_media ?? null, // Initialize social_media
//         sector_id: initialData.sector_id ?? null, // Ensure sector_id is initialized, it's a string (UUID)
//         address: initialData.address ?? null,
//     });

//     const [sectors, setSectors] = useState<Sector[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//     useEffect(() => {
//         if (isOpen) {
//             // Reset form to initialData when modal opens
//             // Ensure all form-managed fields are correctly set from initialData
//             setForm({
//                 name: initialData.name,
//                 email: initialData.email ?? null,
//                 company_name: initialData.company_name ?? null,
//                 phone: initialData.phone ?? null,
//                 social_media: initialData.social_media ?? null, // Reset social_media
//                 sector_id: initialData.sector_id ?? null,
//                 address: initialData.address ?? null,
//             });
//             setError(null);
//             setIsSubmitting(false);

//             // Fetch sectors for the dropdown
//             const fetchDependencies = async () => {
//                 try {
//                     const sectorsRes = await fetch('/sectors');

//                     if (!sectorsRes.ok) {
//                         throw new Error('Failed to fetch sectors.');
//                     }

//                     const sectorsData: Sector[] = await sectorsRes.json();
//                     setSectors(sectorsData);
//                 } catch (err: any) {
//                     console.error("Error fetching dependencies:", err);
//                     setError(err.message || 'Failed to fetch necessary data.');
//                 }
//             };
//             fetchDependencies();
//         }
//     }, [isOpen, initialData]); // initialData as a dependency to re-initialize form when it changes

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//     ) => {
//         const { name, value } = e.target;

//         setForm(prev => ({
//             ...prev,
//             [name]: value === '' ? null : value, // Convert empty strings to null for optional fields
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError(null); // Clear previous errors

//         // Basic form validation for required fields
//         if (!form.name || form.name.trim() === '') {
//             setError('Contact name is required.');
//             setIsSubmitting(false);
//             return;
//         }

//         // Sector is now required in Laravel, so enforce it here too
//         if (!form.sector_id) {
//             setError('Sector is required.');
//             setIsSubmitting(false);
//             return;
//         }

//         if (!initialData.id) {
//             setError('Invalid contact data (ID not available for update).');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             // Construct the payload for the PUT request.
//             // This payload should match the ContactData interface, which is what your
//             // Laravel backend's `update` method is expecting.
//             const payload: ContactData = {
//                 name: form.name,
//                 email: form.email,
//                 company_name: form.company_name,
//                 phone: form.phone,
//                 social_media: form.social_media, // Include social_media in payload
//                 sector_id: form.sector_id, // This is required now
//                 address: form.address,
//             };

//             const response = await fetch(`/contacts/${initialData.id}`, {
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
//                 // Display specific validation errors if available
//                 if (response.status === 422 && errData.errors) {
//                     const errorMessages = Object.values(errData.errors).flat().join('; ');
//                     throw new Error(`Validation failed: ${errorMessages}`);
//                 }
//                 throw new Error(errData.message || 'Failed to save changes.');
//             }

//             const { contact: savedData }: { contact: Contact } = await response.json(); // Explicitly type savedData

//             if (onSave) {
//                 await onSave(savedData); // Pass the fully updated contact object
//             }

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Success!',
//                 text: 'Kontak berhasil diperbaharui.',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });

//             onClose(); // Close modal after successful save
//         } catch (err: any) {
//             console.error("Error saving contact:", err);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error!',
//                 text: err.message || 'Gagal Menyimpan Kontak.',
//             });
//             setError(err.message || 'Failed to save changes.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Edit Contact"
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//             submitLabel="Save"
//             cancelLabel="Cancel" // Changed from "Batal" to "Cancel" for consistency
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {error && <div className="text-red-500 mb-4">{error}</div>}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Contact Name */}
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

//                     {/* Company Name */}
//                     <div>
//                         <label className="block font-semibold">Company Name</label>
//                         <input
//                             type="text"
//                             name="company_name"
//                             value={form.company_name ?? ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     {/* Email */}
//                     <div>
//                         <label className="block font-semibold">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={form.email ?? ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     {/* Phone */}
//                     <div>
//                         <label className="block font-semibold">Phone</label>
//                         <input
//                             type="tel"
//                             name="phone"
//                             value={form.phone ?? ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     {/* Social Media */}
//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Social Media URL</label>
//                         <input
//                             type="url"
//                             name="social_media"
//                             value={form.social_media ?? ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             placeholder="e.g., https://linkedin.com/in/username"
//                         />
//                     </div>

//                     {/* Address */}
//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Address</label>
//                         <textarea
//                             name="address"
//                             value={form.address ?? ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             rows={2}
//                         />
//                     </div>

//                     {/* Sector */}
//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Sector *</label> {/* Added * as it's required */}
//                         <select
//                             name="sector_id"
//                             value={form.sector_id ?? ''} // Use ?? '' for select elements
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             required // Mark as required
//                         >
//                             <option value="">-- Select Sector --</option>
//                             {sectors.map(sector => (
//                                 <option key={sector.id} value={sector.id}>
//                                     {sector.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default EditContactModal;


// import React, { useEffect, useState } from 'react';
// import ReusableModal from '@/components/Modal/modal';
// import { Contact, Sector, ContactData } from '@/components/Types/types';

// interface EditContactModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave?: (updatedContact: ContactData) => Promise<void>; // Kirim ContactData ke parent
//     initialData: Contact;
// }

// const EditContactModal: React.FC<EditContactModalProps> = ({
//     isOpen,
//     onClose,
//     onSave,
//     initialData,
// }) => {
//     const [form, setForm] = useState<Partial<ContactData>>({
//         name: initialData.name,
//         email: initialData.email ?? null,
//         company_name: initialData.company_name ?? null,
//         phone: initialData.phone ?? null,
//         social_media: initialData.social_media ?? null,
//         sector_id: initialData.sector_id ?? null,
//         address: initialData.address ?? null,
//     });

//     const [sectors, setSectors] = useState<Sector[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         if (isOpen) {
//             setForm({
//                 name: initialData.name,
//                 email: initialData.email ?? null,
//                 company_name: initialData.company_name ?? null,
//                 phone: initialData.phone ?? null,
//                 social_media: initialData.social_media ?? null,
//                 sector_id: initialData.sector_id ?? null,
//                 address: initialData.address ?? null,
//             });
//             setError(null);
//             setIsSubmitting(false);

//             const fetchSectors = async () => {
//                 try {
//                     const res = await fetch('/sectors');
//                     if (!res.ok) throw new Error('Gagal mengambil data sektor.');
//                     const data: Sector[] = await res.json();
//                     setSectors(data);
//                 } catch (err: any) {
//                     console.error(err);
//                     setError(err.message || 'Terjadi kesalahan.');
//                 }
//             };

//             fetchSectors();
//         }
//     }, [isOpen, initialData]);

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//     ) => {
//         const { name, value } = e.target;
//         setForm(prev => ({
//             ...prev,
//             [name]: value === '' ? null : value,
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setIsSubmitting(true);

//         // Validasi dasar
//         if (!form.name || form.name.trim() === '') {
//             setError('Nama kontak wajib diisi.');
//             setIsSubmitting(false);
//             return;
//         }

//         if (!form.sector_id) {
//             setError('Sektor wajib dipilih.');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             if (onSave) {
//                 await onSave(form as ContactData);
//             }
//             // Jangan tutup modal di sini, biarkan parent yang lakukan
//         } catch (err: any) {
//             setError(err.message || 'Gagal menyimpan perubahan.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Edit Kontak"
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//         >
//             <div className="max-h-[80vh] overflow-y-auto pr-2">
//                 {error && <div className="text-red-500 mb-4">{error}</div>}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block font-semibold">Nama *</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={form.name || ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-semibold">Perusahaan</label>
//                         <input
//                             type="text"
//                             name="company_name"
//                             value={form.company_name || ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-semibold">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={form.email || ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-semibold">Telepon</label>
//                         <input
//                             type="tel"
//                             name="phone"
//                             value={form.phone || ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Social Media</label>
//                         <input
//                             type="url"
//                             name="social_media"
//                             value={form.social_media || ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             placeholder="https://linkedin.com/in/username"
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Alamat</label>
//                         <textarea
//                             name="address"
//                             value={form.address || ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             rows={2}
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block font-semibold">Sektor *</label>
//                         <select
//                             name="sector_id"
//                             value={form.sector_id || ''}
//                             onChange={handleChange}
//                             className="w-full border rounded px-3 py-2"
//                             required
//                         >
//                             <option value="">-- Pilih Sektor --</option>
//                             {sectors.map(sector => (
//                                 <option key={sector.id} value={sector.id}>
//                                     {sector.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default EditContactModal;


import React, { useEffect } from 'react';
import ReusableModal from '@/components/Modal/modal';
import { Contact as ContactType, Sector } from '@/components/Types/types';
import Select from 'react-select';
import { useForm } from '@inertiajs/react';

interface EditContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectors: Sector[];
    initialData: ContactType | null;
}

const EditContactModal: React.FC<EditContactModalProps> = ({
    isOpen,
    onClose,
    sectors,
    initialData,
}) => {
    if (!initialData) return null;

    const {
        data,
        setData,
        put,
        reset,
        processing,
        errors,
        clearErrors,
    } = useForm({
        name: initialData.name || '',
        email: initialData.email || '',
        company_name: initialData.company_name || '',
        phone: initialData.phone || '',
        social_media: initialData.social_media || '',
        sector_id: initialData.sector?.id ?? '',
        address: initialData.address || '',
    });

    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                name: initialData.name || '',
                email: initialData.email || '',
                company_name: initialData.company_name || '',
                phone: initialData.phone || '',
                social_media: initialData.social_media || '',
                sector_id: initialData.sector?.id ?? '',
                address: initialData.address || '',
            });
            clearErrors();
        }
    }, [isOpen, initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    const handleSelectChange = (selected: any) => {
        setData('sector_id', selected?.value ?? '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/contacts/${initialData.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const selectedSector = sectors.find(
        (s) => String(s.id) === String(data.sector_id)
    );

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Kontak"
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitLabel="Update"
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
                        options={sectors.map((s) => ({
                            value: s.id,
                            label: s.name,
                        }))}
                        value={
                            selectedSector
                                ? { value: selectedSector.id, label: selectedSector.name }
                                : null
                        }
                        onChange={handleSelectChange}
                        placeholder="Pilih sektor"
                        isClearable
                        className="col-span-2 z-50"
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                        menuPosition="fixed"
                        styles={{
                            control: (base) => ({ ...base, minHeight: '34px' }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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

export default EditContactModal;
