import React, { useEffect, useState } from 'react';
import ReusableModal from '@/components/Modal/modal';
import { User, UserData } from '@/components/Types/types';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onSave expects UserData object to be sent to parent
    onSave?: (userData: UserData) => Promise<void>;
    initialData: User; // The user data to pre-fill the form
    isSubmitting: boolean; // Control submission state from parent
}

// Define the form state, including an optional password field
type FormState = {
    name: string;
    email: string;
    password?: string; // Password is optional for edit
    role: 'admin' | 'sales';
};

const EditUserModal: React.FC<EditUserModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    isSubmitting, // Receive isSubmitting from parent
}) => {
    const [form, setForm] = useState<FormState>({
        name: initialData.name,
        email: initialData.email,
        password: '', // Initialize password as empty
        role: initialData.role,
    });

    const [error, setError] = useState<string | null>(null);
    // Removed local isSubmitting as it's now controlled by parent

    useEffect(() => {
        if (isOpen) {
            // Reset form state to initialData when modal opens
            setForm({
                name: initialData.name,
                email: initialData.email,
                password: '', // Always reset password field on open
                role: initialData.role,
            });
            setError(null);
            // Parent will handle resetting isSubmitting
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic client-side validation
        if (!form.name || !form.email || !form.role) {
            setError('Nama, Email, dan Peran wajib diisi.');
            return;
        }

        if (form.password && form.password.length < 8) {
            setError('Password minimal harus 8 karakter jika diisi.');
            return;
        }

        // Prepare the payload to send to the backend
        const payload: UserData = {
            name: form.name,
            email: form.email,
            role: form.role,
        };

        // Only include password in payload if it's been entered
        if (form.password) {
            payload.password = form.password;
        }

        try {
            if (onSave) {
                await onSave(payload); // Call the onSave prop with the UserData
            }
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat memperbarui pengguna.');
        }
        // No finally block for setIsSubmitting, as the parent controls it.
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Pengguna"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting} // Pass parent's isSubmitting prop
            submitLabel="Simpan Perubahan"
            cancelLabel="Batal"
        >
            <div className="max-h-[80vh] overflow-y-auto pr-2">
                {error && <div className="mb-4 text-red-500">{error}</div>}

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold">
                            Nama *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-semibold">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-semibold">
                            Password (Kosongkan jika tidak ingin diubah)
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2"
                            // Password is not required for update
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block font-semibold">
                            Peran *
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2"
                            required
                            disabled={isSubmitting}
                        >
                            <option value="admin">Admin</option>
                            <option value="sales">Sales</option>
                        </select>
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default EditUserModal;
