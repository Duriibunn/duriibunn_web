import { useEffect, useState } from 'react';
import type { ToastType } from '../components/Toast';

// Toast manager: central listener + hook + trigger
let toastId = 0;
const toastListeners: Array<(toast: { id: number; message: string; type: ToastType }) => void> = [];

export function useToastManager() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([]);

  useEffect(() => {
    const listener = (toast: { id: number; message: string; type: ToastType }) => {
      setToasts((prev) => [...prev, toast]);
    };
    toastListeners.push(listener);
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) toastListeners.splice(index, 1);
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, removeToast };
}

export function showToastManager(message: string, type: ToastType = 'info') {
  const id = toastId++;
  toastListeners.forEach((listener) => listener({ id, message, type }));
}

// Backwards-compatible named exports used across the codebase
export const useToast = useToastManager;
export const showToast = showToastManager;

export default null;
