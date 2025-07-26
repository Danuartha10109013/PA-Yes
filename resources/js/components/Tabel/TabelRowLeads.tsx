// import React, { useState, useEffect } from 'react';
// import ActionMenuTransactionLead from './ActionMenuLeads';
// import { LeadDatas as TransactionLeadType, ColumnData } from '@/components/Leads/types'; // Import ColumnData

// type TableRowTransactionLeadProps = {
//     lead?: TransactionLeadType;
//     onEdit: (lead: TransactionLeadType) => void;
//     onDelete: (lead: TransactionLeadType) => void;
//     onDetail: (lead: TransactionLeadType) => void;
//     onColumnChange: (leadId: string, newColumnId: string) => void;
// };

// const TableRowTransactionLead: React.FC<TableRowTransactionLeadProps> = ({
//     lead,
//     onEdit,
//     onDelete,
//     onDetail,
//     onColumnChange,
// }) => {
//     if (!lead) {
//         console.warn('Lead data is missing for a table row. Skipping render.');
//         return null;
//     }

//     const {
//         id,
//         trx,
//         name,
//         company_name,
//         product,
//         deadline,
//         current_price,
//         qty,
//         grand_total,
//         sector,
//         sectorColor,
//         assigneeInitials,
//         assigneeBgColor,
//         created_at,
//         updated_at,
//         notes,
//         columnId, // Use column_id here
//     } = lead;

//     const [columns, setColumns] = useState<ColumnData[]>([]); // Use ColumnData for state

//     useEffect(() => {
//         const fetchColumns = async () => {
//             try {
//                 const response = await fetch('/kanban/leads');
//                 if (!response.ok) {
//                     throw new Error(`Failed to fetch columns: ${response.statusText}`);
//                 }
//                 const columnsData: ColumnData[] = await response.json(); // Cast to ColumnData[]
//                 setColumns(columnsData);
//             } catch (error) {
//                 console.error("Failed to fetch columns:", error);
//             }
//         };
//         fetchColumns();
//     }, []);

//     // Currency and Date formatters (unchanged)
//     const currencyFormatter = new Intl.NumberFormat('id-ID', {
//         style: 'currency',
//         currency: 'IDR',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//     });

//     const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//     });

//     const dateFormatter = new Intl.DateTimeFormat('id-ID', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//     });

//     const formatCurrency = (value: number | null | undefined): string => {
//         if (value === null || value === undefined || isNaN(value)) {
//             return 'N/A';
//         }
//         return currencyFormatter.format(value);
//     };

//     const formatDateTime = (dateString: string | null | undefined): string => {
//         if (!dateString) return 'N/A';
//         try {
//             return dateTimeFormatter.format(new Date(dateString));
//         } catch (e) {
//             console.error('Invalid date/time string:', dateString, e);
//             return 'Invalid Date';
//         }
//     };

//     // const formatDateOnly = (dateString: string | null | undefined): string => {
//     //     if (!dateString) return 'N/A';
//     //     try {
//     //         return dateFormatter.format(new Date(dateString));
//     //     } catch (e) {
//     //         console.error('Invalid date string:', dateString, e);
//     //         return 'Invalid Date';
//     //     }
//     // };
//     const formatDateOnly = (dateString: string | null | undefined): string => {
//         if (!dateString) return 'N/A';
//         const parts = dateString.split('-');
//         if (parts.length === 3) {
//             const [year, month, day] = parts;
//             return `${day}-${month}-${year}`; // atau ubah sesuai kebutuhan
//         }
//         return 'Invalid Date';
//     };
//     console.log('DEBUG DEADLINE:', lead.deadline);


//     return (
//         <tr className="bg-white border border-[#E9ECEF] rounded-lg hover:bg-gray-50 transition-colors duration-200">
//             <td className="pl-6 py-3 leading-tight">
//                 <div className="font-semibold text-base text-[#344767]">{name || 'N/A'}</div>
//             </td>
//             <td className="py-3 leading-tight">
//                 {company_name || <span className="text-gray-400">N/A</span>}
//                 {/* <div className="font-semibold text-base text-[#344767]">{name || 'N/A'}</div>
//                 <div className="text-sm text-gray-500">{company_name || 'N/A'}</div> */}
//             </td>
//             <td className="py-3 text-sm">
//                 {product || <span className="text-gray-400">N/A</span>}
//             </td>
//             {/* <td className="py-3 text-sm">
//                 <div>{formatCurrency(current_price)}</div>
//                 {qty !== null && qty !== undefined && (
//                     <div className="text-gray-600">Qty: {qty}</div>
//                 )}
//             </td> */}
//             {/* <td className="py-3 text-sm font-bold text-[#344767]">
//                 {formatCurrency(grand_total)}
//             </td> */}
//             <td className="py-3 text-sm">{formatDateOnly(deadline)}</td>
//             <td className="py-3 text-sm">
//                 {sector && (
//                     <span
//                         className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
//                         style={{ backgroundColor: sectorColor || '#e0e0e0', color: '#333' }}
//                     >
//                         {sector}
//                     </span>
//                 )}
//                 {assigneeInitials && (
//                     <div
//                         className="mt-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
//                         style={{ backgroundColor: assigneeBgColor || '#6c757d' }}
//                         title={`Assignee: ${name || ''}`}
//                     >
//                         {assigneeInitials}
//                     </div>
//                 )}
//                 {!sector && !assigneeInitials && <span className="text-gray-400">N/A</span>}
//             </td>
//             <td className="py-3 text-xs text-[#344767]">{formatDateTime(created_at)}</td>
//             <td className="py-3 text-xs text-[#344767]">{formatDateTime(updated_at)}</td>
//             {/* <td className="py-3 text-sm text-gray-700 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={notes || ''}>
//                 {notes || <span className="text-gray-400">No Notes</span>}
//             </td> */}
//             {/* Column Selection Dropdown */}
//             <td className="py-3">
//                 <select
//                     value={columnId}
//                     onChange={(e) => onColumnChange(id, e.target.value)}
//                     className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
//                 >
//                     {columns.map((col) => (
//                         <option key={col.id} value={col.id}>{col.title}</option>
//                     ))}
//                 </select>
//             </td>
//             <td className="relative py-3 pr-6 text-right">
//                 <ActionMenuTransactionLead
//                     lead={lead}
//                     onEdit={onEdit}
//                     onDelete={onDelete}
//                     onDetail={onDetail}
//                 />
//             </td>
//         </tr>
//     );
// };


// export default TableRowTransactionLead;


// import React from 'react';
// import ActionMenuTransactionLead from './ActionMenuLeads';
// import { LeadDatas as TransactionLeadType, ColumnData } from '@/components/Leads/types';

// type TableRowTransactionLeadProps = {
//     lead?: TransactionLeadType;
//     onEdit: (lead: TransactionLeadType) => void;
//     onDelete: (lead: TransactionLeadType) => void;
//     onDetail: (lead: TransactionLeadType) => void;
//     onColumnChange: (leadId: string, newColumnId: string) => void;
//     columns: { id: string; title: string }[]; // Receive columns as a prop
// };

// const TableRowTransactionLead: React.FC<TableRowTransactionLeadProps> = ({
//     lead,
//     onEdit,
//     onDelete,
//     onDetail,
//     onColumnChange,
//     columns, // Destructure columns from props
// }) => {
//     if (!lead) {
//         console.warn('Lead data is missing for a table row. Skipping render.');
//         return null;
//     }

//     const {
//         id,
//         trx,
//         name,
//         company_name,
//         product,
//         deadline,
//         current_price,
//         qty,
//         grand_total,
//         sector,
//         sectorColor,
//         assigneeInitials,
//         assigneeBgColor,
//         created_at,
//         updated_at,
//         notes,
//         columnId,
//     } = lead;

//     // No need for useState and useEffect to fetch columns here anymore!

//     // Currency and Date formatters (unchanged)
//     const currencyFormatter = new Intl.NumberFormat('id-ID', {
//         style: 'currency',
//         currency: 'IDR',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//     });

//     const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//     });

//     const dateFormatter = new Intl.DateTimeFormat('id-ID', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//     });

//     const formatCurrency = (value: number | null | undefined): string => {
//         if (value === null || value === undefined || isNaN(value)) {
//             return 'N/A';
//         }
//         return currencyFormatter.format(value);
//     };

//     const formatDateTime = (dateString: string | null | undefined): string => {
//         if (!dateString) return 'N/A';
//         try {
//             return dateTimeFormatter.format(new Date(dateString));
//         } catch (e) {
//             console.error('Invalid date/time string:', dateString, e);
//             return 'Invalid Date';
//         }
//     };

//     const formatDateOnly = (dateString: string | null | undefined): string => {
//         if (!dateString) return 'N/A';
//         const parts = dateString.split('-');
//         if (parts.length === 3) {
//             const [year, month, day] = parts;
//             return `${day}-${month}-${year}`;
//         }
//         return 'Invalid Date';
//     };
//     console.log('DEBUG DEADLINE:', lead.deadline);

//     return (
//         <tr className="bg-white border border-[#E9ECEF] rounded-lg hover:bg-gray-50 transition-colors duration-200">
//             <td className="pl-6 py-3 leading-tight">
//                 <div className="font-semibold text-base text-[#344767]">{name || 'N/A'}</div>
//             </td>
//             <td className="py-3 leading-tight">
//                 {company_name || <span className="text-gray-400">N/A</span>}
//             </td>
//             <td className="py-3 text-sm">
//                 {product || <span className="text-gray-400">N/A</span>}
//             </td>
//             <td className="py-3 text-sm">{formatDateOnly(deadline)}</td>
//             <td className="py-3 text-sm">
//                 {sector && (
//                     <span
//                         className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
//                         style={{ backgroundColor: sectorColor || '#e0e0e0', color: '#333' }}
//                     >
//                         {sector}
//                     </span>
//                 )}
//                 {assigneeInitials && (
//                     <div
//                         className="mt-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
//                         style={{ backgroundColor: assigneeBgColor || '#6c757d' }}
//                         title={`Assignee: ${name || ''}`}
//                     >
//                         {assigneeInitials}
//                     </div>
//                 )}
//                 {!sector && !assigneeInitials && <span className="text-gray-400">N/A</span>}
//             </td>
//             <td className="py-3 text-xs text-[#344767]">{formatDateTime(created_at)}</td>
//             <td className="py-3 text-xs text-[#344767]">{formatDateTime(updated_at)}</td>
//             <td className="py-3">
//                 <select
//                     value={columnId}
//                     onChange={(e) => onColumnChange(id, e.target.value)}
//                     className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
//                 >
//                     {columns.map((col) => (
//                         <option key={col.id} value={col.id}>{col.title}</option>
//                     ))}
//                 </select>
//             </td>
//             <td className="relative py-3 pr-6 text-right">
//                 <ActionMenuTransactionLead
//                     lead={lead}
//                     onEdit={onEdit}
//                     onDelete={onDelete}
//                     onDetail={onDetail}
//                 />
//             </td>
//         </tr>
//     );
// };

// export default TableRowTransactionLead;


import React from 'react';
import ActionMenuTransactionLead from './ActionMenuLeads'; // Adjust path if needed
import { LeadDatas as TransactionLeadType, ColumnData } from '@/components/Leads/types';

type TableRowTransactionLeadProps = {
    lead?: TransactionLeadType;
    onEdit: (lead: TransactionLeadType) => void;
    onDelete: (lead: TransactionLeadType) => void;
    onDetail: (lead: TransactionLeadType) => void;
    onColumnChange: (leadId: string, newColumnId: string) => void;
    columns: { id: string; name: string }[]; // Receive columns as a prop
};

const TableRowTransactionLead: React.FC<TableRowTransactionLeadProps> = ({
    lead,
    onEdit,
    onDelete,
    onDetail,
    onColumnChange,
    columns, // Destructure columns from props
}) => {
    if (!lead) {
        console.warn('Lead data is missing for a table row. Skipping render.');
        return null;
    }

    const {
        id,
        trx,
        name,
        company_name,
        product,
        deadline,
        current_price, // Not displayed in table but available
        qty, // Not displayed in table but available
        grand_total, // Not displayed in table but available
        sector,
        sectorColor,
        assigneeInitials,
        assigneeBgColor,
        created_at,
        updated_at,
        notes, // Not displayed in table but available
        columnId,
    } = lead;

    // Currency and Date formatters (unchanged)
    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const formatCurrency = (value: number | null | undefined): string => {
        if (value === null || value === undefined || isNaN(value)) {
            return 'N/A';
        }
        return currencyFormatter.format(value);
    };

    const formatDateTime = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A';
        try {
            return dateTimeFormatter.format(new Date(dateString));
        } catch (e) {
            console.error('Invalid date/time string:', dateString, e);
            return 'Invalid Date';
        }
    };

    const formatDateOnly = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A';
        // Assuming deadline is YYYY-MM-DD
        try {
            return dateFormatter.format(new Date(dateString + 'T00:00:00')); // Add T00:00:00 for correct parsing
        } catch (e) {
            console.error('Invalid date string:', dateString, e);
            return 'Invalid Date';
        }
    };

    // console.log('DEBUG DEADLINE:', lead.deadline); // Keep for debugging if needed

    return (
        <tr className="bg-white border border-[#E9ECEF] rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <td className="pl-6 py-3 leading-tight">
                <div className="font-semibold text-base text-[#344767]">{name || 'N/A'}</div>
            </td>
            <td className="py-3 leading-tight">
                {company_name || <span className="text-gray-400">N/A</span>}
            </td>
            <td className="py-3 text-sm">
                {product || <span className="text-gray-400">N/A</span>}
            </td>
            <td className="py-3 text-sm">{formatDateOnly(deadline)}</td>
            <td className="py-3 text-sm">
                {sector && (
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: sectorColor || '#e0e0e0', color: '#333' }}
                    >
                        {sector}
                    </span>
                )}
                {assigneeInitials && (
                    <div
                        className="mt-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ backgroundColor: assigneeBgColor || '#6c757d' }}
                        title={`Assignee: ${name || ''}`}
                    >
                        {assigneeInitials}
                    </div>
                )}
                {!sector && !assigneeInitials && <span className="text-gray-400">N/A</span>}
            </td>
            <td className="py-3 text-xs text-[#344767]">{formatDateTime(created_at)}</td>
            <td className="py-3 text-xs text-[#344767]">{formatDateTime(updated_at)}</td>
            <td className="py-3">
                <select
                    value={columnId}
                    onChange={(e) => onColumnChange(id, e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                >
                    {columns.map((col) => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                </select>
            </td>
            <td className="relative py-3 pr-6 text-right">
                <ActionMenuTransactionLead
                    lead={lead}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDetail={onDetail}
                />
            </td>
        </tr>
    );
};

export default TableRowTransactionLead;
