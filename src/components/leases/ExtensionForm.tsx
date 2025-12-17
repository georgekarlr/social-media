import React, { useState } from 'react';
import { ExtendLeaseParams, LeaseListItem } from '../../types/leasesActions';
import { CalendarClock } from 'lucide-react';

interface ExtensionFormProps {
    lease: LeaseListItem;
    onSubmit: (params: ExtendLeaseParams) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ExtensionForm: React.FC<ExtensionFormProps> = ({ lease, onSubmit, onCancel, isSubmitting }) => {

    // Formatting helper to display current end date cleanly
    const currentEndDisplay = new Date(lease.end_date).toLocaleString([], {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const [newDate, setNewDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            p_lease_id: lease.id,
            p_new_end_date: new Date(newDate).toISOString() // Convert local time to ISO for DB
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Info Box */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                <p>Current End: <span className="font-bold">{currentEndDisplay}</span></p>
                <p className="mt-1 text-xs opacity-80">
                    Extending will automatically generate new rent schedules starting from the moment the current lease ends.
                </p>
            </div>

            {/* Date Time Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New End Date & Time</label>
                <div className="relative">
                    <CalendarClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="datetime-local"
                        required
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1">Select the exact time the new lease term expires.</p>
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
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center shadow-sm"
                >
                    <CalendarClock size={16} className="mr-2" />
                    {isSubmitting ? 'Extending...' : 'Extend Lease'}
                </button>
            </div>
        </form>
    );
};

export default ExtensionForm;