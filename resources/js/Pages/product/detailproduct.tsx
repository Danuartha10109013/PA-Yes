import React from 'react';
import Drawer from '@/components/Drawer/Drawer';
import { Product } from '@/components/Types/types';

interface ProductDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({ isOpen, onClose, product }) => {
    if (!product) return null;

    const formatCurrency = (value: number | undefined | null) => {
        if (value === undefined || value === null) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const inputDisplayClasses =
        'border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-700 text-sm';
    const labelClasses = 'text-xs text-gray-500 block mb-0.5';

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
                    <h2 className="text-xl font-bold text-[#344767]">Detail Produk</h2>
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
                        {/* Nama Produk */}
                        <div className="col-span-2">
                            <p className={labelClasses}>Nama Produk</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{product.name}</p>
                        </div>

                        {/* Slug */}
                        <div className="col-span-2">
                            <p className={labelClasses}>Slug</p>
                            <p className={`${inputDisplayClasses} font-medium`}>{product.slug}</p>
                        </div>

                        {/* Harga */}
                        <div className="col-span-2">
                            <p className={labelClasses}>Harga</p>
                            <p className={`${inputDisplayClasses} font-medium`}>
                                {formatCurrency(product.price)}
                            </p>
                        </div>

                        {/* Gambar */}
                        {product.image && (
                            <div className="col-span-2">
                                <p className={labelClasses}>Gambar</p>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-40 mt-1 rounded shadow object-contain border"
                                />
                            </div>
                        )}

                        {/* Deskripsi */}
                        <div className="col-span-2">
                            <p className={labelClasses}>Deskripsi</p>
                            <p
                                className={`${inputDisplayClasses} font-medium whitespace-pre-wrap`}
                            >
                                {product.description || '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default ProductDetailDrawer;
