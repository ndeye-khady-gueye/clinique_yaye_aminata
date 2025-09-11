import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'switch' | 'date' | 'time' | 'datetime-local';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
  responsive?: {
    cols?: number;
    order?: number;
  };
}

export interface ResponsiveFormProps {
  title?: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  className?: string;
  gridCols?: 1 | 2 | 3 | 4;
}

const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  title,
  description,
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  loading = false,
  className = "",
  gridCols = 2
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [dateOpen, setDateOpen] = React.useState<Record<string, boolean>>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} est requis`;
    }

    if (field.validation) {
      const { min, max, minLength, maxLength, pattern, message } = field.validation;
      
      if (min !== undefined && value < min) {
        return message || `${field.label} doit être au moins ${min}`;
      }
      
      if (max !== undefined && value > max) {
        return message || `${field.label} doit être au maximum ${max}`;
      }
      
      if (minLength !== undefined && String(value).length < minLength) {
        return message || `${field.label} doit contenir au moins ${minLength} caractères`;
      }
      
      if (maxLength !== undefined && String(value).length > maxLength) {
        return message || `${field.label} doit contenir au maximum ${maxLength} caractères`;
      }
      
      if (pattern && !new RegExp(pattern).test(String(value))) {
        return message || `${field.label} n'est pas valide`;
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name];
    const fieldValue = formData[field.name] || '';

    const baseClasses = cn(
      'w-full',
      fieldError && 'border-red-500 focus:border-red-500 focus:ring-red-500'
    );

    const fieldClasses = cn(
      'space-y-2',
      field.responsive?.cols && `col-span-${field.responsive.cols}`,
      field.responsive?.order && `order-${field.responsive.order}`
    );

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className={fieldClasses}>
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={field.disabled}
              className={baseClasses}
              rows={4}
            />
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className={fieldClasses}>
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={fieldValue}
              onValueChange={(value) => handleInputChange(field.name, value)}
              disabled={field.disabled}
            >
              <SelectTrigger className={baseClasses}>
                <SelectValue placeholder={field.placeholder || `Sélectionner ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className={fieldClasses}>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={fieldValue}
                onCheckedChange={(checked) => handleInputChange(field.name, checked)}
                disabled={field.disabled}
              />
              <Label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className={fieldClasses}>
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={fieldValue}
              onValueChange={(value) => handleInputChange(field.name, value)}
              disabled={field.disabled}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                  <Label htmlFor={`${field.name}-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        );

      case 'switch':
        return (
          <div key={field.name} className={fieldClasses}>
            <div className="flex items-center space-x-2">
              <Switch
                id={field.name}
                checked={fieldValue}
                onCheckedChange={(checked) => handleInputChange(field.name, checked)}
                disabled={field.disabled}
              />
              <Label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className={fieldClasses}>
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Popover open={dateOpen[field.name]} onOpenChange={(open) => setDateOpen(prev => ({ ...prev, [field.name]: open }))}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    baseClasses,
                    "justify-start text-left font-normal",
                    !fieldValue && "text-muted-foreground"
                  )}
                  disabled={field.disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fieldValue ? format(new Date(fieldValue), "PPP", { locale: fr }) : field.placeholder || "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fieldValue ? new Date(fieldValue) : undefined}
                  onSelect={(date) => {
                    handleInputChange(field.name, date ? date.toISOString().split('T')[0] : '');
                    setDateOpen(prev => ({ ...prev, [field.name]: false }));
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className={fieldClasses}>
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={field.disabled}
              className={baseClasses}
            />
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        );
    }
  };

  return (
    <Card className={cn('card-responsive', className)}>
      {(title || description) && (
        <CardHeader className="p-4 sm:p-6">
          {title && (
            <CardTitle className="text-lg sm:text-xl font-semibold">
              {title}
            </CardTitle>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </CardHeader>
      )}

      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={cn(
            'grid gap-4 sm:gap-6',
            `grid-cols-1 sm:grid-cols-${gridCols}`
          )}>
            {fields.map(renderField)}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {cancelLabel}
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResponsiveForm;