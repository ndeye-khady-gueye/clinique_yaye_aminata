import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ResponsiveProductCardProps {
  title: string;
  description?: string;
  price?: string | number;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  className?: string;
}

const ResponsiveProductCard: React.FC<ResponsiveProductCardProps> = ({
  title,
  description,
  price,
  image,
  category,
  rating,
  reviews,
  badge,
  badgeVariant = 'default',
  actions = [],
  className = ""
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">☆</span>
      );
    }

    return stars;
  };

  return (
    <Card className={cn('card-responsive hover:shadow-lg transition-shadow', className)}>
      {/* Image */}
      {image && (
        <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {badge && (
            <Badge
              variant={badgeVariant}
              className="absolute top-2 right-2"
            >
              {badge}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="p-4 sm:p-6">
        <div className="space-y-2">
          {/* Catégorie */}
          {category && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {category}
            </p>
          )}

          {/* Titre */}
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {description}
            </p>
          )}

          {/* Note et avis */}
          {rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(rating)}
              </div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {rating}
                {reviews && ` (${reviews} avis)`}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Prix */}
        {price && (
          <div className="mb-4">
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {typeof price === 'number' ? `${price} CFA` : price}
            </span>
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

export default ResponsiveProductCard;
