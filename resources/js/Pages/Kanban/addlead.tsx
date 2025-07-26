// import React, { useEffect, useState } from 'react';
// import ReusableModal from '../../components/Modal/modallead';
// import { LeadDatas } from '../../components/Leads/types';
// import Swal from 'sweetalert2';
// import Select from 'react-select';

// interface AddLeadModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (newLead: LeadDatas) => void;
//     initialColumnId: string;
// }

// type FormState = {
//     contactId: string;
//     companyName: string;
//     productId: string;
//     deadline: string;
//     currentPrice: number | null;
//     qty: number | null;
//     discountAmount: number | null;
//     notes: string;
// };

// interface ContactOption {
//     id: string;
//     name: string;
//     company_name: string;
// }

// interface ProductOption {
//     id: string;
//     name: string;
//     price: number;
// }

// const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSave, initialColumnId }) => {
//     const [form, setForm] = useState<FormState>({
//         contactId: '',
//         companyName: '',
//         productId: '',
//         deadline: '',
//         currentPrice: null,
//         qty: null,
//         discountAmount: null,
//         notes: '',
//     });

//     const [contacts, setContacts] = useState<ContactOption[]>([]);
//     const [products, setProducts] = useState<ProductOption[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     useEffect(() => {
//         if (isOpen) {
//             setForm({
//                 contactId: '',
//                 companyName: '',
//                 productId: '',
//                 deadline: '',
//                 currentPrice: null,
//                 qty: null,
//                 discountAmount: null,
//                 notes: '',
//             });
//             setError(null);
//             setIsSubmitting(false);
//             setIsLoading(true);

//             Promise.all([fetch('/contacts'), fetch('/products')])
//                 .then(async ([contactsRes, productsRes]) => {
//                     if (!contactsRes.ok || !productsRes.ok) throw new Error('Failed to fetch options.');
//                     const contactsData = await contactsRes.json();
//                     const productsData = await productsRes.json();

//                     // Debug log
//                     console.log('Fetched contacts:', contactsData);
//                     console.log('Fetched products:', productsData);

//                     // Sort so new data appears at the top (assuming ID increases over time)
//                     const sortedContacts = contactsData.sort((a: ContactOption, b: ContactOption) => b.id.localeCompare(a.id));
//                     const sortedProducts = productsData.sort((a: ProductOption, b: ProductOption) => b.id.localeCompare(a.id));

//                     setContacts(sortedContacts);
//                     setProducts(sortedProducts);
//                 })
//                 .catch(err => setError(err.message))
//                 .finally(() => setIsLoading(false));
//         }
//     }, [isOpen]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value, type } = e.target;
//         const parsedValue = type === 'number' ? (value === '' ? null : Number(value)) : value;
//         setForm(prev => ({ ...prev, [name]: parsedValue }));
//     };

//     const handleContactChange = (selected: any) => {
//         const selectedContact = contacts.find(c => c.id === selected?.value);
//         setForm(prev => ({
//             ...prev,
//             contactId: selected?.value || '',
//             companyName: selectedContact?.company_name || '',
//         }));
//     };

//     const handleProductChange = (selected: any) => {
//         const selectedProduct = products.find(p => p.id === selected?.value);
//         setForm(prev => ({
//             ...prev,
//             productId: selected?.value || '',
//             currentPrice: selectedProduct?.price ?? null,
//         }));
//     };

//     const calculatedGrandTotal = (form.currentPrice ?? 0) * (form.qty ?? 0) - (form.discountAmount ?? 0);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError(null);

//         if (!form.contactId) {
//             setError('Contact is required.');
//             setIsSubmitting(false);
//             return;
//         }

//         const selectedContactName = contacts.find(c => c.id === form.contactId)?.name || '';
//         const selectedProductName = products.find(p => p.id === form.productId)?.name || '';

//         const payload = {
//             column_id: initialColumnId,
//             contact_id: form.contactId,
//             name: selectedContactName,
//             company_name: form.companyName,
//             product_id: form.productId || null,
//             product_name: selectedProductName || null,
//             current_price: form.currentPrice,
//             qty: form.qty,
//             discount_amount: form.discountAmount,
//             deadline: form.deadline || null,
//             notes: form.notes || null,
//         };

//         const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//         if (!csrfToken) {
//             setError('Missing CSRF token.');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const res = await fetch('/kanban/leads', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRF-TOKEN': csrfToken,
//                 },
//                 body: JSON.stringify(payload),
//             });

//             if (!res.ok) {
//                 const errData = await res.json();
//                 if (res.status === 422 && errData.errors) {
//                     const msg = Object.values(errData.errors).flat().join('; ');
//                     setError(`Validation failed: ${msg}`);
//                 } else {
//                     throw new Error(errData.message || 'Failed to add lead.');
//                 }
//                 setIsSubmitting(false);
//                 return;
//             }

//             const newLead: LeadDatas = await res.json();
//             onSave(newLead);
//             Swal.fire({ icon: 'success', title: 'Success!', text: 'Lead berhasil ditambahkan.', timer: 1500, showConfirmButton: false });
//             onClose();
//         } catch (err: any) {
//             setError(err.message || 'Gagal menambahkan lead.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Add New Lead"
//             onSubmit={handleSubmit}
//             isSubmitting={isSubmitting}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//             className="w-[95vw] max-w-[1400px] max-h-[90vh]"
//         >
//             <div className="max-h-[80vh] overflow-y-auto p-2">
//                 {error && <div className="text-red-500 p-2 bg-red-50 border border-red-300 rounded mb-4">{error}</div>}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
//                     {/* Contact Dropdown */}
//                     <div>
//                         <label className="font-semibold block mb-1">Contact *</label>
//                         <Select
//                             isLoading={isLoading}
//                             options={contacts.map(c => ({ value: c.id, label: c.name }))}
//                             onChange={handleContactChange}
//                             value={form.contactId ? { value: form.contactId, label: contacts.find(c => c.id === form.contactId)?.name } : null}
//                             placeholder="Select contact"
//                             isClearable
//                         />
//                     </div>

//                     {/* Company Name */}
//                     <div>
//                         <label className="font-semibold block mb-1">Perusahaan</label>
//                         <input
//                             type="text"
//                             name="companyName"
//                             value={form.companyName}
//                             onChange={handleChange}
//                             disabled
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Product Dropdown */}
//                     <div>
//                         <label className="font-semibold block mb-1">Product</label>
//                         <Select
//                             isLoading={isLoading}
//                             options={products.map(p => ({ value: p.id, label: p.name }))}
//                             onChange={handleProductChange}
//                             value={form.productId ? { value: form.productId, label: products.find(p => p.id === form.productId)?.name } : null}
//                             placeholder="Select product"
//                             isClearable
//                         />
//                     </div>

//                     {/* Deadline */}
//                     <div>
//                         <label className="font-semibold block mb-1">Deadline</label>
//                         <input
//                             type="date"
//                             name="deadline"
//                             value={form.deadline}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Current Price */}
//                     <div>
//                         <label className="font-semibold block mb-1">Current Price</label>
//                         <input
//                             type="number"
//                             name="currentPrice"
//                             value={form.currentPrice ?? ''}
//                             onChange={handleChange}
//                             readOnly
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Quantity */}
//                     <div>
//                         <label className="font-semibold block mb-1">Quantity</label>
//                         <input
//                             type="number"
//                             name="qty"
//                             value={form.qty ?? ''}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Discount */}
//                     <div>
//                         <label className="font-semibold block mb-1">Discount</label>
//                         <input
//                             type="number"
//                             name="discountAmount"
//                             value={form.discountAmount ?? ''}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Grand Total */}
//                     <div>
//                         <label className="font-semibold block mb-1">Grand Total</label>
//                         <input
//                             type="number"
//                             value={calculatedGrandTotal}
//                             readOnly
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Notes */}
//                     <div className="col-span-full">
//                         <label className="font-semibold block mb-1">Notes</label>
//                         <textarea
//                             name="notes"
//                             value={form.notes}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             rows={3}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default AddLeadModal;

// import React, { useEffect, useState } from 'react';
// import { useForm } from '@inertiajs/react';
// import ReusableModal from '../../components/Modal/modallead';
// import { LeadDatas } from '../../components/Leads/types';
// import Swal from 'sweetalert2';
// import Select from 'react-select';

// interface AddLeadModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (newLead: LeadDatas) => void;
//     initialColumnId: string;
// }

// type FormState = {
//     contact_id: string;
//     company_name: string;
//     name: string; // tambahkan ini
//     product_id: string;
//     product_name: string; // <== tambah ini
//     deadline: string;
//     current_price: number | null;
//     qty: number | null;
//     discount_amount: number | null;
//     notes: string;
//     column_id: string; // <-- pastikan ini ada
// };

// interface ContactOption {
//     id: string;
//     name: string;
//     company_name: string;
// }

// interface ProductOption {
//     id: string;
//     name: string;
//     price: number;
// }

// const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSave, initialColumnId }) => {
//     const [contacts, setContacts] = useState<ContactOption[]>([]);
//     const [products, setProducts] = useState<ProductOption[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const form = useForm<FormState>({
//         contact_id: '',
//         company_name: '',
//         name: '', // tambahkan ini
//         product_id: '',
//         product_name: '', // <== init empty string
//         deadline: '',
//         current_price: null,
//         qty: null,
//         discount_amount: null,
//         notes: '',
//         column_id: '', // inisialisasi kosong, akan di-set saat modal dibuka
//     });

//     useEffect(() => {
//         if (isOpen) {
//             form.reset();
//             form.setData('column_id', initialColumnId); // Set column_id saat modal dibuka
//             setError(null);
//             setIsLoading(true);

//             Promise.all([fetch('/contacts'), fetch('/products')])
//                 .then(async ([contactsRes, productsRes]) => {
//                     if (!contactsRes.ok || !productsRes.ok) throw new Error('Failed to fetch options.');
//                     const contactsData = await contactsRes.json();
//                     const productsData = await productsRes.json();

//                     // Sort terbaru dulu
//                     const sortedContacts = contactsData.sort((a: ContactOption, b: ContactOption) => b.id.localeCompare(a.id));
//                     const sortedProducts = productsData.sort((a: ProductOption, b: ProductOption) => b.id.localeCompare(a.id));

//                     setContacts(sortedContacts);
//                     setProducts(sortedProducts);
//                 })
//                 .catch(err => setError(err.message))
//                 .finally(() => setIsLoading(false));
//         }
//     }, [isOpen, initialColumnId]);

//     const handleContactChange = (selected: any) => {
//         const selectedContact = contacts.find(c => c.id === selected?.value);
//         const selectedProduct = products.find(p => p.id === selected?.value);
//         form.setData({
//             contact_id: selected?.value || '',
//             company_name: selectedContact?.company_name || '',
//             name: selectedContact?.name || '',  // <-- tambah ini
//             product_id: '',
//             product_name: selectedProduct?.name || '',
//             current_price: null,
//             qty: null,
//             discount_amount: null,
//             deadline: '',
//             notes: '',
//             column_id: form.data.column_id, // jangan hilangkan column_id
//         });
//     };

//     const handleProductChange = (selected: any) => {
//         const selectedProduct = products.find(p => p.id === selected?.value);
//         form.setData('product_id', selected?.value || '');
//         form.setData('current_price', selectedProduct?.price ?? null);
//     };

//     const calculatedGrandTotal = (form.data.current_price ?? 0) * (form.data.qty ?? 0) - (form.data.discount_amount ?? 0);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);

//         if (!form.data.contact_id) {
//             setError('Contact is required.');
//             return;
//         }

//         form.post('/kanban/leads', {
//             preserveScroll: true,
//             onSuccess: (page) => {
//                 onSave(page.props?.newLead ?? page.props?.lead ?? {});
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Success!',
//                     text: 'Lead berhasil ditambahkan.',
//                     timer: 1500,
//                     showConfirmButton: false,
//                 });
//                 onClose();
//             },
//             onError: (errors) => {
//                 setError(Object.values(errors).flat().join('; '));
//             },
//             onFinish: () => {
//                 form.reset('qty', 'discount_amount', 'notes', 'deadline', 'product_id', 'current_price');
//             },
//         });
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Add New Lead"
//             onSubmit={handleSubmit}
//             isSubmitting={form.processing}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//             className="w-[95vw] max-w-[1400px] max-h-[90vh]"
//         >
//             <div className="max-h-[80vh] overflow-y-auto p-2">
//                 {error && (
//                     <div className="text-red-500 p-2 bg-red-50 border border-red-300 rounded mb-4">{error}</div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
//                     {/* Contact Dropdown */}
//                     <div>
//                         <label className="font-semibold block mb-1">Contact *</label>
//                         <Select
//                             isLoading={isLoading}
//                             options={contacts.map(c => ({ value: c.id, label: c.name }))}
//                             onChange={handleContactChange}
//                             value={
//                                 form.data.contact_id
//                                     ? { value: form.data.contact_id, label: contacts.find(c => c.id === form.data.contact_id)?.name }
//                                     : null
//                             }
//                             placeholder="Select contact"
//                             isClearable
//                         />
//                         {form.errors.contact_id && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.contact_id}</div>
//                         )}
//                     </div>

//                     {/* Company Name */}
//                     <div>
//                         <label className="font-semibold block mb-1">Perusahaan</label>
//                         <input
//                             type="text"
//                             name="company_name"
//                             value={form.data.company_name}
//                             disabled
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Product Dropdown */}
//                     <div>
//                         <label className="font-semibold block mb-1">Product</label>
//                         <Select
//                             isLoading={isLoading}
//                             options={products.map(p => ({ value: p.id, label: p.name }))}
//                             onChange={handleProductChange}
//                             value={
//                                 form.data.product_id
//                                     ? { value: form.data.product_id, label: products.find(p => p.id === form.data.product_id)?.name }
//                                     : null
//                             }
//                             placeholder="Select product"
//                             isClearable
//                         />
//                         {form.errors.product_id && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.product_id}</div>
//                         )}
//                     </div>

//                     {/* Deadline */}
//                     <div>
//                         <label className="font-semibold block mb-1">Deadline</label>
//                         <input
//                             type="date"
//                             name="deadline"
//                             value={form.data.deadline}
//                             onChange={e => form.setData('deadline', e.target.value)}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {form.errors.deadline && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.deadline}</div>
//                         )}
//                     </div>

//                     {/* Current Price */}
//                     <div>
//                         <label className="font-semibold block mb-1">Current Price</label>
//                         <input
//                             type="number"
//                             name="current_price"
//                             value={form.data.current_price ?? ''}
//                             onChange={e =>
//                                 form.setData('current_price', e.target.value === '' ? null : Number(e.target.value))
//                             }
//                             readOnly
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {form.errors.current_price && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.current_price}</div>
//                         )}
//                     </div>

//                     {/* Quantity */}
//                     <div>
//                         <label className="font-semibold block mb-1">Quantity</label>
//                         <input
//                             type="number"
//                             name="qty"
//                             value={form.data.qty ?? ''}
//                             onChange={e =>
//                                 form.setData('qty', e.target.value === '' ? null : Number(e.target.value))
//                             }
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {form.errors.qty && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.qty}</div>
//                         )}
//                     </div>

//                     {/* Discount */}
//                     <div>
//                         <label className="font-semibold block mb-1">Discount</label>
//                         <input
//                             type="number"
//                             name="discount_amount"
//                             value={form.data.discount_amount ?? ''}
//                             onChange={e =>
//                                 form.setData('discount_amount', e.target.value === '' ? null : Number(e.target.value))
//                             }
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {form.errors.discount_amount && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.discount_amount}</div>
//                         )}
//                     </div>

//                     {/* Grand Total */}
//                     <div>
//                         <label className="font-semibold block mb-1">Grand Total</label>
//                         <input
//                             type="number"
//                             value={calculatedGrandTotal}
//                             readOnly
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Notes */}
//                     <div className="col-span-full">
//                         <label className="font-semibold block mb-1">Notes</label>
//                         <textarea
//                             name="notes"
//                             rows={3}
//                             value={form.data.notes}
//                             onChange={e => form.setData('notes', e.target.value)}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {form.errors.notes && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.notes}</div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default AddLeadModal;


// import React, { useEffect, useState } from 'react';
// import { useForm } from '@inertiajs/react';
// import Select from 'react-select'; // Pastikan react-select sudah terinstal
// import Swal from 'sweetalert2';

// // Import komponen dan tipe
// import ReusableModal from '../../components/Modal/modallead';
// import { LeadDatas, ContactOption, ProductOption } from '../../components/Leads/types'; // Import tipe yang sudah diperbaiki

// // Interface untuk props yang diterima AddLeadModal
// interface AddLeadModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (newLead: LeadDatas) => void;
//     initialColumnId: string;
//     contacts: ContactOption[]; // Sekarang diterima sebagai prop
//     products: ProductOption[]; // Sekarang diterima sebagai prop
// }

// // Tipe untuk state form yang dikelola oleh useForm
// type FormState = {
//     contact_id: string;
//     company_name: string; // Akan diisi otomatis dari kontak
//     name: string; // Akan diisi otomatis dari kontak
//     product_id: string | null; // Bisa null
//     product_name: string; // Akan diisi otomatis dari produk
//     deadline: string;
//     current_price: number | null;
//     qty: number | null;
//     discount_amount: number | null;
//     notes: string;
//     column_id: string;
// };

// const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSave, initialColumnId, contacts, products }) => {
//     const [error, setError] = useState<string | null>(null);

//     // Initial check for data presence
//     useEffect(() => {
//         if (isOpen) {
//             console.log('AddLeadModal opened. Checking data:');
//             console.log('  Contacts received:', contacts);
//             console.log('  Products received:', products);
//             if (!Array.isArray(contacts) || contacts.length === 0) {
//                 console.warn('Contacts array is empty or not an array. Dropdown will be empty.');
//             }
//             if (!Array.isArray(products) || products.length === 0) {
//                 console.warn('Products array is empty or not an array. Dropdown will be empty.');
//             }
//         }
//     }, [isOpen, contacts, products]); // Add contacts and products to dependencies

//     const form = useForm<FormState>({
//         contact_id: '',
//         company_name: '',
//         name: '',
//         product_id: null, // Default null untuk product_id
//         product_name: '',
//         deadline: '',
//         current_price: null,
//         qty: null,
//         discount_amount: null,
//         notes: '',
//         column_id: '',
//     });

//     // Efek untuk mereset form dan mengatur ID kolom awal saat modal dibuka
//     useEffect(() => {
//         if (isOpen) {
//             form.reset(); // Reset semua field ke nilai awal
//             form.setData('column_id', initialColumnId); // Atur column_id saat modal dibuka
//             setError(null);
//             form.clearErrors(); // Clear Inertia form errors
//         }
//     }, [isOpen, initialColumnId]); // Bergantung pada isOpen dan initialColumnId

//     const handleContactChange = (selected: any) => {
//         const selectedContact = contacts.find(c => c.id === selected?.value);
//         form.setData({
//             ...form.data,
//             contact_id: selected?.value || '',
//             company_name: selectedContact?.company_name || '',
//             name: selectedContact?.name || '',
//             // Reset bidang terkait produk saat kontak berubah, untuk kondisi bersih
//             product_id: null,
//             product_name: '',
//             current_price: null,
//             qty: null,
//             discount_amount: null,
//             deadline: '',
//             notes: '',
//         });
//         form.clearErrors('contact_id'); // Clear error for contact_id when changed
//     };

//     const handleProductChange = (selected: any) => {
//         const selectedProduct = products.find(p => p.id === selected?.value);
//         form.setData({
//             ...form.data,
//             product_id: selected?.value || null, // Pastikan bisa null
//             product_name: selectedProduct?.name || '',
//             current_price: selectedProduct?.price ?? null,
//         });
//         form.clearErrors('product_id'); // Clear error for product_id when changed
//     };

//     // Hitung grand total secara dinamis
//     const calculatedGrandTotal = (form.data.current_price ?? 0) * (form.data.qty ?? 0) - (form.data.discount_amount ?? 0);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);

//         // Client-side validation for contact_id
//         if (!form.data.contact_id) {
//             setError('Contact is required.');
//             form.setError('contact_id', 'Please select a contact.'); // Set Inertia form error
//             return;
//         }

//         form.post('/kanban/leads', {
//             preserveScroll: true,
//             onSuccess: (page) => {
//                 // Pastikan newLead atau lead diekstraksi dengan benar dari props
//                 // Inertia secara otomatis melemparkan props yang di-flash atau data yang dikembalikan dari controller
//                 const newLeadData = page.props.lead as LeadDatas; // Sesuaikan jika nama prop berbeda di Laravel Anda
//                 if (newLeadData && newLeadData.id) {
//                     onSave(newLeadData);
//                     Swal.fire({
//                         icon: 'success',
//                         title: 'Success!',
//                         text: 'Lead berhasil ditambahkan.',
//                         timer: 1500,
//                         showConfirmButton: false,
//                     });
//                     onClose(); // Tutup modal saat berhasil
//                 } else {
//                     setError('Failed to get new lead data from response.');
//                 }
//             },
//             onError: (errors) => {
//                 // Inertia's onError provides an object of errors
//                 // We can set these directly to the form's errors state
//                 form.setError(errors); // This will populate form.errors
//                 setError('Please correct the errors in the form.'); // Generic error message
//                 console.error('Form submission errors:', errors);
//             },
//             onFinish: () => {
//                 // Reset all form fields to their initial empty state after submission attempt
//                 // column_id is handled by useEffect on modal open
//                 form.reset('contact_id', 'company_name', 'name', 'product_id', 'product_name', 'deadline', 'current_price', 'qty', 'discount_amount', 'notes');
//             },
//         });
//     };

//     return (
//         <ReusableModal
//             isOpen={isOpen}
//             onClose={onClose}
//             title="Add New Lead"
//             onSubmit={handleSubmit}
//             isSubmitting={form.processing}
//             submitLabel="Simpan"
//             cancelLabel="Batal"
//             className="w-[95vw] max-w-[1400px] max-h-[90vh]"
//         >
//             <div className="max-h-[80vh] overflow-y-auto p-2">
//                 {error && (
//                     <div className="text-red-500 p-2 bg-red-50 border border-red-300 rounded mb-4">{error}</div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
//                     {/* Contact Dropdown */}
//                     <div>
//                         <label className="font-semibold block mb-1">Contact *</label>
//                         <Select
//                             // Pastikan contacts adalah array sebelum memanggil map
//                             options={Array.isArray(contacts) ? contacts.map(c => ({ value: c.id, label: c.name })) : []}
//                             onChange={handleContactChange}
//                             value={
//                                 form.data.contact_id
//                                     ? { value: form.data.contact_id, label: contacts.find(c => c.id === form.data.contact_id)?.name || '' }
//                                     : null
//                             }
//                             placeholder="Select contact"
//                             isClearable
//                             isLoading={form.processing}
//                         />
//                         {form.errors.contact_id && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.contact_id}</div>
//                         )}
//                     </div>

//                     {/* Company Name */}
//                     <div>
//                         <label className="font-semibold block mb-1">Perusahaan</label>
//                         <input
//                             type="text"
//                             name="company_name"
//                             value={form.data.company_name}
//                             disabled
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
//                         />
//                     </div>

//                     {/* Product Dropdown */}
//                     <div>
//                         <label className="font-semibold block mb-1">Product</label>
//                         <Select
//                             // Pastikan products adalah array sebelum memanggil map
//                             options={Array.isArray(products) ? products.map(p => ({ value: p.id, label: p.name })) : []}
//                             onChange={handleProductChange}
//                             value={
//                                 form.data.product_id
//                                     ? { value: form.data.product_id, label: products.find(p => p.id === form.data.product_id)?.name || '' }
//                                     : null
//                             }
//                             placeholder="Select product"
//                             isClearable
//                             isLoading={form.processing}
//                         />
//                         {form.errors.product_id && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.product_id}</div>
//                         )}
//                     </div>

//                     {/* Deadline */}
//                     <div>
//                         <label className="font-semibold block mb-1">Deadline</label>
//                         <input
//                             type="date"
//                             name="deadline"
//                             value={form.data.deadline}
//                             onChange={e => form.setData('deadline', e.target.value)}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {form.errors.deadline && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.deadline}</div>
//                         )}
//                     </div>

//                     {/* Current Price */}
//                     <div>
//                         <label className="font-semibold block mb-1">Current Price</label>
//                         <input
//                             type="number"
//                             name="current_price"
//                             value={form.data.current_price ?? ''}
//                             onChange={e =>
//                                 form.setData('current_price', e.target.value === '' ? null : Number(e.target.value))
//                             }
//                             readOnly
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
//                         />
//                         {form.errors.current_price && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.current_price}</div>
//                         )}
//                     </div>

//                     {/* Quantity */}
//                     <div>
//                         <label className="font-semibold block mb-1">Quantity</label>
//                         <input
//                             type="number"
//                             name="qty"
//                             value={form.data.qty ?? ''}
//                             onChange={e =>
//                                 form.setData('qty', e.target.value === '' ? null : Number(e.target.value))
//                             }
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {form.errors.qty && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.qty}</div>
//                         )}
//                     </div>

//                     {/* Discount */}
//                     <div>
//                         <label className="font-semibold block mb-1">Discount</label>
//                         <input
//                             type="number"
//                             name="discount_amount"
//                             value={form.data.discount_amount ?? ''}
//                             onChange={e =>
//                                 form.setData('discount_amount', e.target.value === '' ? null : Number(e.target.value))
//                             }
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {form.errors.discount_amount && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.discount_amount}</div>
//                         )}
//                     </div>

//                     {/* Grand Total */}
//                     <div>
//                         <label className="font-semibold block mb-1">Grand Total</label>
//                         <input
//                             type="number"
//                             value={calculatedGrandTotal}
//                             readOnly
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
//                         />
//                     </div>

//                     {/* Notes */}
//                     <div className="col-span-full">
//                         <label className="font-semibold block mb-1">Notes</label>
//                         <textarea
//                             name="notes"
//                             rows={3}
//                             value={form.data.notes}
//                             onChange={e => form.setData('notes', e.target.value)}
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {form.errors.notes && (
//                             <div className="text-red-600 text-xs mt-1">{form.errors.notes}</div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </ReusableModal>
//     );
// };

// export default AddLeadModal;



import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { LeadDatas, ContactOption, ProductOption } from '@/components/Leads/types';
import ReusableModal from '@/components/Modal/modallead';

interface AddLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newLead: LeadDatas) => void;
    initialColumnId: string;
    contacts: ContactOption[];
    products: ProductOption[];
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialColumnId,
    contacts,
    products,
}) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        column_id: initialColumnId,
        contact_id: '',
        name: '',
        company_name: '',
        product_id: '',
        product_name: '',
        current_price: null,
        qty: null,
        discount_amount: null,
        deadline: '',
        notes: '',
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            setData('column_id', initialColumnId);
        }
    }, [isOpen, initialColumnId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedContact = contacts.find(c => c.id === data.contact_id);
        const selectedProduct = products.find(p => p.id === data.product_id);

        setData('name', selectedContact?.name || '');
        setData('company_name', selectedContact?.company_name || '');
        setData('product_name', selectedProduct?.name || '');

        post('/kanban/leads', {
            preserveScroll: true,
            onSuccess: (page) => {
                const lead = page.props.lead as LeadDatas;
                onSave(lead);
                Swal.fire({ icon: 'success', title: 'Success!', text: 'Lead berhasil ditambahkan.', timer: 1500, showConfirmButton: false });
                onClose();
                reset();
            },
            onError: () => {
                Swal.fire({ icon: 'error', title: 'Gagal menambahkan lead.', text: 'Periksa kembali data yang diisi.' });
            }
        });
    };

    const calculatedGrandTotal = (Number(data.current_price) || 0) * (Number(data.qty) || 0) - (Number(data.discount_amount) || 0);

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Lead Baru"
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitLabel="Simpan"
            cancelLabel="Batal"
            className="w-[95vw] max-w-[1400px] max-h-[90vh]"
        >
            <div className="max-h-[80vh] overflow-y-auto p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">

                    <div>
                        <label className="font-semibold block mb-1">Contact *</label>
                        <Select
                            options={contacts.map(c => ({ value: c.id, label: c.name }))}
                            onChange={(selected) => {
                                const contact = contacts.find(c => c.id === selected?.value);
                                setData('contact_id', selected?.value || '');
                                setData('company_name', contact?.company_name || '');
                                setData('name', contact?.name || '');
                            }}
                            value={data.contact_id ? {
                                value: data.contact_id,
                                label: contacts.find(c => c.id === data.contact_id)?.name,
                            } : null}
                            placeholder="Pilih kontak"
                            isClearable
                        />
                        {errors.contact_id && <div className="text-red-500 text-sm mt-1">{errors.contact_id}</div>}
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Perusahaan</label>
                        <input
                            type="text"
                            name="company_name"
                            value={data.company_name}
                            disabled
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Produk</label>
                        <Select
                            options={products.map(p => ({ value: p.id, label: p.name }))}
                            onChange={(selected) => {
                                const product = products.find(p => p.id === selected?.value);
                                setData('product_id', selected?.value || '');
                                setData('current_price', product?.price ?? 0);
                                setData('product_name', product?.name || '');
                            }}
                            value={data.product_id ? {
                                value: data.product_id,
                                label: products.find(p => p.id === data.product_id)?.name,
                            } : null}
                            placeholder="Pilih produk"
                            isClearable
                        />
                        {errors.product_id && <div className="text-red-500 text-sm mt-1">{errors.product_id}</div>}
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={data.deadline}
                            onChange={(e) => setData('deadline', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Harga</label>
                        <input
                            type="number"
                            name="current_price"
                            value={data.current_price ?? ''}
                            readOnly
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                        />
                        {errors.current_price && <div className="text-red-500 text-sm mt-1">{errors.current_price}</div>}
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Jumlah</label>
                        <input
                            type="number"
                            name="qty"
                            value={data.qty ?? ''}
                            onChange={(e) => setData('qty', e.target.value === '' ? null : Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                        {errors.qty && <div className="text-red-500 text-sm mt-1">{errors.qty}</div>}
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Diskon</label>
                        <input
                            type="number"
                            name="discount_amount"
                            value={data.discount_amount ?? ''}
                            onChange={(e) => setData('discount_amount', e.target.value === '' ? null : Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                        {errors.discount_amount && <div className="text-red-500 text-sm mt-1">{errors.discount_amount}</div>}
                    </div>

                    <div>
                        <label className="font-semibold block mb-1">Total</label>
                        <input
                            type="number"
                            value={calculatedGrandTotal}
                            readOnly
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="font-semibold block mb-1">Catatan</label>
                        <textarea
                            name="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            rows={3}
                        />
                        {errors.notes && <div className="text-red-500 text-sm mt-1">{errors.notes}</div>}
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default AddLeadModal;
