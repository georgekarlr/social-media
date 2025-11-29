// types/products.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Entity Types ---

export interface Product {
    id: number;
    account_id: number;
    user_id: string;
    name: string;
    sku: string;
    price: number;
    cost_price: number;
    stock_quantity: number;
    created_at: string;
}

export type ProductActivityType = 'created' | 'updated' | 'stock_added' | 'stock_removed';

export interface ProductHistory {
    id: number;
    activity_type: ProductActivityType;
    quantity_change: number | null;
    stock_after: number | null;
    reason: string | null;
    created_at: string;
    user_email: string | null;
}

// --- Parameter Interfaces ---

export interface GetProductsParams {
    p_search_term?: string;
    p_limit?: number;
    p_offset?: number;
}

export interface CreateProductParams {
    p_account_id: number;
    p_name: string;
    p_sku: string;
    p_price: number;
    p_cost_price?: number;
    p_stock_quantity?: number;
    p_created_at?: string;
}

export interface UpdateProductParams {
    p_product_id: number;
    p_name?: string;
    p_sku?: string;
    p_price?: number;
    p_cost_price?: number;
}

export interface AdjustStockParams {
    p_product_id: number;
    p_quantity_change: number;
    p_reason: string;
}