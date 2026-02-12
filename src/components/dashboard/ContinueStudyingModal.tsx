import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { studyService } from '../../services/studyService';
import { ContinueStudyingSet } from '../../types/study';
import { Clock, Play, Loader2 } from 'lucide-react';

interface ContinueStudyingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlay?: (setId: string) => void;
}

const PAGE_SIZE = 20;

const ContinueStudyingModal: React.FC<ContinueStudyingModalProps> = ({ isOpen, onClose, onPlay }) => {
  const [items, setItems] = useState<ContinueStudyingSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resetAndLoad = async () => {
    setItems([]);
    setOffset(0);
    setHasMore(true);
    setError(null);
    await loadMore(true);
  };

  useEffect(() => {
    if (isOpen) {
      resetAndLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadMore = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const nextOffset = reset ? 0 : offset;
      const data = await studyService.getContinueStudying(PAGE_SIZE, nextOffset);
      setItems(prev => reset ? data : [...prev, ...data]);
      setOffset(nextOffset + data.length);
      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch (e: any) {
      console.error('Failed to load continue studying:', e);
      setError(e?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Continue Studying">
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {items.length === 0 && loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          </div>
        )}

        {items.length === 0 && !loading && !error && (
          <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
            No sets to continue right now.
          </div>
        )}

        <ul className="divide-y divide-gray-100">
          {items.map((s) => (
            <li key={s.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl mr-3">
                    {s.subject?.emoji || '📚'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{s.title}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span>{s.subject?.name || 'General'}</span>
                      <span>•</span>
                      <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Last active {formatDate(s.last_active)}</span>
                      {typeof s.cards_due === 'number' && (
                        <>
                          <span>•</span>
                          <span>{s.cards_due} due</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onPlay?.(s.id)}
                  className="ml-4 flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="h-4 w-4" /> Study
                </button>
              </div>
            </li>
          ))}
        </ul>

        {hasMore && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => loadMore(false)}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ContinueStudyingModal;
