// components/properties/PropertiesManager.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Home,
    Plus,
    Search,
    Edit2,
    Trash2,
    MapPin,
    Bed,
    Bath,
    AlertCircle,
    Building
} from 'lucide-react';
import {CreatePropertyParams, Property, UpdatePropertyParams} from "../types/properties.ts";
import {PropertiesService} from "../services/propertiesService.ts";
import Modal from "../components/ui/Modal.tsx";
import PropertyForm from "../components/properties/PropertyForm.tsx";
import {formatCurrency} from "../utils/timezone.ts";
import useCurrency from "../hooks/useCurrency.ts";

const PropertiesManager: React.FC = () => {
    // Auth context (mostly for initial loading check, service handles API auth)
    const { currency } = useCurrency();

    // --- State ---
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);

    // --- Data Fetching ---
    const fetchProperties = useCallback(async () => {
        setLoading(true);
        const { data, error } = await PropertiesService.getProperties();

        if (error) {
            setError("Failed to load properties.");
        } else {
            setProperties(data || []);
            setError(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    // --- Handlers ---

    const handleCreate = async (params: CreatePropertyParams | UpdatePropertyParams) => {
        setIsSubmitting(true);
        const { error } = await PropertiesService.createProperty(params as CreatePropertyParams);
        setIsSubmitting(false);

        if (error) {
            alert(`Error creating property: ${error}`);
        } else {
            setIsCreateModalOpen(false);
            fetchProperties();
        }
    };

    const handleUpdate = async (params: CreatePropertyParams | UpdatePropertyParams) => {
        setIsSubmitting(true);
        const { error } = await PropertiesService.updateProperty(params as UpdatePropertyParams);
        setIsSubmitting(false);

        if (error) {
            alert(`Error updating property: ${error}`);
        } else {
            setEditingProperty(null);
            fetchProperties();
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this property? This cannot be undone.")) return;

        const { error } = await PropertiesService.deleteProperty(id);
        if (error) {
            // Friendly error for FK constraint
            if (error.includes("foreign key constraint")) {
                alert("Cannot delete property because it has active leases or history. Please archive it instead.");
            } else {
                alert(`Error deleting property: ${error}`);
            }
        } else {
            fetchProperties();
        }
    };

    // --- Filtering (Client-side) ---
    const filteredProperties = useMemo(() => {
        if (!searchTerm) return properties;
        const lowerTerm = searchTerm.toLowerCase();
        return properties.filter(p =>
            p.name.toLowerCase().includes(lowerTerm) ||
            p.address.toLowerCase().includes(lowerTerm) ||
            p.type.toLowerCase().includes(lowerTerm)
        );
    }, [properties, searchTerm]);

    // --- Helpers ---
    const getStatusStyle = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'occupied': return 'bg-green-100 text-green-800';
            case 'vacant': return 'bg-red-100 text-red-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Building className="mr-2" /> Properties
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage units, track vacancy, and set market rents.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={18} className="mr-2" />
                    Add Property
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, address, or type..."
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProperties.map((property) => (
                                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                                <Home size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{property.name}</div>
                                                <div className="text-xs text-gray-500">{property.type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{property.address}</div>
                                        <div className="text-xs text-gray-500">
                                            {property.city}, {property.state} {property.zip_code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                                            <span className="flex items-center"><Bed size={14} className="mr-1"/> {property.bedrooms || '-'}</span>
                                            <span className="flex items-center"><Bath size={14} className="mr-1"/> {property.bathrooms || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        {formatCurrency(property.market_rent, currency)}
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusStyle(property.status)}`}>
                                                {property.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => setEditingProperty(property)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProperties.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No properties found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredProperties.map((property) => (
                            <div key={property.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <Home size={18} className="text-blue-500 mr-2" />
                                        <h3 className="font-semibold text-gray-900">{property.name}</h3>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize ${getStatusStyle(property.status)}`}>
                                        {property.status}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 mb-2 flex items-start">
                                    <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                                    {property.address}, {property.city}
                                </div>

                                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded-lg">
                                    <span className="flex items-center"><Bed size={14} className="mr-1"/> {property.bedrooms || '-'} Beds</span>
                                    <span className="flex items-center"><Bath size={14} className="mr-1"/> {property.bathrooms || '-'} Baths</span>
                                    <span className="font-semibold text-gray-900 ml-auto">{formatCurrency(property.market_rent, currency)}/mo</span>
                                </div>

                                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => setEditingProperty(property)}
                                        className="flex items-center px-3 py-1.5 text-sm text-blue-600 font-medium bg-blue-50 rounded-lg"
                                    >
                                        <Edit2 size={16} className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(property.id)}
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

            {/* Modals */}

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Add New Property"
            >
                <PropertyForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal
                isOpen={!!editingProperty}
                onClose={() => setEditingProperty(null)}
                title="Edit Property"
            >
                {editingProperty && (
                    <PropertyForm
                        initialData={editingProperty}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingProperty(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>
        </div>
    );
};

export default PropertiesManager;