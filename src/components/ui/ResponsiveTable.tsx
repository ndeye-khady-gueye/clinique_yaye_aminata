import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResponsiveTableProps {
  title?: string;
  description?: string;
  columns: {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
    className?: string;
  }[];
  data: any[];
  emptyMessage?: string;
  className?: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  title,
  description,
  columns,
  data,
  emptyMessage = "Aucune donnée disponible",
  className = ""
}) => {
  if (data.length === 0) {
    return (
      <Card className={`card-responsive ${className}`}>
        {title && (
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-responsive">{title}</CardTitle>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </CardHeader>
        )}
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`card-responsive ${className}`}>
      {title && (
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-responsive">{title}</CardTitle>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        {/* Tableau desktop */}
        <div className="hidden lg:block table-responsive">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.className || ''}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}
                    >
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cartes mobiles */}
        <div className="lg:hidden space-y-3 p-4 sm:p-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2"
            >
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {column.label}:
                  </span>
                  <div className={`text-sm text-gray-900 dark:text-gray-100 text-right flex-1 ml-2 ${column.className || ''}`}>
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveTable;
