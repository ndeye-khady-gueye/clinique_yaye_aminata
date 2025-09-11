import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface ResponsiveComparisonCardProps {
  title: string;
  description?: string;
  price?: string | number;
  period?: string;
  features: ComparisonFeature[];
  recommended?: boolean;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  className?: string;
}

const ResponsiveComparisonCard: React.FC<ResponsiveComparisonCardProps> = ({
  title,
  description,
  price,
  period,
  features,
  recommended = false,
  badge,
  badgeVariant = 'default',
  actions = [],
  className = ""
}) => {
  return (
    <Card className={cn(
      'card-responsive hover:shadow-lg transition-shadow',
      recommended && 'ring-2 ring-primary',
      className
    )}>
      <CardHeader className="p-4 sm:p-6">
        <div className="space-y-3">
          {/* En-tête avec badge */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
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

          {/* Prix */}
          {price && (
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {typeof price === 'number' ? `${price} CFA` : price}
              </div>
              {period && (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {period}
                </p>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Fonctionnalités */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {feature.included ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-xs sm:text-sm font-medium',
                  feature.included
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                )}>
                  {feature.name}
                </p>
                {feature.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {feature.description}
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

export default ResponsiveComparisonCard;
