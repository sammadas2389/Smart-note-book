import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pin, Trash2, Folder, Palette, Check, Calendar, Pencil } from 'lucide-react';
import { Note } from '../types';
import { formatBengaliDate } from '../utils';

interface NoteCardProps {
  key?: string;
  note: Note;
  onDeleteRequest: (note: Note) => void;
  onEditRequest: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onChangeColor: (id: string, color: string) => void;
  onChangeCategory: (id: string, category: string) => void;
}

const NOTE_COLORS = [
  { id: 'bg-white', bgClass: 'bg-white border-slate-200' },
  { id: 'bg-amber-50', bgClass: 'bg-amber-50 border-amber-200' },
  { id: 'bg-rose-50', bgClass: 'bg-rose-50 border-rose-200' },
  { id: 'bg-emerald-50', bgClass: 'bg-emerald-50 border-emerald-200' },
  { id: 'bg-sky-50', bgClass: 'bg-sky-50 border-sky-200' },
  { id: 'bg-purple-50', bgClass: 'bg-purple-50 border-purple-200' },
  { id: 'bg-indigo-50', bgClass: 'bg-indigo-50 border-indigo-200' },
  { id: 'bg-orange-50', bgClass: 'bg-orange-50 border-orange-200' },
];

const CATEGORIES = [
  { id: 'general', name: 'অন্যান্য', colorClass: 'bg-slate-100 text-slate-700' },
  { id: 'personal', name: 'ব্যক্তিগত', colorClass: 'bg-blue-100 text-blue-700 font-medium' },
  { id: 'work', name: 'কাজ', colorClass: 'bg-purple-100 text-purple-700 font-medium' },
  { id: 'ideas', name: 'চিন্তাভাবনা', colorClass: 'bg-amber-100 text-amber-800 font-medium' },
  { id: 'urgent', name: 'জরুরি', colorClass: 'bg-rose-100 text-rose-700 font-medium' },
];

export default function NoteCard({
  note,
  onDeleteRequest,
  onEditRequest,
  onTogglePin,
  onChangeColor,
  onChangeCategory,
}: NoteCardProps) {
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const activeColorObj = NOTE_COLORS.find((c) => c.id === note.color) || NOTE_COLORS[0];
  const activeCategory = CATEGORIES.find((cat) => cat.id === note.category) || CATEGORIES[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-xl border p-5 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md ${
        activeColorObj.bgClass
      } ${note.isPinned ? 'ring-2 ring-amber-100 border-amber-300' : 'hover:border-slate-300'}`}
    >
      {/* Clickable Note Body Area */}
      <div 
        onClick={() => onEditRequest(note)}
        className="cursor-pointer flex-1 flex flex-col"
      >
        {/* Card Header (Title & Pin) */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h4 className="font-semibold text-slate-800 text-base leading-snug break-words pr-8">
            {note.title || <span className="text-slate-400 italic font-normal">শিরোনামহীন নোট</span>}
          </h4>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening edit modal when pinning
              onTogglePin(note.id);
            }}
            className={`absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-500/5 transition-all md:opacity-0 group-hover:opacity-100 ${
              note.isPinned ? 'text-amber-500 md:opacity-100' : 'text-slate-400 hover:text-slate-600'
            }`}
            title={note.isPinned ? 'আনপিন করুন' : 'পিন করুন'}
          >
            <Pin size={15} fill={note.isPinned ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Card Content */}
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap break-words mb-4 flex-1">
          {note.content}
        </p>
      </div>

      {/* Card Footer (Timestamp, Category Badge, Tools) */}
      <div className="mt-auto pt-3 border-t border-slate-100/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Metadata: Category & Date */}
          <div className="flex flex-col gap-1.5">
            <span className={`inline-self-start text-[10px] px-2 py-0.5 rounded-md font-medium tracking-wide ${activeCategory.colorClass}`}>
              {activeCategory.name}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar size={11} />
              <span>{formatBengaliDate(note.createdAt)}</span>
            </div>
          </div>

          {/* Inline Action Buttons (Visible on hover on Desktop, always on mobile) */}
          <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Edit Button */}
            <button
              onClick={() => onEditRequest(note)}
              className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50/50 transition-colors cursor-pointer"
              title="সম্পাদনা করুন"
            >
              <Pencil size={14} />
            </button>

            {/* Color Palette Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowColorPalette(!showColorPalette);
                  setShowCategorySelect(false);
                }}
                className={`p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-500/5 transition-colors cursor-pointer ${
                  showColorPalette ? 'text-slate-600 bg-slate-500/5' : ''
                }`}
                title="রঙ পরিবর্তন"
              >
                <Palette size={14} />
              </button>

              {showColorPalette && (
                <div className="absolute bottom-full right-0 mb-1.5 z-20 flex items-center gap-1 p-1.5 bg-white rounded-lg shadow-lg border border-slate-100 animate-in fade-in slide-in-from-bottom-1 duration-100">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onChangeColor(note.id, c.id);
                        setShowColorPalette(false);
                      }}
                      className={`w-5 h-5 rounded-full border border-slate-200 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${c.id}`}
                    >
                      {note.color === c.id && <Check size={9} className="text-slate-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Folder / Category Assign */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategorySelect(!showCategorySelect);
                  setShowColorPalette(false);
                }}
                className={`p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-500/5 transition-colors cursor-pointer ${
                  showCategorySelect ? 'text-slate-600 bg-slate-500/5' : ''
                }`}
                title="ক্যাটেগরি পরিবর্তন"
              >
                <Folder size={14} />
              </button>

              {showCategorySelect && (
                <div className="absolute bottom-full right-0 mb-1.5 z-20 min-w-28 bg-white rounded-lg shadow-lg border border-slate-100 py-1 flex flex-col text-xs font-medium animate-in fade-in slide-in-from-bottom-1 duration-100">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onChangeCategory(note.id, cat.id);
                        setShowCategorySelect(false);
                      }}
                      className={`px-2.5 py-1.5 text-left hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                        note.category === cat.id ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-600'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {note.category === cat.id && <Check size={11} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Delete/Trash Button */}
            <button
              onClick={() => {
                onDeleteRequest(note);
                setShowColorPalette(false);
                setShowCategorySelect(false);
              }}
              className="p-1.5 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="মুছে ফেলুন"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
