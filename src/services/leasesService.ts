// services/leasesService.ts
import { supabase } from '../lib/supabase';
import type {
    CreateLeaseParams,
    ServiceResponse
} from '../types/leases';

export class LeasesService {

    /**
     * Creates a new lease, updates property status to 'occupied', and triggers schedule generation.
     *
     * @returns ServiceResponse containing the new Lease ID.
     */
    static async createLease(params: CreateLeaseParams): Promise<ServiceResponse<number>> {
        try {
            const rpcParams = {
                p_property_id: params.p_property_id,
                p_tenant_id: params.p_tenant_id,
                p_start_date: params.p_start_date,
                p_end_date: params.p_end_date,
                p_rent_amount: params.p_rent_amount,
                p_frequency: params.p_frequency,
                p_created_at: params.p_created_at ?? new Date().toISOString()
            };

            const { data, error } = await supabase.rpc('rt_create_lease', rpcParams);

            if (error) {
                return { data: null, error: error.message };
            }

            // The function returns a single BIGINT (the ID)
            return { data: data as number, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while creating the lease.'
            };
        }
    }
}