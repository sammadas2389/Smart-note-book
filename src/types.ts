export interface UserProfile {
  name: string;
  institute: string;
  avatarUrl?: string; // Optional custom avatar URL or Base64 uploaded image
  avatarColor: string; // Tailwind color class like bg-emerald-500, bg-indigo-500
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string; // Tailwind class name for background color, e.g., 'bg-white' or 'bg-amber-50'
  category: string; // e.g., 'personal', 'work', 'ideas', 'urgent'
  isPinned: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
