import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Bell,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read?: boolean;
  persistent?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }[];
}

export interface ResponsiveNotificationProps {
  notifications: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onRemove?: (id: string) => void;
  onRemoveAll?: () => void;
  maxNotifications?: number;
  showBadge?: boolean;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const ResponsiveNotification: React.FC<ResponsiveNotificationProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onRemoveAll,
  maxNotifications = 5,
  showBadge = true,
  showSettings = false,
  onSettingsClick,
  className = "",
  position = 'top-right',
  autoClose = false,
  autoCloseDelay = 5000
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Gérer l'affichage des notifications
  useEffect(() => {
    const unreadNotifications = notifications
      .filter(n => !n.read)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, maxNotifications);
    
    setVisibleNotifications(unreadNotifications);
  }, [notifications, maxNotifications]);

  // Auto-fermeture des notifications
  useEffect(() => {
    if (!autoClose) return;

    const timers = visibleNotifications.map(notification => {
      if (!notification.persistent) {
        return setTimeout(() => {
          onRemove?.(notification.id);
        }, autoCloseDelay);
      }
      return null;
    });

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer));
    };
  }, [visibleNotifications, autoClose, autoCloseDelay, onRemove]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getTypeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeClasses = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
    }
  };

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id);
  };

  const handleRemove = (id: string) => {
    onRemove?.(id);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.();
  };

  const handleRemoveAll = () => {
    onRemoveAll?.();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={cn('fixed z-50 max-w-sm w-full', getPositionClasses(), className)}>
      <div className="space-y-2">
        {/* Header avec badge et actions */}
        {showBadge && (
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Notifications
              </span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {showSettings && onSettingsClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSettingsClick}
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-8 w-8 p-0 text-xs"
                >
                  Tout marquer comme lu
                </Button>
              )}
              {onRemoveAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAll}
                  className="h-8 w-8 p-0 text-xs text-red-600 hover:text-red-700"
                >
                  Tout supprimer
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Liste des notifications */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {visibleNotifications.map((notification) => (
            <Alert
              key={notification.id}
              className={cn(
                'relative shadow-lg border-l-4',
                getTypeClasses(notification.type),
                !notification.read && 'ring-2 ring-primary/20'
              )}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getTypeIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {notification.timestamp.toLocaleString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="h-6 w-6 p-0 text-xs"
                        >
                          Marquer comme lu
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(notification.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {notification.actions && notification.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {notification.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant || 'outline'}
                          size="sm"
                          onClick={action.onClick}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveNotification;