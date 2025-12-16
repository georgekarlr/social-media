// types/properties.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Enum Types ---
// Inferred standard types, adjust based on your specific use case
export type PropertyType = 'Single Family' | 'Apartment' | 'Condo' | 'Townhouse' | 'Commercial' | 'Other';
export type PropertyStatus = 'vacant' | 'occupied' | 'maintenance';

// --- Entity Types ---

export interface Property {
    id: number;
    name: string;
    type: PropertyType | string;
    address: string;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    sq_ft: number | null;
    status: PropertyStatus | string;
    market_rent: number;
    created_at: string; // ISO Timestamp
}

// --- Parameter Interfaces ---

export interface CreatePropertyParams {
    p_name: string;
    p_type: string;
    p_address: string;
    p_market_rent: number;

    // Optional fields
    p_city?: string | null;
    p_state?: string | null;
    p_zip_code?: string | null;
    p_bedrooms?: number | null;
    p_bathrooms?: number | null;
    p_sq_ft?: number | null;
    p_created_at?: string; // ISO Timestamp
}

export interface UpdatePropertyParams {
    p_property_id: number;
    p_name: string;
    p_type: string;
    p_address: string;
    p_market_rent: number;

    // Optional fields
    p_city?: string | null;
    p_state?: string | null;
    p_zip_code?: string | null;
    p_bedrooms?: number | null;
    p_bathrooms?: number | null;
    p_sq_ft?: number | null;
    p_updated_at?: string; // ISO Timestamp
}