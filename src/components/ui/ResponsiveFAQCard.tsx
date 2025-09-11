import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string | number;
  question: string;
  answer: string;
  category?: string;
}

interface ResponsiveFAQCardProps {
  title?: string;
  description?: string;
  items: FAQItem[];
  className?: string;
}

const ResponsiveFAQCard: React.FC<ResponsiveFAQCardProps> = ({
  title,
  description,
  items,
  className = ""
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string | number>>(new Set());

  const toggleItem = (id: string | number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const isExpanded = (id: string | number) => expandedItems.has(id);

  return (
    <Card className={cn('card-responsive', className)}>
      {(title || description) && (
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <div>
              {title && (
                <h2 className="text-responsive-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-responsive text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <Button
                variant="ghost"
                className="w-full justify-between p-4 sm:p-6 h-auto text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">
                    {item.question}
                  </h3>
                  {item.category && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.category}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 ml-3">
                  {isExpanded(item.id) ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  )}
                </div>
              </Button>

              {isExpanded(item.id) && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveFAQCard;
