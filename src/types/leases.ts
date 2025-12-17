// types/leases.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Enum Types ---
// Matches the PostgreSQL enum 'rt_frequency_type'
// Adjust these values if your database uses different casing or options
export type FrequencyType = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

// --- Parameter Interfaces ---

export interface CreateLeaseParams {
    p_property_id: number;
    p_tenant_id: number;
    p_start_date: string; // ISO 8601 Timestamp (e.g., 2025-01-01T12:00:00Z)
    p_end_date: string;   // ISO 8601 Timestamp (e.g., 2025-12-31T11:59:59Z)
    p_rent_amount: number;
    p_frequency: FrequencyType;
    p_created_at?: string; // ISO Timestamp
}