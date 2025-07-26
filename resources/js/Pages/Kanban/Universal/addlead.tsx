// import React, { useEffect, useState } from 'react';
// import ReusableModal from '../../../components/Modal/modallead';
// import { LeadDatas } from '../../../components/Leads/types';
// import Swal from 'sweetalert2';
// import Select from 'react-select';

// interface AddLeadModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (newLead: LeadDatas) => void;
//     // initialColumnId: string; // This prop will no longer be needed
// }

// type FormState = {
//     columnId: string; // Add columnId to form state
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

// interface ColumnOption {
//     id: string;
//     name: string;
// }

// const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSave }) => { // Remove initialColumnId from destructuring
//     const [form, setForm] = useState<FormState>({
//         columnId: '', // Initialize columnId
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
//     const [columns, setColumns] = useState<ColumnOption[]>([]); // New state for columns
//     const [error, setError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     useEffect(() => {
//         if (isOpen) {
//             setForm({
//                 columnId: '', // Reset columnId
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

//             Promise.all([fetch('/contacts'), fetch('/products'), fetch('/columns')]) // Fetch columns as well
//                 .then(async ([contactsRes, productsRes, columnsRes]) => {
//                     if (!contactsRes.ok || !productsRes.ok || !columnsRes.ok) throw new Error('Failed to fetch options.');
//                     const contactsData = await contactsRes.json();
//                     const productsData = await productsRes.json();
//                     const columnsData = await columnsRes.json(); // Get columns data

//                     // Debug log
//                     console.log('Fetched contacts:', contactsData);
//                     console.log('Fetched products:', productsData);
//                     console.log('Fetched columns:', columnsData); // Debug log for columns

//                     // Sort so new data appears at the top (assuming ID increases over time)
//                     const sortedContacts = contactsData.sort((a: ContactOption, b: ContactOption) => b.id.localeCompare(a.id));
//                     const sortedProducts = productsData.sort((a: ProductOption, b: ProductOption) => b.id.localeCompare(a.id));
//                     const sortedColumns = columnsData.sort((a: ColumnOption, b: ColumnOption) => b.id.localeCompare(a.id)); // Sort columns

//                     setContacts(sortedContacts);
//                     setProducts(sortedProducts);
//                     setColumns(sortedColumns); // Set columns

//                     // Automatically select the first column if available
//                     if (sortedColumns.length > 0) {
//                         setForm(prev => ({ ...prev, columnId: sortedColumns[0].id }));
//                     }
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

//     const handleColumnChange = (selected: any) => { // New handler for column change
//         setForm(prev => ({
//             ...prev,
//             columnId: selected?.value || '',
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

//         if (!form.columnId) { // Validate column selection
//             setError('Column is required.');
//             setIsSubmitting(false);
//             return;
//         }

//         const selectedContactName = contacts.find(c => c.id === form.contactId)?.name || '';
//         const selectedProductName = products.find(p => p.id === form.productId)?.name || '';

//         const payload = {
//             column_id: form.columnId, // Use the selected columnId from form state
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
//                     {/* Column Dropdown */}
//                     <div>
//                         <label className="font-semibold block mb-1">Column *</label>
//                         <Select
//                             isLoading={isLoading}
//                             options={columns.map(col => ({ value: col.id, label: col.name }))}
//                             onChange={handleColumnChange}
//                             value={form.columnId ? { value: form.columnId, label: columns.find(col => col.id === form.columnId)?.name } : null}
//                             placeholder="Select column"
//                             isClearable={false} // Column should always be selected
//                         />
//                     </div>

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

import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import ReusableModal from '@/components/Modal/modallead';
import { LeadDatas, ContactOption, ProductOption, ColumnOption } from '@/components/Leads/types';

interface AddLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newLead: LeadDatas) => void;
    contacts: ContactOption[];
    products: ProductOption[];
    columns: ColumnOption[];
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({
    isOpen, onClose, onSave, contacts, products, columns
}) => {
    const {
        data, setData, post, processing, errors, reset
    } = useForm({
        column_id: '',
        contact_id: '',
        company_name: '',
        product_id: '',
        current_price: '',
        qty: '',
        discount_amount: '',
        deadline: '',
        notes: '',
    });

    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen]);

    useEffect(() => {
        const price = Number(data.current_price) || 0;
        const qty = Number(data.qty) || 0;
        const discount = Number(data.discount_amount) || 0;
        setGrandTotal((price * qty) - discount);
    }, [data.current_price, data.qty, data.discount_amount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/add/leads', {
            preserveScroll: true,
            onSuccess: (res) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Lead berhasil ditambahkan.',
                    timer: 1500,
                    showConfirmButton: false,
                });
                if (res?.props?.newLead) {
                    onSave(res.props.newLead);
                }
                onClose();
            },
            onError: (err) => {
                Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menambahkan lead.' });
            }
        });
    };

    const handleContactChange = (selected: any) => {
        const contact = contacts.find(c => c.id === selected?.value);
        setData('contact_id', selected?.value || '');
        setData('company_name', contact?.company_name || '');
    };

    const handleProductChange = (selected: any) => {
        const product = products.find(p => p.id === selected?.value);
        setData('product_id', selected?.value || '');
        setData('current_price', product?.price?.toString() || '');
    };

    const handleColumnChange = (selected: any) => {
        setData('column_id', selected?.value || '');
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Lead"
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitLabel="Simpan"
            cancelLabel="Batal"
            className="w-[95vw] max-w-[1400px] max-h-[90vh]"
        >
            <div className="max-h-[80vh] overflow-y-auto p-2 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Column */}
                    <div>
                        <label className="font-semibold block mb-1">Column *</label>
                        <Select
                            options={columns.map(c => ({ label: c.name, value: c.id }))}
                            onChange={handleColumnChange}
                            value={columns.find(c => c.id === data.column_id) ? {
                                label: columns.find(c => c.id === data.column_id)?.name,
                                value: data.column_id
                            } : null}
                        />
                        {errors.column_id && <div className="text-red-500">{errors.column_id}</div>}
                    </div>

                    {/* Contact */}
                    <div>
                        <label className="font-semibold block mb-1">Contact *</label>
                        <Select
                            options={contacts.map(c => ({ label: c.name, value: c.id }))}
                            onChange={handleContactChange}
                            value={contacts.find(c => c.id === data.contact_id) ? {
                                label: contacts.find(c => c.id === data.contact_id)?.name,
                                value: data.contact_id
                            } : null}
                        />
                        {errors.contact_id && <div className="text-red-500">{errors.contact_id}</div>}
                    </div>

                    {/* Company */}
                    <div>
                        <label className="font-semibold block mb-1">Company</label>
                        <input
                            type="text"
                            name="company_name"
                            value={data.company_name}
                            readOnly
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    {/* Product */}
                    <div>
                        <label className="font-semibold block mb-1">Product</label>
                        <Select
                            options={products.map(p => ({ label: p.name, value: p.id }))}
                            onChange={handleProductChange}
                            value={products.find(p => p.id === data.product_id) ? {
                                label: products.find(p => p.id === data.product_id)?.name,
                                value: data.product_id
                            } : null}
                        />
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="font-semibold block mb-1">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={data.deadline}
                            onChange={e => setData('deadline', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    {/* Current Price */}
                    <div>
                        <label className="font-semibold block mb-1">Current Price</label>
                        <input
                            type="number"
                            value={data.current_price}
                            readOnly
                            className="w-full border px-3 py-2 rounded bg-gray-100"
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="font-semibold block mb-1">Quantity</label>
                        <input
                            type="number"
                            value={data.qty}
                            onChange={e => setData('qty', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="font-semibold block mb-1">Discount</label>
                        <input
                            type="number"
                            value={data.discount_amount}
                            onChange={e => setData('discount_amount', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    {/* Grand Total */}
                    <div>
                        <label className="font-semibold block mb-1">Grand Total</label>
                        <input
                            type="number"
                            value={grandTotal}
                            readOnly
                            className="w-full border px-3 py-2 rounded bg-gray-100"
                        />
                    </div>

                    {/* Notes */}
                    <div className="col-span-full">
                        <label className="font-semibold block mb-1">Notes</label>
                        <textarea
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            rows={3}
                        />
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default AddLeadModal;
