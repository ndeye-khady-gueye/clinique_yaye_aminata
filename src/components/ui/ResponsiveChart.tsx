import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ResponsiveChartProps {
  title?: string;
  description?: string;
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie' | 'doughnut';
  height?: number;
  className?: string;
}

const ResponsiveChart: React.FC<ResponsiveChartProps> = ({
  title,
  description,
  data,
  type = 'bar',
  height = 300,
  className = ""
}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {item.value}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
            <div
              className="h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#6C2476'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#6C2476' }} />
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {item.label}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const startAngle = (cumulativePercentage / 100) * 360;
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
          cumulativePercentage += percentage;

          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#6C2476' }} />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {item.value} ({percentage.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
      case 'doughnut':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <Card className={cn('card-responsive', className)}>
      {(title || description) && (
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-responsive">{title}</CardTitle>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className="p-4 sm:p-6">
        <div style={{ height: `${height}px` }} className="flex items-center justify-center">
          {data.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
          ) : (
            <div className="w-full">
              {renderChart()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveChart;
