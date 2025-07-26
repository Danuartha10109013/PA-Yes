import React from 'react';
import ReusableModal from '@/components/Modal/modal';
import { LeadDatas } from '@/components/Leads/types'; // Assuming LeadDatas is the correct type for displaying a lead
import { UUID } from 'crypto';

interface DeleteLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: UUID) => void; // Expects to receive the ID for deletion
    lead: LeadDatas; // The lead object to be deleted
}

const DeleteLeadModal: React.FC<DeleteLeadModalProps> = ({
    isOpen,
    onClose,
    onDelete,
    lead,
}) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (lead && lead.id) {
            onDelete(lead.id); // Pass the ID directly to the parent handler
        }
        // The parent component (e.g., LeadsIndex or the component managing the leads)
        // will be responsible for closing this modal after the delete operation
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Hapus Lead"
            onSubmit={handleSubmit}
            submitLabel="Hapus"
            cancelLabel="Batal"
            isSubmitting={false} // No internal submission state needed for this modal
        >
            <p className="text-gray-700 mb-4">
                Apakah Anda yakin ingin menghapus lead ini?
            </p>
            <p className="font-semibold text-lg text-red-600">
                {lead?.name} - {lead?.product} ({lead?.trx})
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Tindakan ini tidak dapat dibatalkan.
            </p>
        </ReusableModal>
    );
};

export default DeleteLeadModal;

