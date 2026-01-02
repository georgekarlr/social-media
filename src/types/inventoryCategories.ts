// types/inventoryCategories.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Entity Types ---

export interface Category {
    category_id: number;
    name: string;
    description: string | null;
    product_count: number;
}

// --- Parameter Interfaces ---

export interface GetCategoriesParams {
    p_account_id: number; // Required for Admin Check
    p_search_term?: string;
}

export interface CreateCategoryParams {
    p_account_id: number;
    p_name: string;
    p_description?: string;
}

export interface UpdateCategoryParams {
    p_account_id: number;
    p_category_id: number;
    p_name: string;
    p_description: string;
}

// --- Result Interfaces ---

export interface CreateCategoryResult {
    new_category_id: number;
    new_name: string;
    status: string;
}

export interface UpdateCategoryResult {
    updated_id: number;
    status: string;
    message: string;
}

export interface DeleteCategoryResult {
    is_deleted: boolean;
    message: string;
}