import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Folder, 
  Sparkles, 
  Pin, 
  Trash2, 
  NotebookPen, 
  FileText,
  AlertCircle,
  Clock,
  UserCheck,
  UserPen,
  Download
} from 'lucide-react';
import { Note, UserProfile } from './types';
import NoteInput from './components/NoteInput';
import NoteCard from './components/NoteCard';
import ConfirmationModal from './components/ConfirmationModal';
import ProfileModal from './components/ProfileModal';
import EditNoteModal from './components/EditNoteModal';
import DownloadModal from './components/DownloadModal';
import { getCurrentBengaliTimestamp, toBengaliNumerals } from './utils';

const CATEGORIES_FILTER = [
  { id: 'all', name: 'সব নোট' },
  { id: 'personal', name: 'ব্যক্তিগত' },
  { id: 'work', name: 'কাজ' },
  { id: 'ideas', name: 'চিন্তাভাবনা' },
  { id: 'urgent', name: 'জরুরি' },
  { id: 'general', name: 'অন্যান্য' },
];

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Profile state with defaults
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Samma Das',
    institute: 'Chattogram Polytechnic Institute',
    avatarColor: 'bg-emerald-500',
  });
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Deletion Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  // Edit Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  // Download/Export Modal state
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Load notes and profile from LocalStorage on component mount
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem('samma_das_notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        // Seed default notes so the user doesn't see a blank page initially
        const defaultNotes: Note[] = [
          {
            id: 'default-1',
            title: 'গুগল কিপ নোটপ্যাডে আপনাকে স্বাগতম!',
            content: 'এটি একটি অত্যন্ত আধুনিক ও মিনিমালিস্ট নোট রাখার অ্যাপ্লিকেশন। এখানে আপনি সহজেই আপনার দৈনন্দিন কাজ, গুরুত্বপূর্ণ চিন্তা এবং রিমাইন্ডার সংরক্ষণ করতে পারেন।\n\n১. উপরে নোটের শিরোনাম এবং বিবরণ দিয়ে "সংরক্ষণ করুন" বাটনে ক্লিক করুন।\n২. নোটটির ক্যাটেগরি এবং ব্যাকগ্রাউন্ড কালার ইচ্ছেমতো পরিবর্তন করতে পারেন।\n৩. গুরুত্বপূর্ণ নোটগুলিকে পিন করে রাখতে ডানপাশের পিন আইকন ব্যবহার করুন।',
            color: 'bg-amber-50',
            category: 'general',
            isPinned: true,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
          },
          {
            id: 'default-2',
            title: 'আজকের বাজার তালিকা',
            content: '- চাল ৫ কেজি\n- ডাল ১ কেজি\n- পেঁয়াজ ও রসুন\n- তাজা মাছ ও সবজি\n- ধনেপাতা এবং কাঁচামরিচ',
            color: 'bg-emerald-50',
            category: 'personal',
            isPinned: false,
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
          },
          {
            id: 'default-3',
            title: 'অফিসের জরুরি প্রজেক্ট ডেডলাইন',
            content: 'আগামী সোমবারের মধ্যে ক্লায়েন্ট প্রেজেন্টেশন ও কোড রিভিউ সম্পন্ন করতে হবে। ডিজাইন টিমের কাছ থেকে এসেটগুলো সংগ্রহ করা অত্যন্ত গুরুত্বপূর্ণ।',
            color: 'bg-rose-50',
            category: 'work',
            isPinned: false,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
          }
        ];
        setNotes(defaultNotes);
        localStorage.setItem('samma_das_notes', JSON.stringify(defaultNotes));
      }

      // Load Profile
      const storedProfile = localStorage.getItem('samma_das_profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (e) {
      console.error('LocalStorage parsing error:', e);
    }
  }, []);

  // Save notes to LocalStorage helper
  const saveNotesToStorage = (updatedNotes: Note[]) => {
    try {
      localStorage.setItem('samma_das_notes', JSON.stringify(updatedNotes));
    } catch (e) {
      console.error('Failed to save to LocalStorage:', e);
    }
  };

  // Save profile to LocalStorage helper
  const saveProfileToStorage = (updatedProfile: UserProfile) => {
    try {
      setProfile(updatedProfile);
      localStorage.setItem('samma_das_profile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile to LocalStorage:', e);
    }
  };

  // 1. Add Note Handler
  const handleAddNote = (newNoteData: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...newNoteData,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: getCurrentBengaliTimestamp(),
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  // 2. Request Delete Note (Opens Modal)
  const handleDeleteRequest = (note: Note) => {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  // 3. Confirm Delete Note (Triggered from Modal)
  const handleConfirmDelete = () => {
    if (!noteToDelete) return;

    const updatedNotes = notes.filter((n) => n.id !== noteToDelete.id);
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    
    setDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  // 3b. Request Edit Note (Opens Modal)
  const handleEditRequest = (note: Note) => {
    setNoteToEdit(note);
    setEditModalOpen(true);
  };

  // 3c. Save Edited Note (Triggered from Modal)
  const handleSaveEditedNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  // 3d. Import Notes (Merges uploaded notes and saves them)
  const handleImportNotes = (importedNotes: Note[]) => {
    // Generate new unique ids for imported notes to prevent conflicts with existing notes
    const newNotes = importedNotes.map(n => ({
      ...n,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7)
    }));
    const updatedNotes = [...notes, ...newNotes];
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  // 4. Toggle Pin status
  const handleTogglePin = (id: string) => {
    const updatedNotes = notes.map((n) => {
      if (n.id === id) {
        return { ...n, isPinned: !n.isPinned };
      }
      return n;
    });
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  // 5. Change Note Color
  const handleChangeColor = (id: string, color: string) => {
    const updatedNotes = notes.map((n) => {
      if (n.id === id) {
        return { ...n, color };
      }
      return n;
    });
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  // 6. Change Note Category
  const handleChangeCategory = (id: string, category: string) => {
    const updatedNotes = notes.map((n) => {
      if (n.id === id) {
        return { ...n, category };
      }
      return n;
    });
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  // Filter notes according to search query and selected category
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Separate pinned and unpinned notes
  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-800">
      {/* 1. Header with App Name and Owner Info */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Application Name */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 rounded-xl text-white shadow-sm shadow-amber-200">
              <BookOpen size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-800">স্মার্ট নোটবুক</h1>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">কিপ স্টাইল</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xs text-slate-400 font-medium">
                  ব্যবহারকারী: <span className="text-slate-600 font-semibold">{profile.name}</span>
                </p>
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="p-1 rounded-full text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors cursor-pointer"
                  title="প্রোফাইল পরিবর্তন করুন"
                >
                  <UserPen size={11} />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                {profile.institute}
              </p>
            </div>
          </div>

          {/* Centered Modern Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="নোটের শিরোনাম বা বিবরণ দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-700 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2.5 border border-transparent focus:border-slate-200 focus:outline-hidden transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                মুছে ফেলুন
              </button>
            )}
          </div>

          {/* Download & Backup Trigger Button */}
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs shadow-amber-100 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="ডাউনলোড ও ব্যাকআপ"
          >
            <Download size={14} className="stroke-[2.5]" />
            <span>ডাউনলোড ও ব্যাকআপ</span>
          </button>

          {/* Owner Quick Profile / Status Indicator */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="hidden lg:flex items-center gap-3.5 bg-slate-50 border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 text-left rounded-xl px-4 py-1.5 transition-all duration-200 cursor-pointer group"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs ${profile.avatarColor}`}>
                {(() => {
                  const parts = profile.name.trim().split(/\s+/);
                  if (parts.length >= 2) {
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                  }
                  return profile.name.substring(0, 2).toUpperCase() || 'SD';
                })()}
              </div>
            )}
            <div className="text-left text-xs">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-slate-700 leading-none group-hover:text-amber-600 transition-colors">{profile.name}</p>
                <UserPen size={11} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1 leading-tight">
                {profile.institute}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                অনলাইন স্টোরেজ সচল
              </p>
            </div>
          </button>

        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Sidebar Filters */}
        <aside className="w-full md:w-56 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 pb-2 md:pb-0 border-b md:border-b-0 border-slate-100">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Folder size={12} />
            <span>ক্যাটেগরি সমূহ</span>
          </div>

          {CATEGORIES_FILTER.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                cat.id === 'all' ? 'bg-amber-400' :
                cat.id === 'personal' ? 'bg-blue-400' :
                cat.id === 'work' ? 'bg-purple-400' :
                cat.id === 'ideas' ? 'bg-amber-300' :
                cat.id === 'urgent' ? 'bg-rose-400' : 'bg-slate-400'
              }`} />
              <span>{cat.name}</span>
              {selectedCategory === cat.id && (
                <span className="ml-auto text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md hidden md:inline-block">
                  {toBengaliNumerals(
                    cat.id === 'all' 
                      ? notes.length 
                      : notes.filter((n) => n.category === cat.id).length
                  )}
                </span>
              )}
            </button>
          ))}

          {/* Sidebar Download Button */}
          <div className="md:border-t md:border-slate-100 md:pt-4 md:mt-4">
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-600 hover:bg-amber-50/50 bg-amber-50/20 md:w-full transition-all duration-200 shrink-0 cursor-pointer border border-amber-200/40"
            >
              <Download size={15} className="stroke-[2.5]" />
              <span>ডাউনলোড ও ব্যাকআপ</span>
            </button>
          </div>
        </aside>

        {/* Right Side: Notes Board */}
        <section className="flex-1 flex flex-col">
          {/* Form to enter a new note */}
          <NoteInput onAddNote={handleAddNote} />

          {/* Notes Container */}
          <div className="flex-1">
            <AnimatePresence mode="popLayout">
              {/* Empty state when no notes matched */}
              {filteredNotes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white max-w-xl mx-auto my-6"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                    <NotebookPen size={32} />
                  </div>
                  <h3 className="text-base font-bold text-slate-700">কোনো তথ্য বা নোট পাওয়া যায়নি!</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">
                    {searchQuery 
                      ? 'আপনার খোঁজা কীওয়ার্ডের সাথে কোনো নোটের শিরোনাম বা বিবরণ মিলছে না।' 
                      : 'নতুন নোট তৈরি করতে উপরের ইনপুট বক্সে টাইপ করুন এবং সংরক্ষণ করুন।'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-lg transition-all"
                    >
                      অনুসন্ধান ক্লিয়ার করুন
                    </button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-8">
                  {/* Pinned Section */}
                  {pinnedNotes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 px-1">
                        <Pin size={12} className="text-amber-500 fill-amber-500" />
                        <span>পিন করা নোটসমূহ ({toBengaliNumerals(pinnedNotes.length)})</span>
                      </div>
                      <motion.div 
                        layout 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      >
                        {pinnedNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            onDeleteRequest={handleDeleteRequest}
                            onEditRequest={handleEditRequest}
                            onTogglePin={handleTogglePin}
                            onChangeColor={handleChangeColor}
                            onChangeCategory={handleChangeCategory}
                          />
                        ))}
                      </motion.div>
                    </div>
                  )}

                  {/* Other Notes Section */}
                  {otherNotes.length > 0 && (
                    <div>
                      {pinnedNotes.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 px-1 mt-6">
                          <FileText size={12} />
                          <span>অন্যান্য নোটসমূহ ({toBengaliNumerals(otherNotes.length)})</span>
                        </div>
                      )}
                      <motion.div 
                        layout 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      >
                        {otherNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            onDeleteRequest={handleDeleteRequest}
                            onEditRequest={handleEditRequest}
                            onTogglePin={handleTogglePin}
                            onChangeColor={handleChangeColor}
                            onChangeCategory={handleChangeCategory}
                          />
                        ))}
                      </motion.div>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>

      {/* 3. Footer with Credit line */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
          <p className="font-medium">
            &copy; {toBengaliNumerals(new Date().getFullYear())} স্মার্ট নোটবুক। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex flex-col items-center sm:items-end gap-1 font-semibold text-slate-500">
            <p className="flex items-center gap-1">
              Developed with ❤️ by <span className="text-amber-600">Samma Das</span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              Chattogram Polytechnic Institute
            </p>
          </div>
        </div>
      </footer>

      {/* Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setNoteToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        noteTitle={noteToDelete?.title || ''}
      />

      {/* Profile/Identity Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        onSave={saveProfileToStorage}
      />

      {/* Edit Note Modal */}
      <EditNoteModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setNoteToEdit(null);
        }}
        note={noteToEdit}
        onSave={handleSaveEditedNote}
      />

      {/* Download and Backup Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        notes={notes}
        profile={profile}
        onImportNotes={handleImportNotes}
      />
    </div>
  );
}
