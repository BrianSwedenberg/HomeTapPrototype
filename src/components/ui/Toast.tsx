import { useState, useEffect, useCallback } from 'react';

export type ToastVariant = 'default' | 'success' | 'error';

interface ToastState {
  message: string;
  variant: ToastVariant;
  visible: boolean;
  id: number;
}

let _showToast: ((message: string, variant?: ToastVariant) => void) | null = null;

export function showToast(message: string, variant: ToastVariant = 'default') {
  _showToast?.(message, variant);
}

export function Toast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const show = useCallback((message: string, variant: ToastVariant = 'default') => {
    setToast({ message, variant, visible: true, id: Date.now() });
  }, []);

  useEffect(() => {
    _showToast = show;
    return () => { _showToast = null; };
  }, [show]);

  useEffect(() => {
    if (!toast?.visible) return;
    const timer = setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast?.id]);

  if (!toast) return null;

  const bg =
    toast.variant === 'success' ? '#2E7D32' :
    toast.variant === 'error'   ? '#C62828' :
    '#1A1A2E';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 300,
        backgroundColor: bg,
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        transition: 'opacity 300ms ease, transform 300ms ease',
        opacity: toast.visible ? 1 : 0,
        transform: toast.visible ? 'translateY(0)' : 'translateY(8px)',
        pointerEvents: toast.visible ? 'auto' : 'none',
      }}
    >
      {toast.message}
    </div>
  );
}
