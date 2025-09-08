import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoreVertical, Edit, Trash2, Eye, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

interface ResponsiveContextMenuProps {
  items: ContextMenuItem[];
  trigger?: React.ReactNode;
  className?: string;
}

const ResponsiveContextMenu: React.FC<ResponsiveContextMenuProps> = ({
  items,
  trigger,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.bottom + 8
      });
    }
    
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const getDefaultIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('modifier') || lowerLabel.includes('edit')) return <Edit className="h-4 w-4" />;
    if (lowerLabel.includes('supprimer') || lowerLabel.includes('delete')) return <Trash2 className="h-4 w-4" />;
    if (lowerLabel.includes('voir') || lowerLabel.includes('view')) return <Eye className="h-4 w-4" />;
    if (lowerLabel.includes('copier') || lowerLabel.includes('copy')) return <Copy className="h-4 w-4" />;
    return <MoreVertical className="h-4 w-4" />;
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="sm"
        onClick={handleTriggerClick}
        className="h-8 w-8 p-0"
      >
        {trigger || <MoreVertical className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[200px] sm:min-w-[240px]"
          style={{
            left: Math.min(position.x, window.innerWidth - 200),
            top: Math.min(position.y, window.innerHeight - 200)
          }}
        >
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
            <CardContent className="p-2">
              <div className="space-y-1">
                {items.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={cn(
                      'w-full justify-start text-left h-8 sm:h-10 px-3',
                      item.variant === 'destructive' && 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20',
                      item.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <span className="mr-3 flex-shrink-0">
                      {item.icon || getDefaultIcon(item.label)}
                    </span>
                    <span className="truncate text-xs sm:text-sm">{item.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResponsiveContextMenu;
