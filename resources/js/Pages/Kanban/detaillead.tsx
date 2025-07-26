// import React from 'react';
// import Drawer from '@/components/Drawer/Drawer';
// import { LeadDatas } from '@/components/Leads/types';
// // import { Carbon } from 'carbon-components-react'; // Pastikan Carbon diimport jika digunakan untuk format tanggal

// interface LeadDetailDrawerProps {
//     isOpen: boolean;
//     onClose: () => void;
//     lead: LeadDatas | null;
// }

// const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({ isOpen, onClose, lead }) => {
//     if (!lead) return null;

//     // --- TAMBAHKAN LOGS INI ---
//     console.log("DEBUG: Email:", lead?.email);
//     console.log("DEBUG: Phone:", lead?.phone);
//     console.log("DEBUG: Social Media:", lead?.social_media);
//     console.log("DEBUG: Address:", lead?.address);

//     // --- AKHIR LOGS ---

//     const formatCurrency = (value: number | undefined | null) => {
//         if (value === undefined || value === null) return '-';
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency',
//             currency: 'IDR',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//         }).format(value);
//     };

//     const formatDate = (dateString: string | null | undefined) => {
//         if (!dateString) return '-';
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//             });
//         } catch (error) {
//             console.error("Error formatting date:", dateString, error);
//             return dateString;
//         }
//     };

//     const inputDisplayClasses = "border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-700 text-sm";
//     const labelClasses = "text-xs text-gray-500 block mb-0.5";

//     return (
//         <Drawer
//             isOpen={isOpen}
//             onClose={onClose}
//             position="right"
//             width="500px"
//             className="drawer-with-top-shadow"
//         >
//             <div className="p-4 flex flex-col h-full">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold text-[#344767]">Detail Lead</h2>
//                     <button
//                         onClick={onClose}
//                         className="text-gray-500 hover:text-gray-700 text-xl"
//                         aria-label="Close"
//                     >
//                         &times;
//                     </button>
//                 </div>

//                 <div className="flex-grow overflow-y-auto pr-3">
//                     <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-gray-700">
//                         {/* Nama Lead */}
//                         <div>
//                             <p className={labelClasses}>Nama Lead</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{lead.name}</p>
//                         </div>

//                         {/* Perusahaan */}
//                         <div>
//                             <p className={labelClasses}>Perusahaan</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{lead.company_name || '-'}</p>
//                         </div>

//                         {/* Email */}
//                         <div>
//                             <p className={labelClasses}>Email</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{lead.email || '-'}</p>
//                         </div>

//                         {/* No. Telepon */}
//                         <div>
//                             <p className={labelClasses}>No. Telepon</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{lead.phone || '-'}</p>
//                         </div>

//                         {/* Sosial Media */}
//                         <div>
//                             <p className={labelClasses}>Sosial Media</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{lead.social_media || '-'}</p>
//                         </div>

//                         {/* Alamat (Spans both columns) */}
//                         <div className="col-span-2">
//                             <p className={labelClasses}>Alamat</p>
//                             <p className={`${inputDisplayClasses} font-medium whitespace-pre-wrap`}>{lead.address || '-'}</p>
//                         </div>

//                         {/* Produk */}
//                         <div>
//                             <p className={labelClasses}>Produk</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{lead.product || '-'}</p>
//                         </div>

//                         {/* Harga Saat Ini */}
//                         <div>
//                             <p className={labelClasses}>Harga Saat Ini</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{formatCurrency(lead.current_price)}</p>
//                         </div>

//                         {/* Kuantitas */}
//                         <div>
//                             <p className={labelClasses}>Kuantitas</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{lead.qty || '-'}</p>
//                         </div>

//                         {/* Total Harga */}
//                         <div>
//                             <p className={labelClasses}>Total Harga</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{formatCurrency(lead.grand_total)}</p>
//                         </div>

//                         {/* Tenggat Waktu */}
//                         {/* Pastikan Anda menambahkan ini jika ingin ditampilkan */}
//                         <div>
//                             <p className={labelClasses}>Tenggat Waktu</p>
//                             <p className={`${inputDisplayClasses} font-medium`}>{formatDate(lead.deadline)}</p>
//                         </div>

//                         {/* Catatan (Spans both columns) */}
//                         <div className="col-span-2">
//                             <p className={labelClasses}>Catatan</p>
//                             <p className={`${inputDisplayClasses} font-medium whitespace-pre-wrap`}>{lead.notes || '-'}</p>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </Drawer>
//     );
// };

// export default LeadDetailDrawer;


import React from 'react';
import Drawer from '@/components/Drawer/Drawer';
import { LeadDatas } from '@/components/Leads/types';

interface LeadDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    lead: LeadDatas | null;
}

const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({ isOpen, onClose, lead }) => {
    if (!lead) return null;

    const formatCurrency = (value: number | undefined | null) => {
        if (value === undefined || value === null) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (error) {
            console.error("Error formatting date:", dateString, error);
            return dateString;
        }
    };

    const inputDisplayClasses = "border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-700 text-sm";
    const labelClasses = "text-xs text-gray-500 block mb-0.5";

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            position="right"
            width="500px"
            className="drawer-with-top-shadow"
        >
            <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#344767]">Detail Lead</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto pr-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-gray-700">
                        {/* Nama Lead */}
                        <div>
                            <p className={labelClasses}>Nama Lead</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{lead.name}</p>
                        </div>

                        {/* Perusahaan */}
                        <div>
                            <p className={labelClasses}>Perusahaan</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{lead.company_name || '-'}</p>
                        </div>

                        {/* Email */}
                        <div>
                            <p className={labelClasses}>Email</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{lead.email || '-'}</p>
                        </div>

                        {/* No. Telepon */}
                        <div>
                            <p className={labelClasses}>No. Telepon</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{lead.phone || '-'}</p>
                        </div>

                        {/* Sosial Media */}
                        <div className="col-span-2">
                            <p className={labelClasses}>Sosial Media</p>
                            {Array.isArray(lead.social_media) && lead.social_media.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                                    {lead.social_media.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={`${inputDisplayClasses} font-medium`}>-</p>
                            )}
                        </div>

                        {/* Alamat */}
                        <div className="col-span-2">
                            <p className={labelClasses}>Alamat</p>
                            {Array.isArray(lead.address) && lead.address.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                                    {lead.address.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={`${inputDisplayClasses} font-medium`}>-</p>
                            )}
                        </div>

                        {/* Produk */}
                        <div>
                            <p className={labelClasses}>Produk</p>
                            <p className={`${inputDisplayClasses} font-medium`}>
                                {typeof lead.product === 'string' ? lead.product : (lead.product?.name ?? '-')}
                            </p>
                        </div>

                        {/* Harga Saat Ini */}
                        <div>
                            <p className={labelClasses}>Harga Saat Ini</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{formatCurrency(lead.current_price)}</p>
                        </div>

                        {/* Kuantitas */}
                        <div>
                            <p className={labelClasses}>Kuantitas</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{lead.qty || '-'}</p>
                        </div>

                        {/* Total Harga */}
                        <div>
                            <p className={labelClasses}>Total Harga</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{formatCurrency(lead.grand_total)}</p>
                        </div>

                        {/* Tenggat Waktu */}
                        <div>
                            <p className={labelClasses}>Tenggat Waktu</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{formatDate(lead.deadline)}</p>
                        </div>

                        {/* Catatan */}
                        <div className="col-span-2">
                            <p className={labelClasses}>Catatan</p>
                            <p className={`${inputDisplayClasses} font-medium whitespace-pre-wrap`}>{lead.notes || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default LeadDetailDrawer;
