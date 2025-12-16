// components/dashboard/RentDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    Home,
    Users,
    DollarSign,
    AlertCircle,
    Clock,
    CheckCircle2,
    PieChart,
    RefreshCw,
    Calendar as CalendarIcon
} from 'lucide-react';
import {DashboardStats} from "../types/dashboard.ts";
import {DashboardService} from "../services/dashboardService.ts";
import { useCurrency } from "../hooks/useCurrency.ts";
import { formatCurrency as formatCurrencyByCode } from "../utils/timezone.ts";

// --- Sub-Component: Stat Card ---
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass: string;
    subText?: string;
    trend?: string; // Optional visual indicator
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, subText, trend }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                {subText && <p className="text-xs text-gray-400 mt-2">{subText}</p>}
            </div>
            <div className={`p-3 rounded-lg ${colorClass}`}>
                {icon}
            </div>
        </div>
        {trend && (
            <div className={`absolute bottom-0 left-0 h-1 ${trend}`} style={{ width: '100%' }}></div>
        )}
    </div>
);

// --- Main Dashboard Component ---

const RentDashboard: React.FC = () => {
    // --- State ---
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currency } = useCurrency();

    // Default Date Range: First to Last day of current month
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();

    // Store as YYYY-MM-DD for input fields, convert to ISO for API
    const [startDate, setStartDate] = useState(firstDay.split('T')[0]);
    const [endDate, setEndDate] = useState(lastDay.split('T')[0]);

    
    // --- Fetch Logic ---
    const fetchStats = useCallback(async () => {
        setLoading(true);
        // Ensure we send full ISO timestamp or date string based on API expectation
        // Appending T00:00:00 for start and T23:59:59 for end is safer for specific ranges
        const { data, error } = await DashboardService.getStats({
            p_start_date: `${startDate}T00:00:00`,
            p_end_date: `${endDate}T23:59:59`
        });

        if (error) {
            setError(error);
        } else {
            setStats(data);
            setError(null);
        }
        setLoading(false);
    }, [startDate, endDate]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // --- Helpers ---
    const formatCurrency = (val: number) => formatCurrencyByCode(val, currency);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // --- Render ---

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Property Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Rent collection, occupancy, and lease alerts.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center px-2">
                        <CalendarIcon size={16} className="text-gray-400 mr-2" />
                        <span className="text-xs font-semibold text-gray-600">Range:</span>
                    </div>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="text-sm border-0 bg-gray-50 rounded px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <span className="hidden sm:inline text-gray-400 self-center">-</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="text-sm border-0 bg-gray-50 rounded px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={fetchStats}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center shadow-sm">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : stats ? (
                <div className="space-y-8">

                    {/* 1. Occupancy Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Home className="mr-2 text-blue-500" size={20} /> Occupancy Status
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Occupancy Rate"
                                value={`${stats.occupancy_rate}%`}
                                icon={<PieChart size={24} className="text-blue-600" />}
                                colorClass="bg-blue-50"
                                subText="Percentage of rented units"
                                trend={stats.occupancy_rate > 90 ? 'bg-green-500' : stats.occupancy_rate > 70 ? 'bg-yellow-500' : 'bg-red-500'}
                            />
                            <StatCard
                                title="Total Properties"
                                value={stats.total_properties}
                                icon={<Home size={24} className="text-gray-600" />}
                                colorClass="bg-gray-100"
                                subText="Units under management"
                            />
                            <StatCard
                                title="Occupied"
                                value={stats.occupied_count}
                                icon={<Users size={24} className="text-green-600" />}
                                colorClass="bg-green-50"
                                subText="Active leases"
                            />
                            <StatCard
                                title="Vacant"
                                value={stats.vacant_count}
                                icon={<AlertCircle size={24} className="text-orange-600" />}
                                colorClass="bg-orange-50"
                                subText="Units available for rent"
                            />
                        </div>
                    </div>

                    {/* 2. Financial Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <DollarSign className="mr-2 text-green-500" size={20} /> Financial Performance
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-sm font-medium text-gray-500 mb-1">Expected Revenue</p>
                                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.expected_revenue)}</h3>
                                <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Total rent roll for period</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-sm font-medium text-gray-500 mb-1">Collected Revenue</p>
                                <h3 className="text-2xl font-bold text-green-600">{formatCurrency(stats.collected_revenue)}</h3>
                                <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="bg-green-500 h-1.5 rounded-full"
                                        style={{ width: `${Math.min(100, (stats.collected_revenue / (stats.expected_revenue || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    {((stats.collected_revenue / (stats.expected_revenue || 1)) * 100).toFixed(1)}% Collection Rate
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-sm font-medium text-gray-500 mb-1">Outstanding Balance</p>
                                <h3 className="text-2xl font-bold text-red-600">{formatCurrency(stats.outstanding_balance)}</h3>
                                <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="bg-red-500 h-1.5 rounded-full"
                                        style={{ width: `${Math.min(100, (stats.outstanding_balance / (stats.expected_revenue || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Rent yet to be collected</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Alerts Section (Two Columns) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Overdue Payments List */}
                        <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-red-50 bg-red-50/30 flex justify-between items-center">
                                <div className="flex items-center">
                                    <AlertCircle className="text-red-500 mr-2" size={18} />
                                    <h3 className="font-semibold text-gray-900">Overdue Payments</h3>
                                </div>
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {stats.overdue_count}
                                </span>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {stats.overdue_data.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3">Tenant</th>
                                            <th className="px-6 py-3">Due Date</th>
                                            <th className="px-6 py-3 text-right">Balance</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {stats.overdue_data.map((item) => (
                                            <tr key={item.id} className="hover:bg-red-50/20 transition-colors">
                                                <td className="px-6 py-3">
                                                    <div className="text-sm font-medium text-gray-900">{item.tenant_name}</div>
                                                    <div className="text-xs text-gray-500">{item.property_name}</div>
                                                </td>
                                                <td className="px-6 py-3 text-sm text-red-600">
                                                    {formatDate(item.due_date)}
                                                </td>
                                                <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                                                    {formatCurrency(item.balance)}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-gray-400 text-sm">
                                        <CheckCircle2 size={32} className="mx-auto mb-2 text-green-400" />
                                        No overdue payments found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expiring Leases List */}
                        <div className="bg-white rounded-xl border border-yellow-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-yellow-50 bg-yellow-50/30 flex justify-between items-center">
                                <div className="flex items-center">
                                    <Clock className="text-yellow-600 mr-2" size={18} />
                                    <h3 className="font-semibold text-gray-900">Expiring Leases</h3>
                                </div>
                                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {stats.expiring_leases_count}
                                </span>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {stats.expiring_leases_data.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3">Tenant</th>
                                            <th className="px-6 py-3">Property</th>
                                            <th className="px-6 py-3 text-right">End Date</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {stats.expiring_leases_data.map((lease) => (
                                            <tr key={lease.id} className="hover:bg-yellow-50/20 transition-colors">
                                                <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                                    {lease.tenant_name}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-500">
                                                    {lease.property_name}
                                                </td>
                                                <td className="px-6 py-3 text-right text-sm font-medium text-yellow-700">
                                                    {formatDate(lease.end_date)}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-gray-400 text-sm">
                                        <CheckCircle2 size={32} className="mx-auto mb-2 text-green-400" />
                                        No leases expiring in this period.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default RentDashboard;