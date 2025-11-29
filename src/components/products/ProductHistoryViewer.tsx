import React, { useEffect, useState } from 'react';
import { ProductHistory } from '../../types/products';
import { Calendar, User, Activity, AlertCircle } from 'lucide-react';
import {ProductsService} from "../../services/productService.ts";

interface ProductHistoryViewProps {
    productId: number;
}

const ProductHistoryView: React.FC<ProductHistoryViewProps> = ({ productId }) => {
    const [history, setHistory] = useState<ProductHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // --- CRITICAL FIX: Guard clause ---
        // If productId is invalid (e.g. 0, null, undefined), stop immediately.
        // This prevents the "function not found without parameters" error.
        if (!productId) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchHistory = async () => {
            setLoading(true);
            const { data, error } = await ProductsService.getProductHistory(productId);

            if (isMounted) {
                if (error) setError(error);
                else setHistory(data || []);
                setLoading(false);
            }
        };

        fetchHistory();

        return () => { isMounted = false; };
    }, [productId]);

    if (!productId) return null; // Don't render anything if no ID

    if (loading) return (
        <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center p-4 text-red-600 bg-red-50 rounded-lg">
            <AlertCircle size={18} className="mr-2" />
            <span>{error}</span>
        </div>
    );

    if (history.length === 0) return (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No history records found for this product.
        </div>
    );

    return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {history.map((record) => (
                <div key={record.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${
                                record.activity_type === 'created' ? 'bg-purple-100 text-purple-800' :
                                    record.activity_type.includes('added') ? 'bg-green-100 text-green-800' :
                                        record.activity_type.includes('removed') ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'
                            }`}>
                                {record.activity_type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                                {record.quantity_change && record.quantity_change > 0 ? '+' : ''}
                                {record.quantity_change !== null ? record.quantity_change : '--'}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {new Date(record.created_at).toLocaleString()}
                        </div>
                    </div>

                    {record.reason && (
                        <div className="mt-2 text-sm text-gray-600 pl-2 border-l-2 border-gray-100">
                            {record.reason}
                        </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                            <User size={12} className="mr-1" />
                            {record.user_email || 'System'}
                        </div>
                        <div className="flex items-center font-mono">
                            <Activity size={12} className="mr-1" />
                            Stock: {record.stock_after ?? 'N/A'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductHistoryView;