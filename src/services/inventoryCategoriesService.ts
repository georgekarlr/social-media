// services/inventoryCategoriesService.ts
import { supabase } from '../lib/supabase';
import type {
    Category,
    GetCategoriesParams,
    CreateCategoryParams,
    UpdateCategoryParams,
    CreateCategoryResult,
    UpdateCategoryResult,
    DeleteCategoryResult,
    ServiceResponse
} from '../types/inventoryCategories';

export class InventoryCategoriesService {

    /**
     * Fetches categories with optional search.
     * Requires Admin Account ID.
     */
    static async getCategories(params: GetCategoriesParams): Promise<ServiceResponse<Category[]>> {
        try {
            const { data, error } = await supabase.rpc('inv_get_categories', {
                p_account_id: params.p_account_id,
                p_search_term: params.p_search_term ?? ''
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as Category[], error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching categories.'
            };
        }
    }

    /**
     * Creates a new category.
     * Requires Admin Account ID.
     */
    static async createCategory(params: CreateCategoryParams): Promise<ServiceResponse<CreateCategoryResult>> {
        try {
            const { data, error } = await supabase.rpc('inv_create_category', {
                p_account_id: params.p_account_id,
                p_name: params.p_name,
                p_description: params.p_description ?? null
            });

            if (error) {
                return { data: null, error: error.message };
            }

            if (!data || data.length === 0) {
                return { data: null, error: 'Failed to create category.' };
            }

            return { data: data[0] as CreateCategoryResult, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while creating the category.'
            };
        }
    }

    /**
     * Updates an existing category.
     * Requires Admin Account ID.
     */
    static async updateCategory(params: UpdateCategoryParams): Promise<ServiceResponse<UpdateCategoryResult>> {
        try {
            const { data, error } = await supabase.rpc('inv_update_category', {
                p_account_id: params.p_account_id,
                p_category_id: params.p_category_id,
                p_name: params.p_name,
                p_description: params.p_description
            });

            if (error) {
                return { data: null, error: error.message };
            }

            if (!data || data.length === 0) {
                return { data: null, error: 'Failed to update category.' };
            }

            return { data: data[0] as UpdateCategoryResult, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while updating the category.'
            };
        }
    }

    /**
     * Deletes a category.
     * Will return `is_deleted: false` with a message if products are still attached.
     */
    static async deleteCategory(accountId: number, categoryId: number): Promise<ServiceResponse<DeleteCategoryResult>> {
        try {
            const { data, error } = await supabase.rpc('inv_delete_category', {
                p_account_id: accountId,
                p_category_id: categoryId
            });

            if (error) {
                return { data: null, error: error.message };
            }

            if (!data || data.length === 0) {
                return { data: null, error: 'Failed to delete category.' };
            }

            return { data: data[0] as DeleteCategoryResult, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while deleting the category.'
            };
        }
    }
}