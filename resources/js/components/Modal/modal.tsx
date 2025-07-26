// import React, { FormEvent, ReactNode, useState } from 'react';

// interface ReusableModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: ReactNode;
//   onSubmit?: (e: FormEvent) => void; // Optional, hanya untuk Add/Edit
//   submitLabel?: string;
//   cancelLabel?: string;
//   isDelete?: boolean;
//   isSubmitting?: boolean;
// }

// const ReusableModal: React.FC<ReusableModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   onSubmit,
//   submitLabel = 'Simpan',
//   cancelLabel = 'Batal',
//   isDelete = false,
//   isSubmitting = false,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
//         <div className="flex justify-between items-center px-4 py-3 border-b">
//           <h2 className="text-lg font-bold">{title}</h2>
//           <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
//         </div>

//         <form onSubmit={onSubmit} className="px-4 py-4">
//           {children}

//           <div className="flex justify-end gap-2 pt-4 border-t mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
//               disabled={isSubmitting}
//             >
//               {cancelLabel}
//             </button>
//             {onSubmit && (
//               <button
//                 type="submit"
//                 className={`px-4 py-2 text-white rounded ${isDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Memproses...' : submitLabel}
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ReusableModal;


import React from 'react';
import { createPortal } from 'react-dom';

interface ReusableModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit?: (e: React.FormEvent) => void;
    submitLabel?: string;
    cancelLabel?: string;
    isSubmitting?: boolean;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    isSubmitting = false,
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 sm:mx-auto relative">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={onSubmit}>
                    {children}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            disabled={isSubmitting}
                        >
                            {cancelLabel}
                        </button>
                        {onSubmit && ( // Only render submit button if onSubmit is provided
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200
                                    ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : submitLabel}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>,
        document.body // Or document.getElementById('modal-root') if you have one
    );
};

export default ReusableModal;
