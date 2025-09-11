import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  children?: NavigationItem[];
  active?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

export interface ResponsiveMobileNavigationProps {
  items: NavigationItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  notifications?: number;
  className?: string;
  logo?: React.ReactNode;
  title?: string;
}

const ResponsiveMobileNavigation: React.FC<ResponsiveMobileNavigationProps> = ({
  items,
  user,
  onLogout,
  onSearch,
  notifications = 0,
  className = "",
  logo,
  title = "Menu"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Fermer le menu quand on clique sur un lien
  const handleItemClick = (item: NavigationItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.href) {
      setIsOpen(false);
    }
  };

  // Gérer l'expansion des sous-menus
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Filtrer les éléments selon la recherche
  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    return item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.children?.some(child => 
             child.label.toLowerCase().includes(searchQuery.toLowerCase())
           );
  });

  // Gérer la recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Fermer le menu au changement de route
  useEffect(() => {
    setIsOpen(false);
  }, []);

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = item.active;

    return (
      <div key={item.id}>
        <div
          className={cn(
            'flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
            level > 0 && 'ml-4',
            isActive && 'bg-primary text-primary-foreground',
            !isActive && !item.disabled && 'hover:bg-gray-100 dark:hover:bg-gray-800',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <button
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.id);
              } else {
                handleItemClick(item);
              }
            }}
            disabled={item.disabled}
            className={cn(
              'flex items-center space-x-3 flex-1 text-left',
              level > 0 && 'text-sm'
            )}
          >
            {item.icon && (
              <div className={cn(
                'flex-shrink-0',
                level > 0 ? 'h-4 w-4' : 'h-5 w-5'
              )}>
                {item.icon}
              </div>
            )}
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <Badge 
                variant={isActive ? "secondary" : "default"}
                className="text-xs"
              >
                {item.badge}
              </Badge>
            )}
          </button>
          {hasChildren && (
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          )}
        </div>
        
        {/* Sous-menus */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('lg:hidden', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="left" 
          className="w-80 p-0 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {logo && (
                  <div className="h-8 w-8 flex-shrink-0">
                    {logo}
                  </div>
                )}
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          {onSearch && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredItems.map(item => renderNavigationItem(item))}
          </div>

          {/* User Section */}
          {user && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                  {user.role && (
                    <p className="text-xs text-primary font-medium">
                      {user.role}
                    </p>
                  )}
                </div>
                {notifications > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center">
                    {notifications > 99 ? '99+' : notifications}
                  </Badge>
                )}
              </div>
              
              {onLogout && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ResponsiveMobileNavigation;
