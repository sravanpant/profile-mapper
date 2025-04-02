import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info
};

const colorMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500'
};

export function Notification({
  message,
  type = 'info',
  duration = 3000,
  onClose
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = iconMap[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`
          fixed 
          bottom-4 
          right-4 
          z-50 
          flex 
          items-center 
          p-4 
          rounded-lg 
          shadow-lg 
          text-white 
          ${colorMap[type]}
        `}
      >
        <Icon className="mr-2" />
        <span>{message}</span>
        <button 
          onClick={() => setIsVisible(false)} 
          className="ml-4 hover:opacity-75"
        >
          <X size={20} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// Notification Manager Hook
export function useNotification() {
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  const showNotification = (options: NotificationProps) => {
    setNotification(options);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return { 
    notification, 
    showNotification, 
    hideNotification 
  };
}