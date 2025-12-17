import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from "../contexts/AuthContext";

import {
    Users,
    Plus,
    Search,
    Edit2,
    Trash2,
    Mail,
    Phone,
    FileText,
    AlertCircle
} from 'lucide-react';
import {CreateTenantParams, Tenant, UpdateTenantParams} from "../types/tenants.ts";
import {TenantsService} from "../services/tenantsService.ts";
import Modal from "../components/ui/Modal.tsx";
import TenantForm from "../components/tenants/TenantsForm.tsx";

const TenantsManager: React.FC = () => {
    // 1. Auth & Context
    const { persona } = useAuth();
    const accountId = persona?.id ?? null;

    // 2. State
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

    // 3. Data Fetching
    const fetchTenants = useCallback(async () => {
        setLoading(true);
        const { data, error } = await TenantsService.getTenants();

        if (error) {
            setError("Failed to load tenants.");
        } else {
            setTenants(data || []);
            setError(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants]);

    // 4. Handlers
    const handleCreate = async (params: CreateTenantParams | UpdateTenantParams) => {
        setIsSubmitting(true);
        const { error } = await TenantsService.createTenant(params as CreateTenantParams);
        setIsSubmitting(false);

        if (error) {
            alert(`Error creating tenant: ${error}`);
        } else {
            setIsCreateModalOpen(false);
            fetchTenants();
        }
    };

    const handleUpdate = async (params: CreateTenantParams | UpdateTenantParams) => {
        setIsSubmitting(true);
        const { error } = await TenantsService.updateTenant(params as UpdateTenantParams);
        setIsSubmitting(false);

        if (error) {
            alert(`Error updating tenant: ${error}`);
        } else {
            setEditingTenant(null);
            fetchTenants();
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this tenant?")) return;

        const { error } = await TenantsService.deleteTenant(id);
        if (error) {
            if (error.includes("foreign key")) {
                alert("Cannot delete tenant because they have active leases/history.");
            } else {
                alert(`Error deleting tenant: ${error}`);
            }
        } else {
            fetchTenants();
        }
    };

    // Client-side Filtering
    const filteredTenants = useMemo(() => {
        if (!searchTerm) return tenants;
        const lowerTerm = searchTerm.toLowerCase();
        return tenants.filter(t =>
            t.full_name.toLowerCase().includes(lowerTerm) ||
            (t.email && t.email.toLowerCase().includes(lowerTerm)) ||
            (t.phone && t.phone.includes(lowerTerm))
        );
    }, [tenants, searchTerm]);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Users className="mr-2" /> Tenant Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Directory of current and past tenants.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    // Disabled if no auth (though RLS handles backend)
                    disabled={!accountId}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    <Plus size={18} className="mr-2" />
                    Add Tenant
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTenants.map((tenant) => (
                                <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                                <span className="font-bold">{tenant.full_name.charAt(0)}</span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">{tenant.full_name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            {tenant.email && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Mail size={14} className="mr-1.5" /> {tenant.email}
                                                </div>
                                            )}
                                            {tenant.phone && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Phone size={14} className="mr-1.5" /> {tenant.phone}
                                                </div>
                                            )}
                                            {!tenant.email && !tenant.phone && (
                                                <span className="text-xs text-gray-400 italic">No contact info</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {tenant.id_number || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {tenant.notes || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => setEditingTenant(tenant)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tenant.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTenants.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No tenants found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredTenants.map((tenant) => (
                            <div key={tenant.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                                            {tenant.full_name.charAt(0)}
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{tenant.full_name}</h3>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {tenant.email && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail size={16} className="mr-2 text-gray-400" />
                                            {tenant.email}
                                        </div>
                                    )}
                                    {tenant.phone && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone size={16} className="mr-2 text-gray-400" />
                                            {tenant.phone}
                                        </div>
                                    )}
                                    {tenant.notes && (
                                        <div className="flex items-start text-sm text-gray-600">
                                            <FileText size={16} className="mr-2 mt-0.5 text-gray-400" />
                                            <span className="line-clamp-2">{tenant.notes}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => setEditingTenant(tenant)}
                                        className="flex items-center px-3 py-1.5 text-sm text-blue-600 font-medium bg-blue-50 rounded-lg"
                                    >
                                        <Edit2 size={16} className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tenant.id)}
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
                title="Add New Tenant"
            >
                <TenantForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal
                isOpen={!!editingTenant}
                onClose={() => setEditingTenant(null)}
                title="Edit Tenant"
            >
                {editingTenant && (
                    <TenantForm
                        initialData={editingTenant}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingTenant(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>
        </div>
    );
};

export default TenantsManager;