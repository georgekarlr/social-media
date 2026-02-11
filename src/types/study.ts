export interface Subject {
  id: number;
  name: string;
  slug: string;
  emoji?: string;
}

export interface StudySet {
  id: string;
  title: string;
  average_rating: number;
  subject_id: string;
  is_public: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudySetWithSubject extends Pick<StudySet, 'id' | 'title' | 'average_rating'> {
  subject: string;
}

export interface DailyPick {
  message: string;
  set: StudySetWithSubject;
}

export interface ContinueStudyingItem {
  id: string;
  title: string;
  subject: string;
  emoji: string | null;
  last_active: string;
}

export interface Creator {
  id: string;
  username: string;
  avatar: string | null;
}

export interface FeedItem {
  type: 'feed';
  set_id: string;
  title: string;
  description: string | null;
  tags: string[];
  created_at: string;
  is_official: boolean;
  creator: Creator;
  subject: {
    name: string;
    emoji: string | null;
  };
  stats: {
    average_rating: number;
    total_ratings: number;
    cards_count: number;
    like_count: number;
    comment_count: number;
  };
}

export interface RecommendedUser {
  type: 'rec_user';
  user_id: string;
  username: string;
  avatar: string | null;
  xp: number;
  bio: string | null;
}

export type FeedContent = FeedItem | RecommendedUser;

export type StudyItemType = 'flashcard' | 'quiz_question' | 'note';

export interface FlashcardContent {
  front: string;
  back: string;
  explanation?: string;
  image_url?: string;
}

export interface QuizQuestionOption {
  id: number;
  text: string;
}

export interface QuizQuestionContent {
  question: string;
  options: QuizQuestionOption[];
  correct_option_id: number;
  explanation?: string;
}

export interface NoteContent {
  title: string;
  markdown: string;
  attachment_url?: string;
}

export interface CreateStudyItem {
  type: StudyItemType;
  content: FlashcardContent | QuizQuestionContent | NoteContent;
}

export interface CreateFullSetParams {
  title: string;
  description: string;
  subject_id: number;
  is_public: boolean;
  tags: string[];
  items?: CreateStudyItem[];
}

export interface UserStats {
  streak: number;
  total_xp: number;
  level: number;
  cards_due: number;
  minutes_today: number;
  pending_invites: number;
}

export interface StudyProgress {
  box_level: number;
  is_due: boolean;
  last_reviewed: string | null;
}

export interface StudyItemPlay {
  id: string;
  type: StudyItemType;
  position: number;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  study_data: StudyProgress;
  content: FlashcardContent | QuizQuestionContent | NoteContent;
}

export interface StudySetPlay {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  emoji: string | null;
  average_rating: number;
  total_ratings: number;
  creator: Creator;
  total_likes: number;
  total_comments: number;
}

export interface GetSetForPlayResponse {
  set: StudySetPlay;
  items: StudyItemPlay[];
}

export interface StudySessionResult {
  item_id: string;
  is_correct: boolean;
}

export interface FinishStudySessionParams {
  set_id: string;
  duration_seconds: number;
  results: StudySessionResult[];
}

export interface HomeDashboardResponse {
  user_stats: UserStats | null;
  daily_pick: DailyPick | null;
  continue_studying: ContinueStudyingItem[];
  feed_type: 'following' | 'recommendations';
  feed_content: FeedContent[];
}
