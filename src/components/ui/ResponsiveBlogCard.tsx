import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveBlogCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime?: string;
  views?: number;
  image?: string;
  category?: string;
  tags?: string[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  className?: string;
}

const ResponsiveBlogCard: React.FC<ResponsiveBlogCardProps> = ({
  title,
  excerpt,
  author,
  date,
  readTime,
  views,
  image,
  category,
  tags = [],
  actions = [],
  className = ""
}) => {
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
          {category && (
            <Badge className="absolute top-3 left-3">
              {category}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="p-4 sm:p-6">
        <div className="space-y-3">
          {/* Titre */}
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
            {title}
          </h3>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{date}</span>
            </div>
            {readTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{readTime}</span>
              </div>
            )}
            {views && (
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{views} vues</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Extrait */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {excerpt}
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

export default ResponsiveBlogCard;
