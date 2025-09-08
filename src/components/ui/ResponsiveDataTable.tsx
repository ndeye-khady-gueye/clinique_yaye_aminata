import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Search, 
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  responsive?: 'always' | 'sm' | 'md' | 'lg' | 'xl' | 'never';
}

export interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  exportable?: boolean;
  onRowClick?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onView?: (record: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

function ResponsiveDataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = true,
  sortable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  exportable = false,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  loading = false,
  emptyMessage = "Aucune donnée disponible",
  className = ""
}: ResponsiveDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filtrage des données
  const filteredData = useMemo(() => {
    let filtered = data;

    // Recherche globale
    if (searchTerm) {
      filtered = filtered.filter(record =>
        Object.values(record).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filtres par colonne
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(record =>
          String(record[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    return filtered;
  }, [data, searchTerm, filters]);

  // Tri des données
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Gestion du tri
  const handleSort = (field: keyof T) => {
    if (!sortable) return;

    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Gestion des filtres
  const handleFilter = (field: keyof T, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field as string]: value
    }));
  };

  // Rendu des colonnes visibles selon la taille d'écran
  const getVisibleColumns = () => {
    return columns.filter(col => {
      if (col.responsive === 'never') return false;
      if (col.responsive === 'always') return true;
      // Pour simplifier, on affiche toutes les colonnes sur mobile
      // Dans une vraie implémentation, on utiliserait useMediaQuery
      return true;
    });
  };

  const visibleColumns = getVisibleColumns();

  if (loading) {
    return (
      <Card className={cn('card-responsive', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('card-responsive', className)}>
      {(title || searchable || exportable) && (
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {title && (
              <CardTitle className="text-lg sm:text-xl font-semibold">
                {title}
              </CardTitle>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              )}
              {exportable && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        {/* Version mobile - Cards */}
        <div className="block sm:hidden">
          {paginatedData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {emptyMessage}
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {paginatedData.map((record, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onRowClick?.(record)}
                >
                  {visibleColumns.map((column) => (
                    <div key={String(column.key)} className="flex justify-between items-start">
                      <span className="font-medium text-sm text-gray-600 dark:text-gray-400">
                        {column.title}:
                      </span>
                      <div className="text-right flex-1 ml-2">
                        {column.render 
                          ? column.render(record[column.key], record)
                          : String(record[column.key] || '-')
                        }
                      </div>
                    </div>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <div className="flex justify-end space-x-2 pt-2 border-t">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(record);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(record);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(record);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Version desktop - Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable && sortField === column.key && (
                        <span className="text-primary">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    {column.filterable && (
                      <Input
                        placeholder={`Filtrer ${column.title}`}
                        value={filters[String(column.key)] || ''}
                        onChange={(e) => handleFilter(column.key, e.target.value)}
                        className="mt-1 h-8 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={visibleColumns.length + (onEdit || onDelete || onView ? 1 : 0)}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((record, index) => (
                  <tr
                    key={index}
                    className={cn(
                      'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(record)}
                  >
                    {visibleColumns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          'px-4 py-4 text-sm text-gray-900 dark:text-gray-100',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.render 
                          ? column.render(record[column.key], record)
                          : String(record[column.key] || '-')
                        }
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="px-4 py-4 text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(record);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(record);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(record);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="px-4 py-3 sm:px-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Affichage de {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, filteredData.length)} sur {filteredData.length} résultats
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResponsiveDataTable;
