import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface MobileNavigationProps {
  items: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    active?: boolean;
  }[];
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={`lg:hidden ${className}`}>
      {/* Bouton menu */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="p-2"
        aria-label="Menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Menu mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleMenu}
          />
          
          {/* Menu */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMenu}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation items */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index}>
                      <Button
                        variant={item.active ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          item.active
                            ? 'bg-primary text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          if (item.onClick) {
                            item.onClick();
                          }
                          setIsOpen(false);
                        }}
                      >
                        {item.icon && (
                          <span className="mr-3 flex-shrink-0">
                            {item.icon}
                          </span>
                        )}
                        <span className="truncate">{item.label}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
