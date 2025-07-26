// src/components/Contacts/ContactDetailDrawer.tsx
import React from 'react';
import Drawer from '@/components/Drawer/Drawer'; // Sesuaikan path komponen Drawer Anda
import { Contact as ContactType } from '@/components/Types/types';

interface ContactDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    contact: ContactType | null;
}

const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({ isOpen, onClose, contact }) => {
    if (!contact) {
        return null; // Jangan render drawer jika tidak ada kontak yang dipilih
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            position="right" // Biasanya detail drawer muncul dari kanan
            width="400px" // Sesuaikan lebar sesuai kebutuhan
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#344767]">Detail Kontak</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-4 text-gray-700">
                    <div>
                        <p className="text-sm text-gray-500">Nama</p>
                        <p className="font-medium text-lg">{contact.name}</p>
                    </div>
                    <hr className="my-2 border-gray-200" /> {/* Added separator */}
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{contact.email || '-'}</p>
                    </div>
                    <hr className="my-2 border-gray-200" /> {/* Added separator */}
                    <div>
                        <p className="text-sm text-gray-500">Perusahaan</p>
                        <p className="font-medium">{contact.company_name || '-'}</p>
                    </div>
                    <hr className="my-2 border-gray-200" /> {/* Added separator */}
                    <div>
                        <p className="text-sm text-gray-500">Telepon</p>
                        <p className="font-medium">{contact.phone || '-'}</p>
                    </div>
                    <hr className="my-2 border-gray-200" /> {/* Added separator */}
                    <div>
                        <p className="text-sm text-gray-500">Alamat</p>
                        <p className="font-medium">{contact.address || '-'}</p>
                    </div>
                    <hr className="my-2 border-gray-200" /> {/* Added separator */}
                    <div>
                        <p className="text-sm text-gray-500">Sektor</p>
                        <p className="font-medium">{contact.sector?.name || '-'}</p>
                    </div>
                    <hr className="my-2 border-gray-200" /> {/* Added separator */}
                </div>
            </div>
        </Drawer>
    );
};

export default ContactDetailDrawer;
