import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResponsiveListProps {
  title?: string;
  description?: string;
  items: {
    id: string | number;
    title: string;
    subtitle?: string;
    description?: string;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    onClick?: () => void;
  }[];
  emptyMessage?: string;
  className?: string;
}

const ResponsiveList: React.FC<ResponsiveListProps> = ({
  title,
  description,
  items,
  emptyMessage = "Aucun élément disponible",
  className = ""
}) => {
  if (items.length === 0) {
    return (
      <Card className={`card-responsive ${className}`}>
        {title && (
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-responsive">{title}</CardTitle>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </CardHeader>
        )}
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`card-responsive ${className}`}>
      {title && (
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-responsive">{title}</CardTitle>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <div className="space-y-2 sm:space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${
                item.onClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors' : ''
              }`}
              onClick={item.onClick}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {item.icon && (
                    <div className="flex-shrink-0 mt-1">
                      {item.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {item.subtitle}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {item.actions && (
                  <div className="flex-shrink-0 ml-3">
                    {item.actions}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveList;
