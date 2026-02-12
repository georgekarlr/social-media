import { supabase } from '../lib/supabase';
import { MyProfileResponse } from '../types/profile';

export const profileService = {
  /**
   * Fetches the current user's profile, study stats, and created sets.
   */
  async getMyProfile(): Promise<MyProfileResponse> {
    const { data, error } = await supabase.rpc('c_get_my_profile');

    if (error) {
      console.error('Error fetching my profile:', error);
      throw error;
    }

    return data as MyProfileResponse;
  },

  /**
   * Updates the current user's profile information.
   */
  async updateProfile(params: {
    username: string;
    full_name: string;
    bio: string;
    avatar_url: string;
  }) {
    const { data, error } = await supabase.rpc('c_update_profile', {
      p_username: params.username,
      p_full_name: params.full_name,
      p_bio: params.bio,
      p_avatar_url: params.avatar_url,
    });

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  },
};
