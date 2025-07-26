// import React, { useEffect, useState } from 'react';
// import ReusableModal from '@/components/Modal/modallead';
// import Select from 'react-select';
// import Swal from 'sweetalert2';

// export interface Column {
//     id: string;
//     name: string;
// }

// export interface Product {
//     id: string;
//     name: string;
//     price: number;
// }

// export interface Contact {
//     id: string;
//     name: string;
//     company_name?: string | null;
// }

// export interface Transaction {
//     id: string;
//     trx: string;
//     column_id: string;
//     product_id: string | null;
//     contact_id: string;
//     current_price: number;
//     qty: number;
//     discount_amount: number | null;
//     grand_total: number;
//     deadline: string | null;
//     notes: string | null;
//     created_at: string;
//     updated_at: string;
//     sector?: string;
//     sectorColor?: string;
//     name?: string;
//     company_name?: string | null;
//     product?: string;
//     assigneeInitials?: string;
//     assigneeBgColor?: string;
//     columnId?: string;
// }

// export interface TransactionPayload {
//     product_id: string | null;
//     contact_id: string;
//     current_price: number;
//     qty: number;
//     discount_amount?: number | null;
//     deadline?: string | null;
//     notes?: string | null;
// }

// interface EditTransactionModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave?: (data: Transaction) => Promise<void>;
//     initialData: Transaction;
// }

// const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
//     isOpen,
//     onClose,
//     onSave,
//     initialData,
// }) => {
//     const [form, setForm] = useState<Transaction>(initialData);
//     const [products, setProducts] = useState<Product[]>([]);
//     const [contacts, setContacts] = useState<Contact[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//     useEffect(() => {
//         if (isOpen) {
//             setForm({
//                 ...initialData,
//                 deadline: initialData.deadline ?? null,
//                 notes: initialData.notes ?? null,
//                 discount_amount: initialData.discount_amount ?? null,
//             });
//             setError(null);
//             setIsSubmitting(false);

//             const fetchDependencies = async () => {
//                 try {
//                     const [productsRes, contactsRes] = await Promise.all([
//                         fetch('/products'),
//                         fetch('/contacts'),
//                     ]);

//                     if (!productsRes.ok) throw new Error('Failed to fetch products.');
//                     const productsData: Product[] = await productsRes.json();
//                     setProducts(productsData);

//                     if (!contactsRes.ok) throw new Error('Failed to fetch contacts.');
//                     const contactsData: Contact[] = await contactsRes.json();
//                     setContacts(contactsData);
//                 } catch (err: any) {
//                     console.error('Error fetching dependencies:', err);
//                     setError(err.message || 'Failed to retrieve necessary data.');
//                 }
//             };

//             fetchDependencies();
//         }
//     }, [isOpen, initialData]);

//     useEffect(() => {
//         const selectedProduct = products.find((p) => p.id === form.product_id);
//         if (selectedProduct) {
//             setForm((prev) => ({
//                 ...prev,
//                 current_price: selectedProduct.price,
//             }));
//         }
//     }, [form.product_id, products]);

//     useEffect(() => {
//         const selectedContact = contacts.find((c) => c.id === form.contact_id);
//         setForm((prev) => ({
//             ...prev,
//             company_name: selectedContact?.company_name ?? null,
//         }));
//     }, [form.contact_id, contacts]);

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => {
//         const { name, value, type } = e.target;

//         setForm((prev) => ({
//             ...prev,
//             [name]:
//                 type === 'number'
//                     ? value === ''
//                         ? null
//                         : parseFloat(value) || 0
//                     : value === ''
//                         ? null
//                         : value,
//         }));
//     };

//     const handleSelectChange = (selected: any, name: string) => {
//         const value = selected?.value ?? null;

//         if (name === 'product_id' && value === null) {
//             setForm((prev) => ({
//                 ...prev,
//                 product_id: null,
//                 current_price: 0,
//                 qty: 0,
//                 discount_amount: null,
//             }));
//         } else {
//             setForm((prev) => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError(null);

//         // Validasi hanya jika ada produk
//         if (form.product_id) {
//             if (!form.qty || form.qty <= 0) {
//                 setError('Quantity must be greater than 0 when product is selected.');
//                 setIsSubmitting(false);
//                 return;
//             }
//             if (!form.current_price || form.current_price <= 0) {
//                 setError('Current price must be greater than 0 when product is selected.');
//                 setIsSubmitting(false);
//                 return;
//             }
//         }

//         if (form.discount_amount !== null && form.discount_amount < 0) {
//             setError('Discount amount cannot be negative.');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const csrfToken = document
//                 .querySelector('meta[name="csrf-token"]')
//                 ?.getAttribute('content');

//             const payload: TransactionPayload = {
//                 product_id: form.product_id,
//                 contact_id: form.contact_id,
//                 current_price: form.product_id ? form.current_price : 0,
//                 qty: form.product_id ? form.qty : 0,
//                 discount_amount:
//                     form.discount_amount === 0 ? null : form.discount_amount,
//                 deadline: form.deadline === '' ? null : form.deadline,
//                 notes: form.notes === '' ? null : form.notes,
//             };

//             const response = await fetch(`/kanban/leads/${initialData.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Accept: 'application/json',
//                     ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
//                 },
//                 body: JSON.stringify(payload),
//             });

//             if (!response.ok) {
//                 const errData = await response.json();
//                 if (errData.errors) {
//                     const errorMessages = Object.values(errData.errors)
//                         .flat()
//                         .join(' ');
//                     throw new Error(
//                         errorMessages ||
//                         errData.message ||
//                         'Failed to save transaction changes.'
//                     );
//                 }
//                 throw new Error(errData.message || 'Failed to save transaction changes.');
//             }

//             const { transaction: savedData }: { transaction: Transaction } =
//                 await response.json();

//             if (onSave) await onSave(savedData);
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Updated!',
//                 text: 'Lead berhasil diperbarui!',
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//             onClose();
//         } catch (err: any) {
//             console.error('Error saving transaction:', err);
//             setError(err.message || 'Failed to save transaction changes.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const calculatedGrandTotal =
//         form.qty && form.current_price
//             ? form.current_price * form.qty - (form.discount_amount ?? 0)
//             : 0;

//     const contactOptions = contacts.map((c) => ({ value: c.id, label: c.name }));
//     const productOptions = products.map((p) => ({ value: p.id, label: p.name }));
//     // const contactOptions = contacts.map((c) => ({
//     //     value: c.id,
//     //     label: c.company_name ? `${c.name} (${c.company_name})` : c.name,
//     // }));

//     // const productOptions = products.map((p) => ({
//     //     value: p.id,
//     //     label: `${p.name} (Rp ${p.price.toLocaleString('id-ID')})`,
//     // }));


//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Edit Transaksi"
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//             className="w-[95vw] max-w-[1400px] max-h-[90vh]"
//         >
//             <div className="max-h-[80vh] overflow-y-auto p-2">
//                 {error && (
//                     <div className="text-red-500 p-2 bg-red-50 border border-red-300 rounded mb-4">
//                         {error}
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
//                     <div>
//                         <label className="font-semibold block mb-1">Contact Name <span className="text-red-500">*</span></label>
//                         <Select
//                             options={contactOptions}
//                             value={contactOptions.find((opt) => opt.value === form.contact_id) || null}
//                             onChange={(opt) => handleSelectChange(opt, 'contact_id')}
//                             placeholder="Select contact"
//                             isClearable
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Company Name</label>
//                         <input
//                             type="text"
//                             name="company_name"
//                             value={form.company_name ?? ''}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                             disabled
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Product</label>
//                         <Select
//                             options={productOptions}
//                             value={productOptions.find((opt) => opt.value === form.product_id) || null}
//                             onChange={(opt) => handleSelectChange(opt, 'product_id')}
//                             placeholder="Select product"
//                             isClearable
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Deadline</label>
//                         <input
//                             type="date"
//                             name="deadline"
//                             value={form.deadline ?? ''}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Current Price</label>
//                         <input
//                             type="number"
//                             name="current_price"
//                             value={form.current_price}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                             readOnly
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Quantity</label>
//                         <input
//                             type="number"
//                             name="qty"
//                             value={form.qty}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                             min={0}
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Discount Amount</label>
//                         <input
//                             type="number"
//                             name="discount_amount"
//                             value={form.discount_amount ?? ''}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Grand Total</label>
//                         <input
//                             type="number"
//                             name="grand_total"
//                             value={calculatedGrandTotal}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                             readOnly
//                         />
//                     </div>

//                     <div className="col-span-full">
//                         <label className="font-semibold block mb-1">Notes</label>
//                         <textarea
//                             name="notes"
//                             value={form.notes ?? ''}
//                             onChange={handleChange}
//                             rows={3}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default EditTransactionModal;

// import React, { useEffect, useState } from 'react';
// import { useForm } from '@inertiajs/react';
// import ReusableModal from '@/components/Modal/modallead';
// import Select from 'react-select';
// import Swal from 'sweetalert2';

// import type { Transaction, TransactionPayload, Product, Contact } from '@/components/Leads/types'; // optional, depends on your structure

// interface EditTransactionModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave?: (data: Transaction) => void;
//     initialData: Transaction;
// }

// const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
//     isOpen,
//     onClose,
//     onSave,
//     initialData,
// }) => {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [contacts, setContacts] = useState<Contact[]>([]);
//     const [loadingDeps, setLoadingDeps] = useState<boolean>(false);

//     const {
//         data,
//         setData,
//         put,
//         processing,
//         errors,
//         reset,
//     } = useForm<TransactionPayload>({
//         product_id: initialData.product_id,
//         contact_id: initialData.contact_id,
//         current_price: initialData.current_price,
//         qty: initialData.qty,
//         discount_amount: initialData.discount_amount ?? null,
//         deadline: initialData.deadline ?? null,
//         notes: initialData.notes ?? null,
//     });

//     useEffect(() => {
//         if (isOpen) {
//             reset({
//                 product_id: initialData.product_id,
//                 contact_id: initialData.contact_id,
//                 current_price: initialData.current_price,
//                 qty: initialData.qty,
//                 discount_amount: initialData.discount_amount ?? null,
//                 deadline: initialData.deadline ?? null,
//                 notes: initialData.notes ?? null,
//             });

//             setLoadingDeps(true);

//             const fetchDependencies = async () => {
//                 try {
//                     const [productsRes, contactsRes] = await Promise.all([
//                         fetch('/products'),
//                         fetch('/contacts'),
//                     ]);
//                     const productsData: Product[] = await productsRes.json();
//                     const contactsData: Contact[] = await contactsRes.json();
//                     setProducts(productsData);
//                     setContacts(contactsData);
//                 } catch (err) {
//                     console.error('Error fetching products or contacts:', err);
//                 } finally {
//                     setLoadingDeps(false);
//                 }
//             };

//             fetchDependencies();
//         }
//     }, [isOpen, initialData]);

//     useEffect(() => {
//         const selectedProduct = products.find((p) => p.id === data.product_id);
//         if (selectedProduct) {
//             setData('current_price', selectedProduct.price);
//         }
//     }, [data.product_id, products]);

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => {
//         const { name, value, type } = e.target;
//         const parsedValue =
//             type === 'number'
//                 ? value === ''
//                     ? null
//                     : parseFloat(value) || 0
//                 : value === ''
//                     ? null
//                     : value;

//         setData(name as keyof TransactionPayload, parsedValue);
//     };

//     const handleSelectChange = (selected: any, name: keyof TransactionPayload) => {
//         const value = selected?.value ?? null;

//         if (name === 'product_id' && value === null) {
//             setData({
//                 ...data,
//                 product_id: null,
//                 current_price: 0,
//                 qty: 0,
//                 discount_amount: null,
//             });
//         } else {
//             setData(name, value);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         put(`/kanban/leads/${initialData.id}`, {
//             onSuccess: (page) => {
//                 if (onSave && page.props.transaction) {
//                     onSave(page.props.transaction as Transaction);
//                 }

//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Updated!',
//                     text: 'Lead berhasil diperbarui!',
//                     timer: 2000,
//                     showConfirmButton: false,
//                 });

//                 onClose();
//             },
//             onError: (err) => {
//                 console.error('Validation errors:', err);
//             },
//         });
//     };

//     const calculatedGrandTotal =
//         data.qty && data.current_price
//             ? data.current_price * data.qty - (data.discount_amount ?? 0)
//             : 0;

//     const contactOptions = contacts.map((c) => ({
//         value: c.id,
//         label: c.name,
//     }));

//     const productOptions = products.map((p) => ({
//         value: p.id,
//         label: p.name,
//     }));

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Edit Transaksi"
//             onSubmit={handleSubmit}
//             isSubmitting={processing}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//             className="w-[95vw] max-w-[1400px] max-h-[90vh]"
//         >
//             <div className="max-h-[80vh] overflow-y-auto p-2">
//                 {Object.keys(errors).length > 0 && (
//                     <div className="text-red-500 p-2 bg-red-50 border border-red-300 rounded mb-4">
//                         {Object.entries(errors).map(([field, msg]) => (
//                             <div key={field}>{msg}</div>
//                         ))}
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
//                     <div>
//                         <label className="font-semibold block mb-1">Contact Name <span className="text-red-500">*</span></label>
//                         <Select
//                             options={contactOptions}
//                             value={contactOptions.find((opt) => opt.value === data.contact_id) || null}
//                             onChange={(opt) => handleSelectChange(opt, 'contact_id')}
//                             placeholder="Select contact"
//                             isClearable
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Company Name</label>
//                         <input
//                             type="text"
//                             value={
//                                 contacts.find((c) => c.id === data.contact_id)?.company_name ?? ''
//                             }
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                             disabled
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Product</label>
//                         <Select
//                             options={productOptions}
//                             value={productOptions.find((opt) => opt.value === data.product_id) || null}
//                             onChange={(opt) => handleSelectChange(opt, 'product_id')}
//                             placeholder="Select product"
//                             isClearable
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Deadline</label>
//                         <input
//                             type="date"
//                             name="deadline"
//                             value={data.deadline ?? ''}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Current Price</label>
//                         <input
//                             type="number"
//                             name="current_price"
//                             value={data.current_price}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                             readOnly
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Quantity</label>
//                         <input
//                             type="number"
//                             name="qty"
//                             value={data.qty}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                             min={0}
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Discount Amount</label>
//                         <input
//                             type="number"
//                             name="discount_amount"
//                             value={data.discount_amount ?? ''}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="font-semibold block mb-1">Grand Total</label>
//                         <input
//                             type="number"
//                             name="grand_total"
//                             value={calculatedGrandTotal}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                             readOnly
//                         />
//                     </div>

//                     <div className="col-span-full">
//                         <label className="font-semibold block mb-1">Notes</label>
//                         <textarea
//                             name="notes"
//                             value={data.notes ?? ''}
//                             onChange={handleChange}
//                             rows={3}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default EditTransactionModal;


import React, { useEffect } from 'react'; // 'useState' is no longer needed for products/contacts
import { useForm } from '@inertiajs/react';
import ReusableModal from '@/components/Modal/modallead';
import Select from 'react-select';
import Swal from 'sweetalert2';

// Import all necessary types from your central types file
import type { LeadDatas, TransactionPayload, ContactOption, ProductOption } from '@/components/Leads/types';

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onSave sekarang menerima LeadDatas karena kita mengedit LeadDatas
    onSave?: (data: LeadDatas) => void;
    // initialData sekarang bertipe LeadDatas
    initialData: LeadDatas;
    // products dan contacts datang dari props
    contacts: ContactOption[];
    products: ProductOption[];
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    contacts, // Diterima dari props
    products, // Diterima dari props
}) => {
    // Data form disesuaikan dengan TransactionPayload
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
    } = useForm<TransactionPayload>({
        // Sesuaikan dengan properti dari LeadDatas yang akan diedit
        product_id: initialData.product_id,
        contact_id: initialData.contact_id,
        current_price: initialData.current_price,
        qty: initialData.qty,
        discount_amount: initialData.discount_amount ?? null,
        deadline: initialData.deadline ?? null,
        notes: initialData.notes ?? null,
    });

    useEffect(() => {
        if (isOpen) {
            // Reset form data saat modal dibuka atau initialData berubah
            reset({
                product_id: initialData.product_id,
                contact_id: initialData.contact_id,
                current_price: initialData.current_price,
                qty: initialData.qty,
                discount_amount: initialData.discount_amount ?? null,
                deadline: initialData.deadline ?? null,
                notes: initialData.notes ?? null,
            });
            // Tidak perlu lagi mengambil data produk/kontak karena sudah ada di props
        }
    }, [isOpen, initialData, reset]); // Tambahkan `reset` ke dependency array

    useEffect(() => {
        // Ketika product_id berubah, update current_price berdasarkan daftar produk dari props
        const selectedProduct = products.find((p) => p.id === data.product_id);
        if (selectedProduct) {
            setData('current_price', selectedProduct.price);
        } else {
            // Jika tidak ada produk terpilih, set harga ke 0 atau nilai default lainnya
            setData('current_price', 0);
        }
    }, [data.product_id, products, setData]); // Tambahkan `setData` ke dependency array

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const parsedValue =
            type === 'number'
                ? value === ''
                    ? null
                    : parseFloat(value) || 0
                : value === ''
                    ? null
                    : value;

        setData(name as keyof TransactionPayload, parsedValue);
    };

    const handleSelectChange = (selected: any, name: keyof TransactionPayload) => {
        const value = selected?.value ?? null;

        if (name === 'product_id' && value === null) {
            // Jika produk di-clear, reset juga harga, kuantitas, dan diskon
            setData({
                ...data,
                product_id: null,
                current_price: 0,
                qty: 0,
                discount_amount: null,
            });
        } else {
            setData(name, value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Pastikan endpoint PUT sesuai untuk update lead/transaction
        // Diasumsikan `initialData.id` adalah ID lead/transaksi yang sedang diedit
        put(`/kanban/leads/${initialData.id}`, {
            onSuccess: (page) => {
                // Pastikan `page.props.transaction` (atau `page.props.lead`)
                // memiliki tipe `LeadDatas` yang konsisten dengan `onSave`
                if (onSave && page.props.transaction) {
                    // Konversi ke LeadDatas jika perlu, atau pastikan sudah LeadDatas
                    onSave(page.props.transaction as LeadDatas);
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Lead berhasil diperbarui!',
                    timer: 2000,
                    showConfirmButton: false,
                });

                onClose();
            },
            onError: (err) => {
                console.error('Validation errors:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Terjadi kesalahan saat memperbarui lead.',
                    timer: 3000,
                    showConfirmButton: false,
                });
            },
        });
    };

    const calculatedGrandTotal =
        data.qty && data.current_price
            ? data.current_price * data.qty - (data.discount_amount ?? 0)
            : 0;

    // Gunakan `contacts` dan `products` yang diterima dari props
    const contactOptions = contacts.map((c) => ({
        value: c.id,
        label: c.name,
    }));

    const productOptions = products.map((p) => ({
        value: p.id,
        label: p.name,
    }));

    // Mencari nama perusahaan berdasarkan contact_id saat ini
    const currentContact = contacts.find((c) => c.id === data.contact_id);
    const companyNameDisplay = currentContact ? currentContact.company_name ?? '' : '';


    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Lead"
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitLabel="Simpan"
            cancelLabel="Batal"
            className="w-[95vw] max-w-[1400px] max-h-[90vh]"
        >
            <div className="max-h-[80vh] overflow-y-auto p-2">
                {Object.keys(errors).length > 0 && (
                    <div className="text-red-500 p-2 bg-red-50 border border-red-300 rounded mb-4">
                        {Object.entries(errors).map(([field, msg]) => (
                            <div key={field}>{msg}</div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                        <label className="font-semibold block mb-1">Contact Name <span className="text-red-500">*</span></label>
                        <Select
                            options={contactOptions}
                            value={contactOptions.find((opt) => opt.value === data.contact_id) || null}
                            onChange={(opt) => handleSelectChange(opt, 'contact_id')}
                            placeholder="Select contact"
                            isClearable
                        />
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Company Name</label>
                        <input
                            type="text"
                            value={companyNameDisplay} // Menggunakan companyNameDisplay
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            disabled
                        />
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Product</label>
                        <Select
                            options={productOptions}
                            value={productOptions.find((opt) => opt.value === data.product_id) || null}
                            onChange={(opt) => handleSelectChange(opt, 'product_id')}
                            placeholder="Select product"
                            isClearable
                        />
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={data.deadline ?? ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Current Price</label>
                        <input
                            type="number"
                            name="current_price"
                            value={data.current_price}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Quantity</label>
                        <input
                            type="number"
                            name="qty"
                            value={data.qty}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            min={0}
                        />
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Discount Amount</label>
                        <input
                            type="number"
                            name="discount_amount"
                            value={data.discount_amount ?? ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Grand Total</label>
                        <input
                            type="number"
                            name="grand_total"
                            value={calculatedGrandTotal}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            readOnly
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="font-semibold block mb-1">Notes</label>
                        <textarea
                            name="notes"
                            value={data.notes ?? ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default EditTransactionModal;
