import React, { useEffect, useState } from 'react';
import ReusableModal from '@/components/Modal/modal';
import { UserData } from '@/components/Types/types';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: UserData) => Promise<void>; // Expects UserData object
    isSubmitting: boolean; // Controls the submit button state
}

type FormState = {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'sales' | ''; // Added empty string for initial state
};

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave, isSubmitting }) => {
    const [form, setForm] = useState<FormState>({
        name: '',
        email: '',
        password: '',
        role: '', // Default to empty string or a default role like 'sales'
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Reset form state when the modal opens
            setForm({ name: '', email: '', password: '', role: '' });
            setError(null);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic client-side validation
        if (!form.name || !form.email || !form.password || !form.role) {
            setError('Nama, Email, Password, dan Peran wajib diisi.');
            return;
        }

        if (form.password.length < 8) {
            setError('Password minimal harus 8 karakter.');
            return;
        }

        // Prepare data to send, excluding 'image' and 'slug' as they are not for users
        const userData: UserData = {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role as 'admin' | 'sales', // Cast to the correct union type
        };

        try {
            await onSave(userData); // Call the onSave prop with UserData
            // onSave will handle the actual API call and closing the modal on success
        } catch (err: any) {
            // Error handling from the parent component's onSave
            // This assumes onSave might throw an error with a message
            setError(err.message || 'Terjadi kesalahan saat menyimpan pengguna.');
        }
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Pengguna Baru"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting} // Pass the prop here
            submitLabel="Simpan"
            cancelLabel="Batal"
        >
            <div className="max-h-[80vh] overflow-y-auto pr-2">
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold">Nama *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-semibold">Email *</label>
                        <input
                            type="email" // Use type="email" for better user experience and basic validation
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-semibold">Password *</label>
                        <input
                            type="password" // Use type="password" for sensitive input
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block font-semibold">Peran *</label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            disabled={isSubmitting}
                        >
                            <option value="">Pilih Peran</option>
                            <option value="admin">Admin</option>
                            <option value="sales">Sales</option>
                        </select>
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default AddUserModal;
