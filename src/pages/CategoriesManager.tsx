import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../contexts/AuthContext";

import {
    Tags,
    Plus,
    Search,
    Edit2,
    Trash2,
    AlertCircle,
    Package,
    AlertTriangle
} from 'lucide-react';
import {Category} from "../types/inventoryCategories.ts";
import {InventoryCategoriesService} from "../services/inventoryCategoriesService.ts";
import Modal from "../components/ui/Modal.tsx";
import CategoryForm from "../components/management/categories/CategoryForm.tsx";

const CategoriesManager: React.FC = () => {
    // 1. Context
    const { persona } = useAuth();
    const accountId = persona?.id ?? null;

    // 2. State
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    // 4. Fetch Data
    const fetchCategories = useCallback(async () => {
        if (!accountId) return;

        setLoading(true);
        const { data, error } = await InventoryCategoriesService.getCategories({
            p_account_id: accountId,
            p_search_term: searchTerm
        });

        if (error) {
            setError("Failed to load categories.");
        } else {
            setCategories(data || []);
            setError(null);
        }
        setLoading(false);
    }, [accountId, searchTerm]);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => fetchCategories(), 300);
        return () => clearTimeout(timer);
    }, [fetchCategories]);

    // 5. Handlers

    const handleCreate = async (formData: { name: string; description: string }) => {
        if (!accountId) return;

        setIsSubmitting(true);
        const { error } = await InventoryCategoriesService.createCategory({
            p_account_id: accountId,
            p_name: formData.name,
            p_description: formData.description
        });
        setIsSubmitting(false);

        if (error) {
            alert(`Error creating category: ${error}`);
        } else {
            setIsCreateModalOpen(false);
            fetchCategories();
        }
    };

    const handleUpdate = async (formData: { name: string; description: string }) => {
        if (!accountId || !editingCategory) return;

        setIsSubmitting(true);
        const { error } = await InventoryCategoriesService.updateCategory({
            p_account_id: accountId,
            p_category_id: editingCategory.category_id,
            p_name: formData.name,
            p_description: formData.description
        });
        setIsSubmitting(false);

        if (error) {
            alert(`Error updating category: ${error}`);
        } else {
            setEditingCategory(null);
            fetchCategories();
        }
    };

    const confirmDelete = async () => {
        if (!accountId || !deleteTarget) return;

        setIsSubmitting(true);
        const { data, error } = await InventoryCategoriesService.deleteCategory(accountId, deleteTarget.category_id);
        setIsSubmitting(false);

        if (error) {
            alert(`System error: ${error}`);
        } else if (data) {
            if (data.is_deleted) {
                // Success
                setDeleteTarget(null);
                fetchCategories();
            } else {
                // Logic prevention (e.g., products attached)
                alert(`Cannot delete: ${data.message}`);
                setDeleteTarget(null);
            }
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Tags className="mr-2" /> Product Categories
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Organize your inventory catalog.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    disabled={!accountId}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    <Plus size={18} className="mr-2" />
                    Add Category
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((cat) => (
                                <tr key={cat.category_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3 font-bold text-xs">
                                                {cat.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {cat.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                cat.product_count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                <Package size={12} className="mr-1" />
                                                {cat.product_count}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setEditingCategory(cat)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(cat)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No categories found. Start by adding one!
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {categories.map((cat) => (
                            <div key={cat.category_id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <Tags size={18} className="text-blue-500 mr-2" />
                                        <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                        cat.product_count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {cat.product_count} Items
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {cat.description || 'No description provided.'}
                                </p>

                                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => setEditingCategory(cat)}
                                        className="flex items-center px-3 py-1.5 text-sm text-blue-600 font-medium bg-blue-50 rounded-lg"
                                    >
                                        <Edit2 size={16} className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(cat)}
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

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create Category"
            >
                <CategoryForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingCategory}
                onClose={() => setEditingCategory(null)}
                title="Edit Category"
            >
                {editingCategory && (
                    <CategoryForm
                        initialData={editingCategory}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingCategory(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete Category"
            >
                <div className="space-y-4">
                    <div className="flex items-start bg-red-50 p-4 rounded-lg border border-red-100">
                        <AlertTriangle className="text-red-600 mr-3 mt-0.5 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-red-800 font-bold">Confirm Deletion</h3>
                            <p className="text-red-700 text-sm mt-1">
                                Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
                            </p>
                            {deleteTarget && deleteTarget.product_count > 0 && (
                                <p className="text-red-800 text-xs font-bold mt-2">
                                    Note: This category has {deleteTarget.product_count} products.
                                    Deletion might be blocked or require re-assigning products.
                                </p>
                            )}
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
                            {isSubmitting ? 'Deleting...' : 'Delete Category'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CategoriesManager;