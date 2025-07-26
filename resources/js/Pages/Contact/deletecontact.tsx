import React from 'react';
import ReusableModal from '@/components/Modal/modal';
import { Contact as ContactType } from '@/components/Types/types';
import { UUID } from 'crypto';
import Swal from 'sweetalert2';

interface DeleteContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: UUID) => void; // Expects to receive the ID for deletion
    contact: ContactType; // The contact object to be deleted
}

const DeleteContactModal: React.FC<DeleteContactModalProps> = ({
    isOpen,
    onClose,
    onDelete,
    contact,
}) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (contact && contact.id) {
            onDelete(contact.id); // Pass the ID directly to the parent handler
        }
        // The parent (ContactsIndex) will handle closing the modal after the delete operation
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Hapus Kontak"
            onSubmit={handleSubmit}
            submitLabel="Hapus"
            cancelLabel="Batal"
            isSubmitting={false} // No internal submission state needed for this modal
        >
            <p className="text-gray-700 mb-4">
                Apakah Anda yakin ingin menghapus kontak ini?
            </p>
            <p className="font-semibold text-lg text-red-600">
                {contact?.name} ({contact?.email})
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Tindakan ini tidak dapat dibatalkan.
            </p>
        </ReusableModal>
    );
};

export default DeleteContactModal;
