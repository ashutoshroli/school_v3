import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export function Card({ children, className, title, subtitle, action, noPadding }: CardProps) {
  return (
    <div className={cn('rounded-lg border border-secondary-200 bg-white shadow-sm', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>}
            {subtitle && <p className="text-sm text-secondary-500">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'p-6')}>{children}</div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  iconBg?: string;
}

export function StatsCard({ title, value, change, changeLabel, icon, iconBg = 'bg-primary-100' }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-500">{title}</p>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
          {change !== undefined && (
            <p
              className={cn(
                'text-sm mt-2',
                change >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change >= 0 ? '+' : ''}
              {change}% {changeLabel || 'from last month'}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('rounded-lg p-3', iconBg)}>
            <div className="text-primary-600">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
}
