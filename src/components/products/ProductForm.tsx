import React, { useState, useEffect } from 'react';
import { Product, CreateProductParams, UpdateProductParams } from '../../types/products';

interface ProductFormProps {
    initialData?: Product;
    accountId: number | null;
    onSubmit: (data: CreateProductParams | UpdateProductParams) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
                                                     initialData,
                                                     accountId,
                                                     onSubmit,
                                                     onCancel,
                                                     isSubmitting
                                                 }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        cost_price: '',
        stock_quantity: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                sku: initialData.sku,
                price: initialData.price.toString(),
                cost_price: initialData.cost_price.toString(),
                stock_quantity: initialData.stock_quantity.toString()
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (initialData) {
            onSubmit({
                p_product_id: initialData.id,
                p_name: formData.name,
                p_sku: formData.sku,
                p_price: parseFloat(formData.price) || 0,
                p_cost_price: parseFloat(formData.cost_price) || 0
            });
        } else {
            // Fix: Strict check for account ID
            if (!accountId) {
                alert("Account ID not found. Please reload or sign in again.");
                return;
            }
            onSubmit({
                p_account_id: accountId,
                p_name: formData.name,
                p_sku: formData.sku,
                p_price: parseFloat(formData.price) || 0,
                p_cost_price: parseFloat(formData.cost_price) || 0,
                p_stock_quantity: parseInt(formData.stock_quantity) || 0
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={formData.cost_price}
                        onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    />
                </div>

                {!initialData && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={formData.stock_quantity}
                            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                            placeholder="0"
                        />
                    </div>
                )}
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
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;