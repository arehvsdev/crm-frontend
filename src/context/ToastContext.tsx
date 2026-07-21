import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes toast-slide-in {
        from {
          opacity: 0;
          transform: translateY(1rem) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .animate-toast-in {
        animation: toast-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = "bg-slate-900 border-slate-750 text-slate-100 shadow-xl shadow-slate-950/20";
          let iconColor = "text-blue-400";
          let iconPath = (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          );

          if (toast.type === "success") {
            bgColor = "bg-slate-900 border-emerald-500/20 text-slate-100 shadow-xl shadow-emerald-950/10";
            iconColor = "text-emerald-400";
            iconPath = (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            );
          } else if (toast.type === "error") {
            bgColor = "bg-slate-900 border-rose-500/20 text-slate-100 shadow-xl shadow-rose-950/10";
            iconColor = "text-rose-400";
            iconPath = (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            );
          }

          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md animate-toast-in pointer-events-auto max-w-sm ${bgColor}`}
            >
              <svg className={`w-5 h-5 ${iconColor} shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {iconPath}
              </svg>
              <span className="text-sm font-medium leading-relaxed">{toast.message}</span>
              <button 
                onClick={() => removeToast(toast.id)} 
                className="text-slate-400 hover:text-slate-200 transition-colors shrink-0 ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
