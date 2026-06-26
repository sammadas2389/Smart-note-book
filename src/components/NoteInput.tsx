import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pin, Plus, Folder, Palette, Check } from 'lucide-react';
import { Note } from '../types';

interface NoteInputProps {
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
}

const NOTE_COLORS = [
  { id: 'bg-white', name: 'সাদা', bgClass: 'bg-white border-slate-200', textClass: 'text-slate-800' },
  { id: 'bg-amber-50', name: 'হলুদ', bgClass: 'bg-amber-50 border-amber-200', textClass: 'text-amber-950' },
  { id: 'bg-rose-50', name: 'গোলাপী', bgClass: 'bg-rose-50 border-rose-200', textClass: 'text-rose-950' },
  { id: 'bg-emerald-50', name: 'সবুজ', bgClass: 'bg-emerald-50 border-emerald-200', textClass: 'text-emerald-950' },
  { id: 'bg-sky-50', name: 'নীল', bgClass: 'bg-sky-50 border-sky-200', textClass: 'text-sky-950' },
  { id: 'bg-purple-50', name: 'বেগুনী', bgClass: 'bg-purple-50 border-purple-200', textClass: 'text-purple-950' },
  { id: 'bg-indigo-50', name: 'নীলচে', bgClass: 'bg-indigo-50 border-indigo-200', textClass: 'text-indigo-950' },
  { id: 'bg-orange-50', name: 'কমলা', bgClass: 'bg-orange-50 border-orange-200', textClass: 'text-orange-950' },
];

const CATEGORIES = [
  { id: 'general', name: 'অন্যান্য' },
  { id: 'personal', name: 'ব্যক্তিগত' },
  { id: 'work', name: 'কাজ' },
  { id: 'ideas', name: 'চিন্তাভাবনা' },
  { id: 'urgent', name: 'জরুরি' },
];

export default function NoteInput({ onAddNote }: NoteInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('bg-white');
  const [category, setCategory] = useState('general');
  const [isPinned, setIsPinned] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close input if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // If user entered some text, keep it expanded or let them close
        if (title.trim() === '' && content.trim() === '') {
          setIsExpanded(false);
          setShowColorPicker(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [title, content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;

    onAddNote({
      title: title.trim(),
      content: content.trim(),
      color,
      category,
      isPinned,
    });

    // Reset Form
    setTitle('');
    setContent('');
    setColor('bg-white');
    setCategory('general');
    setIsPinned(false);
    setIsExpanded(false);
    setShowColorPicker(false);
  };

  const selectedColorObj = NOTE_COLORS.find((c) => c.id === color) || NOTE_COLORS[0];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div
        ref={containerRef}
        className={`w-full rounded-xl transition-all duration-300 shadow-sm border ${
          selectedColorObj.bgClass
        } ${isExpanded ? 'shadow-md border-slate-300/80 ring-2 ring-slate-200' : 'hover:shadow-md hover:border-slate-300'}`}
      >
        <form onSubmit={handleSubmit} className="p-4 flex flex-col">
          {/* Note Title Input (Visible when expanded) */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-3 flex items-start justify-between gap-2"
              >
                <input
                  type="text"
                  placeholder="শিরোনাম..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent font-medium text-lg placeholder-slate-400 focus:outline-hidden py-1 border-b border-transparent focus:border-slate-100/30"
                  maxLength={100}
                />
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`p-1.5 rounded-full hover:bg-slate-500/10 transition-all ${
                    isPinned ? 'text-amber-500 hover:text-amber-600 scale-110' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={isPinned ? 'নোটটি আনপিন করুন' : 'নোটটি পিন করুন'}
                >
                  <Pin size={18} fill={isPinned ? 'currentColor' : 'none'} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Note Content / Description */}
          <textarea
            placeholder={isExpanded ? 'নোটের বিবরণ লিখুন...' : 'একটি নতুন নোট লিখুন...'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            rows={isExpanded ? 3 : 1}
            className="w-full bg-transparent text-slate-700 placeholder-slate-400 focus:outline-hidden py-1 resize-none leading-relaxed"
          />

          {/* Action and Control Bar (Visible when expanded) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  {/* Color Picker Button & Tooltip */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className={`p-2 rounded-full hover:bg-slate-500/10 text-slate-500 hover:text-slate-700 transition-colors ${
                        showColorPicker ? 'bg-slate-500/10' : ''
                      }`}
                      title="রঙ পরিবর্তন করুন"
                    >
                      <Palette size={16} />
                    </button>

                    {showColorPicker && (
                      <div className="absolute bottom-full left-0 mb-2 z-30 flex items-center gap-1.5 p-2 bg-white rounded-xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        {NOTE_COLORS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setColor(c.id);
                              setShowColorPicker(false);
                            }}
                            className={`w-6 h-6 rounded-full border border-slate-200 transition-transform hover:scale-115 flex items-center justify-center cursor-pointer ${c.id}`}
                            title={c.name}
                          >
                            {color === c.id && <Check size={11} className="text-slate-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Selector */}
                  <div className="flex items-center gap-1 bg-slate-500/5 hover:bg-slate-500/10 rounded-lg px-2 py-1 text-slate-500 transition-colors text-xs border border-slate-100">
                    <Folder size={12} />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-transparent font-medium border-none outline-hidden cursor-pointer text-slate-600 pr-1"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-white text-slate-700">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle('');
                      setContent('');
                      setColor('bg-white');
                      setCategory('general');
                      setIsPinned(false);
                      setIsExpanded(false);
                      setShowColorPicker(false);
                    }}
                    className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-500/10 transition-colors cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() && !content.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-white px-4 py-1.5 text-xs font-semibold shadow-xs shadow-emerald-100 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    নোট সংরক্ষণ করুন
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
