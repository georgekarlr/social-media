// types/tenants.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Entity Types ---

export interface Tenant {
    id: number;
    full_name: string;
    email: string | null;
    phone: string | null;
    id_number: string | null;
    notes: string | null;
    created_at: string; // ISO Timestamp
    updated_at: string; // ISO Timestamp
}

// --- Parameter Interfaces ---

export interface CreateTenantParams {
    p_full_name: string;
    p_email?: string | null;
    p_phone?: string | null;
    p_id_number?: string | null;
    p_notes?: string | null;
    p_created_at?: string; // ISO Timestamp
}

export interface UpdateTenantParams {
    p_tenant_id: number;
    p_full_name: string;
    p_email?: string | null;
    p_phone?: string | null;
    p_id_number?: string | null;
    p_notes?: string | null;
    p_updated_at?: string; // ISO Timestamp
}