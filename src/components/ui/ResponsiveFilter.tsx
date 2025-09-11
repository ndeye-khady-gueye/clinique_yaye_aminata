import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  CalendarIcon, 
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'daterange' | 'number' | 'boolean';
  options?: FilterOption[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  responsive?: {
    cols?: number;
    order?: number;
  };
}

export interface ResponsiveFilterProps {
  title?: string;
  fields: FilterField[];
  onFilter: (filters: Record<string, any>) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  showSearchButton?: boolean;
  searchLabel?: string;
  clearLabel?: string;
  loading?: boolean;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  showActiveFilters?: boolean;
}

const ResponsiveFilter: React.FC<ResponsiveFilterProps> = ({
  title = "Filtres",
  fields,
  onFilter,
  onClear,
  showClearButton = true,
  showSearchButton = true,
  searchLabel = "Filtrer",
  clearLabel = "Effacer",
  loading = false,
  className = "",
  collapsible = false,
  defaultOpen = true,
  showActiveFilters = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [dateRanges, setDateRanges] = useState<Record<string, { from?: Date; to?: Date }>>({});

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (key: string, range: { from?: Date; to?: Date }) => {
    setDateRanges(prev => ({
      ...prev,
      [key]: range
    }));
    setFilters(prev => ({
      ...prev,
      [key]: range
    }));
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setDateRanges({});
    if (onClear) {
      onClear();
    } else {
      onFilter({});
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== undefined && v !== null);
      }
      return value !== undefined && value !== null && value !== '';
    }).length;
  };

  const renderField = (field: FilterField) => {
    const fieldValue = filters[field.key];
    const fieldClasses = cn(
      'space-y-2',
      field.responsive?.cols && `col-span-${field.responsive.cols}`,
      field.responsive?.order && `order-${field.responsive.order}`
    );

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.key} className={fieldClasses}>
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={fieldValue || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              className="w-full"
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.key} className={fieldClasses}>
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </Label>
            <Select
              value={fieldValue || ''}
              onValueChange={(value) => handleFilterChange(field.key, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={field.placeholder || `Sélectionner ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {option.count}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.key} className={fieldClasses}>
            <Label className="text-sm font-medium">
              {field.label}
            </Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.key}-${option.value}`}
                    checked={Array.isArray(fieldValue) ? fieldValue.includes(option.value) : false}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
                      if (checked) {
                        handleFilterChange(field.key, [...currentValues, option.value]);
                      } else {
                        handleFilterChange(field.key, currentValues.filter(v => v !== option.value));
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`${field.key}-${option.value}`} 
                    className="text-sm flex-1 flex items-center justify-between"
                  >
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        {option.count}
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.key} className={fieldClasses}>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.key}
                checked={fieldValue || false}
                onCheckedChange={(checked) => handleFilterChange(field.key, checked)}
              />
              <Label htmlFor={field.key} className="text-sm font-medium">
                {field.label}
              </Label>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div key={field.key} className={fieldClasses}>
            <Label className="text-sm font-medium">
              {field.label}
            </Label>
            <RadioGroup
              value={fieldValue || ''}
              onValueChange={(value) => handleFilterChange(field.key, value)}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.key}-${option.value}`} />
                  <Label htmlFor={`${field.key}-${option.value}`} className="text-sm flex-1 flex items-center justify-between">
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        {option.count}
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'date':
        return (
          <div key={field.key} className={fieldClasses}>
            <Label className="text-sm font-medium">
              {field.label}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fieldValue ? format(new Date(fieldValue), "PPP", { locale: fr }) : field.placeholder || "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fieldValue ? new Date(fieldValue) : undefined}
                  onSelect={(date) => handleFilterChange(field.key, date ? date.toISOString().split('T')[0] : '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'daterange':
        const dateRange = dateRanges[field.key] || {};
        return (
          <div key={field.key} className={fieldClasses}>
            <Label className="text-sm font-medium">
              {field.label}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "dd/MM/yyyy", { locale: fr })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: fr })}`
                    : field.placeholder || "Sélectionner une période"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => handleDateRangeChange(field.key, range || {})}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'boolean':
        return (
          <div key={field.key} className={fieldClasses}>
            <Label className="text-sm font-medium">
              {field.label}
            </Label>
            <RadioGroup
              value={fieldValue || ''}
              onValueChange={(value) => handleFilterChange(field.key, value === 'true')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${field.key}-true`} />
                <Label htmlFor={`${field.key}-true`} className="text-sm">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${field.key}-false`} />
                <Label htmlFor={`${field.key}-false`} className="text-sm">Non</Label>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={cn('card-responsive', className)}>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {showActiveFilters && activeFiltersCount > 0 && (
              <Badge variant="default" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8 p-0"
            >
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-6">
            {/* Champs de filtre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map(renderField)}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              {showClearButton && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  disabled={loading || activeFiltersCount === 0}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {clearLabel}
                </Button>
              )}
              {showSearchButton && (
                <Button
                  onClick={handleApplyFilters}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {searchLabel}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ResponsiveFilter;