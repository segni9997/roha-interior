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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-[#132527] border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 text-white"
          >
            <button
              onClick={onCancel}
              className="icon-button absolute top-4 right-4"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  isDestructive
                    ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                }`}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-white mb-1.5">
                  {title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="secondary-button text-xs"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm ${
                  isDestructive
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
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
