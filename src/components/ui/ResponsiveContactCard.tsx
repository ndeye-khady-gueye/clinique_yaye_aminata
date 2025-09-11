import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactInfo {
  type: 'phone' | 'email' | 'address' | 'hours' | 'website' | 'message';
  label: string;
  value: string;
  href?: string;
}

interface ResponsiveContactCardProps {
  title: string;
  description?: string;
  contactInfo: ContactInfo[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  className?: string;
}

const ResponsiveContactCard: React.FC<ResponsiveContactCardProps> = ({
  title,
  description,
  contactInfo,
  actions = [],
  className = ""
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Phone className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'email':
        return <Mail className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'address':
        return <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'hours':
        return <Clock className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'website':
        return <Globe className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />;
      default:
        return <Phone className="h-4 w-4 sm:h-5 sm:w-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'phone':
        return 'text-green-600 dark:text-green-400';
      case 'email':
        return 'text-blue-600 dark:text-blue-400';
      case 'address':
        return 'text-red-600 dark:text-red-400';
      case 'hours':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'website':
        return 'text-purple-600 dark:text-purple-400';
      case 'message':
        return 'text-indigo-600 dark:text-indigo-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className={cn('card-responsive hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="p-4 sm:p-6">
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Informations de contact */}
        <div className="space-y-4 mb-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={cn('flex-shrink-0 mt-1', getIconColor(info.type))}>
                {getIcon(info.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {info.label}
                </p>
                {info.href ? (
                  <a
                    href={info.href}
                    className="text-xs sm:text-sm text-primary hover:text-primary/80 break-words"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                    {info.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

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

export default ResponsiveContactCard;
