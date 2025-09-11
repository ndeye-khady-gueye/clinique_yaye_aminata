import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  LogOut, 
  ChevronRight,
  Home,
  Calendar,
  Users,
  FileText,
  Settings,
  Phone,
  Shield,
  Building,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  onClick?: () => void;
  children?: NavigationItem[];
  badge?: string | number;
  isActive?: boolean;
}

interface EnhancedMobileNavigationProps {
  items: NavigationItem[];
  user?: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  onLogout: () => void;
  onNavigate: (path: string) => void;
  onSearch?: (query: string) => void;
  notifications?: number;
  className?: string;
}

const EnhancedMobileNavigation: React.FC<EnhancedMobileNavigationProps> = ({
  items,
  user,
  onLogout,
  onNavigate,
  onSearch,
  notifications = 0,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Fermer le menu au changement de route
  useEffect(() => {
    setIsOpen(false);
  }, []);

  const handleItemClick = (item: NavigationItem) => {
    if (item.path) {
      onNavigate(item.path);
    }
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

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

  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    return item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.children?.some(child => 
             child.label.toLowerCase().includes(searchQuery.toLowerCase())
           );
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const indentClass = level > 0 ? `ml-${level * 4}` : '';

    return (
      <div key={item.id} className={cn("w-full", indentClass)}>
        <div className="flex items-center">
          <Button
            variant={item.isActive ? "default" : "ghost"}
            className={cn(
              "w-full justify-start text-left h-auto p-3 rounded-lg transition-all duration-200",
              item.isActive 
                ? "bg-gradient-clinic text-white shadow-md" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
              level > 0 && "text-sm"
            )}
            onClick={() => hasChildren ? toggleExpanded(item.id) : handleItemClick(item)}
          >
            <div className="flex items-center w-full">
              <span className={cn(
                "flex-shrink-0 mr-3",
                level > 0 ? "h-4 w-4" : "h-5 w-5"
              )}>
                {item.icon}
              </span>
              <span className="flex-1 truncate text-sm sm:text-base">
                {item.label}
              </span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 text-xs px-2 py-1"
                >
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 ml-2 transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                />
              )}
            </div>
          </Button>
        </div>
        
        {/* Sous-menus */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1 ml-4">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("lg:hidden", className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 relative"
          >
            <Menu className="h-5 w-5" />
            {notifications > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                variant="destructive"
              >
                {notifications > 9 ? '9+' : notifications}
              </Badge>
            )}
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="left" 
          className="w-80 sm:w-96 p-0 flex flex-col bg-white dark:bg-gray-800"
        >
          {/* Header avec infos utilisateur */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-clinic flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Menu
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Navigation
                  </p>
                </div>
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

            {/* Infos utilisateur */}
            {user && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-clinic flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Barre de recherche */}
          {onSearch && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans le menu..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>
            </div>
          )}

          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun résultat trouvé</p>
                </div>
              ) : (
                filteredItems.map(item => renderNavigationItem(item))
              )}
            </nav>
          </div>

          {/* Footer avec déconnexion */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Déconnexion
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EnhancedMobileNavigation;

