// services/tenantsService.ts
import { supabase } from '../lib/supabase';
import type {
    Tenant,
    CreateTenantParams,
    UpdateTenantParams,
    ServiceResponse
} from '../types/tenants';

export class TenantsService {

    /**
     * Fetches all tenants belonging to the current user.
     */
    static async getTenants(): Promise<ServiceResponse<Tenant[]>> {
        try {
            const { data, error } = await supabase.rpc('rt_get_tenants');

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as Tenant[], error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching tenants.'
            };
        }
    }

    /**
     * Creates a new tenant record.
     * Returns the ID of the newly created tenant.
     */
    static async createTenant(params: CreateTenantParams): Promise<ServiceResponse<number>> {
        try {
            const rpcParams = {
                p_full_name: params.p_full_name,
                p_email: params.p_email ?? null,
                p_phone: params.p_phone ?? null,
                p_id_number: params.p_id_number ?? null,
                p_notes: params.p_notes ?? null,
                p_created_at: params.p_created_at ?? new Date().toISOString()
            };

            const { data, error } = await supabase.rpc('rt_create_tenant', rpcParams);

            if (error) {
                return { data: null, error: error.message };
            }

            // Function returns BIGINT directly
            return { data: data as number, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while creating the tenant.'
            };
        }
    }

    /**
     * Updates details of an existing tenant.
     */
    static async updateTenant(params: UpdateTenantParams): Promise<ServiceResponse<void>> {
        try {
            const rpcParams = {
                p_tenant_id: params.p_tenant_id,
                p_full_name: params.p_full_name,
                p_email: params.p_email ?? null,
                p_phone: params.p_phone ?? null,
                p_id_number: params.p_id_number ?? null,
                p_notes: params.p_notes ?? null,
                p_updated_at: params.p_updated_at ?? new Date().toISOString()
            };

            const { error } = await supabase.rpc('rt_update_tenant', rpcParams);

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: null, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while updating the tenant.'
            };
        }
    }

    /**
     * Deletes a tenant.
     * Will fail with an error message if the tenant has associated leases.
     */
    static async deleteTenant(tenantId: number): Promise<ServiceResponse<void>> {
        try {
            const { error } = await supabase.rpc('rt_delete_tenant', {
                p_tenant_id: tenantId
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: null, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while deleting the tenant.'
            };
        }
    }
}