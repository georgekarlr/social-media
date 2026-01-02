import React, { useState, useEffect } from 'react';
import { Tag, FileText, CheckCircle2 } from 'lucide-react';
import {Category} from "../../../types/inventoryCategories.ts";

interface CategoryFormData {
    name: string;
    description: string;
}

interface CategoryFormProps {
    initialData?: Category;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
                                                       initialData,
                                                       onSubmit,
                                                       onCancel,
                                                       isSubmitting
                                                   }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || '');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, description });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        required
                        placeholder="e.g. Electronics, Furniture"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>

            {/* Description Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                        rows={4}
                        placeholder="Optional details about this category..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
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
                    <CheckCircle2 size={16} className="mr-2" />
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Category' : 'Create Category')}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;