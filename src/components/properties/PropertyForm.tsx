// components/properties/PropertyForm.tsx
import React, { useState, useEffect } from 'react';
import { Property, CreatePropertyParams, UpdatePropertyParams, PropertyType } from '../../types/properties';
import { Home, MapPin, Bed, Bath, Ruler } from 'lucide-react';
import useCurrency from "../../hooks/useCurrency.ts";
import {getCurrencySymbol} from "../../utils/timezone.ts";

interface PropertyFormProps {
    initialData?: Property;
    onSubmit: (data: CreatePropertyParams | UpdatePropertyParams) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
                                                       initialData,
                                                       onSubmit,
                                                       onCancel,
                                                       isSubmitting
                                                   }) => {
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Single Family',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        bedrooms: '',
        bathrooms: '',
        sq_ft: '',
        market_rent: ''
    });

    const { symbol } = useCurrency();

    // Load data if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                type: initialData.type,
                address: initialData.address,
                city: initialData.city || '',
                state: initialData.state || '',
                zip_code: initialData.zip_code || '',
                bedrooms: initialData.bedrooms?.toString() || '',
                bathrooms: initialData.bathrooms?.toString() || '',
                sq_ft: initialData.sq_ft?.toString() || '',
                market_rent: initialData.market_rent.toString()
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const commonParams = {
            p_name: formData.name,
            p_type: formData.type,
            p_address: formData.address,
            p_city: formData.city || null,
            p_state: formData.state || null,
            p_zip_code: formData.zip_code || null,
            p_bedrooms: formData.bedrooms ? parseFloat(formData.bedrooms) : null,
            p_bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
            p_sq_ft: formData.sq_ft ? parseFloat(formData.sq_ft) : null,
            p_market_rent: parseFloat(formData.market_rent) || 0
        };

        if (initialData) {
            onSubmit({
                ...commonParams,
                p_property_id: initialData.id,
                p_updated_at: new Date().toISOString()
            } as UpdatePropertyParams);
        } else {
            onSubmit({
                ...commonParams,
                p_created_at: new Date().toISOString()
            } as CreatePropertyParams);
        }
    };

    const propertyTypes: PropertyType[] = ['Single Family', 'Apartment', 'Condo', 'Townhouse', 'Commercial', 'Other'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name / Alias</label>
                    <div className="relative">
                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            required
                            placeholder="e.g. Sunset Apartments Unit 101"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none bg-white"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Market Rent</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">{symbol}</span>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                            value={formData.market_rent}
                            onChange={(e) => setFormData({ ...formData, market_rent: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin size={16} className="mr-1" /> Location
                </h4>
                <div className="space-y-3">
                    <div>
                        <input
                            type="text"
                            required
                            placeholder="Street Address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-6 gap-3">
                        <div className="col-span-3">
                            <input
                                type="text"
                                placeholder="City"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div className="col-span-1">
                            <input
                                type="text"
                                placeholder="State"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <input
                                type="text"
                                placeholder="Zip"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                                value={formData.zip_code}
                                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Specs Section */}
            <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Specifications</h4>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 flex items-center"><Bed size={12} className="mr-1"/> Beds</label>
                        <input
                            type="number"
                            step="0.5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                            value={formData.bedrooms}
                            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 flex items-center"><Bath size={12} className="mr-1"/> Baths</label>
                        <input
                            type="number"
                            step="0.5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 flex items-center"><Ruler size={12} className="mr-1"/> Sq Ft</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                            value={formData.sq_ft}
                            onChange={(e) => setFormData({ ...formData, sq_ft: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
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
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Property' : 'Create Property')}
                </button>
            </div>
        </form>
    );
};

export default PropertyForm;