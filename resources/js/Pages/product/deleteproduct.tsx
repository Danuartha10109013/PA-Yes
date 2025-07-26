import React from 'react';
import ReusableModal from '@/components/Modal/modal';
import { Product as ProductType } from '@/components/Types/types';
import { UUID } from 'crypto'; // Assuming UUID is used for Product IDs as well

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: UUID) => void; // Expects to receive the ID for deletion
    product: ProductType; // The product object to be deleted
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
    isOpen,
    onClose,
    onDelete,
    product,
}) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (product && product.id) {
            onDelete(product.id as UUID); // Cast product.id to UUID as per your types
        }
        // The parent component will handle closing the modal after the delete operation
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Hapus Produk"
            onSubmit={handleSubmit}
            submitLabel="Hapus"
            cancelLabel="Batal"
            isSubmitting={false} // No internal submission state needed for this modal
        >
            <p className="text-gray-700 mb-4">
                Apakah Anda yakin ingin menghapus produk ini?
            </p>
            <p className="font-semibold text-lg text-red-600">
                {product?.name} (Rp {product?.price.toLocaleString('id-ID')})
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Tindakan ini tidak dapat dibatalkan.
            </p>
        </ReusableModal>
    );
};

export default DeleteProductModal;
