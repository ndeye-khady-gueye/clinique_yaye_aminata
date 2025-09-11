import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveFormProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    default?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  children,
  className = "",
  columns = { default: 1, sm: 2 },
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-2 xs:gap-3',
    md: 'gap-3 xs:gap-4',
    lg: 'gap-4 xs:gap-6'
  };

  const getGridCols = () => {
    const baseCols = columns.default || 1;
    const xsCols = columns.xs || baseCols;
    const smCols = columns.sm || xsCols;
    const mdCols = columns.md || smCols;
    const lgCols = columns.lg || mdCols;

    return `grid-cols-${baseCols} xs:grid-cols-${xsCols} sm:grid-cols-${smCols} md:grid-cols-${mdCols} lg:grid-cols-${lgCols}`;
  };

  return (
    <div className={cn(
      "grid",
      getGridCols(),
      gapClasses[gap],
      "form-responsive",
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveFormFieldProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const ResponsiveFormField: React.FC<ResponsiveFormFieldProps> = ({
  children,
  className = "",
  fullWidth = false
}) => {
  return (
    <div className={cn(
      "space-y-1 xs:space-y-2",
      fullWidth && "col-span-full",
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveLabelProps {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

const ResponsiveLabel: React.FC<ResponsiveLabelProps> = ({
  children,
  className = "",
  required = false
}) => {
  return (
    <label className={cn(
      "label-responsive block font-medium text-gray-700 dark:text-gray-300",
      required && "after:content-['*'] after:ml-1 after:text-red-500",
      className
    )}>
      {children}
    </label>
  );
};

interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const ResponsiveInput: React.FC<ResponsiveInputProps> = ({
  className = "",
  error = false,
  helperText,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <input
        className={cn(
          "input-responsive rounded-md border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:ring-2 focus:ring-primary focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {helperText && (
        <p className={cn(
          "text-xs text-gray-500 dark:text-gray-400",
          error && "text-red-500 dark:text-red-400"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
};

interface ResponsiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
}

const ResponsiveTextarea: React.FC<ResponsiveTextareaProps> = ({
  className = "",
  error = false,
  helperText,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <textarea
        className={cn(
          "input-responsive rounded-md border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:ring-2 focus:ring-primary focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "resize-vertical min-h-[80px] xs:min-h-[100px]",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {helperText && (
        <p className={cn(
          "text-xs text-gray-500 dark:text-gray-400",
          error && "text-red-500 dark:text-red-400"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
};

interface ResponsiveSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  helperText?: string;
  options: { value: string; label: string }[];
}

const ResponsiveSelect: React.FC<ResponsiveSelectProps> = ({
  className = "",
  error = false,
  helperText,
  options,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <select
        className={cn(
          "input-responsive rounded-md border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
          "focus:ring-2 focus:ring-primary focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <p className={cn(
          "text-xs text-gray-500 dark:text-gray-400",
          error && "text-red-500 dark:text-red-400"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
};

interface ResponsiveButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
}

const ResponsiveButtonGroup: React.FC<ResponsiveButtonGroupProps> = ({
  children,
  className = "",
  direction = 'horizontal',
  spacing = 'md'
}) => {
  const spacingClasses = {
    sm: 'space-x-1 xs:space-x-2',
    md: 'space-x-2 xs:space-x-3',
    lg: 'space-x-3 xs:space-x-4'
  };

  const verticalSpacingClasses = {
    sm: 'space-y-1 xs:space-y-2',
    md: 'space-y-2 xs:space-y-3',
    lg: 'space-y-3 xs:space-y-4'
  };

  return (
    <div className={cn(
      "flex",
      direction === 'horizontal' ? 'flex-row' : 'flex-col',
      direction === 'horizontal' ? spacingClasses[spacing] : verticalSpacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
};

export {
  ResponsiveForm,
  ResponsiveFormField,
  ResponsiveLabel,
  ResponsiveInput,
  ResponsiveTextarea,
  ResponsiveSelect,
  ResponsiveButtonGroup
};