import React from 'react';

interface ReusableModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    submitLabel?: string;
    cancelLabel?: string;
    className?: string; // This prop allows external control of modal's size
}

const ReusableModal: React.FC<ReusableModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    isSubmitting,
    submitLabel = 'Simpan',
    cancelLabel = 'Batal',
    className, // Destructure the className prop
}) => {
    if (!isOpen) return null;

    return (
        // Overlay: Covers the whole screen, centers the modal
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            {/* Modal Content Container: The actual modal box.
          `className` is applied here, overriding or extending default `w-full max-w-lg`. */}
            {/* <div className={`bg-white rounded-lg shadow-xl w-full max-w-lg ${className || ''}`}> */}
            <div className={`bg-white rounded-lg shadow-xl ${className ? className : 'w-full max-w-lg'}`}>

                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>

                {/* Modal Body (Form) */}
                <form onSubmit={onSubmit} className="p-4">
                    {children} {/* This renders the content from AddLeadModal */}

                    {/* Modal Footer (Action Buttons) */}
                    <div className="border-t pt-4 mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200 ease-in-out"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
                        >
                            {isSubmitting ? 'Saving...' : submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReusableModal;
