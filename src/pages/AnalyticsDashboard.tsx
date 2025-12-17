import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import {
    TrendingUp,
    PieChart as PieIcon,
    Home,
    Calendar,
    RefreshCw,
    AlertCircle,
    Wallet
} from 'lucide-react';
import {AnalyticsSummary} from "../types/analytics.ts";
import useCurrency from "../hooks/useCurrency.ts";
import {AnalyticsService} from "../services/analyticsService.ts";
import {formatCurrency} from "../utils/timezone.ts";

// --- Constants for Chart Colors ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard: React.FC = () => {
    // 1. Context & State
    const { currency } = useCurrency();

    const [data, setData] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Date State (Defaults to current year)
    const currentYear = new Date().getFullYear();
    const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // 2. Data Fetching
    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        const { data, error } = await AnalyticsService.getSummary({
            p_start_date: `${startDate}T00:00:00`,
            p_end_date: `${endDate}T23:59:59`
        });

        if (error) {
            setError(error);
        } else {
            setData(data);
            setError(null);
        }
        setLoading(false);
    }, [startDate, endDate]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    // 3. Derived Totals
    const totalRevenuePeriod = useMemo(() => {
        if (!data) return 0;
        return data.revenue_over_time.reduce((acc, curr) => acc + curr.total_revenue, 0);
    }, [data]);

    // 4. Custom Tooltip for Currency
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
                    <p className="font-bold text-gray-700 mb-1">{label}</p>
                    <p className="text-blue-600 font-semibold">
                        {formatCurrency(payload[0].value, currency)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <TrendingUp className="mr-2" /> Financial Analytics
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Revenue trends, occupancy rates, and payment insights.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center px-2">
                        <Calendar size={16} className="text-gray-400 mr-2" />
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
                        onClick={fetchAnalytics}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : data ? (
                <div className="space-y-6">

                    {/* 1. KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Revenue */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Revenue (Period)</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                        {formatCurrency(totalRevenuePeriod, currency)}
                                    </h3>
                                </div>
                                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                    <Wallet size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Vacancy Rate */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Vacancy Rate</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                        {data.vacancy_stats.vacancy_rate}%
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {data.vacancy_stats.vacant} vacant / {data.vacancy_stats.total} total units
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${data.vacancy_stats.vacancy_rate > 10 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <Home size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Occupied Units */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Occupied Units</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                        {data.vacancy_stats.occupied}
                                    </h3>
                                </div>
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                    <PieIcon size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Main Chart: Revenue Over Time */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trend</h3>
                        {/*
                            FIX: Explicit width and height on the parent container.
                            Removed flex properties that might collapse the container before render.
                        */}
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.revenue_over_time} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month_label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="total_revenue"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 3. Bottom Grid: Payment Methods & Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Payment Method Distribution */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Methods</h3>

                            {/*
                                FIX: Explicit width and height on the parent container.
                                Removed complex flex alignments that confuse Recharts initial sizing.
                            */}
                            <div className="w-full h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.payment_methods}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="total_volume"
                                            nameKey="payment_method"
                                        >
                                            {data.payment_methods.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value, currency)}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Payment Method Details Table */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Details</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Method</th>
                                        <th className="px-4 py-3">Txns</th>
                                        <th className="px-4 py-3 text-right rounded-r-lg">Volume</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                    {data.payment_methods.map((method, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                                    ></div>
                                                    {method.payment_method}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{method.usage_count}</td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                {formatCurrency(method.total_volume, currency)}
                                            </td>
                                        </tr>
                                    ))}
                                    {data.payment_methods.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                                                No payment data found.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>
            ) : null}
        </div>
    );
};

export default AnalyticsDashboard;