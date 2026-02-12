export interface LibraryContentItem {
  id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  average_rating: number;
  total_ratings: number;
  created_at: string;
  saved_at?: string;
  cards_count: number;
  subject: {
    name: string | null;
    emoji: string | null;
  } | null;
  creator: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export type LibraryTabType = 'created' | 'saved';
