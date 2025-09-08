import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  title,
  description,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
  hover = false,
  clickable = false,
  onClick
}) => {
  return (
    <Card
      className={cn(
        'card-responsive',
        hover && 'hover:shadow-lg transition-shadow duration-200',
        clickable && 'cursor-pointer hover:scale-105 transition-transform duration-200',
        className
      )}
      onClick={onClick}
    >
      {(title || description) && (
        <CardHeader className={cn('p-4 sm:p-6', headerClassName)}>
          {title && (
            <CardTitle className="text-responsive">{title}</CardTitle>
          )}
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={cn('p-4 sm:p-6', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default ResponsiveCard;
