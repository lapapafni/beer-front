"use client";

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Toast({
  message,
  actionLabel,
  onAction,
}: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 bg-[#1c1c1c] border border-white/10 px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 animate-slideUp z-50">
      <span className="text-white">{message}</span>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-amber-400 hover:text-amber-300 font-semibold"
        >
          {actionLabel}
        </button>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}