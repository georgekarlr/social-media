import React, { useState, useEffect } from 'react'
import { studyService } from '../../services/studyService'
import { Subject, CreateStudyItem, StudyItemType, FlashcardContent, QuizQuestionContent, NoteContent } from '../../types/study'
import { Loader2, Plus, X, Brain, CheckSquare, FileText, Trash2, Edit2 } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'

interface CreateSetModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ItemEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: CreateStudyItem) => void
  initialItem?: CreateStudyItem
  itemIndex?: number
}

const ItemEditorModal: React.FC<ItemEditorModalProps> = ({ isOpen, onClose, onSave, initialItem, itemIndex }) => {
  const [type, setType] = useState<StudyItemType>(initialItem?.type || 'flashcard')
  const [content, setContent] = useState<any>(initialItem?.content || { front: '', back: '', explanation: '', image_url: '' })

  useEffect(() => {
    if (initialItem) {
      setType(initialItem.type)
      setContent(initialItem.content)
    } else {
      setType('flashcard')
      setContent({ front: '', back: '', explanation: '', image_url: '' })
    }
  }, [initialItem, isOpen])

  const handleTypeChange = (newType: StudyItemType) => {
    setType(newType)
    if (newType === 'flashcard') {
      setContent({ front: '', back: '', explanation: '', image_url: '' })
    } else if (newType === 'quiz_question') {
      setContent({ question: '', options: [{ id: 1, text: '' }, { id: 2, text: '' }], correct_option_id: 1, explanation: '' })
    } else {
      setContent({ title: '', markdown: '', attachment_url: '' })
    }
  }

  const updateContent = (fields: any) => {
    setContent({ ...content, ...fields })
  }

  const handleSave = () => {
    onSave({ type, content })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {itemIndex !== undefined ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Type Selector */}
          {!initialItem && (
            <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('flashcard')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all
                  ${type === 'flashcard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Brain className="h-4 w-4" />
                <span>Flashcard</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('quiz_question')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all
                  ${type === 'quiz_question' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <CheckSquare className="h-4 w-4" />
                <span>Quiz</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('note')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all
                  ${type === 'note' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FileText className="h-4 w-4" />
                <span>Note</span>
              </button>
            </div>
          )}

          {/* Flashcard Editor */}
          {type === 'flashcard' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Front (Term)</label>
                <textarea
                  value={content.front}
                  onChange={(e) => updateContent({ front: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={3}
                  placeholder="What is the term?"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Back (Definition)</label>
                <textarea
                  value={content.back}
                  onChange={(e) => updateContent({ back: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={3}
                  placeholder="What is the definition?"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Explanation (Optional)</label>
                <textarea
                  value={content.explanation}
                  onChange={(e) => updateContent({ explanation: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={2}
                  placeholder="Add context or mnemonics..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  value={content.image_url}
                  onChange={(e) => updateContent({ image_url: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}

          {/* Quiz Editor */}
          {type === 'quiz_question' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question</label>
                <textarea
                  value={content.question}
                  onChange={(e) => updateContent({ question: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  rows={3}
                  placeholder="Enter your question here..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Options (Select correct one)</label>
                {content.options.map((opt: any, optIdx: number) => (
                  <div key={opt.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correct-option"
                      checked={content.correct_option_id === opt.id}
                      onChange={() => updateContent({ correct_option_id: opt.id })}
                      className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...content.options]
                          newOpts[optIdx].text = e.target.value
                          updateContent({ options: newOpts })
                        }}
                        className="flex-1 border-none text-sm py-2 px-3 focus:ring-0"
                        placeholder={`Option ${optIdx + 1}`}
                      />
                      {content.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newOpts = content.options.filter((o: any) => o.id !== opt.id)
                            const correctId = content.correct_option_id === opt.id ? newOpts[0].id : content.correct_option_id
                            updateContent({ options: newOpts, correct_option_id: correctId })
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {content.options.length < 6 && (
                  <button
                    type="button"
                    onClick={() => {
                      const maxId = Math.max(...content.options.map((o: any) => o.id), 0)
                      updateContent({ options: [...content.options, { id: maxId + 1, text: '' }] })
                    }}
                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Option</span>
                  </button>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Explanation (Optional)</label>
                <textarea
                  value={content.explanation}
                  onChange={(e) => updateContent({ explanation: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  rows={2}
                  placeholder="Why is this the correct answer?"
                />
              </div>
            </div>
          )}

          {/* Note Editor */}
          {type === 'note' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => updateContent({ title: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  placeholder="Key concepts of..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content (Markdown)</label>
                <textarea
                  value={content.markdown}
                  onChange={(e) => updateContent({ markdown: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-mono"
                  rows={6}
                  placeholder="# Introduction\nUse markdown to format your note..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Attachment URL (Optional)</label>
                <input
                  type="text"
                  value={content.attachment_url}
                  onChange={(e) => updateContent({ attachment_url: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  placeholder="Link to PDF, video, or extra resource"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
          >
            {itemIndex !== undefined ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}

const CreateSetModal: React.FC<CreateSetModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subjectId, setSubjectId] = useState<number | ''>('')
  const [isPublic, setIsPublic] = useState(true)
  const [tags, setTags] = useState('')
  const [items, setItems] = useState<CreateStudyItem[]>([])
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectsLoading, setSubjectsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Item Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CreateStudyItem | undefined>()
  const [editingIndex, setEditingIndex] = useState<number | undefined>()

  useEffect(() => {
    if (isOpen) {
      const fetchSubjects = async () => {
        try {
          const data = await studyService.getSubjects()
          setSubjects(data)
        } catch (err) {
          console.error('Failed to fetch subjects:', err)
        } finally {
          setSubjectsLoading(false)
        }
      }
      fetchSubjects()
    }
  }, [isOpen])

  const openAddItem = () => {
    setEditingItem(undefined)
    setEditingIndex(undefined)
    setIsEditorOpen(true)
  }

  const openEditItem = (index: number) => {
    setEditingItem(items[index])
    setEditingIndex(index)
    setIsEditorOpen(true)
  }

  const handleSaveItem = (item: CreateStudyItem) => {
    if (editingIndex !== undefined) {
      const newItems = [...items]
      newItems[editingIndex] = item
      setItems(newItems)
    } else {
      setItems([...items, item])
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (subjectId === '') {
      setError('Please select a subject')
      return
    }

    try {
      setLoading(true)
      await studyService.createFullSet({
        title: title.trim(),
        description: description.trim(),
        subject_id: Number(subjectId),
        is_public: isPublic,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        items: items.length > 0 ? items : undefined
      })
      showToast('Study set created successfully!', 'success')
      onClose()
      // Reset form
      setTitle('')
      setDescription('')
      setSubjectId('')
      setItems([])
      setTags('')
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create set'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Plus className="h-6 w-6 mr-2 text-blue-600" />
            Create Study Set
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="create-set-form" onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Set Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">General Information</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-lg py-3"
                    placeholder="e.g. Organic Chemistry"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 py-3"
                    required
                    disabled={subjectsLoading}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.emoji} {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    placeholder="What is this set about?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="chem, bio, exam..."
                  />
                </div>
                <div className="flex items-center pt-2 border-t border-gray-200 mt-2">
                  <label className="inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">Make this set public</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Study Items ({items.length})</h3>
                <button
                  type="button"
                  onClick={openAddItem}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Start building your set</h4>
                  <p className="text-gray-500">Add flashcards, quiz questions, or detailed notes.</p>
                  <button
                    type="button"
                    onClick={openAddItem}
                    className="mt-6 px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Create first item
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div 
                      key={index} 
                      className="group flex items-center p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => openEditItem(index)}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-4 
                        ${item.type === 'flashcard' ? 'bg-blue-50 text-blue-600' : 
                          item.type === 'quiz_question' ? 'bg-indigo-50 text-indigo-600' : 
                          'bg-emerald-50 text-emerald-600'}`}
                      >
                        {item.type === 'flashcard' && <Brain className="h-5 w-5" />}
                        {item.type === 'quiz_question' && <CheckSquare className="h-5 w-5" />}
                        {item.type === 'note' && <FileText className="h-5 w-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">
                          {item.type === 'flashcard' ? (item.content as FlashcardContent).front :
                           item.type === 'quiz_question' ? (item.content as QuizQuestionContent).question :
                           (item.content as NoteContent).title || 'Untitled Note'}
                        </p>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                          {item.type.replace('_', ' ')}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditItem(index)
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeItem(index)
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-sm">
            {error && <p className="text-red-600 font-medium">{error}</p>}
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Discard
            </button>
            <button
              form="create-set-form"
              type="submit"
              disabled={loading || items.length === 0}
              className="bg-blue-600 text-white font-bold px-10 py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:grayscale flex items-center shadow-xl shadow-blue-100"
            >
              {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              Publish Set
            </button>
          </div>
        </div>

        {/* Focused Item Editor Modal */}
        <ItemEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveItem}
          initialItem={editingItem}
          itemIndex={editingIndex}
        />
      </div>
    </div>
  )
}

export default CreateSetModal
