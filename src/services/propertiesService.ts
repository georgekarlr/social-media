// services/propertiesService.ts
import { supabase } from '../lib/supabase';
import type {
    Property,
    CreatePropertyParams,
    UpdatePropertyParams,
    ServiceResponse
} from '../types/properties';

export class PropertiesService {

    /**
     * Fetches all properties belonging to the current user.
     */
    static async getProperties(): Promise<ServiceResponse<Property[]>> {
        try {
            const { data, error } = await supabase.rpc('rt_get_properties');

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as Property[], error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching properties.'
            };
        }
    }

    /**
     * Creates a new property record.
     * Returns the ID of the newly created property.
     */
    static async createProperty(params: CreatePropertyParams): Promise<ServiceResponse<number>> {
        try {
            const rpcParams = {
                p_name: params.p_name,
                p_type: params.p_type,
                p_address: params.p_address,
                p_market_rent: params.p_market_rent,
                p_city: params.p_city ?? null,
                p_state: params.p_state ?? null,
                p_zip_code: params.p_zip_code ?? null,
                p_bedrooms: params.p_bedrooms ?? null,
                p_bathrooms: params.p_bathrooms ?? null,
                p_sq_ft: params.p_sq_ft ?? null,
                p_created_at: params.p_created_at ?? new Date().toISOString()
            };

            const { data, error } = await supabase.rpc('rt_create_property', rpcParams);

            if (error) {
                return { data: null, error: error.message };
            }

            // Function returns BIGINT directly (single value)
            return { data: data as number, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while creating the property.'
            };
        }
    }

    /**
     * Updates details of an existing property.
     */
    static async updateProperty(params: UpdatePropertyParams): Promise<ServiceResponse<void>> {
        try {
            const rpcParams = {
                p_property_id: params.p_property_id,
                p_name: params.p_name,
                p_type: params.p_type,
                p_address: params.p_address,
                p_market_rent: params.p_market_rent,
                p_city: params.p_city ?? null,
                p_state: params.p_state ?? null,
                p_zip_code: params.p_zip_code ?? null,
                p_bedrooms: params.p_bedrooms ?? null,
                p_bathrooms: params.p_bathrooms ?? null,
                p_sq_ft: params.p_sq_ft ?? null,
                p_updated_at: params.p_updated_at ?? new Date().toISOString()
            };

            const { error } = await supabase.rpc('rt_update_property', rpcParams);

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: null, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while updating the property.'
            };
        }
    }

    /**
     * Deletes a property.
     * Will fail with an error message if the property has existing lease history.
     */
    static async deleteProperty(propertyId: number): Promise<ServiceResponse<void>> {
        try {
            const { error } = await supabase.rpc('rt_delete_property', {
                p_property_id: propertyId
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: null, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while deleting the property.'
            };
        }
    }
}