import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../contexts/AuthContext";

import {
    Package,
    Plus,
    Search,
    Edit2,
    Trash2,
    AlertTriangle,
    Boxes
} from 'lucide-react';
import {InventoryProduct} from "../types/inventoryProducts.ts";
import {Category} from "../types/inventoryCategories.ts";
import {InventoryProductsService} from "../services/inventoryProductsService.ts";
import {InventoryCategoriesService} from "../services/inventoryCategoriesService.ts";
import Modal from "../components/ui/Modal.tsx";
import ProductForm from "../components/management/products/ProductForm.tsx";

const ProductsManager: React.FC = () => {
    // 1. Context
    const { persona } = useAuth();
    const accountId = persona?.id ?? null;

    // 2. State
    const [products, setProducts] = useState<InventoryProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]); // Needed for form

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<InventoryProduct | null>(null);

    // 4. Data Fetching (Products + Categories)
    const fetchData = useCallback(async () => {
        if (!accountId) return;
        setLoading(true);

        try {
            // Fetch both concurrently
            const [prodRes, catRes] = await Promise.all([
                InventoryProductsService.getProducts({ p_account_id: accountId, p_search_term: searchTerm }),
                InventoryCategoriesService.getCategories({ p_account_id: accountId })
            ]);

            if (prodRes.error) throw new Error(prodRes.error);
            if (catRes.error) console.warn("Categories fetch warning:", catRes.error);

            setProducts(prodRes.data || []);
            setCategories(catRes.data || []);
            setError(null);

        } catch (err: any) {
            setError(err.message || "Failed to load inventory data.");
        } finally {
            setLoading(false);
        }
    }, [accountId, searchTerm]);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => fetchData(), 400);
        return () => clearTimeout(timer);
    }, [fetchData]);

    // 5. Handlers

    const handleCreate = async (formData: any) => {
        if (!accountId) return;
        setIsSubmitting(true);

        const { data, error } = await InventoryProductsService.createProduct({
            p_account_id: accountId,
            p_sku: formData.sku,
            p_name: formData.name,
            p_description: formData.description,
            p_category_id: formData.categoryId,
            p_unit_type: formData.unitType,
            p_reorder_level: formData.reorderLevel
        });

        setIsSubmitting(false);

        if (error) {
            alert(`System Error: ${error}`);
        } else if (data) {
            if (data.success) {
                setIsCreateModalOpen(false);
                fetchData();
            } else {
                alert(`Creation Failed: ${data.message}`);
            }
        }
    };

    const handleUpdate = async (formData: any) => {
        if (!accountId || !editingProduct) return;
        setIsSubmitting(true);

        const { data, error } = await InventoryProductsService.updateProduct({
            p_account_id: accountId,
            p_product_id: editingProduct.product_id,
            p_sku: formData.sku,
            p_name: formData.name,
            p_description: formData.description,
            p_category_id: formData.categoryId,
            p_unit_type: formData.unitType,
            p_reorder_level: formData.reorderLevel
        });

        setIsSubmitting(false);

        if (error) {
            alert(`System Error: ${error}`);
        } else if (data) {
            if (data.success) {
                setEditingProduct(null);
                fetchData();
            } else {
                alert(`Update Failed: ${data.message}`);
            }
        }
    };

    const confirmDelete = async () => {
        if (!accountId || !deleteTarget) return;
        setIsSubmitting(true);

        const { data, error } = await InventoryProductsService.deleteProduct(accountId, deleteTarget.product_id);
        setIsSubmitting(false);

        if (error) {
            alert(`System Error: ${error}`);
        } else if (data) {
            if (data.success) {
                setDeleteTarget(null);
                fetchData();
            } else {
                alert(`Cannot Delete: ${data.message}`);
                setDeleteTarget(null);
            }
        }
    };

    // Helper: Stock Status Badge
    const getStockBadge = (current: number, reorder: number) => {
        if (current === 0) return <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>;
        if (current <= reorder) return <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">Low Stock</span>;
        return <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">In Stock</span>;
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
    <Boxes className="mr-2" /> Products Catalog
    </h1>
    <p className="text-gray-500 text-sm mt-1">Manage items, stock levels, and reorder points.</p>
    </div>
    <button
    onClick={() => setIsCreateModalOpen(true)}
    disabled={!accountId}
    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
    >
    <Plus size={18} className="mr-2" />
        Add Product
    </button>
    </div>

    {/* Search Bar */}
    <div className="relative mb-6 max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
    <input
    type="text"
    placeholder="Search by SKU or Name..."
    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow shadow-sm"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    />
    </div>

    {/* Error */}
    {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
        <AlertTriangle size={20} className="mr-2" />
        {error}
        </div>
    )}

    {/* Content */}
    {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
    ) : (
        <>
            {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
    <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
                <tr key={product.product_id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
            <div className="flex items-center">
            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
            <Package size={18} />
    </div>
    <div>
    <div className="font-medium text-gray-900">{product.name}</div>
        <div className="text-xs text-gray-500">SKU: {product.sku}</div>
    </div>
    </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-600">
        {product.category_name || <span className="italic text-gray-400">Uncategorized</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                {product.unit_type}
                </td>
                <td className="px-6 py-4 text-center">
            <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-900">{product.current_stock}</span>
        {getStockBadge(product.current_stock, product.reorder_level)}
        </div>
        </td>
        <td className="px-6 py-4 text-right">
    <div className="flex justify-end space-x-2">
    <button
        onClick={() => setEditingProduct(product)}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
        <Edit2 size={18} />
    </button>
    <button
        onClick={() => setDeleteTarget(product)}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
        <Trash2 size={18} />
    </button>
    </div>
    </td>
    </tr>
    ))}
        {products.length === 0 && (
            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No products found.</td></tr>
        )}
        </tbody>
        </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
            {products.map((product) => (
                    <div key={product.product_id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                <Package size={18} className="text-blue-500 mr-2" />
                <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
    </div>
    </div>
        {getStockBadge(product.current_stock, product.reorder_level)}
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg mb-3 text-xs text-gray-600">
        <span>Cat: <strong>{product.category_name || '-'}</strong></span>
    <span>Stock: <strong className="text-sm">{product.current_stock}</strong> {product.unit_type}</span>
    </div>

    <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
    <button
        onClick={() => setEditingProduct(product)}
        className="flex items-center px-3 py-1.5 text-sm text-blue-600 font-medium bg-blue-50 rounded-lg"
        >
        <Edit2 size={16} className="mr-1" /> Edit
        </button>
        <button
        onClick={() => setDeleteTarget(product)}
        className="flex items-center px-3 py-1.5 text-sm text-red-600 font-medium bg-red-50 rounded-lg"
        >
        <Trash2 size={16} className="mr-1" /> Delete
        </button>
        </div>
        </div>
    ))}
        </div>
        </>
    )}

        {/* --- MODALS --- */}

        {/* Create */}
        <Modal
            isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Product"
        >
        <ProductForm
            categories={categories}
        onSubmit={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
        isSubmitting={isSubmitting}
        />
        </Modal>

        {/* Edit */}
        <Modal
            isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Product"
            >
            {editingProduct && (
                <ProductForm
                    initialData={editingProduct}
        categories={categories}
        onSubmit={handleUpdate}
        onCancel={() => setEditingProduct(null)}
        isSubmitting={isSubmitting}
        />
    )}
        </Modal>

        {/* Delete */}
        <Modal
            isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
        >
        <div className="space-y-4">
        <div className="flex items-start bg-red-50 p-4 rounded-lg border border-red-100">
        <AlertTriangle className="text-red-600 mr-3 mt-0.5 flex-shrink-0" size={24} />
    <div>
    <h3 className="text-red-800 font-bold">Confirm Deletion</h3>
    <p className="text-red-700 text-sm mt-1">
        Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
    </p>
    <p className="text-red-600 text-xs mt-2 italic">
        This action cannot be completed if there are stock transactions linked to this product.
    </p>
    </div>
    </div>

    <div className="flex justify-end space-x-3 pt-2">
    <button
        onClick={() => setDeleteTarget(null)}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
            Cancel
            </button>
            <button
        onClick={confirmDelete}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
            >
            {isSubmitting ? 'Deleting...' : 'Delete Product'}
            </button>
            </div>
            </div>
            </Modal>
            </div>
    );
    };

    export default ProductsManager;