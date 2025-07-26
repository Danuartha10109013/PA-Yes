

// interface TransactionLog {
//     id: string;
//     action: string;
//     user: string;
//     created_at: string;
//     changes: Record<string, any>;
// }

// export interface LeadDatas {
//     id: string;
//     trx: string;
//     name: string;
//     company_name: string;
//     product: string;
//     product_id: string | null; // BISA NULL dari backend
//     deadline: string | null;
//     current_price: number;
//     qty: number;
//     grand_total: number;
//     notes: string | null;
//     columnId: string;

//     sector?: string | null;
//     sector_id?: string | null; // belum dikirim, tapi boleh disiapkan
//     // sectorColor?: string | null;
//     sectorColor?: string | null;
//     sectorTextColor?: string | null;


//     assigneeInitials?: string | null;
//     assigneeBgColor?: string | null;

//     created_at: string;
//     updated_at: string;
//     contact_id: string;

//     email: string;
//     phone: string;
//     social_media: string;
//     address: string;

//     // Tambahan untuk log terakhir
//     lastUserInitials?: string | null;
//     lastUserBgColor?: string | null;
//     logs?: TransactionLog[];
// }



// export interface ColumnData {
//     id: string;
//     title: string;
//     leadId: string[]; // This should probably be leadIds: string[]
//     // Based on your original ColumnData, you might also have:
//     // bgColor: string;
//     // borderColor: string;
//     // titleColor: string;
//     // dotBorderColor: string;
//     // dotBgColor: string;
//     // dotTextColor: string;
//     // addLeadColor: string;
// }

// export interface User {
//     id: string;
//     name: string;
//     email: string;
//     // ... other user properties
// }

// export interface Status {
//     id: string;
//     name: string;
//     // ... other status properties
// }

// export interface ProductData {
//     id: string;
//     name: string;
//     slug: string; // Likely used for SEO-friendly URLs
//     price: number;
//     description: string | null; // Can be null
//     image: string | null; // URL to the product image, can be null
//     created_at: string; // ISO 8601 timestamp
//     updated_at: string; // ISO 8601 timestamp
//     deleted_at?: string | null; // Optional: For soft deletes
// }

// export interface ContactData {
//     id: string; // Unique identifier for the contact
//     name: string; // The full name of the contact person
//     company_name?: string | null; // The company name associated with the contact (optional, can be null)
//     email?: string | null; // Optional: Email address of the contact
//     phone?: string | null; // Optional: Phone number of the contact
//     address?: string | null; // Optional: Address of the contact
//     sector_id?: string | null; // Optional: ID of the sector the contact belongs to
//     created_at?: string; // Optional: Timestamp of when the contact was created (ISO string)
//     updated_at?: string; // Optional: Timestamp of when the contact was last updated (ISO string)
//     // Add any other properties that your contact objects might have
// }


// Your existing type definitions (unchanged, just included for context)
interface TransactionLog {
    id: string;
    action: string;
    user: string; // Nama pengguna yang melakukan aksi
    created_at: string; // Timestamp log
    changes: Record<string, any>; // Detail perubahan dalam format key-value
}

export interface LeadDatas {
    id: string;
    trx: string; // Kode transaksi unik
    name: string; // Nama kontak dari lead
    company_name: string; // Nama perusahaan kontak dari lead
    product: string; // Nama produk yang terlibat dalam lead
    product_id: string | null; // ID produk, bisa null jika belum ada produk
    deadline: string | null; // Tanggal deadline, bisa null
    current_price: number; // Harga saat ini
    qty: number; // Kuantitas
    grand_total: number; // Total harga (setelah diskon)
    notes: string | null; // Catatan, bisa null
    columnId: string; // ID kolom Kanban tempat lead berada

    sector?: string | null; // Nama sektor, opsional
    sector_id?: string | null; // ID sektor, opsional
    sectorColor?: string | null; // Warna latar belakang sektor, opsional
    sectorTextColor?: string | null; // Warna teks sektor, opsional

    assigneeInitials?: string | null; // Inisial penanggung jawab, opsional
    assigneeBgColor?: string | null; // Warna latar belakang inisial penanggung jawab, opsional

    created_at: string; // Timestamp pembuatan lead
    updated_at: string; // Timestamp pembaruan terakhir lead
    contact_id: string; // ID kontak terkait

    email: string | null; // Email kontak, bisa null
    phone: string | null; // Telepon kontak, bisa null
    social_media: string | null; // Media sosial kontak (disimpan sebagai string JSON), bisa null
    address: string | null; // Alamat kontak (disimpan sebagai string JSON), bisa null
    // social_media: Record<string, string> | string[] | null | string; // Bisa objek, array, string, atau null
    // address: Record<string, string> | string[] | null | string; // Bisa objek, array, string, atau null
    // social_media: string[] | null;
    // address: string[] | null;

    // Tambahan untuk log aktivitas terakhir
    lastUserInitials?: string | null;
    lastUserBgColor?: string | null;
    logs?: TransactionLog[]; // Array log transaksi terkait lead ini
}

export interface ColumnData {
    id: string;
    title: string;
    bgColor?: string; // Warna latar belakang kolom, opsional
    borderColor?: string; // Warna border kolom, opsional
    titleColor?: string; // Warna teks judul kolom, opsional
    dotBorderColor?: string; // Warna border titik indikator, opsional
    dotBgColor?: string; // Warna latar belakang titik indikator, opsional
    dotTextColor?: string; // Warna teks titik indikator, opsional
    addLeadColor?: string; // Warna tombol tambah lead, opsional
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Status {
    id: string;
    name: string;
}

export interface ProductData {
    id: string;
    name: string;
    slug?: string | null; // Slug produk, opsional dan bisa null
    price: number;
    description: string | null; // Deskripsi, bisa null
    image: string | null; // URL gambar, bisa null
    created_at: string;
    updated_at: string;
    deleted_at?: string | null; // Untuk soft deletes, opsional
}

export interface ContactData {
    id: string;
    name: string;
    company_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null; // Alamat, bisa null
    sector_id?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ContactOption {
    id: string;
    name: string;
    company_name: string;
}

export interface ProductOption {
    id: string;
    name: string;
    price: number;
}

export interface TransactionPayload {
    product_id: string | null;
    contact_id: string;
    current_price: number;
    qty: number;
    discount_amount: number | null;
    deadline: string | null;
    notes: string | null;
}

export interface ColumnOption {
    id: string; // ID kolom
    name: string; // Nama kolom
}
