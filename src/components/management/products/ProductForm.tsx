
import React, { useState, useEffect } from 'react';
import { Box, Tag, FileText, Ruler, AlertCircle, Save } from 'lucide-react';
import {InventoryProduct, InventoryUnitType} from "../../../types/inventoryProducts.ts";
import {Category} from "../../../types/inventoryCategories.ts";

interface ProductFormData {
    sku: string;
    name: string;
    description: string;
    categoryId: number;
    unitType: string;
    reorderLevel: number;
}

interface ProductFormProps {
    initialData?: InventoryProduct;
    categories: Category[]; // Passed from parent for dropdown
    onSubmit: (data: ProductFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
                                                     initialData,
                                                     categories,
                                                     onSubmit,
                                                     onCancel,
                                                     isSubmitting
                                                 }) => {
    // Form State
    const [formData, setFormData] = useState<ProductFormData>({
        sku: '',
        name: '',
        description: '',
        categoryId: categories.length > 0 ? categories[0].category_id : 0,
        unitType: 'pieces',
        reorderLevel: 5
    });

    // Load initial data
    useEffect(() => {
        if (initialData) {
            // Find the category ID by name if needed, or assume backend returns ID in a real app.
            // For this UI, we map the name string back to an ID if possible, or default.
            const cat = categories.find(c => c.name === initialData.category_name);

            setFormData({
                sku: initialData.sku,
                name: initialData.name,
                description: initialData.description || '',
                categoryId: cat ? cat.category_id : (categories[0]?.category_id || 0),
                unitType: initialData.unit_type,
                reorderLevel: initialData.reorder_level
            });
        } else if (categories.length > 0) {
            // Default to first category on create
            setFormData(prev => ({ ...prev, categoryId: categories[0].category_id }));
        }
    }, [initialData, categories]);

    const handleChange = (field: keyof ProductFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const unitTypes: InventoryUnitType[] = ['pieces', 'box', 'pack', 'set', 'pair', 'dozen', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'sq_m', 'roll'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SKU */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            required
                            placeholder="e.g. ELEC-001"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={formData.sku}
                            onChange={(e) => handleChange('sku', e.target.value)}
                        />
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <div className="relative">
                        <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            required
                            placeholder="e.g. Wireless Mouse"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                        rows={3}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none bg-white"
                        value={formData.categoryId}
                        onChange={(e) => handleChange('categoryId', parseInt(e.target.value))}
                    >
                        {categories.map(cat => (
                            <option key={cat.category_id} value={cat.category_id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Unit Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                    <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none bg-white"
                            value={formData.unitType}
                            onChange={(e) => handleChange('unitType', e.target.value)}
                        >
                            {unitTypes.map(u => (
                                <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Reorder Level */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Level</label>
                    <div className="relative">
                        <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="number"
                            min="0"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={formData.reorderLevel}
                            onChange={(e) => handleChange('reorderLevel', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    <Save size={16} className="mr-2" />
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;