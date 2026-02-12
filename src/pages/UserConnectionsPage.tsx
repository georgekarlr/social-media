import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { studyService } from '../services/studyService';
import { UserConnection, UserProfileInfo } from '../types/study';
import { supabase } from '../lib/supabase';
import { Loader2, ChevronLeft, Search, UserPlus, UserMinus, Users } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const UserConnectionsPage: React.FC = () => {
  const { username: rawUsername } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  
  const username = rawUsername?.replace(/^@/, '') || '';
  const initialTab = (searchParams.get('tab') as 'followers' | 'following') || 'followers';
  
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<UserConnection[]>([]);
  const [profile, setProfile] = useState<UserProfileInfo | null>(null);
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});

  const fetchConnections = useCallback(async (userId: string, type: 'followers' | 'following', query: string) => {
    try {
      setLoading(true);
      const data = await studyService.getUserConnections(userId, type, query);
      setConnections(data);
    } catch (err) {
      console.error('Failed to fetch connections:', err);
      showToast('Failed to load connections', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const init = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        // 1) Resolve username -> user id
        const { data: profileRow, error: profileErr } = await supabase
          .from('c_profiles')
          .select('id')
          .eq('username', username)
          .maybeSingle();

        if (profileErr) throw profileErr;
        if (!profileRow) {
          showToast('User not found', 'error');
          navigate('/dashboard');
          return;
        }

        // 2) Fetch profile info for counts/header
        const res = await studyService.getUserProfile(profileRow.id);
        if (res) {
          setProfile(res.profile);
          await fetchConnections(profileRow.id, activeTab, searchQuery);
        }
      } catch (err) {
        console.error('Initialization failed:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [username, activeTab, searchQuery, fetchConnections, navigate, showToast]);

  const handleTabChange = (tab: 'followers' | 'following') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleToggleFollow = async (targetUser: UserConnection) => {
    if (followLoading[targetUser.id]) return;

    try {
      setFollowLoading(prev => ({ ...prev, [targetUser.id]: true }));
      const isFollowing = targetUser.is_following;

      if (isFollowing) {
        await studyService.unfollowUser(targetUser.id);
        showToast(`Unfollowed @${targetUser.username}`, 'success');
      } else {
        await studyService.followUser(targetUser.id);
        showToast(`Following @${targetUser.username}`, 'success');
      }

      setConnections(prev => prev.map(c => 
        c.id === targetUser.id ? { ...c, is_following: !isFollowing } : c
      ));
    } catch (err: any) {
      showToast(err?.message || 'Failed to update follow status', 'error');
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetUser.id]: false }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{profile?.full_name || username}</h1>
          <p className="text-sm text-gray-500">@{username}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => handleTabChange('followers')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'followers' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {profile?.followers_count || 0} Followers
        </button>
        <button
          onClick={() => handleTabChange('following')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'following' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {profile?.following_count || 0} Following
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search connections..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No {activeTab} found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {connections.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between gap-4">
                <Link to={`/u/${user.username}`} className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0 border-2 border-white shadow-sm overflow-hidden">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
                    ) : (
                      user.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate text-sm">
                      {user.full_name || user.username}
                    </div>
                    <div className="text-xs text-gray-500 truncate">@{user.username}</div>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="hidden sm:block text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                        {user.total_xp.toLocaleString()} XP
                    </div>
                    {profile?.id !== user.id && (
                        <button
                        onClick={() => handleToggleFollow(user)}
                        disabled={followLoading[user.id]}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                            user.is_following
                            ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        >
                        {followLoading[user.id] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : user.is_following ? (
                            <>
                            <UserMinus className="h-3 w-3" /> <span>Unfollow</span>
                            </>
                        ) : (
                            <>
                            <UserPlus className="h-3 w-3" /> <span>Follow</span>
                            </>
                        )}
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserConnectionsPage;
