import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ResponsiveProfileCardProps {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  className?: string;
}

const ResponsiveProfileCard: React.FC<ResponsiveProfileCardProps> = ({
  name,
  role,
  email,
  phone,
  avatar,
  bio,
  stats = [],
  actions = [],
  className = ""
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={cn('card-responsive', className)}>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-lg sm:text-xl font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          {/* Informations principales */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {name}
            </h2>
            {role && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                {role}
              </p>
            )}
            {bio && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">
                {bio}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Informations de contact */}
        {(email || phone) && (
          <div className="space-y-2 mb-4 sm:mb-6">
            {email && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="text-gray-900 dark:text-white break-words">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Téléphone:</span>
                <span className="text-gray-900 dark:text-white">{phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Statistiques */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 sm:mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

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

export default ResponsiveProfileCard;
