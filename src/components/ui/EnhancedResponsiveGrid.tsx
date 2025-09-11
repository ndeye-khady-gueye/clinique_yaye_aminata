import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  autoFit?: boolean;
  minItemWidth?: string;
  equalHeight?: boolean;
}

const EnhancedResponsiveGrid: React.FC<EnhancedResponsiveGridProps> = ({
  children,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 'md',
  className = "",
  autoFit = false,
  minItemWidth = "280px",
  equalHeight = false
}) => {
  const gapClasses = {
    xs: 'gap-1 sm:gap-2',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-6',
    lg: 'gap-4 sm:gap-6 lg:gap-8',
    xl: 'gap-6 sm:gap-8 lg:gap-10'
  };

  const getGridCols = () => {
    if (autoFit) {
      return `grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`;
    }

    const baseCols = cols.default || 1;
    const xsCols = cols.xs || baseCols;
    const smCols = cols.sm || xsCols;
    const mdCols = cols.md || smCols;
    const lgCols = cols.lg || mdCols;
    const xlCols = cols.xl || lgCols;
    const xxlCols = cols['2xl'] || xlCols;

    return `grid-cols-${baseCols} xs:grid-cols-${xsCols} sm:grid-cols-${smCols} md:grid-cols-${mdCols} lg:grid-cols-${lgCols} xl:grid-cols-${xlCols} 2xl:grid-cols-${xxlCols}`;
  };

  return (
    <div className={cn(
      "grid",
      getGridCols(),
      gapClasses[gap],
      equalHeight && "items-stretch",
      className
    )}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            className: cn(
              equalHeight && "h-full",
              child.props.className
            )
          });
        }
        return child;
      })}
    </div>
  );
};

export default EnhancedResponsiveGrid;

