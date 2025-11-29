import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../contexts/AuthContext";

import {
    Plus, Search, Edit2, Trash2, History, Package, AlertCircle
} from 'lucide-react';
import {AdjustStockParams, CreateProductParams, Product, UpdateProductParams} from "../types/products.ts";
import {ProductsService} from "../services/productService.ts";
import Modal from "../components/ui/Modal.tsx";
import ProductForm from "../components/products/ProductForm.tsx";
import StockAdjustForm from "../components/products/StockAdjustForm.tsx";
import ProductHistoryView from "../components/products/ProductHistoryViewer.tsx";

const ProductManager: React.FC = () => {
    const { persona } = useAuth();
    const accountId = persona?.id ?? null;

    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal State
    // We keep these strictly separate
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [stockProduct, setStockProduct] = useState<Product | null>(null);
    const [historyProduct, setHistoryProduct] = useState<Product | null>(null);

    // --- Fetch Logic ---
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const { data, error } = await ProductsService.getProducts({
            p_search_term: searchTerm
        });

        if (error) setError(error);
        else setProducts(data || []);

        setLoading(false);
    }, [searchTerm]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- Action Handlers ---

    // SAFE ADD HANDLER: Ensures history is cleared
    const handleOpenAddModal = () => {
        setHistoryProduct(null); // Clear history
        setEditProduct(null);    // Clear edit
        setStockProduct(null);   // Clear stock
        setIsCreateModalOpen(true); // Open Create only
    };

    const handleCreate = async (params: CreateProductParams | UpdateProductParams) => {
        setIsSubmitting(true);
        const { error } = await ProductsService.createProduct(params as CreateProductParams);
        setIsSubmitting(false);

        if (error) {
            alert(error);
        } else {
            setIsCreateModalOpen(false);
            fetchProducts();
        }
    };

    const handleUpdate = async (params: CreateProductParams | UpdateProductParams) => {
        setIsSubmitting(true);
        const { error } = await ProductsService.updateProduct(params as UpdateProductParams);
        setIsSubmitting(false);

        if (error) {
            alert(error);
        } else {
            setEditProduct(null);
            fetchProducts();
        }
    };

    const handleStockAdjust = async (params: AdjustStockParams) => {
        setIsSubmitting(true);
        const { error } = await ProductsService.adjustStock(params);
        setIsSubmitting(false);

        if (error) {
            alert(error);
        } else {
            setStockProduct(null);
            fetchProducts();
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        const { error } = await ProductsService.deleteProduct(id);
        if (error) alert(error);
        else fetchProducts();
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>

                <button
                    onClick={handleOpenAddModal}
                    disabled={!accountId}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={18} className="mr-2" />
                    Add Product
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                    <AlertCircle size={20} className="mr-2" /> {error}
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{product.name}</div>
                                    <div className="text-sm text-gray-500">{product.sku}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.stock_quantity}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => setStockProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Stock">
                                            <Package size={18} />
                                        </button>
                                        <button onClick={() => setHistoryProduct(product)} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="History">
                                            <History size={18} />
                                        </button>
                                        <button onClick={() => setEditProduct(product)} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Mobile View */}
                    <div className="md:hidden">
                        {products.map((product) => (
                            <div key={product.id} className="p-4 border-b border-gray-100">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">{product.name}</span>
                                    <span className="font-bold">${product.price}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="space-x-2">
                                        <button onClick={() => setStockProduct(product)} className="text-blue-600 p-1"><Package size={20}/></button>
                                        <button onClick={() => setHistoryProduct(product)} className="text-gray-500 p-1"><History size={20}/></button>
                                        <button onClick={() => setEditProduct(product)} className="text-gray-500 p-1"><Edit2 size={20}/></button>
                                    </div>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-500 p-1"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Modals --- */}

            {/* 1. Create Modal - STRICTLY SEPARATE */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Product"
            >
                <ProductForm
                    accountId={accountId}
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* 2. Edit Modal */}
            <Modal
                isOpen={!!editProduct}
                onClose={() => setEditProduct(null)}
                title="Edit Product"
            >
                {editProduct && (
                    <ProductForm
                        initialData={editProduct}
                        accountId={accountId}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditProduct(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

            {/* 3. Stock Modal */}
            <Modal
                isOpen={!!stockProduct}
                onClose={() => setStockProduct(null)}
                title="Adjust Stock"
            >
                {stockProduct && (
                    <StockAdjustForm
                        product={stockProduct}
                        onSubmit={handleStockAdjust}
                        onCancel={() => setStockProduct(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

            {/* 4. History Modal */}
            <Modal
                isOpen={!!historyProduct}
                onClose={() => setHistoryProduct(null)}
                title="Product History"
            >
                {/* Ensure component only mounts if historyProduct is present */}
                {historyProduct && (
                    <ProductHistoryView productId={historyProduct.id} />
                )}
            </Modal>
        </div>
    );
};

export default ProductManager;