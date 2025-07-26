// // resources/js/types/index.ts

// import { UUID } from "crypto";

// export interface Sector {
//     id: UUID;
//     name: string;
//     bg_color: string | null;
//     text_color: string | null;
//     created_at: string;
//     updated_at: string;
//     deleted_at: string | null;
// }
// export interface SectorData {
//     name: string;
//     bg_color: string | null;
//     text_color: string | null;
// }

// // resources/js/types/index.ts

// export interface ContactData { // Untuk data yang dikirim ke backend
//     name: string;
//     email?: string;
//     company_name: string | null;
//     phone?: string;
//     sector_id?: UUID; // Bisa null jika tidak ada sector
//     address?: string;
// }

// export interface Contact { // Untuk data yang diterima dari backend
//     id: UUID;
//     name: string;
//     email: string | null;
//     company_name: string | null;
//     phone: string | null;
//     sector_id: UUID;
//     address: string | null;
//     created_at: string;
//     updated_at: string;
//     deleted_at: string | null;
//     sector?: { // Relasi sektor, akan dimuat jika ada 'with('sector')'
//         id: UUID;
//         name: string;
//     } | null;
// }

// export interface ProductData {
//     name: string;
//     slug: string;
//     price: number;
//     description?: string;
//     image?: string;
// }

// export interface Product {
//     id: string; // Assuming UUID from HasUuids trait, so string
//     name: string;
//     slug: string;
//     price: number;
//     description: string | null; // Explicitly allow null
//     image: string | null; // URL to the image, explicitly allow null
//     created_at: string; // ISO 8601 timestamp string
//     updated_at: string; // ISO 8601 timestamp string
//     deleted_at: string | null; // For soft deletes, explicitly allow null
// }


// resources/js/types/index.ts
// import { UUID } from "crypto";

// export interface Sector {
//     id: UUID;
//     name: string;
//     bg_color: string | null;
//     text_color: string | null;
//     created_at: string;
//     updated_at: string;
//     deleted_at: string | null;
// }
// export interface SectorData {
//     name: string;
//     bg_color: string | null;
//     text_color: string | null;
// }

// export interface ContactData { // Untuk data yang dikirim ke backend
//     name: string;
//     email?: string;
//     company_name: string | null;
//     phone?: string;
//     sector_id?: UUID; // Bisa null jika tidak ada sector
//     address?: string;
// }

// export interface Contact { // Untuk data yang diterima dari backend
//     id: UUID;
//     name: string;
//     email: string | null;
//     company_name: string | null;
//     phone: string | null;
//     sector_id: UUID;
//     address: string | null;
//     created_at: string;
//     updated_at: string;
//     deleted_at: string | null;
//     sector?: { // Relasi sektor, akan dimuat jika ada 'with('sector')'
//         id: UUID;
//         name: string;
//     } | null;
// }

// export interface ProductData {
//     name: string;
//     slug: string;
//     price: number;
//     description?: string | null; // Added | null
//     image?: string | null; // Added | null
// }
// export interface Report {
//     id: string; // UUID for report ID
//     transaction_id: string;
//     created_at: string;
//     updated_at: string;
//     deleted_at: string | null;
//     transaction?: Transaction | null; // Add the transaction relationship here
// }

// export interface Product {
//     id: string; // Assuming UUID from HasUuids trait, so string
//     name: string;
//     slug: string;
//     price: number;
//     description: string | null; // Explicitly allow null
//     image: string | null; // URL to the image, explicitly allow null
//     created_at: string; // ISO 8601 timestamp string
//     updated_at: string; // ISO 8601 timestamp string
//     deleted_at: string | null; // For soft deletes, explicitly allow null
// }

// export interface SegmentasiPasar {
//     id: string;
//     sector_id: string;
//     sector_name: string;
//     jumlah_item: number;
//     total_penjualan: string;
//     total_transaksi: string;
//     kriteria_jumlah_item: string;
//     kriteria_total_penjualan: string;
//     kriteria_total_transaksi: string;
//     status: string;
//     created_at: string;
//     updated_at: string;
//     deleted_at?: string | null;
// }

// interface UseSegmentasiPasarDataResult {
//     data: SegmentasiPasar[];
//     loading: boolean;
//     error: string | null;
// }


// export interface UserData {
//     name: string;
//     email: string;
//     password?: string; // Optional for updates, required for creation
//     role: 'admin' | 'sales'; // Matches the ENUM in your migration
// }

// /**
//  * Interface for a full User object as received from the API.
//  * Includes all database fields except sensitive ones like raw password.
//  */
// export interface User {
//     id: string; // Assuming UUID from Laravel migration
//     name: string;
//     email: string;
//     email_verified_at: string | null; // Can be a date string or null
//     role: 'admin' | 'sales'; // Matches the ENUM in your migration
//     created_at: string; // ISO 8601 string date
//     updated_at: string; // ISO 8601 string date
//     // Note: 'password' and 'remember_token' are typically hidden from API responses
// }


// export interface ColumnData {
//     id: string;
//     name: string;
//     created_at?: string;
//     updated_at?: string;
// }



// @/components/Types/types.ts
// import { UUID } from "crypto"; // Keep this if you're using Node.js crypto for UUID, otherwise use string for browser

export interface Sector {
    id: UUID;
    name: string;
    bg_color: string | null;
    text_color: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
export interface SectorData {
    name: string;
    bg_color: string | null;
    text_color: string | null;
}

export interface ContactData { // Untuk data yang dikirim ke backend
    name: string;
    email?: string | null;
    company_name: string | null;
    phone?: string | null;
    social_media?: string | null;
    sector_id?: UUID; // Bisa null jika tidak ada sector
    address?: string;
}

export interface Contact { // Untuk data yang diterima dari backend
    id: UUID;
    name: string;
    email: string | null;
    company_name: string | null;
    phone: string | null;
    sector_id: UUID;
    address: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    sector?: { // Relasi sektor, akan dimuat jika ada 'with('sector')'
        id: UUID;
        name: string;
    } | null;
}

export interface ProductData {
    name: string;
    slug: string;
    price: number;
    description?: string | null;
    image?: string | null;
}
export interface Report {
    id: string; // UUID for report ID
    transaction_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    transaction?: Transaction | null;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string | null;
    image: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface SegmentasiPasar {
    id: string;
    sector_id: string;
    sector_name: string;
    jumlah_item: number;
    total_penjualan: string;
    total_transaksi: string;
    kriteria_jumlah_item: string;
    kriteria_total_penjualan: string;
    kriteria_total_transaksi: string;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

interface UseSegmentasiPasarDataResult {
    data: SegmentasiPasar[];
    loading: boolean;
    error: string | null;
}


export interface UserData {
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'sales';
}

export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'admin' | 'sales';
    created_at: string;
    updated_at: string;
}

export interface ColumnData {
    id: UUID; // Assuming UUID for column ID as well
    name: string;
    created_at?: string;
    updated_at?: string;
}

// Add a new interface for TransactionData that only includes necessary fields for creation
// based on your Transaction model's $fillable.
export interface TransactionData {
    column_id: UUID;
    contact_id: UUID;
    trx: string; // Assuming 'trx' is required and generated/provided
    product_id?: UUID | null; // Optional based on your logic
    current_price?: number | null;
    qty?: number | null;
    grand_total?: number | null;
    deadline?: string | null; // Date string
    notes?: string | null;
}

// Update the existing Transaction interface to use UUID for column_id
export interface Transaction {
    id: UUID;
    column_id: UUID;
    trx: string;
    product_id: UUID | null;
    contact_id: UUID;
    current_price: number | null;
    qty: number | null;
    grand_total: number | null;
    deadline: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    // You might want to add relationships here if they are eager-loaded
    column?: ColumnData | null;
    contact?: Contact | null;
    product?: Product | null;
}// @/components/Types/types.ts
import { UUID } from "crypto"; // Keep this if you're using Node.js crypto for UUID, otherwise use string for browser

export interface Sector {
    id: UUID;
    name: string;
    bg_color: string | null;
    text_color: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
export interface SectorData {
    name: string;
    bg_color: string | null;
    text_color: string | null;
}

export interface ContactData { // Untuk data yang dikirim ke backend
    name: string;
    email?: string;
    company_name: string | null;
    phone?: string;
    sector_id?: UUID; // Bisa null jika tidak ada sector
    address?: string;
}

export interface Contact { // Untuk data yang diterima dari backend
    id: UUID;
    name: string;
    email: string | null;
    company_name: string | null;
    phone: string | null;
    sector_id: UUID;
    address: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    sector?: { // Relasi sektor, akan dimuat jika ada 'with('sector')'
        id: UUID;
        name: string;
    } | null;
}

export interface ProductData {
    name: string;
    slug: string;
    price: number;
    description?: string | null;
    image?: string | null;
}
export interface Report {
    id: string; // UUID for report ID
    transaction_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    transaction?: Transaction | null;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string | null;
    image: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface SegmentasiPasar {
    id: string;
    sector_id: string;
    sector_name: string;
    jumlah_item: number;
    total_penjualan: string;
    total_transaksi: string;
    kriteria_jumlah_item: string;
    kriteria_total_penjualan: string;
    kriteria_total_transaksi: string;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

interface UseSegmentasiPasarDataResult {
    data: SegmentasiPasar[];
    loading: boolean;
    error: string | null;
}


export interface UserData {
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'sales';
}

export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'admin' | 'sales';
    created_at: string;
    updated_at: string;
}

export interface ColumnData {
    id: UUID; // Assuming UUID for column ID as well
    name: string;
    created_at?: string;
    updated_at?: string;
}

// Add a new interface for TransactionData that only includes necessary fields for creation
// based on your Transaction model's $fillable.
export interface TransactionData {
    column_id: UUID;
    contact_id: UUID;
    trx: string; // Assuming 'trx' is required and generated/provided
    product_id?: UUID | null; // Optional based on your logic
    current_price?: number | null;
    qty?: number | null;
    grand_total?: number | null;
    deadline?: string | null; // Date string
    notes?: string | null;
}

// Update the existing Transaction interface to use UUID for column_id
export interface Transaction {
    id: UUID;
    column_id: UUID;
    trx: string;
    product_id: UUID | null;
    contact_id: UUID;
    current_price: number | null;
    qty: number | null;
    grand_total: number | null;
    deadline: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    // You might want to add relationships here if they are eager-loaded
    column?: ColumnData | null;
    contact?: Contact | null;
    product?: Product | null;
}
