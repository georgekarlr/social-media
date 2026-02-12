import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConversationList from '../components/messages/ConversationList';
import { MessageSquare, Send, Loader2, ChevronLeft } from 'lucide-react';
import { Conversation, ChatMessage } from '../types/message';
import { messageService } from '../services/messageService';
import MessageBubble from '../components/messages/MessageBubble';
import NewMessageModal from '../components/messages/NewMessageModal';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { SearchUserResult } from '../types/study';

const MessagesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [initialConvId, setInitialConvId] = useState<string | null>(location.state?.conversationId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeConversation) {
      fetchMessages();
      
      // Subscribe to new messages for this conversation
      const channel = supabase
        .channel(`messages:${activeConversation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'c_messages',
            filter: `conversation_id=eq.${activeConversation.id}`,
          },
          () => {
            // Refresh messages when a new one arrives
            // Ideally we'd just fetch the latest or append if we had the full object
            fetchMessages(false);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (showLoading = true) => {
    if (!activeConversation) return;
    try {
      if (showLoading) setLoadingMessages(true);
      const data = await messageService.getMessages(activeConversation.id);
      // c_get_messages returns newest first, we want oldest first for display
      setMessages([...data].reverse());
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      showToast('Failed to load message history', 'error');
    } finally {
      if (showLoading) setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !newMessage.trim() || sending) return;

    try {
      setSending(true);
      const sentMessage = await messageService.sendMessage(activeConversation.id, newMessage.trim());
      setNewMessage('');
      
      // Update local messages state immediately for better UX
      // Convert SendMessageResponse to ChatMessage
      const newChatMessage: ChatMessage = {
        id: sentMessage.id,
        content: sentMessage.content,
        created_at: sentMessage.created_at,
        sender_id: sentMessage.sender.id,
        is_mine: sentMessage.is_mine,
        shared_set: null // The RPC doesn't return full shared_set info in this version
      };
      
      setMessages(prev => [...prev, newChatMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleSelectUser = async (user: SearchUserResult) => {
    try {
      setIsNewMessageModalOpen(false);
      const res = await messageService.startChat(user.id);
      
      // Update initialConvId to trigger selection in ConversationList
      setInitialConvId(res.conversation_id);
      
      // Increment refreshKey to force ConversationList to reload conversations
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to start chat:', error);
      showToast('Failed to start chat', 'error');
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    if (window.innerWidth < 768) {
      navigate(`/messages/${conversation.id}`);
    } else {
      setActiveConversation(conversation);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] lg:h-screen overflow-hidden bg-white lg:rounded-3xl lg:border lg:border-gray-100 lg:shadow-sm">
      {/* Sidebar - Conversation List */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-100">
        <ConversationList
          onSelectConversation={handleSelectConversation}
          activeConversationId={activeConversation?.id || null}
          initialConversationId={initialConvId}
          onNewMessage={() => setIsNewMessageModalOpen(true)}
          refreshKey={refreshKey}
        />
      </div>

      {/* Main Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-gray-50/30">
        {activeConversation ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
               <div className="flex items-center min-w-0">
                 <button
                   onClick={() => setActiveConversation(null)}
                   className="md:hidden p-2 mr-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                 >
                   <ChevronLeft className="h-6 w-6" />
                 </button>
                 {activeConversation.other_user.avatar_url ? (
                   <img
                     src={activeConversation.other_user.avatar_url}
                     alt={activeConversation.other_user.username}
                     className="h-10 w-10 rounded-full object-cover mr-3 flex-shrink-0"
                   />
                 ) : (
                   <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">
                      {activeConversation.other_user.username[0].toUpperCase()}
                   </div>
                 )}
                 <div className="min-w-0">
                   <h3 className="font-bold text-gray-900 truncate">{activeConversation.other_user.username}</h3>
                   <div className="flex items-center">
                     <div className={`h-2 w-2 rounded-full mr-2 ${activeConversation.other_user.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
                     <p className={`text-xs font-medium ${activeConversation.other_user.is_online ? 'text-green-500' : 'text-gray-400'}`}>
                       {activeConversation.other_user.is_online ? 'Online' : 'Offline'}
                     </p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Loading messages...</p>
                </div>
              ) : messages.length > 0 ? (
                <>
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
                    <MessageSquare className="h-8 w-8 text-blue-100" />
                  </div>
                  <h3 className="text-gray-900 font-bold">No messages yet</h3>
                  <p className="text-sm text-gray-500">Send a message to start the conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-100 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
              <MessageSquare className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
            <p className="text-gray-500 max-w-sm">
              Select a conversation from the list to view messages or start a new chat with your study partners.
            </p>
          </div>
        )}
      </div>

      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
};

export default MessagesPage;
