export interface MyProfileData {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  email: string;
  level: number;
  total_xp: number;
  streak: number;
  joined_at: string;
  followers_count: number;
  following_count: number;
}

export interface MyStudyStats {
  total_study_time: number;
  sessions_count: number;
  cards_reviewed: number;
  last_active: string | null;
}

export interface MySet {
  id: string;
  title: string;
  description: string | null;
  average_rating: number | null;
  is_public: boolean;
  created_at: string;
  cards_count: number;
}

export interface MyProfileResponse {
  profile: MyProfileData;
  stats: MyStudyStats;
  sets: MySet[];
}
