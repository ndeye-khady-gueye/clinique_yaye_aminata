import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResponsivePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const ResponsivePagination: React.FC<ResponsivePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 20, 50, 100],
  showInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = "",
  size = 'md',
  variant = 'outline'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'h-8 w-8 text-xs',
          text: 'text-xs',
          select: 'h-8 text-xs'
        };
      case 'md':
        return {
          button: 'h-9 w-9 text-sm',
          text: 'text-sm',
          select: 'h-9 text-sm'
        };
      case 'lg':
        return {
          button: 'h-10 w-10 text-base',
          text: 'text-base',
          select: 'h-10 text-base'
        };
      default:
        return {
          button: 'h-9 w-9 text-sm',
          text: 'text-sm',
          select: 'h-9 text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  // Calculer les pages visibles
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    
    // Première page
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Pages du milieu
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Dernière page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)}>
      {/* Informations */}
      {showInfo && (
        <div className={cn('text-gray-700 dark:text-gray-300', sizeClasses.text)}>
          Affichage de {startItem} à {endItem} sur {totalItems} résultats
        </div>
      )}

      {/* Contrôles de pagination */}
      <div className="flex items-center space-x-2">
        {/* Sélection du nombre d'éléments par page */}
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center space-x-2">
            <span className={cn('text-gray-700 dark:text-gray-300', sizeClasses.text)}>
              Afficher:
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className={cn('w-20', sizeClasses.select)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Boutons de pagination */}
        <div className="flex items-center space-x-1">
          {/* Premier page */}
          {showFirstLast && (
            <Button
              variant={variant}
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={cn(sizeClasses.button)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Page précédente */}
          <Button
            variant={variant}
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(sizeClasses.button)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Pages numérotées */}
          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <div className={cn('px-2 py-1', sizeClasses.text)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                ) : (
                  <Button
                    variant={page === currentPage ? 'default' : variant}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    className={cn(
                      sizeClasses.button,
                      page === currentPage && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Page suivante */}
          <Button
            variant={variant}
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(sizeClasses.button)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dernière page */}
          {showFirstLast && (
            <Button
              variant={variant}
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={cn(sizeClasses.button)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsivePagination;