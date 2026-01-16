import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { cn } from './UI';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000); // Auto dismiss after 4s
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      className={cn(
        "pointer-events-auto min-w-[320px] max-w-[420px] p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start gap-4",
        toast.type === 'success'
          ? "bg-brand/10 border-brand/20 text-white"
          : "bg-red-500/10 border-red-500/20 text-white"
      )}
    >
      <div className={cn(
        "p-2 rounded-full shrink-0",
        toast.type === 'success' ? "bg-brand text-black" : "bg-red-500 text-white"
      )}>
        {toast.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      </div>

      <div className="flex-1 pt-0.5">
        <h4 className={cn("font-bold text-sm", toast.type === 'success' ? "text-brand" : "text-red-400")}>
          {toast.title}
        </h4>
        {toast.message && <p className="text-xs text-white/60 mt-1 leading-relaxed">{toast.message}</p>}
      </div>

      <button onClick={onDismiss} className="text-white/20 hover:text-white transition-colors">
        <X size={14} />
      </button>

      {/* Progress Bar (Optional Visual Flair) */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className={cn(
          "absolute bottom-0 left-0 h-[2px]",
          toast.type === 'success' ? "bg-brand/50" : "bg-red-500/50"
        )}
      />
    </motion.div>
  );
};
