
// types/inventoryProducts.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Enum Types ---
// Matches the PostgreSQL enum 'inv_unit_type'
export type InventoryUnitType =
    | 'pieces' | 'box' | 'pack' | 'set' | 'pair' | 'dozen'
    | 'kg' | 'g' | 'l' | 'ml' | 'm' | 'cm' | 'sq_m' | 'roll';

// --- Entity Types ---

export interface InventoryProduct {
    product_id: number;
    sku: string;
    name: string;
    description: string | null;
    category_name: string | null;
    unit_type: InventoryUnitType | string;
    reorder_level: number;
    metadata: Record<string, any>;
    created_at: string; // ISO Timestamp
    updated_at: string; // ISO Timestamp
    current_stock: number;
}

// --- Parameter Interfaces ---

export interface GetProductsParams {
    p_account_id: number; // Admin Check
    p_search_term?: string;
    p_filter_unit?: string | null; // Optional Unit Type Filter
}

export interface CreateProductParams {
    p_account_id: number;
    p_sku: string;
    p_name: string;
    p_description?: string;
    p_category_id: number;
    p_unit_type: string; // Should match InventoryUnitType
    p_reorder_level: number;
    p_metadata?: Record<string, any>;
    p_created_at?: string; // ISO Timestamp
}

export interface UpdateProductParams {
    p_account_id: number;
    p_product_id: number;
    p_sku: string;
    p_name: string;
    p_description: string;
    p_category_id: number;
    p_unit_type: string;
    p_reorder_level: number;
    p_metadata?: Record<string, any> | null;
    p_updated_at?: string; // ISO Timestamp
}

// --- Result Interfaces ---

export interface CreateProductResult {
    new_product_id: number | null;
    success: boolean;
    message: string;
}

export interface UpdateProductResult {
    success: boolean;
    message: string;
}

export interface DeleteProductResult {
    success: boolean;
    message: string;
}