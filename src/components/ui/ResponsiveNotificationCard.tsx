import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveNotificationCardProps {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  timestamp?: string;
  read?: boolean;
  priority?: 'low' | 'medium' | 'high';
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  onClose?: () => void;
  onMarkAsRead?: () => void;
  className?: string;
}

const ResponsiveNotificationCard: React.FC<ResponsiveNotificationCardProps> = ({
  title,
  message,
  type = 'default',
  timestamp,
  read = false,
  priority = 'medium',
  actions = [],
  onClose,
  onMarkAsRead,
  className = ""
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'info':
        return <Info className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'default':
      default:
        return <Bell className="h-4 w-4 sm:h-5 sm:w-5" />;
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'default':
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card className={cn(
      'card-responsive border-l-4 transition-all duration-200',
      getTypeClasses(),
      !read && 'ring-2 ring-primary/20',
      className
    )}>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Icône */}
            <div className="flex-shrink-0 mt-1">
              {getIcon()}
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                  {title}
                </h3>
                {!read && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                )}
                {priority !== 'medium' && (
                  <Badge variant={getPriorityColor()} className="text-xs">
                    {priority === 'high' ? 'Urgent' : priority === 'low' ? 'Faible' : 'Normal'}
                  </Badge>
                )}
              </div>
              {timestamp && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {timestamp}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 ml-2">
            {!read && onMarkAsRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAsRead}
                className="h-6 w-6 p-0"
                title="Marquer comme lu"
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
                title="Fermer"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Message */}
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 break-words">
          {message}
        </p>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                onClick={action.onClick}
                className="w-full sm:w-auto"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsiveNotificationCard;
