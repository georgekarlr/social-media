import { supabase } from '../lib/supabase';
import { HomeDashboardResponse, StudySet, CreateFullSetParams, Subject, GetSetForPlayResponse, FinishStudySessionParams } from '../types/study';

export const studyService = {
  /**
   * Fetches a study set and its items for the study player.
   */
  async getSetForPlay(setId: string): Promise<GetSetForPlayResponse | null> {
    const { data, error } = await supabase.rpc('c_get_set_for_play', {
      target_set_id: setId,
    });

    if (error) {
      console.error('Error fetching set for play:', error);
      throw error;
    }

    return data as GetSetForPlayResponse;
  },

  /**
   * Fetches the home dashboard data including daily pick, continue studying, and feed.
   */
  async getHomeDashboard(): Promise<HomeDashboardResponse | null> {
    const { data, error } = await supabase.rpc('c_get_home_dashboard');

    console.log('Home dashboard data:', data);
    if (error) {
      console.error('Error fetching home dashboard:', error);
      throw error;
    }

    return data as HomeDashboardResponse;
  },

  /**
   * Searches for study sets using fuzzy search.
   * @param searchTerm The term to search for.
   */
  async searchStudySets(searchTerm: string): Promise<StudySet[]> {
    const { data, error } = await supabase.rpc('c_search_sets_fuzzy', {
      search_term: searchTerm,
    });

    if (error) {
      console.error('Error searching study sets:', error);
      throw error;
    }

    return data as StudySet[];
  },

  /**
   * Fetches all subjects for study set categorization.
   */
  async getSubjects(): Promise<Subject[]> {
    // Attempt to fetch from table directly as the RPC might not be present
    const { data, error } = await supabase
      .from('c_subjects')
      .select('id, name, slug, emoji')
      .order('name');

    if (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }

    return data as Subject[];
  },

  /**
   * Creates a full study set (optionally with items) via RPC and returns the new set ID.
   */
  async createFullSet(params: CreateFullSetParams): Promise<string> {
    const { data, error } = await supabase.rpc('c_create_full_set', {
      title: params.title,
      description: params.description,
      subject_id: params.subject_id,
      is_public: params.is_public,
      tags: params.tags,
      // Let items be omitted if undefined; RPC has default '[]'
      ...(params.items ? { items: params.items } : {}),
    });

    if (error) {
      console.error('Error creating study set:', error);
      throw error;
    }

    return data as string; // UUID of the new set
  },

  /**
   * Clones a study set and returns the new set ID.
   * @param originalSetId The ID of the set to clone.
   */
  async cloneSet(originalSetId: string): Promise<string> {
    const { data, error } = await supabase.rpc('c_clone_set', {
      original_set_id: originalSetId,
    });

    if (error) {
      console.error('Error cloning study set:', error);
      throw error;
    }

    return data as string; // UUID of the new set
  },

  /**
   * Follows a user by their ID.
   * @param targetUserId The ID of the user to follow.
   */
  async followUser(targetUserId: string): Promise<void> {
    const { error } = await supabase.rpc('c_follow_user', {
      target_user_id: targetUserId,
    });

    if (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },

  /**
   * Unfollows a user by their ID.
   * @param targetUserId The ID of the user to unfollow.
   */
  async unfollowUser(targetUserId: string): Promise<void> {
    const { error } = await supabase.rpc('c_unfollow_user', {
      target_user_id: targetUserId,
    });

    if (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },

  /**
   * Finishes a study session and updates progress.
   */
  async finishStudySession(params: FinishStudySessionParams): Promise<void> {
    const { error } = await supabase.rpc('c_finish_study_session', {
      p_set_id: params.set_id,
      p_duration_seconds: params.duration_seconds,
      p_results: params.results,
    });

    if (error) {
      console.error('Error finishing study session:', error);
      throw error;
    }
  },
};
