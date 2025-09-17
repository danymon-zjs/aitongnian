import React, { useState, useEffect, createContext, useContext } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast组件
const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-400';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-400';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-400';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md border shadow-lg z-50 transform transition-all duration-300 ease-in-out opacity-100 translate-y-0 ${getTypeStyles()}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{getIcon()}</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

// ToastProvider组件
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning'; duration: number }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const success = (message: string, duration: number = 3000) => {
    showToast(message, 'success', duration);
  };

  const error = (message: string, duration: number = 5000) => {
    showToast(message, 'error', duration);
  };

  const info = (message: string, duration: number = 3000) => {
    showToast(message, 'info', duration);
  };

  const warning = (message: string, duration: number = 4000) => {
    showToast(message, 'warning', duration);
  };

  const contextValue: ToastContextType = {
    showToast,
    success,
    error,
    info,
    warning
  };

  // 设置全局toast实例
  React.useEffect(() => {
    setGlobalToastInstance(contextValue);
  }, [contextValue]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        />
      ))}
    </ToastContext.Provider>
  );
};

// 自定义Hook
const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// 创建一个全局的toast实例，避免在组件外部使用useContext
let globalToastInstance: ToastContextType | null = null;

// 设置全局toast实例的函数
export const setGlobalToastInstance = (instance: ToastContextType) => {
  globalToastInstance = instance;
};

// 导出toast对象，保持与原代码的兼容性
const toast = {
  success: (message: string, duration?: number) => {
    if (globalToastInstance) {
      globalToastInstance.success(message, duration);
    } else {
      console.warn('Toast not initialized. Make sure ToastProvider is properly set up.');
    }
  },
  error: (message: string, duration?: number) => {
    if (globalToastInstance) {
      globalToastInstance.error(message, duration);
    } else {
      console.warn('Toast not initialized. Make sure ToastProvider is properly set up.');
    }
  },
  info: (message: string, duration?: number) => {
    if (globalToastInstance) {
      globalToastInstance.info(message, duration);
    } else {
      console.warn('Toast not initialized. Make sure ToastProvider is properly set up.');
    }
  },
  warning: (message: string, duration?: number) => {
    if (globalToastInstance) {
      globalToastInstance.warning(message, duration);
    } else {
      console.warn('Toast not initialized. Make sure ToastProvider is properly set up.');
    }
  }
};

export { ToastProvider, useToast, toast };
export default Toast;