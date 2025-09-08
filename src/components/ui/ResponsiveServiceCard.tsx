import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ResponsiveServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  price?: string | number;
  duration?: string;
  features?: string[];
  category?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  className?: string;
}

const ResponsiveServiceCard: React.FC<ResponsiveServiceCardProps> = ({
  title,
  description,
  icon,
  price,
  duration,
  features = [],
  category,
  badge,
  badgeVariant = 'default',
  actions = [],
  className = ""
}) => {
  return (
    <Card className={cn('card-responsive hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="p-4 sm:p-6">
        <div className="space-y-3">
          {/* En-tête avec icône et badge */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div>
                {category && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {category}
                  </p>
                )}
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
            </div>
            {badge && (
              <Badge
                variant={badgeVariant}
                className="flex-shrink-0"
              >
                {badge}
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {description}
          </p>

          {/* Prix et durée */}
          <div className="flex items-center justify-between text-sm">
            {price && (
              <span className="font-semibold text-gray-900 dark:text-white">
                {typeof price === 'number' ? `${price} CFA` : price}
              </span>
            )}
            {duration && (
              <span className="text-gray-500 dark:text-gray-400">
                {duration}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Fonctionnalités */}
        {features.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2">
              Fonctionnalités incluses:
            </h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
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

export default ResponsiveServiceCard;
