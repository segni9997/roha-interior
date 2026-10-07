import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss?: (id: string) => void;
  onClose?: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss, onClose }) => {
  const handleDismiss = (id: string) => {
    if (onDismiss) onDismiss(id);
    if (onClose) onClose(id);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 bg-[#132527]/95 text-white ${
              toast.type === 'success'
                ? 'border-emerald-500/40 border-l-4 border-l-emerald-400'
                : toast.type === 'error'
                ? 'border-rose-500/40 border-l-4 border-l-rose-500'
                : 'border-cyan-500/40 border-l-4 border-l-cyan-400'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
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
        className={`p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 bg-[#132527]/95 text-white max-w-md ${
          isSuccess
            ? 'border-emerald-500/40 border-l-4 border-l-emerald-400'
            : 'border-rose-500/40 border-l-4 border-l-rose-500'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle size={18} className="text-rose-400 shrink-0" />
        )}
        <p className="text-xs font-medium tracking-tight text-white leading-relaxed flex-1">
          {message}
        </p>
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
