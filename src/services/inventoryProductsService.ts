// services/inventoryProductsService.ts
import { supabase } from '../lib/supabase';
import type {
    InventoryProduct,
    GetProductsParams,
    CreateProductParams,
    UpdateProductParams,
    CreateProductResult,
    UpdateProductResult,
    DeleteProductResult,
    ServiceResponse
} from '../types/inventoryProducts';

export class InventoryProductsService {

    /**
     * Fetches products with optional search and unit type filtering.
     * Requires Admin Account ID.
     */
    static async getProducts(params: GetProductsParams): Promise<ServiceResponse<InventoryProduct[]>> {
        try {
            const { data, error } = await supabase.rpc('inv_get_products', {
                p_account_id: params.p_account_id,
                p_search_term: params.p_search_term ?? '',
                p_filter_unit: params.p_filter_unit ?? null
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as InventoryProduct[], error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching products.'
            };
        }
    }

    /**
     * Creates a new product.
     * Handles unique constraint violations for SKU gracefully via the returned object.
     */
    static async createProduct(params: CreateProductParams): Promise<ServiceResponse<CreateProductResult>> {
        try {
            const { data, error } = await supabase.rpc('inv_create_product', {
                p_account_id: params.p_account_id,
                p_sku: params.p_sku,
                p_name: params.p_name,
                p_description: params.p_description ?? '',
                p_category_id: params.p_category_id,
                p_unit_type: params.p_unit_type,
                p_reorder_level: params.p_reorder_level,
                p_metadata: params.p_metadata ?? {},
                p_created_at: params.p_created_at ?? new Date().toISOString()
            });

            if (error) {
                return { data: null, error: error.message };
            }

            if (!data || data.length === 0) {
                return { data: null, error: 'Failed to create product.' };
            }

            return { data: data[0] as CreateProductResult, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while creating the product.'
            };
        }
    }

    /**
     * Updates an existing product.
     */
    static async updateProduct(params: UpdateProductParams): Promise<ServiceResponse<UpdateProductResult>> {
        try {
            const { data, error } = await supabase.rpc('inv_update_product', {
                p_account_id: params.p_account_id,
                p_product_id: params.p_product_id,
                p_sku: params.p_sku,
                p_name: params.p_name,
                p_description: params.p_description,
                p_category_id: params.p_category_id,
                p_unit_type: params.p_unit_type,
                p_reorder_level: params.p_reorder_level,
                p_metadata: params.p_metadata ?? null,
                p_updated_at: params.p_updated_at ?? new Date().toISOString()
            });

            if (error) {
                return { data: null, error: error.message };
            }

            if (!data || data.length === 0) {
                return { data: null, error: 'Failed to update product.' };
            }

            return { data: data[0] as UpdateProductResult, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while updating the product.'
            };
        }
    }

    /**
     * Deletes a product.
     * Returns failure if transactions exist.
     */
    static async deleteProduct(accountId: number, productId: number): Promise<ServiceResponse<DeleteProductResult>> {
        try {
            const { data, error } = await supabase.rpc('inv_delete_product', {
                p_account_id: accountId,
                p_product_id: productId
            });

            if (error) {
                return { data: null, error: error.message };
            }

            if (!data || data.length === 0) {
                return { data: null, error: 'Failed to delete product.' };
            }

            return { data: data[0] as DeleteProductResult, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while deleting the product.'
            };
        }
    }
}