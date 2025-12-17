import React, { useState } from 'react';
import { AlertTriangle, FileX } from 'lucide-react';
import {LeaseListItem, TerminateLeaseParams} from "../../types/leasesActions.ts";

interface TerminationFormProps {
    lease: LeaseListItem;
    onSubmit: (params: TerminateLeaseParams) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const TerminationForm: React.FC<TerminationFormProps> = ({ lease, onSubmit, onCancel, isSubmitting }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            p_lease_id: lease.id,
            p_reason: reason
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Warning Box */}
            <div className="bg-red-50 p-4 rounded-lg flex items-start border border-red-100">
                <AlertTriangle className="text-red-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                <div className="text-sm text-red-800">
                    <p className="font-bold">Warning: This action is irreversible.</p>
                    <p className="mt-1">
                        Terminating the lease for <strong>{lease.tenant_name}</strong> will end the contract immediately.
                        Future rent schedules will be voided.
                    </p>
                </div>
            </div>

            {/* Reason Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Termination</label>
                <textarea
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="e.g., Tenant eviction, mutual agreement, breach of contract..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center shadow-sm"
                >
                    <FileX size={16} className="mr-2" />
                    {isSubmitting ? 'Terminating...' : 'Terminate Lease'}
                </button>
            </div>
        </form>
    );
};

export default TerminationForm;