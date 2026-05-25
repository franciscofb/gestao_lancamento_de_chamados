import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
}

interface ToastNotificationProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastNotification({ toasts, onRemove }: ToastNotificationProps) {
  const getColors = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-100 border-emerald-500',
          badgeBg: 'bg-emerald-500 text-white',
          textColor: 'text-emerald-950',
          icon: <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-rose-100 border-rose-500',
          badgeBg: 'bg-rose-600 text-white',
          textColor: 'text-rose-950',
          icon: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-100 border-amber-500',
          badgeBg: 'bg-amber-500 text-zinc-950',
          textColor: 'text-amber-950',
          icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-sky-100 border-sky-500',
          badgeBg: 'bg-sky-500 text-white',
          textColor: 'text-sky-950',
          icon: <Info className="h-5 w-5 text-sky-600 shrink-0" />
        };
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      id="toast-notification-root"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = getColors(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div 
                className={`w-full ${config.bg} border-3 border-zinc-900 px-4 py-3.5 flex items-start gap-3 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] relative overflow-hidden font-sans`}
              >
                {/* Horizontal high-contrast indicator tag */}
                <span className={`absolute top-0 left-0 right-0 h-1.5 ${config.badgeBg.split(' ')[0]}`}></span>
                
                <div className="mt-0.5 shrink-0">
                  {config.icon}
                </div>

                <div className="flex-1 select-none pr-3">
                  {toast.title && (
                    <h4 className="font-black text-xs text-zinc-950 uppercase tracking-wide mb-0.5 font-mono">
                      {toast.title}
                    </h4>
                  )}
                  <p className="text-xs font-bold text-zinc-900 leading-snug">
                    {toast.message}
                  </p>
                </div>

                <button
                  onClick={() => onRemove(toast.id)}
                  className="rounded-none border-2 border-zinc-900 bg-white hover:bg-zinc-100 p-1 text-zinc-900 cursor-pointer transition-all hover:translate-x-[0.5px] hover:translate-y-[0.5px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 self-start"
                  aria-label="Close notification"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
