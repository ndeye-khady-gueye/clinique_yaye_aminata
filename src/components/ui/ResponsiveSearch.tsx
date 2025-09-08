import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showFilters?: boolean;
  onFilterClick?: () => void;
  className?: string;
  debounceMs?: number;
}

const ResponsiveSearch: React.FC<ResponsiveSearchProps> = ({
  placeholder = "Rechercher...",
  value,
  onChange,
  onSearch,
  onClear,
  showFilters = false,
  onFilterClick,
  className = "",
  debounceMs = 300
}) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  useEffect(() => {
    if (onSearch && debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    if (onClear) {
      onClear();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-20 input-responsive"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {showFilters && onFilterClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFilterClick}
              className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Filter className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveSearch;
