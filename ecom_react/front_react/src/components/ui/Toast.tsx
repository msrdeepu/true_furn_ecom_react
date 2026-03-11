import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const backgrounds = {
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  return (
    <div
      className={`custom-toast ${isVisible ? 'fade-in' : 'fade-out'}`}
      style={{
        background: backgrounds[type],
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '10px',
        pointerEvents: 'auto',
        fontSize: '0.95rem',
        fontWeight: 500,
        minWidth: '280px',
        zIndex: 9999,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
        {icons[type]}
      </span>
      <span>{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          marginLeft: 'auto',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: '#fff',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          close
        </span>
      </button>
      <style>{`
        .custom-toast.fade-in {
          animation: toast-in 0.3s ease-out forwards;
        }
        .custom-toast.fade-out {
          animation: toast-out 0.3s ease-in forwards;
        }
        @keyframes toast-in {
          from { transform: translateY(20px); opacity: 0; scale: 0.95; }
          to { transform: translateY(0); opacity: 1; scale: 1; }
        }
        @keyframes toast-out {
          from { transform: translateY(0); opacity: 1; scale: 1; }
          to { transform: translateY(-20px); opacity: 0; scale: 0.95; }
        }
      `}</style>
    </div>
  );
};
