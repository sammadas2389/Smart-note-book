import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noteTitle: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  noteTitle,
}: ConfirmationModalProps) {
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
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-slate-100"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full p-1.5 hover:bg-slate-50 transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Modal Content */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <div className="mt-0.5 flex-1">
                <h3 className="text-lg font-semibold text-slate-800">
                  নোটটি মুছে ফেলতে চান?
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  আপনি কি নিশ্চিত যে আপনি{' '}
                  <span className="font-semibold text-slate-700">
                    "{noteTitle || 'শিরোনামহীন নোট'}"
                  </span>{' '}
                  মুছে ফেলতে চান? একবার মুছে ফেললে এটি আর ফিরে পাওয়া যাবে না।
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
              >
                না, রাখুন
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-sm shadow-rose-100"
              >
                <Trash2 size={15} />
                হ্যাঁ, নিশ্চিত
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
