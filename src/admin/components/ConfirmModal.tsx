import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#11191b] border border-slate-800 rounded-2xl p-6 shadow-2xl z-10 text-white"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${isDestructive ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white mb-1.5">{title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border border-slate-700 text-slate-300 hover:bg-white/5 transition-all cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  isDestructive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30'
                    : 'bg-[#205b63] hover:bg-[#2b757f] text-white shadow-lg'
                }`}
              >
                {isLoading ? 'Processing...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
