import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Check, User, School, Camera, Image as ImageIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const AVATAR_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-orange-500',
];

export default function ProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: ProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [institute, setInstitute] = useState(profile.institute);
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File reader for Base64 conversion
  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      institute: institute.trim() || 'কোনো শিক্ষাপ্রতিষ্ঠান নেই',
      avatarColor,
      avatarUrl: avatarUrl || undefined,
    });
    onClose();
  };

  // Helper to extract initials
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase() || 'SD';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-slate-100 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Camera size={18} className="text-amber-500" />
                প্রোফাইল ও পরিচয় সম্পাদনা
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 rounded-full p-1.5 hover:bg-slate-50 transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Editing Form */}
            <form onSubmit={handleSave} className="space-y-5">
              {/* Avatar Selector and Upload Section */}
              <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                {/* Current Avatar Preview */}
                <div className="relative group shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm ring-4 ring-amber-100"
                    />
                  ) : (
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-sm ring-4 ring-amber-100 ${avatarColor}`}>
                      {getInitials(name || 'Samma Das')}
                    </div>
                  )}

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white p-1 rounded-full shadow-xs hover:bg-rose-600 transition-colors cursor-pointer"
                      title="ছবি মুছে ফেলুন"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>

                {/* Drag and Drop File Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-amber-500 bg-amber-50/30'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Upload size={18} className="text-slate-400 mb-1" />
                  <p className="text-xs text-slate-600 font-medium">
                    নতুন প্রোফাইল ছবি আপলোড করুন
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    এখানে ফাইল ড্র্যাগ অ্যান্ড ড্রপ করুন অথবা ক্লিক করুন
                  </p>
                </div>
              </div>

              {/* Avatar Background Color Selection (Visible if no Custom Image Uploaded) */}
              {!avatarUrl && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    অ্যাভাটার ব্যাকগ্রাউন্ড কালার
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAvatarColor(color)}
                        className={`w-8 h-8 rounded-full border border-white shadow-xs transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${color}`}
                      >
                        {avatarColor === color && (
                          <Check size={14} className="text-white font-bold" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Fields */}
              <div className="space-y-4">
                {/* Owner Name Input */}
                <div className="space-y-1.5">
                  <label htmlFor="owner-name" className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <User size={14} className="text-slate-400" />
                    ব্যবহারকারীর নাম / পরিচয়
                  </label>
                  <input
                    id="owner-name"
                    type="text"
                    required
                    placeholder="যেমন: Samma Das"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Polytechnic / Institute Input */}
                <div className="space-y-1.5">
                  <label htmlFor="institute-name" className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <School size={14} className="text-slate-400" />
                    পলিটেকনিক / শিক্ষা প্রতিষ্ঠানের নাম
                  </label>
                  <input
                    id="institute-name"
                    type="text"
                    placeholder="যেমন: Chattogram Polytechnic Institute"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-5 py-2.5 text-xs font-bold shadow-xs shadow-amber-100 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} className="stroke-[2.5]" />
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
