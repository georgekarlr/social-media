import { supabase } from '../lib/supabase';
import { HomeDashboardResponse, StudySet, CreateFullSetParams, Subject } from '../types/study';

export const studyService = {
  /**
   * Fetches the home dashboard data including daily pick, continue studying, and feed.
   */
  async getHomeDashboard(): Promise<HomeDashboardResponse | null> {
    const { data, error } = await supabase.rpc('c_get_home_dashboard');

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
};
