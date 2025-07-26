// resources/js/Components/Tabel/TableRowProduct.tsx
import React from 'react';
import ActionMenuProduct from './ActionMenuProduct'; // Ensure this path is correct
import { Product as ProductType } from '@/components/Types/types'; // Import the ProductType

type TableRowProductProps = {
    id: string; // Assuming UUID from your Laravel model is a string
    name: string;
    slug: string;
    price: number;
    description: string | null; // Changed to allow null
    image: string | null; // Changed to allow null
    created_at: string;
    updated_at: string;
    onEdit: (product: ProductType) => void;
    onDelete: (product: ProductType) => void;
    onDetail: (product: ProductType) => void;
};

const TableRowProduct: React.FC<TableRowProductProps> = ({
    id,
    name,
    slug,
    price,
    description,
    image,
    created_at,
    updated_at,
    onEdit,
    onDelete,
    onDetail
}) => {
    // Construct the full ProductType object to pass to handlers and ActionMenuProduct
    const productFull: ProductType = {
        id,
        name,
        slug,
        price,
        description,
        image,
        created_at,
        updated_at,
        deleted_at: null, // Assuming it's null if not explicitly passed
    };

    return (
        <tr className="bg-white border border-[#E9ECEF] rounded-lg">
            <td className="pl-6 py-3 leading-tight">
                <div className="font-semibold">{name}</div>
            </td>
            {/* <td className="py-3 text-sm">{slug}</td> */}
            <td className="py-3 text-sm">{price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
            {/* <td className="py-3 text-sm line-clamp-2 max-w-xs">{description}</td> */}
            <td className="py-3 text-xs text-[#344767]">
                {description ? (
                    <span>{description}</span>
                ) : (
                    <span className="text-gray-400">Tidak ada deskripsi</span>
                )}
            </td>

            <td className="py-3">
                {/* {image ? (
                    <img src={image} alt={name} className="w-12 h-12 object-cover rounded" />
                ) : (
                    <span className="text-gray-400">No Image</span>
                )} */}
                <img
                    src={image || '/images/default-product.jpg'}
                    alt={name}
                    className="w-20 h-20 object-contain rounded-md border"
                />

            </td>
            <td className="py-3 text-xs text-[#344767]">{new Date(created_at).toLocaleString()}</td>
            <td className="py-3 text-xs text-[#344767]">{new Date(updated_at).toLocaleString()}</td>
            <td className="relative py-3 pr-6 text-right">
                <ActionMenuProduct
                    product={productFull}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDetail={onDetail}
                />
            </td>
        </tr>
    );
};

export default TableRowProduct;
