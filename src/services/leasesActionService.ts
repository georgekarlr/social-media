// services/LeasesActionService.ts
import { supabase } from '../lib/supabase';
import type {
    LeaseListItem,
    LeaseScheduleItem,
    GetLeasesListParams,
    RecordPaymentParams,
    TerminateLeaseParams,
    ExtendLeaseParams,
    ServiceResponse
} from '../types/leasesActions';

export class LeasesActionService {

    /**
     * Fetches a list of leases filtered by search term and status.
     */
    static async getLeasesList(params: GetLeasesListParams = {}): Promise<ServiceResponse<LeaseListItem[]>> {
        try {
            const { data, error } = await supabase.rpc('rt_get_leases_list', {
                p_search: params.p_search ?? null,
                p_status: params.p_status ?? null
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as LeaseListItem[], error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching the leases list.'
            };
        }
    }

    /**
     * Retrieves the rent payment schedule for a specific lease.
     */
    static async getLeaseSchedule(leaseId: number): Promise<ServiceResponse<LeaseScheduleItem[]>> {
        try {
            const { data, error } = await supabase.rpc('rt_get_lease_schedule', {
                p_lease_id: leaseId
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as LeaseScheduleItem[], error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching the lease schedule.'
            };
        }
    }

    /**
     * Records a payment against a specific rent schedule item.
     * This triggers the internal triggers to update the schedule status and lease total.
     */
    static async recordPayment(params: RecordPaymentParams): Promise<ServiceResponse<number>> {
        try {
            const { data, error } = await supabase.rpc('rt_record_payment', {
                p_rent_schedule_id: params.p_rent_schedule_id,
                p_amount: params.p_amount,
                p_payment_method: params.p_payment_method,
                p_notes: params.p_notes ?? null,
                p_transaction_date: params.p_transaction_date ?? new Date().toISOString()
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as number, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while recording the payment.'
            };
        }
    }

    /**
     * Terminates a lease early, sets the end date to now, voids future payments,
     * and sets the property status back to 'vacant'.
     */
    static async terminateLease(params: TerminateLeaseParams): Promise<ServiceResponse<void>> {
        try {
            const { error } = await supabase.rpc('rt_terminate_lease', {
                p_lease_id: params.p_lease_id,
                p_reason: params.p_reason ?? 'Early Termination'
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: null, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while terminating the lease.'
            };
        }
    }

    /**
     * Extends the end date of an existing lease and generates the additional
     * rent schedule items for the extended period.
     */
    static async extendLease(params: ExtendLeaseParams): Promise<ServiceResponse<void>> {
        try {
            const { error } = await supabase.rpc('rt_extend_lease', {
                p_lease_id: params.p_lease_id,
                p_new_end_date: params.p_new_end_date
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: null, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while extending the lease.'
            };
        }
    }
}