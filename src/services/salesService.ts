// services/SalesService.ts
import { supabase } from '../lib/supabase';
import type {
    ProcessSaleParams,
    ProcessSaleResult,
    ServiceResponse
} from '../types/sales';

export class SalesService {

    /**
     * Processes a new sale (Order).
     * Handles full payments, installments (via template), or custom schedule installments.
     *
     * @param params - The sale details including items, payment info, and optional installment config.
     * @returns ServiceResponse containing the new order ID and status.
     */
    static async processSale(params: ProcessSaleParams): Promise<ServiceResponse<ProcessSaleResult>> {
        try {
            // Prepare the parameters.
            // Note: Supabase JS client automatically stringifies objects/arrays for JSONB columns,
            // but explicitly typing the params in the types file ensures structure.
            const rpcParams = {
                p_account_id: params.p_account_id,
                p_customer_id: params.p_customer_id,
                p_sale_type: params.p_sale_type,
                p_items: params.p_items,
                p_payment: params.p_payment,
                p_installment_plan_id: params.p_installment_plan_id ?? null,
                p_custom_schedule: params.p_custom_schedule ?? null,
                p_created_at: params.p_created_at ?? new Date().toISOString()
            };

            const { data, error } = await supabase.rpc('ins_process_sale', rpcParams);

            if (error) {
                return { data: null, error: error.message };
            }

            // The function returns a TABLE, so data will be an array of rows.
            if (!data || data.length === 0) {
                return { data: null, error: 'Transaction failed: No response from server.' };
            }

            // Cast the first result row to our result interface
            return { data: data[0] as ProcessSaleResult, error: null };

        } catch (err: any) {
            // Catch client-side or unexpected network errors
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while processing the sale.'
            };
        }
    }
}