// import React from 'react';
// import ActionMenuSector from './ActionMenuSector'; // You'll need to create this component
// import { Sector as SectorType } from '@/components/Types/types'; // Import the SectorType
// import { UUID } from "crypto";

// type TableRowSectorProps = {
//     id: UUID; // Assuming UUID from your Laravel model, so it should be a string
//     name: string;
//     bg_color: string;
//     text_color: string;
//     created_at: string;
//     updated_at: string;
//     onEdit: (sector: SectorType) => void;
//     onDelete: (sector: SectorType) => void;
//     onDetail: (sector: SectorType) => void;
// };

// const TableRowSector: React.FC<TableRowSectorProps> = ({
//     id,
//     name,
//     bg_color,
//     text_color,
//     created_at,
//     updated_at,
//     onEdit,
//     onDelete,
//     onDetail,
// }) => {
//     // Construct the full SectorType object to pass to handlers and ActionMenu
//     const sectorFull: SectorType = {
//         id,
//         name,
//         bg_color,
//         text_color,
//         created_at,
//         updated_at,
//         // If your SectorType has 'deleted_at' for soft deletes, add it here as null
//         // deleted_at: null,
//     };

//     return (
//         <tr className="bg-white border border-[#E9ECEF] rounded-lg">
//             <td className="pl-6 py-3 leading-tight">
//                 <div className="font-semibold">{name}</div>
//             </td>
//             <td className="py-3 text-sm">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg_color} ${text_color}`}>
//                     {bg_color}
//                 </span>
//             </td>
//             <td className="py-3 text-sm">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg_color} ${text_color}`}>
//                     {text_color}
//                 </span>
//             </td>
//             <td className="py-3 text-xs text-[#344767]">{new Date(created_at).toLocaleString()}</td>
//             <td className="py-3 text-xs text-[#344767]">{new Date(updated_at).toLocaleString()}</td>
//             <td className="relative py-3 pr-6 text-right">
//                 <ActionMenuSector
//                     sector={sectorFull}
//                     onEdit={onEdit}
//                     onDelete={onDelete}
//                     onDetail={onDetail}
//                 />
//             </td>
//         </tr>
//     );
// };

// export default TableRowSector;

import React from 'react';
import ActionMenuSector from './ActionMenuSector';
import { Sector as SectorType } from '@/components/Types/types';
import { UUID } from "crypto";

type TableRowSectorProps = {
    id: UUID;
    name: string;
    bg_color: string;
    text_color: string;
    created_at: string;
    updated_at: string;
    onEdit: (sector: SectorType) => void;
    onDelete: (sector: SectorType) => void;
    onDetail: (sector: SectorType) => void;
};

const TableRowSector: React.FC<TableRowSectorProps> = ({
    id,
    name,
    bg_color,
    text_color,
    created_at,
    updated_at,
    onEdit,
    onDelete,
    onDetail,
}) => {
    const sectorFull: SectorType = {
        id,
        name,
        bg_color,
        text_color,
        created_at,
        updated_at,
    };

    return (
        <tr className="bg-white border border-[#E9ECEF] rounded-lg">
            <td className="pl-6 py-3 leading-tight">
                <div className="font-semibold">{name}</div>
            </td>

            {/* BG Color Preview */}
            <td className="py-3 text-sm">
                <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: bg_color, color: '#ffffff' }}
                >
                    {bg_color}
                </span>
            </td>

            {/* Text Color Preview */}
            <td className="py-3 text-sm">
                <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#f0f0f0', color: text_color }}
                >
                    {text_color}
                </span>
            </td>

            <td className="py-3 text-xs text-[#344767]">
                {new Date(created_at).toLocaleString()}
            </td>
            <td className="py-3 text-xs text-[#344767]">
                {new Date(updated_at).toLocaleString()}
            </td>

            <td className="relative py-3 pr-6 text-right">
                <ActionMenuSector
                    sector={sectorFull}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDetail={onDetail}
                />
            </td>
        </tr>
    );
};

export default TableRowSector;
