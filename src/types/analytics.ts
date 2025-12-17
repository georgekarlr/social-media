// types/analytics.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Nested JSON Structures ---

export interface RevenueDataPoint {
    month_label: string; // Format: "YYYY-MM"
    total_revenue: number;
}

export interface PaymentMethodStat {
    payment_method: string;
    usage_count: number;
    total_volume: number;
}

export interface VacancyStats {
    total: number;
    vacant: number;
    occupied: number;
    vacancy_rate: number; // Percentage
}

// --- Main Return Object ---

export interface AnalyticsSummary {
    revenue_over_time: RevenueDataPoint[];
    payment_methods: PaymentMethodStat[];
    vacancy_stats: VacancyStats;
}

// --- Parameter Interface ---

export interface GetAnalyticsSummaryParams {
    p_start_date?: string; // ISO Timestamp, defaults to start of year in DB
    p_end_date?: string;   // ISO Timestamp, defaults to now in DB
}
