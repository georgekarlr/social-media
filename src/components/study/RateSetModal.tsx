import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Star, Loader2 } from 'lucide-react';
import { studyService } from '../../services/studyService';

interface RateSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  setId: string;
  initialAverage?: number;
  onRated?: (newAverage: number, newTotal: number) => void;
}

const RateSetModal: React.FC<RateSetModalProps> = ({ isOpen, onClose, setId, initialAverage, onRated }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || submitting) return;

    try {
      setSubmitting(true);
      const res = await studyService.rateSet({ p_set_id: setId, p_rating: rating, p_review: review || undefined });
      onRated?.(res.new_average, res.new_total);
      onClose();
    } catch (err) {
      console.error('Failed to rate set', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate this set">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {[1,2,3,4,5].map((v) => (
            <button
              key={v}
              type="button"
              onMouseEnter={() => setHover(v)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(v)}
              className="p-1 sm:p-2 transition-transform active:scale-125"
              aria-label={`Rate ${v} star${v>1?'s':''}`}
            >
              <Star
                className={`${(hover || rating) >= v ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} h-10 w-10 sm:h-12 sm:w-12 transition-colors`}
              />
            </button>
          ))}
        </div>
        {initialAverage !== undefined && (
          <p className="text-center text-sm text-gray-500">Current average: {initialAverage.toFixed(1)} ⭐</p>
        )}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Optional review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts about this set (optional)"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
          <button
            type="submit"
            disabled={!rating || submitting}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RateSetModal;
