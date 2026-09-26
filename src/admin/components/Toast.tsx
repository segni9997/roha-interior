import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 text-white ${
              toast.type === 'success'
                ? 'bg-[#122524]/90 border-[#205b63]'
                : 'bg-[#2b1418]/90 border-rose-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="text-xs font-bold uppercase tracking-wider">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-3 text-white max-w-md ${
          isSuccess
            ? 'bg-[#0f2123]/95 border-[#205b63] shadow-teal-950/40'
            : 'bg-[#291316]/95 border-rose-800 shadow-rose-950/40'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle size={18} className="text-rose-400 shrink-0" />
        )}
        <p className="text-xs font-mono tracking-tight leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 ml-1 cursor-pointer transition-colors"
        >
          <X size={14} />
        </button>
      </motion.div>
    </div>
  );
};
