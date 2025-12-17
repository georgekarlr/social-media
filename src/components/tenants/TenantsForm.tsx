import React, { useState, useEffect } from 'react';
import { Tenant, CreateTenantParams, UpdateTenantParams } from '../../types/tenants';
import { User, Mail, Phone, CreditCard, FileText } from 'lucide-react';

interface TenantFormProps {
    initialData?: Tenant;
    onSubmit: (data: CreateTenantParams | UpdateTenantParams) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const TenantForm: React.FC<TenantFormProps> = ({
                                                   initialData,
                                                   onSubmit,
                                                   onCancel,
                                                   isSubmitting
                                               }) => {
    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        id_number: '',
        notes: ''
    });

    // Populate form if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                full_name: initialData.full_name,
                email: initialData.email || '',
                phone: initialData.phone || '',
                id_number: initialData.id_number || '',
                notes: initialData.notes || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare data (convert empty strings to null if desired, or keep as string depending on DB constraint)
        const commonParams = {
            p_full_name: formData.full_name,
            p_email: formData.email || null,
            p_phone: formData.phone || null,
            p_id_number: formData.id_number || null,
            p_notes: formData.notes || null,
        };

        if (initialData) {
            onSubmit({
                ...commonParams,
                p_tenant_id: initialData.id,
                p_updated_at: new Date().toISOString()
            } as UpdateTenantParams);
        } else {
            onSubmit({
                ...commonParams,
                p_created_at: new Date().toISOString()
            } as CreateTenantParams);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="tel"
                            placeholder="(555) 123-4567"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* ID Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number / SSN (Optional)</label>
                <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="National ID, Passport, etc."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                        value={formData.id_number}
                        onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                    />
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                        rows={3}
                        placeholder="Employment details, preferences, etc."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>
            </div>

            {/* Action Buttons */}
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
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Tenant' : 'Create Tenant')}
                </button>
            </div>
        </form>
    );
};

export default TenantForm;