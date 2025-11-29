import React, { useEffect, useState } from 'react';
import { DashboardService } from '../services/dashboardService.ts'; // Adjust path as needed
import type { DashboardStats } from '../types/dashboard.ts'; // Adjust path as needed

// --- Helper: Currency Formatter ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

// --- Component: Stat Card ---
interface StatCardProps {
    title: string;
    value: number;
    type?: 'currency' | 'count';
    color?: string; // Tailwind border color class like 'border-blue-500'
}

const StatCard: React.FC<StatCardProps> = ({ title, value, type = 'currency', color = 'border-gray-200' }) => {
    return (
        <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color}`}>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">
                {type === 'currency' ? formatCurrency(value) : value}
            </div>
        </div>
    );
};

// --- Main Component: Dashboard Stats Grid ---
const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Default Date Range: First day of current month to today
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Append time to ensure full coverage of the selected end date
            const start = new Date(dateRange.start);
            const end = new Date(dateRange.end);
            end.setHours(23, 59, 59, 999); // Set to end of day

            const data = await DashboardService.getStats(start, end);
            setStats(data);
        } catch (err: any) {
            setError('Failed to load dashboard statistics.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">

            {/* Header & Date Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Performance Overview</h2>
                <div className="flex gap-2 bg-white p-2 rounded shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">From</label>
                        <input
                            type="date"
                            name="start"
                            value={dateRange.start}
                            onChange={handleDateChange}
                            className="text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">To</label>
                        <input
                            type="date"
                            name="end"
                            value={dateRange.end}
                            onChange={handleDateChange}
                            className="text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 text-red-700 bg-red-100 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            )}

            {/* Data Display */}
            {!loading && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Row 1: Period Financials */}
                    <StatCard
                        title="Period Sales"
                        value={stats.period_sales}
                        color="border-blue-500"
                    />
                    <StatCard
                        title="Cash Collected"
                        value={stats.period_cash_collected}
                        color="border-green-500"
                    />
                    <StatCard
                        title="Refunds"
                        value={stats.period_refunds}
                        color="border-red-400"
                    />

                    {/* Row 2: Projections & Global Stats */}
                    <StatCard
                        title="Collections Due (Period)"
                        value={stats.period_installments_due}
                        color="border-yellow-500"
                    />
                    <StatCard
                        title="Total Outstanding Debt"
                        value={stats.global_outstanding_debt}
                        color="border-purple-500"
                    />
                    <StatCard
                        title="Overdue Loans"
                        value={stats.global_overdue_count}
                        type="count"
                        color="border-orange-600"
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;