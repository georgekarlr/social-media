import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Brain, CheckSquare, FileText, Heart, MessageSquare, Loader2, Sparkles, Copy } from 'lucide-react';
import { studyService } from '../../services/studyService';
import { GetSetForPlayResponse, StudyItemPlay, FlashcardContent, QuizQuestionContent, NoteContent, StudySessionResult } from '../../types/study';
import { useToast } from '../../contexts/ToastContext';

interface StudyModalProps {
  setId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudyModal: React.FC<StudyModalProps> = ({ setId, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [data, setData] = useState<GetSetForPlayResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [isFinishing, setIsFinishing] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  useEffect(() => {
    if (isOpen && setId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await studyService.getSetForPlay(setId);
          setData(result);
          setCurrentIndex(0);
          setFlipped(false);
          setSelectedOptionId(null);
          setIsAnswered(false);
          setStartTime(Date.now());
          setResults({});
          setIsFinishing(false);
          setSessionFinished(false);
        } catch (err) {
          console.error('Failed to fetch study set:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (!isOpen) {
      // Clean up when modal closes
      setStartTime(null);
    }
  }, [isOpen, setId]);

  if (!isOpen) return null;

  const handleFinish = async () => {
    if (!data || !startTime || isFinishing) return;

    try {
      setIsFinishing(true);
      
      // Ensure the current item is recorded if it hasn't been yet (for flashcards/notes)
      const finalResults = { ...results };
      const currentItem = data.items[currentIndex];
      if (currentItem && finalResults[currentItem.id] === undefined) {
        if (currentItem.type === 'flashcard' || currentItem.type === 'note') {
          finalResults[currentItem.id] = true;
        }
      }

      const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
      const resultsArray: StudySessionResult[] = Object.entries(finalResults).map(([item_id, is_correct]) => ({
        item_id,
        is_correct
      }));

      if (resultsArray.length > 0) {
        await studyService.finishStudySession({
          set_id: data.set.id,
          duration_seconds: Math.max(durationSeconds, 1),
          results: resultsArray
        });
        showToast('Study session saved!', 'success');
      }
      
      setSessionFinished(true);
    } catch (err: any) {
      console.error('Failed to finish study session:', err);
      showToast('Failed to save progress', 'error');
    } finally {
      setIsFinishing(false);
    }
  };

  const handleNext = () => {
    if (data && currentIndex < data.items.length - 1) {
      // Record progress for current item if it's flashcard/note and not yet recorded
      const item = data.items[currentIndex];
      if ((item.type === 'flashcard' || item.type === 'note') && results[item.id] === undefined) {
        setResults(prev => ({ ...prev, [item.id]: true }));
      }

      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else if (currentIndex === data.items.length - 1) {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      // Record progress for current item if it's flashcard/note and not yet recorded
      const item = data.items[currentIndex];
      if ((item.type === 'flashcard' || item.type === 'note') && results[item.id] === undefined) {
        setResults(prev => ({ ...prev, [item.id]: true }));
      }

      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
      setSelectedOptionId(null);
      setIsAnswered(false);
    }
  };

  const handleClone = async () => {
    if (!data?.set.id || cloning) return;
    try {
      setCloning(true);
      await studyService.cloneSet(data.set.id);
      showToast(`Successfully cloned "${data.set.title}"!`, 'success');
    } catch (err: any) {
      console.error('Failed to clone set:', err);
      showToast(err?.message || 'Failed to clone study set', 'error');
    } finally {
      setCloning(false);
    }
  };

  const currentItem = data?.items[currentIndex];

  const renderFlashcard = (content: FlashcardContent) => (
    <div 
      onClick={() => setFlipped(!flipped)}
      className="relative w-full aspect-[4/3] cursor-pointer perspective-1000 group"
    >
      <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-blue-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="absolute top-4 left-4 bg-blue-50 p-2 rounded-xl">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{content.front}</h2>
          <p className="mt-8 text-sm text-blue-500 font-bold animate-pulse">Click to flip</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden bg-blue-600 border-2 border-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl rotate-y-180 text-white">
          <div className="absolute top-4 left-4 bg-white/20 p-2 rounded-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <p className="text-xl font-medium mb-4">{content.back}</p>
          {content.explanation && (
            <div className="mt-4 p-4 bg-white/10 rounded-xl text-sm italic">
              {content.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuiz = (content: QuizQuestionContent) => (
    <div className="w-full bg-white border-2 border-orange-100 rounded-3xl p-8 shadow-xl">
      <div className="flex items-center space-x-2 mb-6 text-orange-600">
        <CheckSquare className="h-6 w-6" />
        <span className="font-bold uppercase tracking-wider text-sm">Quick Quiz</span>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-8">{content.question}</h2>
      <div className="space-y-3">
        {content.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrect = opt.id === content.correct_option_id;
          
          let buttonClass = "w-full text-left p-4 rounded-2xl border-2 transition-all font-medium flex items-center justify-between group ";
          
          if (isAnswered) {
            if (isCorrect) {
              buttonClass += "border-green-500 bg-green-50 text-green-700";
            } else if (isSelected) {
              buttonClass += "border-red-500 bg-red-50 text-red-700";
            } else {
              buttonClass += "border-gray-100 text-gray-400 opacity-50";
            }
          } else {
            buttonClass += "border-gray-100 hover:border-blue-500 hover:bg-blue-50 text-gray-700";
          }

          return (
            <button 
              key={opt.id}
              disabled={isAnswered}
              onClick={() => {
                setSelectedOptionId(opt.id);
                setIsAnswered(true);
                if (currentItem) {
                  setResults(prev => ({ ...prev, [currentItem.id]: opt.id === content.correct_option_id }));
                }
              }}
              className={buttonClass}
            >
              <span>{opt.text}</span>
              <div className={`h-6 w-6 rounded-full border-2 transition-colors flex items-center justify-center ${
                isAnswered && isCorrect ? 'border-green-500 bg-green-500' : 
                isAnswered && isSelected ? 'border-red-500 bg-red-500' : 
                'border-gray-200 group-hover:border-blue-500'
              }`}>
                {isAnswered && (isCorrect || isSelected) && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      {isAnswered && content.explanation && (
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2 duration-300">
          <p className="text-sm font-bold text-gray-900 mb-1">Explanation</p>
          <p className="text-sm text-gray-600 italic">{content.explanation}</p>
        </div>
      )}
    </div>
  );

  const renderNote = (content: NoteContent) => (
    <div className="w-full bg-white border-2 border-emerald-100 rounded-3xl p-8 shadow-xl max-h-[60vh] overflow-y-auto">
      <div className="flex items-center space-x-2 mb-6 text-emerald-600">
        <FileText className="h-6 w-6" />
        <span className="font-bold uppercase tracking-wider text-sm">Study Note</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{content.title}</h2>
      <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
        {content.markdown}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gray-50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[90vh]">
        {/* Header */}
        <div className="p-6 flex items-center justify-between bg-white border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
              {data?.set.emoji || '📚'}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1">{data?.set.title || 'Loading...'}</h3>
              <p className="text-xs text-gray-500">{data?.set.subject || 'Study Set'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleClone}
              disabled={cloning || !data}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-blue-600 disabled:opacity-50"
              title="Clone this set"
            >
              {cloning ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Preparing your study session...</p>
            </div>
          ) : sessionFinished ? (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Well Done!</h2>
              <p className="text-gray-500 mb-8">You've completed this study session.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Cards</p>
                  <p className="text-2xl font-black text-gray-900">{Object.keys(results).length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Correct</p>
                  <p className="text-2xl font-black text-green-600">
                    {Object.values(results).filter(Boolean).length}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          ) : data && currentItem ? (
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
              {currentItem.type === 'flashcard' && renderFlashcard(currentItem.content as FlashcardContent)}
              {currentItem.type === 'quiz_question' && renderQuiz(currentItem.content as QuizQuestionContent)}
              {currentItem.type === 'note' && renderNote(currentItem.content as NoteContent)}
            </div>
          ) : (
            <p className="text-gray-500">Failed to load items.</p>
          )}
        </div>

        {/* Progress & Controls */}
        {data && (
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1.5 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart className={`h-5 w-5 ${currentItem?.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-sm font-bold">{currentItem?.like_count || 0}</span>
                </button>
                <button className="flex items-center space-x-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-bold">{currentItem?.comment_count || 0}</span>
                </button>
              </div>

              {/* Study Progress badge */}
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Level {currentItem?.study_data.box_level || 0}
                </span>
              </div>

              <div className="text-sm font-bold text-gray-400">
                {currentIndex + 1} <span className="text-gray-300 mx-1">/</span> {data.items.length}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0 || sessionFinished}
                className="flex-1 flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 border-gray-100 font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>
              <button 
                onClick={handleNext}
                disabled={isFinishing || sessionFinished}
                className="flex-[2] flex items-center justify-center space-x-2 py-4 rounded-2xl bg-blue-600 text-white font-bold disabled:opacity-30 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                {isFinishing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>{currentIndex === data.items.length - 1 ? 'Finish Session' : 'Next Card'}</span>
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyModal;
