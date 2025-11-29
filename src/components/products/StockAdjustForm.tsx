// components/products/StockAdjustForm.tsx
import React, { useState } from 'react';
import { AdjustStockParams, Product } from '../../types/products';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StockAdjustFormProps {
    product: Product;
    onSubmit: (params: AdjustStockParams) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const StockAdjustForm: React.FC<StockAdjustFormProps> = ({ product, onSubmit, onCancel, isSubmitting }) => {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [type, setType] = useState<'add' | 'remove'>('add');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseInt(amount);
        if (!numAmount || numAmount <= 0) return;

        const quantityChange = type === 'add' ? numAmount : -numAmount;

        onSubmit({
            p_product_id: product.id,
            p_quantity_change: quantityChange,
            p_reason: reason || (type === 'add' ? 'Stock Refill' : 'Stock Correction')
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="text-sm text-gray-500">Current Stock</div>
                <div className="text-2xl font-bold text-gray-900">{product.stock_quantity} units</div>
                <div className="text-sm text-gray-600">{product.name} ({product.sku})</div>
            </div>

            <div className="flex space-x-2 mb-4">
                <button
                    type="button"
                    onClick={() => setType('add')}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border ${
                        type === 'add'
                            ? 'bg-green-50 border-green-200 text-green-700 ring-1 ring-green-500'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <ArrowUp size={16} className="mr-2" /> Add Stock
                </button>
                <button
                    type="button"
                    onClick={() => setType('remove')}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border ${
                        type === 'remove'
                            ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <ArrowDown size={16} className="mr-2" /> Remove Stock
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. New shipment, Damaged goods"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                        type === 'add' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    }`}
                >
                    {isSubmitting ? 'Updating...' : `Confirm ${type === 'add' ? 'Addition' : 'Removal'}`}
                </button>
            </div>
        </form>
    );
};

export default StockAdjustForm;