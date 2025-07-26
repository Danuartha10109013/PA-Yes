// resources/js/components/Modal/addmodal.tsx

import React from 'react';
import './css/cssmodal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    className?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, className = '', children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose} // klik background modal akan menutup modal
        >
            <div
                className={`bg-white rounded-lg shadow-lg relative ${className}`}
                onClick={(e) => e.stopPropagation()} // cegah klik di modal body menutup modal
            >
                {title && (
                    <div className="flex justify-between items-center border-b px-4 py-2">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-xl font-bold leading-none"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                    </div>
                )}
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
