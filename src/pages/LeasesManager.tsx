import React, { useEffect, useState, useCallback } from 'react';
import {
    FileText,
    Search,
    Filter,
    AlertCircle,
    ChevronRight,
    Home
} from 'lucide-react';
import useCurrency from "../hooks/useCurrency.ts";
import {
    ExtendLeaseParams,
    LeaseListItem,
    LeaseScheduleItem,
    LeaseStatusFilter,
    RecordPaymentParams,
    TerminateLeaseParams
} from "../types/leasesActions.ts";
import {LeasesActionService} from "../services/leasesActionService.ts";
import {formatCurrency} from "../utils/timezone.ts";
import Modal from "../components/ui/Modal.tsx";
import LeaseDetail from "../components/leases/LeaseDetail.tsx";
import PaymentForm from "../components/leases/PaymentForm.tsx";
import TerminationForm from "../components/leases/TerminationForm.tsx";
import ExtensionForm from "../components/leases/ExtensionForm.tsx";

const LeasesManager: React.FC = () => {
    // 1. Context
    const { currency } = useCurrency();

    // 2. State
    const [leases, setLeases] = useState<LeaseListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<LeaseStatusFilter>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Modal States
    // Main Detail Modal
    const [selectedLease, setSelectedLease] = useState<LeaseListItem | null>(null);

    // Action Modals (triggered from Detail view)
    const [paymentTarget, setPaymentTarget] = useState<LeaseScheduleItem | null>(null);
    const [terminationTarget, setTerminationTarget] = useState<LeaseListItem | null>(null);
    const [extensionTarget, setExtensionTarget] = useState<LeaseListItem | null>(null);

    // 4. Fetch Data
    const fetchLeases = useCallback(async () => {
        setLoading(true);
        const { data, error } = await LeasesActionService.getLeasesList({
            p_search: searchTerm,
            p_status: statusFilter
        });

        if (error) {
            setError("Failed to load leases.");
        } else {
            setLeases(data || []);
            setError(null);
        }
        setLoading(false);
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => fetchLeases(), 300);
        return () => clearTimeout(timer);
    }, [fetchLeases]);

    // 5. Action Handlers

    const handleRecordPayment = async (params: RecordPaymentParams) => {
        setIsSubmitting(true);
        const { error } = await LeasesActionService.recordPayment(params);
        setIsSubmitting(false);

        if (error) {
            alert(`Error recording payment: ${error}`);
        } else {
            setPaymentTarget(null);
            // We need to refresh the lease list to update totals
            fetchLeases();
            setSelectedLease(null);
            // NOTE: Ideally, we'd also trigger a refresh inside LeaseDetail,
            // but closing/reopening or relying on a global refresh key is simpler for this structure.
            // For better UX, we could force the Detail component to reload its schedule.
        }
    };

    const handleTerminate = async (params: TerminateLeaseParams) => {
        setIsSubmitting(true);
        const { error } = await LeasesActionService.terminateLease(params);
        setIsSubmitting(false);

        if (error) {
            alert(`Error terminating lease: ${error}`);
        } else {
            setTerminationTarget(null);
            setSelectedLease(null); // Close detail view as lease state changed drastically
            fetchLeases();
        }
    };

    const handleExtend = async (params: ExtendLeaseParams) => {
        setIsSubmitting(true);
        const { error } = await LeasesActionService.extendLease(params);
        setIsSubmitting(false);

        if (error) {
            alert(`Error extending lease: ${error}`);
        } else {
            setExtensionTarget(null);
            setSelectedLease(null); // Close detail view to force refresh when reopened
            fetchLeases();
        }
    };

    // Helper for Status UI
    const getLeaseStatusBadge = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes('active')) return 'bg-green-100 text-green-800';
        if (l.includes('expiring')) return 'bg-orange-100 text-orange-800';
        if (l.includes('terminated')) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FileText className="mr-2" /> Lease Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Track active leases, payments, and renewals.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search Property or Tenant..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <select
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none bg-white"
                        value={statusFilter || ''}
                        onChange={(e) => setStatusFilter((e.target.value as LeaseStatusFilter) || null)}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="expiring">Expiring Soon</option>
                        <option value="terminated">Terminated</option>
                    </select>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant / Property</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {leases.map((lease) => (
                                <tr key={lease.id} onClick={() => setSelectedLease(lease)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{lease.tenant_name}</span>
                                            <span className="text-xs text-gray-500">{lease.property_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(lease.start_date).toLocaleDateString()} - {new Date(lease.end_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        {formatCurrency(lease.rent_amount, currency)}
                                        <span className="text-xs text-gray-500 font-normal"> / {lease.payment_frequency}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${getLeaseStatusBadge(lease.status_label)}`}>
                                                {lease.status_label}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ChevronRight className="text-gray-400 ml-auto" size={20} />
                                    </td>
                                </tr>
                            ))}
                            {leases.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No leases found.</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {leases.map((lease) => (
                            <div key={lease.id} onClick={() => setSelectedLease(lease)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900">{lease.tenant_name}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getLeaseStatusBadge(lease.status_label)}`}>{lease.status_label}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2 flex items-center">
                                    <Home size={14} className="mr-1" /> {lease.property_name}
                                </div>
                                <div className="flex justify-between items-end border-t border-gray-100 pt-2 mt-2">
                                    <div className="text-xs text-gray-500">
                                        Ends: {new Date(lease.end_date).toLocaleDateString()}
                                    </div>
                                    <div className="font-bold text-gray-900">
                                        {formatCurrency(lease.rent_amount, currency)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* --- MODALS --- */}

            {/* 1. Main Detail Modal */}
            <Modal
                isOpen={!!selectedLease}
                onClose={() => setSelectedLease(null)}
                title="Lease Details"
            >
                {selectedLease && (
                    <LeaseDetail
                        lease={selectedLease}
                        onRecordPayment={(item) => setPaymentTarget(item)}
                        onTerminate={() => setTerminationTarget(selectedLease)}
                        onExtend={() => setExtensionTarget(selectedLease)}
                    />
                )}
            </Modal>

            {/* 2. Payment Modal */}
            <Modal
                isOpen={!!paymentTarget}
                onClose={() => setPaymentTarget(null)}
                title="Record Payment"
            >
                {paymentTarget && (
                    <PaymentForm
                        scheduleItem={paymentTarget}
                        onSubmit={handleRecordPayment}
                        onCancel={() => setPaymentTarget(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

            {/* 3. Termination Modal */}
            <Modal
                isOpen={!!terminationTarget}
                onClose={() => setTerminationTarget(null)}
                title="Terminate Lease"
            >
                {terminationTarget && (
                    <TerminationForm
                        lease={terminationTarget}
                        onSubmit={handleTerminate}
                        onCancel={() => setTerminationTarget(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

            {/* 4. Extension Modal */}
            <Modal
                isOpen={!!extensionTarget}
                onClose={() => setExtensionTarget(null)}
                title="Extend Lease"
            >
                {extensionTarget && (
                    <ExtensionForm
                        lease={extensionTarget}
                        onSubmit={handleExtend}
                        onCancel={() => setExtensionTarget(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>
        </div>
    );
};

export default LeasesManager;