import React from 'react';
import ReusableModal from '@/components/Modal/modal';
import { Sector as SectorType } from '@/components/Types/types'; // Import SectorType
import { UUID } from 'crypto'; // Assuming UUID type is used for sector IDs as well

interface DeleteSectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: UUID) => void; // Expects to receive the ID for deletion
    sector: SectorType; // The sector object to be deleted
}

const DeleteSectorModal: React.FC<DeleteSectorModalProps> = ({
    isOpen,
    onClose,
    onDelete,
    sector,
}) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure the sector and its ID exist before attempting to delete
        if (sector && sector.id) {
            onDelete(sector.id as UUID); // Cast sector.id to UUID if it's not strictly UUID already
        }
        // The parent component (SectorsIndex) will handle closing the modal
        // after the delete operation and re-fetching data.
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Hapus Sektor"
            onSubmit={handleSubmit}
            submitLabel="Hapus"
            cancelLabel="Batal"
            isSubmitting={false} // No internal submission state needed for this simple confirmation modal
        >
            <p className="text-gray-700 mb-4">
                Apakah Anda yakin ingin menghapus sektor ini?
            </p>
            <p className="font-semibold text-lg text-red-600">
                {sector?.name}
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Tindakan ini tidak dapat dibatalkan. Menghapus sektor akan melepaskan semua kontak dari sektor ini.
            </p>
        </ReusableModal>
    );
};

export default DeleteSectorModal;
