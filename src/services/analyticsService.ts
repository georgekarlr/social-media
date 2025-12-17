// services/analyticsService.ts
import { supabase } from '../lib/supabase';
import type {
    AnalyticsSummary,
    GetAnalyticsSummaryParams,
    ServiceResponse
} from '../types/analytics';

export class AnalyticsService {

    /**
     * Fetches the analytics summary including revenue trends, payment method usage,
     * and a snapshot of current vacancy statistics.
     *
     * @param params - Optional date range filters.
     * @returns ServiceResponse containing the aggregated analytics object.
     */
    static async getSummary(params: GetAnalyticsSummaryParams = {}): Promise<ServiceResponse<AnalyticsSummary>> {
        try {
            const { data, error } = await supabase.rpc('rt_get_analytics_summary', {
                p_start_date: params.p_start_date ?? null,
                p_end_date: params.p_end_date ?? null
            });

            if (error) {
                return { data: null, error: error.message };
            }

            // The function returns a TABLE row containing JSON aggregates.
            // We expect a single row of data.
            if (!data || data.length === 0) {
                return { data: null, error: 'No analytics data available.' };
            }

            return { data: data[0] as AnalyticsSummary, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching analytics.'
            };
        }
    }
}