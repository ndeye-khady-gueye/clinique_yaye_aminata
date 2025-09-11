import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveClientTestimonialCardProps {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  avatar?: string;
  date?: string;
  verified?: boolean;
  featured?: boolean;
  className?: string;
}

const ResponsiveClientTestimonialCard: React.FC<ResponsiveClientTestimonialCardProps> = ({
  name,
  role,
  company,
  content,
  rating,
  avatar,
  date,
  verified = false,
  featured = false,
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
    <Card className={cn(
      'card-responsive hover:shadow-lg transition-shadow',
      featured && 'ring-2 ring-primary',
      className
    )}>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          {/* Avatar */}
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-sm sm:text-base font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          {/* Informations du client */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                {name}
              </h3>
              {verified && (
                <Badge variant="secondary" className="text-xs">
                  Vérifié
                </Badge>
              )}
              {featured && (
                <Badge className="text-xs">
                  Recommandé
                </Badge>
              )}
            </div>
            {(role || company) && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                {role}{role && company && ' • '}{company}
              </p>
            )}
            {date && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {date}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Note */}
        {rating && (
          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <div className="flex items-center space-x-1">
              {renderStars(rating)}
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {rating}/5
            </span>
          </div>
        )}

        {/* Contenu du témoignage */}
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 h-6 w-6 text-gray-300 dark:text-gray-600" />
          <blockquote className="text-sm sm:text-base text-gray-700 dark:text-gray-300 italic leading-relaxed pl-4">
            {content}
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveClientTestimonialCard;
