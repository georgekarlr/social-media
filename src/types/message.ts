export interface MessageUser {
  id: string;
  username: string;
  avatar_url: string | null;
  is_online: boolean;
}

export interface SharedSet {
  id: string;
  title: string;
  cards_count: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  is_mine: boolean;
  shared_set: SharedSet | null;
}

export interface LastMessage {
  content: string;
  sender_id: string;
  created_at: string;
  is_mine: boolean;
}

export interface Conversation {
  id: string;
  updated_at: string;
  unread_count: number;
  other_user: MessageUser;
  last_message: LastMessage | null;
}

export interface StartChatResponse {
  conversation_id: string;
  is_new: boolean;
}

export interface SendMessageResponse {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  is_mine: boolean;
}
