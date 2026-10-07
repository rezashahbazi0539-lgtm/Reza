'use client';

import { useStore } from '../StoreContext';
import { CheckCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-slide-up">
      <div className="bg-white shadow-lg border border-gray-100 px-5 py-3 flex items-center gap-3 max-w-sm">
        {toast.type === 'success' && <CheckCircle size={20} className="text-green-500" />}
        {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
        {toast.type === 'error' && <X size={20} className="text-red-500" />}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
}
