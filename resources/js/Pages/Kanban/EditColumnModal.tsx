import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { ColumnData } from '@/components/Leads/types';
import Drawer from '@/components/Drawer/Drawer';

interface EditColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    column: ColumnData | null;
}

const EditColumnModal: React.FC<EditColumnModalProps> = ({ isOpen, onClose, onSuccess, column }) => {
    const [formData, setFormData] = useState({
        name: '',
        bg_color: 'bg-gray-100',
        border_color: 'border-gray-300',
        title_color: 'text-gray-600',
        dot_border_color: 'border-gray-400',
        dot_bg_color: 'bg-transparent',
        dot_text_color: 'text-gray-400',
        add_lead_color: 'text-gray-700'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update form data when column prop changes
    useEffect(() => {
        if (column) {
            setFormData({
                name: column.title,
                bg_color: column.bgColor || 'bg-gray-100',
                border_color: column.borderColor || 'border-gray-300',
                title_color: column.titleColor || 'text-gray-600',
                dot_border_color: column.dotBorderColor || 'border-gray-400',
                dot_bg_color: column.dotBgColor || 'bg-transparent',
                dot_text_color: column.dotTextColor || 'text-gray-400',
                add_lead_color: column.addLeadColor || 'text-gray-700'
            });
        }
    }, [column]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            Swal.fire('Error!', 'Nama kolom harus diisi', 'error');
            return;
        }

        if (!column) {
            Swal.fire('Error!', 'Data kolom tidak ditemukan', 'error');
            return;
        }

        setIsSubmitting(true);

        router.put(`/columns/${column.id}`, formData, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Kolom berhasil diperbarui!',
                    timer: 1500,
                    showConfirmButton: false
                });
                onSuccess();
                onClose();
            },
            onError: (errors) => {
                Swal.fire('Error!', Object.values(errors).join(', '), 'error');
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    if (!isOpen || !column) return null;

    return (
        <Drawer isOpen={isOpen} onClose={onClose} position="right" width="500px" className="drawer-with-top-shadow">
            <div className="flex h-full flex-col p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#344767]">Edit Kolom</h2>
                    <button onClick={onClose} className="text-xl text-gray-500 hover:text-gray-700" aria-label="Close">
                        &times;
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto pr-3">
                    <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
                        {/* Nama Kolom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kolom *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: PROSPECTING, CONTACTING, etc."
                                required
                            />
                        </div>

                        {/* Background Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                            <select
                                name="bg_color"
                                value={formData.bg_color}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="bg-gray-100">Gray Light</option>
                                <option value="bg-blue-100">Blue Light</option>
                                <option value="bg-green-100">Green Light</option>
                                <option value="bg-yellow-100">Yellow Light</option>
                                <option value="bg-red-100">Red Light</option>
                                <option value="bg-purple-100">Purple Light</option>
                                <option value="bg-pink-100">Pink Light</option>
                                <option value="bg-indigo-100">Indigo Light</option>
                            </select>
                        </div>

                        {/* Border Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
                            <select
                                name="border_color"
                                value={formData.border_color}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="border-gray-300">Gray</option>
                                <option value="border-blue-300">Blue</option>
                                <option value="border-green-300">Green</option>
                                <option value="border-yellow-300">Yellow</option>
                                <option value="border-red-300">Red</option>
                                <option value="border-purple-300">Purple</option>
                                <option value="border-pink-300">Pink</option>
                                <option value="border-indigo-300">Indigo</option>
                            </select>
                        </div>

                        {/* Title Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title Color</label>
                            <select
                                name="title_color"
                                value={formData.title_color}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="text-gray-600">Gray</option>
                                <option value="text-blue-600">Blue</option>
                                <option value="text-green-600">Green</option>
                                <option value="text-yellow-600">Yellow</option>
                                <option value="text-red-600">Red</option>
                                <option value="text-purple-600">Purple</option>
                                <option value="text-pink-600">Pink</option>
                                <option value="text-indigo-600">Indigo</option>
                            </select>
                        </div>

                        {/* Preview */}
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                            <label className="mb-2 block text-sm font-medium text-gray-700">Preview</label>
                            <div className={`${formData.bg_color} ${formData.border_color} border-2 rounded-md p-3`}>
                                <div className={`${formData.title_color} text-sm font-semibold`}>
                                    {formData.name || 'Nama Kolom'}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">0 leads</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    'Simpan Perubahan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Drawer>
    );
};

export default EditColumnModal; 