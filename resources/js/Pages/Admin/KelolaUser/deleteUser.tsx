import React from 'react';
import ReusableModal from '@/components/Modal/modal';
import { User as UserType } from '@/components/Types/types';

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: string) => void; // Expects to receive the user's ID for deletion
    user: UserType; // The user object to be deleted
    isSubmitting: boolean; // Add this prop to disable buttons during submission
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    isOpen,
    onClose,
    onDelete,
    user,
    isSubmitting,
}) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure the user object and its ID exist before calling onDelete
        if (user && user.id) {
            onDelete(user.id); // Pass the user's ID to the onDelete handler
        }
        // The parent component is responsible for handling the API call
        // and closing the modal upon successful deletion.
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Hapus Pengguna" // Title adapted for user deletion
            onSubmit={handleSubmit}
            submitLabel="Hapus" // Submit button text
            cancelLabel="Batal" // Cancel button text
            isSubmitting={isSubmitting} // Pass the isSubmitting prop to disable buttons
        >
            <p className="text-gray-700 mb-4">
                Apakah Anda yakin ingin menghapus pengguna ini?
            </p>
            <p className="font-semibold text-lg text-red-600">
                {user?.name} ({user?.email})
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Tindakan ini tidak dapat dibatalkan.
            </p>
        </ReusableModal>
    );
};

export default DeleteUserModal;
