// resources/js/components/ContactForm.tsx

import React, { useState, FormEvent, useEffect } from 'react';
import { ContactData, Sector } from '../Types/types'; // Import ContactData dan Sector

interface ContactFormProps {
    onSubmit: (data: ContactData) => void; // Fungsi yang dipanggil saat submit, menerima ContactData
    onCancel: () => void; // Fungsi untuk membatalkan/menutup form
    initialData?: Partial<ContactData>; // Data awal untuk mode edit (opsional)
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onCancel, initialData }) => {
    // State untuk menyimpan data formulir, diinisialisasi dengan initialData atau nilai kosong
    const [formData, setFormData] = useState<ContactData>({
        name: initialData?.name || '',
        email: initialData?.email || '',
        company_name: initialData?.company_name || '',
        phone: initialData?.phone || '',
        sector_id: initialData?.sector_id || null, // sector_id bisa null jika tidak dipilih
        address: initialData?.address || '',
    });

    // State untuk menyimpan daftar sektor yang diambil dari API
    const [sectors, setSectors] = useState<Sector[]>([]);

    // Efek untuk memuat daftar sektor saat komponen pertama kali di-render
    useEffect(() => {
        const fetchSectors = async () => {
            try {
                // Panggil API untuk mendapatkan daftar sektor
                const response = await fetch('/sectors');
                if (!response.ok) {
                    throw new Error('Failed to fetch sectors');
                }
                const data: Sector[] = await response.json();
                setSectors(data);
            } catch (error) {
                console.error('Error fetching sectors:', error);
                // Anda bisa menambahkan logika penanganan error di sini, misalnya menampilkan pesan ke pengguna
            }
        };
        fetchSectors();
    }, []); // Array dependensi kosong agar efek hanya berjalan sekali

    // Handler untuk perubahan input form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'sector_id' && value !== '' ? Number(value) : value, // Konversi sector_id ke angka
        }));
    };

    // Handler untuk submit form
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Validasi dasar
        if (!formData.name.trim()) {
            alert('Nama kontak wajib diisi!');
            return;
        }
        if (!formData.email?.trim()) { // Gunakan optional chaining karena email bisa null/undefined
            alert('Email wajib diisi!');
            return;
        }

        onSubmit(formData); // Panggil fungsi onSubmit yang diterima dari parent
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Perusahaan/Kontak:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
            </div>
            <div className="form-group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''} // Pastikan nilai input tidak undefined
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
            </div>
            <div className="form-group">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telepon:</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
            </div>
            <div className="form-group">
                <label htmlFor="sector_id" className="block text-sm font-medium text-gray-700">Sektor:</label>
                <select
                    id="sector_id"
                    name="sector_id"
                    value={formData.sector_id || ''} // Value di <select> harus string
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                    <option value="">Pilih Sektor</option> {/* Opsi default */}
                    {sectors.map(sector => (
                        <option key={sector.id} value={sector.id}>
                            {sector.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat:</label>
                <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                ></textarea>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    Simpan Kontak
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
