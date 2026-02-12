import { supabase } from '../lib/supabase';
import { HomeDashboardResponse, StudySet, CreateFullSetParams, Subject, GetSetForPlayResponse, FinishStudySessionParams, FinishStudySessionResponse, ItemLiker, StudyComment, RateSetParams, RateSetResponse, GetUserProfileResponse, ContinueStudyingSet, ContinueStudyingItem } from '../types/study';

export interface ToggleReactionResponse {
  is_liked: boolean;
  new_count: number;
}

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

    if (!data) return null;

    const response = data as GetSetForPlayResponse;

    // Map avatar_url to avatar for backward compatibility if needed
    if (response.set.creator && response.set.creator.avatar_url && !response.set.creator.avatar) {
      response.set.creator.avatar = response.set.creator.avatar_url;
    }

    return response;
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
   * Fetch paginated list of continue-studying sets for the current user.
   */
  async getContinueStudying(limit: number = 50, offset: number = 0): Promise<ContinueStudyingSet[]> {
    const { data, error } = await supabase.rpc('c_get_continue_studying', {
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      console.error('Error fetching continue studying:', error);
      throw error;
    }

    // Data is already shaped by RPC; return as-is
    return (data || []) as ContinueStudyingSet[];
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
  async finishStudySession(params: FinishStudySessionParams): Promise<FinishStudySessionResponse> {
    const { data, error } = await supabase.rpc('c_finish_study_session', {
      p_set_id: params.set_id,
      p_duration_seconds: params.duration_seconds,
      p_results: params.results,
    });

    if (error) {
      console.error('Error finishing study session:', error);
      throw error;
    }

    return data as FinishStudySessionResponse;
  },

  /**
   * Toggles a reaction (like) for a study item.
   * @param itemId The ID of the item to toggle reaction for.
   * @param type The type of reaction (defaults to 'like').
   */
  async toggleReaction(itemId: string, type: string = 'like'): Promise<ToggleReactionResponse> {
    const { data, error } = await supabase.rpc('c_toggle_reaction', {
      p_item_id: itemId,
      p_type: type,
    });

    if (error) {
      console.error('Error toggling reaction:', error);
      throw error;
    }

    return data as ToggleReactionResponse;
  },

  /**
   * Fetches the list of users who liked a specific study item.
   * @param itemId The ID of the item.
   */
  async getItemLikers(itemId: string): Promise<ItemLiker[]> {
    const { data, error } = await supabase.rpc('c_get_item_likers', {
      target_item_id: itemId,
    });

    if (error) {
      console.error('Error fetching item likers:', error);
      throw error;
    }

    return data as ItemLiker[];
  },

  /**
   * Fetches comments for a study set or item.
   */
  async getComments(targetId: string, targetType: 'set' | 'item', limitCount: number = 20): Promise<StudyComment[]> {
    const { data, error } = await supabase.rpc('c_get_comments', {
      p_target_id: targetId,
      p_target_type: targetType,
      limit_count: limitCount
    });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    return data as StudyComment[];
  },

  /**
   * Posts a comment for a study set or item.
   */
  async postComment(targetId: string, targetType: 'set' | 'item', content: string, parentId?: string): Promise<StudyComment> {
    const { data, error } = await supabase.rpc('c_post_comment', {
      p_target_id: targetId,
      p_target_type: targetType,
      p_content: content,
      p_parent_id: parentId || null
    });

    if (error) {
      console.error('Error posting comment:', error);
      throw error;
    }

    return data as StudyComment;
  },

  /**
   * Rates a study set and provides an optional review.
   * @param params RateSetParams containing setId, rating, and optional review.
   */
  async rateSet(params: RateSetParams): Promise<RateSetResponse> {
    const { data, error } = await supabase.rpc('c_rate_set', {
      p_set_id: params.p_set_id,
      p_rating: params.p_rating,
      p_review: params.p_review || null,
    });

    if (error) {
      console.error('Error rating study set:', error);
      throw error;
    }

    return data as RateSetResponse;
  },

  /**
   * Toggles a bookmark for a target (set or item).
   * @param targetId The ID of the set or item
   * @param targetType 'set' or 'item'
   * @returns TRUE if now bookmarked, FALSE if removed
   */
  async toggleBookmark(targetId: string, targetType: 'set' | 'item'): Promise<boolean> {
    const { data, error } = await supabase.rpc('c_toggle_bookmark', {
      p_target_id: targetId,
      p_target_type: targetType,
    });

    if (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }

    return data as boolean;
  },

  /**
   * Fetch another user's public profile and their public study sets.
   */
  async getUserProfile(targetUserId: string): Promise<GetUserProfileResponse | null> {
    const { data, error } = await supabase.rpc('c_get_user_profile', {
      target_user_id: targetUserId,
    });

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data as GetUserProfileResponse | null;
  },
};
