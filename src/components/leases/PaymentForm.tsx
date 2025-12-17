import React, { useState } from 'react';
import { RecordPaymentParams, LeaseScheduleItem } from '../../types/leasesActions';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrency } from '../../utils/timezone';
import { DollarSign, CheckCircle2, CalendarClock } from 'lucide-react';

interface PaymentFormProps {
    scheduleItem: LeaseScheduleItem;
    onSubmit: (params: RecordPaymentParams) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ scheduleItem, onSubmit, onCancel, isSubmitting }) => {
    const { currency } = useCurrency();

    // Helper to get local ISO string (YYYY-MM-DDTHH:MM) for datetime-local input
    const getCurrentLocalTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const [amount, setAmount] = useState(scheduleItem.balance.toString());
    const [method, setMethod] = useState('Cash');
    const [transactionDate, setTransactionDate] = useState(getCurrentLocalTime());
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            p_rent_schedule_id: scheduleItem.id,
            p_amount: parseFloat(amount),
            p_payment_method: method,
            p_transaction_date: new Date(transactionDate).toISOString(), // Convert back to UTC ISO
            p_notes: notes
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Summary Banner */}
            <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center text-sm border border-blue-100">
                <span className="text-blue-800">Total Due:</span>
                <span className="font-bold text-blue-800">{formatCurrency(scheduleItem.amount_due, currency)}</span>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg flex justify-between items-center text-sm border border-orange-100">
                <span className="text-orange-800">Remaining Balance:</span>
                <span className="font-bold text-orange-800">{formatCurrency(scheduleItem.balance, currency)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="number"
                            step="0.01"
                            max={scheduleItem.balance}
                            required
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none transition-shadow"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>

                {/* Transaction Date Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <div className="relative">
                        <CalendarClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="datetime-local"
                            required
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none bg-white"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Method Select */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none bg-white"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Check">Check</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Notes Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ref No, Transaction ID..."
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
                    className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 flex items-center shadow-sm"
                >
                    <CheckCircle2 size={16} className="mr-2" />
                    {isSubmitting ? 'Processing...' : 'Record Payment'}
                </button>
            </div>
        </form>
    );
};

export default PaymentForm;