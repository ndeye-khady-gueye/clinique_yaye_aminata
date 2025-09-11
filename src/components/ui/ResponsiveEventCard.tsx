import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveEventCardProps {
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  attendees?: number;
  maxAttendees?: number;
  image?: string;
  category?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  price?: string | number;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  className?: string;
}

const ResponsiveEventCard: React.FC<ResponsiveEventCardProps> = ({
  title,
  description,
  date,
  time,
  location,
  attendees,
  maxAttendees,
  image,
  category,
  status = 'upcoming',
  price,
  actions = [],
  className = ""
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'upcoming':
        return 'À venir';
      case 'ongoing':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
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
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {category && (
              <Badge className="text-xs">
                {category}
              </Badge>
            )}
            <Badge className={cn('text-xs', getStatusColor())}>
              {getStatusLabel()}
            </Badge>
          </div>
          {price && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="text-xs">
                {typeof price === 'number' ? `${price} CFA` : price}
              </Badge>
            </div>
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
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{date}</span>
              {time && (
                <>
                  <span>•</span>
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{time}</span>
                </>
              )}
            </div>
            {location && (
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{location}</span>
              </div>
            )}
            {attendees !== undefined && (
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>
                  {attendees}
                  {maxAttendees && ` / ${maxAttendees}`} participants
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {description}
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

export default ResponsiveEventCard;
