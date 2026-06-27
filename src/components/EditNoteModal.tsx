import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Pin, Palette, Folder } from 'lucide-react';
import { Note } from '../types';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSave: (updatedNote: Note) => void;
}

const NOTE_COLORS = [
  { id: 'bg-white', name: 'সাদা', bgClass: 'bg-white border-slate-200' },
  { id: 'bg-amber-50', name: 'হলুদ', bgClass: 'bg-amber-50 border-amber-200' },
  { id: 'bg-rose-50', name: 'গোলাপী', bgClass: 'bg-rose-50 border-rose-200' },
  { id: 'bg-emerald-50', name: 'সবুজ', bgClass: 'bg-emerald-50 border-emerald-200' },
  { id: 'bg-sky-50', name: 'নীল', bgClass: 'bg-sky-50 border-sky-200' },
  { id: 'bg-purple-50', name: 'বেগুনী', bgClass: 'bg-purple-50 border-purple-200' },
  { id: 'bg-indigo-50', name: 'নীলচে', bgClass: 'bg-indigo-50 border-indigo-200' },
  { id: 'bg-orange-50', name: 'কমলা', bgClass: 'bg-orange-50 border-orange-200' },
];

const CATEGORIES = [
  { id: 'general', name: 'অন্যান্য' },
  { id: 'personal', name: 'ব্যক্তিগত' },
  { id: 'work', name: 'কাজ' },
  { id: 'ideas', name: 'চিন্তাভাবনা' },
  { id: 'urgent', name: 'জরুরি' },
];

export default function EditNoteModal({
  isOpen,
  onClose,
  note,
  onSave,
}: EditNoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('bg-white');
  const [category, setCategory] = useState('general');
  const [isPinned, setIsPinned] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Sync state with note when note changes or modal opens
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setCategory(note.category);
      setIsPinned(note.isPinned);
    }
  }, [note, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;
    if (!title.trim() && !content.trim()) return;

    onSave({
      ...note,
      title: title.trim(),
      content: content.trim(),
      color,
      category,
      isPinned,
    });
    onClose();
  };

  const selectedColorObj = NOTE_COLORS.find((c) => c.id === color) || NOTE_COLORS[0];

  return (
    <AnimatePresence>
      {isOpen && note && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`relative w-full max-w-xl overflow-hidden rounded-2xl p-6 shadow-xl border ${selectedColorObj.bgClass} z-10`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full p-1.5 hover:bg-slate-500/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Title & Pinned Status */}
            <div className="flex items-center justify-between gap-2 mb-4 pr-8">
              <input
                type="text"
                placeholder="নোটের শিরোনাম..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent font-semibold text-lg placeholder-slate-400 focus:outline-hidden py-1"
                maxLength={100}
              />
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`p-1.5 rounded-full hover:bg-slate-500/10 transition-all cursor-pointer ${
                  isPinned ? 'text-amber-500 scale-110' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={isPinned ? 'আনপিন করুন' : 'পিন করুন'}
              >
                <Pin size={18} fill={isPinned ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Note Content Description Textarea */}
            <textarea
              placeholder="নোটের বিবরণ লিখুন..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-transparent text-slate-700 placeholder-slate-400 focus:outline-hidden py-1 resize-none leading-relaxed mb-6"
            />

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100/60">
              <div className="flex items-center gap-2">
                {/* Color Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={`p-2 rounded-full hover:bg-slate-500/10 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer ${
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

                {/* Category Dropdown */}
                <div className="flex items-center gap-1 bg-slate-500/5 hover:bg-slate-500/10 rounded-lg px-2.5 py-1 text-slate-500 transition-colors text-xs border border-slate-100">
                  <Folder size={12} />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-transparent font-semibold border-none outline-hidden cursor-pointer text-slate-600 pr-1"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-white text-slate-700">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-500/10 transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!title.trim() && !content.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white px-5 py-2 text-xs font-bold shadow-xs shadow-amber-100 transition-colors cursor-pointer"
                >
                  <Check size={14} className="stroke-[2.5]" />
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
