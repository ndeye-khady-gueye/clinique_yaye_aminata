import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveCarouselProps {
  items: React.ReactNode[];
  title?: string;
  description?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const ResponsiveCarousel: React.FC<ResponsiveCarouselProps> = ({
  items,
  title,
  description,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const intervalRef = useRef<NodeJS.Timeout>();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isAutoPlaying && items.length > 1) {
      intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, autoPlayInterval, items.length]);

  const handleMouseEnter = () => {
    if (autoPlay) {
      setIsAutoPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsAutoPlaying(true);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className={cn('relative', className)}>
      {(title || description) && (
        <div className="mb-4 sm:mb-6">
          {title && (
            <h2 className="text-responsive-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-responsive text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <div
        className="relative overflow-hidden rounded-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Conteneur des slides */}
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Card className="h-full">
                <CardContent className="p-4 sm:p-6">
                  {item}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Flèches de navigation */}
        {showArrows && items.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Indicateurs de pagination */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex
                  ? 'bg-primary'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsiveCarousel;
