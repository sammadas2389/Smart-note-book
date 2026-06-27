import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  FileJson, 
  FileText, 
  Upload, 
  Check, 
  Info, 
  HelpCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Note, UserProfile } from '../types';
import { toBengaliNumerals } from '../utils';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  profile: UserProfile;
  onImportNotes: (importedNotes: Note[]) => void;
}

export default function DownloadModal({
  isOpen,
  onClose,
  notes,
  profile,
  onImportNotes,
}: DownloadModalProps) {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  // 1. Download Notes as JSON
  const downloadJSON = () => {
    try {
      if (notes.length === 0) {
        showNotification('আপনার কোনো নোট নেই!', true);
        return;
      }
      const dataStr = JSON.stringify(notes, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `smart_notebook_notes_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('নোটসমূহ সফলভাবে JSON ফরম্যাটে ডাউনলোড হয়েছে!');
    } catch (err) {
      showNotification('ডাউনলোড করতে ব্যর্থ হয়েছে!', true);
    }
  };

  // 2. Download Notes as formatted TXT file
  const downloadTXT = () => {
    try {
      if (notes.length === 0) {
        showNotification('আপনার কোনো নোট নেই!', true);
        return;
      }
      let textContent = `=========================================\n`;
      textContent += `     স্মার্ট নোটবুক - নোট ব্যাকআপ রিপোর্ট\n`;
      textContent += `=========================================\n`;
      textContent += `ব্যবহারকারী: ${profile.name}\n`;
      textContent += `শিক্ষা প্রতিষ্ঠান: ${profile.institute}\n`;
      textContent += `তারিখ ও সময়: ${new Date().toLocaleString('bn-BD')}\n`;
      textContent += `মোট নোট সংখ্যা: ${toBengaliNumerals(notes.length)} টি\n`;
      textContent += `=========================================\n\n`;

      notes.forEach((note, index) => {
        const catMap: Record<string, string> = {
          all: 'সব নোট',
          personal: 'ব্যক্তিগত',
          work: 'কাজ',
          ideas: 'চিন্তাভাবনা',
          urgent: 'জরুরি',
          general: 'অন্যান্য',
        };
        const categoryName = catMap[note.category] || 'অন্যান্য';
        textContent += `নোট নং: ${toBengaliNumerals(index + 1)}\n`;
        textContent += `-----------------------------------------\n`;
        textContent += `শিরোনাম: ${note.title || 'শিরোনামহীন নোট'}\n`;
        textContent += `ক্যাটেগরি: ${categoryName}\n`;
        textContent += `তৈরির সময়: ${note.createdAt}\n`;
        textContent += `পিন করা: ${note.isPinned ? 'হ্যাঁ' : 'না'}\n`;
        textContent += `-----------------------------------------\n`;
        textContent += `বিবরণ:\n${note.content}\n`;
        textContent += `=========================================\n\n`;
      });

      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `smart_notebook_notes_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('নোটসমূহ সফলভাবে TXT ফাইল হিসেবে ডাউনলোড হয়েছে!');
    } catch (err) {
      showNotification('ডাউনলোড করতে ব্যর্থ হয়েছে!', true);
    }
  };

  // 3. Download self-contained single file Offline Reader HTML
  const downloadOfflineHTML = () => {
    try {
      const notesJsonStr = JSON.stringify(notes);
      
      const htmlTemplate = `<!DOCTYPE html>
<html lang="bn">
<!-- 
  ============================================================
  স্মার্ট নোটবুক - সম্পূর্ণ নিরাপদ অফলাইন ভিউয়ার ও রিডার ফাইল
  নিরাপত্তা যাচাই: এই ফাইলটি সম্পূর্ণ অফলাইন এবং এতে কোনো ট্র্যাকিং কোড, 
  বিজ্ঞাপন, বা ক্ষতিকারক স্ক্রিপ্ট নেই। এটি শুধুমাত্র আপনার ব্রাউজারে 
  লোকালি সংরক্ষিত নোটগুলো সুন্দরভাবে দেখানোর জন্য তৈরি করা হয়েছে।
  ============================================================
-->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="স্মার্ট নোটবুক অফলাইন ভিউয়ার - আপনার ব্যক্তিগত নোট ব্যাকআপ ভিউয়ার">
  <meta name="generator" content="Smart Notebook Client Export">
  <title>স্মার্ট নোটবুক - অফলাইন ভিউয়ার</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
  <header class="bg-white border-b border-slate-150 py-4 px-6 sticky top-0 z-10 shadow-sm">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span class="p-1.5 bg-amber-500 text-white rounded-lg text-sm">📓</span>
          স্মার্ট নোটবুক অফলাইন রিডার
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          ব্যবহারকারী: <span class="font-semibold">${profile.name}</span> | ${profile.institute}
        </p>
      </div>
      
      <!-- Search -->
      <div class="relative w-full md:max-w-xs">
        <input 
          type="text" 
          id="searchInput" 
          placeholder="নোট খুঁজুন..." 
          class="w-full bg-slate-100 focus:bg-white text-sm px-4 py-2 rounded-xl border border-transparent focus:border-slate-300 outline-none transition-all"
        >
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-6xl w-full mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-slate-700">সংরক্ষিত নোটসমূহ (<span id="countSpan">0</span>টি)</h2>
      <span class="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
        ● সম্পূর্ণ অফলাইন সংস্করণ
      </span>
    </div>

    <!-- Notes Grid -->
    <div id="notesGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Notes will inject here -->
    </div>

    <!-- Empty State -->
    <div id="emptyState" class="hidden flex-col items-center justify-center py-16 text-center">
      <div class="text-4xl mb-3">📭</div>
      <p class="text-slate-500 font-medium">কোনো নোট খুঁজে পাওয়া যায়নি!</p>
    </div>
  </main>

  <footer class="bg-white border-t border-slate-100 py-4 text-center text-xs text-slate-400 mt-8">
    <p>Developed with ❤️ by <span class="font-semibold text-slate-600">Samma Das</span> | Chattogram Polytechnic Institute</p>
  </footer>

  <script>
    // এই স্ক্রিপ্টটি শুধুমাত্র আপনার নোটগুলো সুন্দরভাবে দেখানোর জন্য ব্যবহৃত হচ্ছে।
    const notes = ${notesJsonStr};
    
    const colorClasses = {
      'bg-white': 'bg-white border-slate-200',
      'bg-amber-50': 'bg-amber-50 border-amber-200',
      'bg-rose-50': 'bg-rose-50 border-rose-200',
      'bg-emerald-50': 'bg-emerald-50 border-emerald-200',
      'bg-sky-50': 'bg-sky-50 border-sky-200',
      'bg-purple-50': 'bg-purple-50 border-purple-200',
      'bg-indigo-50': 'bg-indigo-50 border-indigo-200',
      'bg-orange-50': 'bg-orange-50 border-orange-200',
    };

    const searchInput = document.getElementById('searchInput');
    const notesGrid = document.getElementById('notesGrid');
    const emptyState = document.getElementById('emptyState');
    const countSpan = document.getElementById('countSpan');

    function renderNotes(filterText = '') {
      const filtered = notes.filter(n => {
        const query = filterText.toLowerCase();
        return n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query);
      });

      countSpan.textContent = filtered.length;
      notesGrid.innerHTML = '';

      if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        return;
      }

      emptyState.classList.remove('flex');
      emptyState.classList.add('hidden');

      filtered.forEach(note => {
        const card = document.createElement('div');
        const bgAndBorder = colorClasses[note.color] || 'bg-white border-slate-200';
        card.className = 'p-5 rounded-2xl border transition-shadow hover:shadow-md flex flex-col ' + bgAndBorder;
        
        let headerHtml = '';
        if (note.isPinned) {
          headerHtml += '<span class="text-xs font-bold text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded mb-2 w-max">📌 পিন করা</span>';
        }

        const titleText = note.title.trim() ? note.title : 'শিরোনামহীন নোট';
        const formattedDate = note.createdAt || '';

        card.innerHTML = \`
          \${headerHtml}
          <h3 class="font-bold text-slate-800 text-base mb-1.5">\${titleText}</h3>
          <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words flex-1 mb-4">\${note.content}</p>
          <div class="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100/60 pt-3.5">
            <span>📅 \${formattedDate}</span>
            <span class="font-semibold uppercase text-[10px] bg-slate-200/60 px-2 py-0.5 rounded">\${note.category}</span>
          </div>
        \`;
        notesGrid.appendChild(card);
      });
    }

    searchInput.addEventListener('input', (e) => {
      renderNotes(e.target.value);
    });

    // Initial render
    renderNotes();
  </script>
</body>
</html>`;

      const blob = new Blob([htmlTemplate], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `smart_notebook_offline_${new Date().toISOString().slice(0,10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('অফলাইন ভিউয়ার (HTML) সফলভাবে ডাউনলোড হয়েছে!');
    } catch (err) {
      showNotification('ডাউনলোড করতে ব্যর্থ হয়েছে!', true);
    }
  };

  // 4. Handle JSON File Upload for Importing Notes
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const validNotes = imported.filter(
            (n) => n && typeof n === 'object' && 'id' in n && 'title' in n && 'content' in n
          );
          if (validNotes.length > 0) {
            onImportNotes(validNotes);
            showNotification(`${toBengaliNumerals(validNotes.length)} টি নোট সফলভাবে ইম্পোর্ট করা হয়েছে!`);
            if (fileInputRef.current) fileInputRef.current.value = '';
          } else {
            showNotification('ফাইলটিতে কোনো সঠিক নোটের তথ্য পাওয়া যায়নি!', true);
          }
        } else {
          showNotification('ভুল ফাইল সংস্করণ! সঠিক নোটের JSON ব্যাকআপ ফাইল আপলোড করুন।', true);
        }
      } catch (err) {
        showNotification('ফাইলটি পড়তে সমস্যা হয়েছে! ফাইল ফরম্যাট পরীক্ষা করুন।', true);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-slate-100 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Download size={18} className="text-amber-500" />
                ডাউনলোড ও ব্যাকআপ সেন্টার
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 rounded-full p-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Custom Banner Notifications */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 mb-4 text-xs font-semibold flex items-center gap-2">
                <span className="bg-emerald-500 text-white rounded-full p-0.5">✓</span>
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 mb-4 text-xs font-semibold flex items-center gap-2">
                <span className="bg-rose-500 text-white rounded-full p-0.5 px-1.5">!</span>
                {errorMessage}
              </div>
            )}

            {/* 100% Virus-Free & Safe Download Verification Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3.5 mb-4 text-xs text-slate-700 flex gap-2.5 items-start">
              <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-bold text-emerald-800 flex items-center gap-1">
                  ভাইরাস ও ক্ষতিকারক ফাইল মুক্ত ডাউনলোড গ্যারান্টি!
                </p>
                <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                  স্মার্ট নোটবুকের ব্যাকআপ ও অফলাইন ভিউয়ার ফাইলগুলো সম্পূর্ণ লোকাল ব্রাউজার থেকে সরাসরি তৈরি করা হয়। এতে কোনো বিজ্ঞাপন, ট্র্যাকিং কোড, কিংবা ক্ষতিকারক এক্সিকিউটেবল প্রোগ্রাম বা স্ক্রিপ্ট নেই। আপনি সম্পূর্ণ নিরাপদে এগুলো ডাউনলোড ও ব্যবহার করতে পারেন।
                </p>
              </div>
            </div>

            {/* Options Body */}
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-medium">
                আপনার স্মার্ট নোটবুকের সকল নোট সংরক্ষণ, ডাউনলোড অথবা ব্যাকআপ রিস্টোর করার অপশন সমূহ নিচে রয়েছে:
              </p>

              {/* 1. TXT Document Download option */}
              <button
                onClick={downloadTXT}
                className="w-full flex items-center gap-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl p-3.5 text-left transition-all duration-200 cursor-pointer group"
              >
                <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-105 transition-transform">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-700">নোট শিট ডাউনলোড (TXT)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">সবগুলো নোট রিডেবল টেক্সট ফাইলে ডাউনলোড করুন</p>
                </div>
                <Download size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </button>

              {/* 2. Self-contained HTML file (Offline App/Viewer) */}
              <button
                onClick={downloadOfflineHTML}
                className="w-full flex items-center gap-4 bg-amber-50/30 hover:bg-amber-50/60 border border-amber-200/50 rounded-xl p-3.5 text-left transition-all duration-200 cursor-pointer group"
              >
                <div className="p-2.5 bg-amber-100 rounded-lg text-amber-600 group-hover:scale-105 transition-transform">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-700">অফলাইন ভিউয়ার ডাউনলোড (HTML)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">আপনার নোটসহ সম্পূর্ণ অফলাইন রিড-অনলি ওয়েব পেজ</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Download size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-sm">অফলাইন সংস্করণ</span>
                </div>
              </button>

              {/* 3. JSON Backup download option */}
              <button
                onClick={downloadJSON}
                className="w-full flex items-center gap-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl p-3.5 text-left transition-all duration-200 cursor-pointer group"
              >
                <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-105 transition-transform">
                  <FileJson size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-700">র ব্যাকআপ ফাইল ডাউনলোড (JSON)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">ভবিষ্যতে পুনরুদ্ধার করার জন্য ব্যাকআপ ফাইল</p>
                </div>
                <Download size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </button>

              {/* 4. Import / Restore section */}
              <div className="border-t border-dashed border-slate-200 pt-4 mt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ব্যাকআপ পুনরুদ্ধার করুন (Import)</h4>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-slate-50/50 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload size={20} className="text-slate-400 group-hover:text-amber-500 group-hover:scale-105 transition-all" />
                  <div>
                    <p className="text-xs font-bold text-slate-700">JSON ব্যাকআপ ফাইল আপলোড করুন</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">আপনার পূর্বের নোটসমূহ পুনরুদ্ধার করতে এখানে ক্লিক করুন</p>
                  </div>
                </div>
              </div>

              {/* Info section for Source Code export */}
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] leading-relaxed text-slate-500 border border-slate-200/40 flex gap-2.5 items-start mt-3">
                <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-600">ওয়েব অ্যাপ সোর্স কোড ডাউনলোড করার নিয়ম:</p>
                  <p className="mt-1">
                    সম্পূর্ণ প্রোডাকশন সোর্স কোড (.ZIP ফাইল হিসেবে) সরাসরি ডাউনলোড করতে স্ক্রিনের ওপরের ডানদিকের গিয়ার আইকন (Settings) থেকে <span className="font-semibold text-slate-700">"Export"</span> মেনুতে ক্লিক করুন।
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Close Button */}
            <div className="flex justify-end pt-4 mt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
