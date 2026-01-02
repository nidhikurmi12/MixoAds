import { LucideIcon } from 'lucide-react';
import CircularProgress from './CircularProgress';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
  progressColor?: string;
  iconBgColor?: string;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  progress,
  progressColor,
  iconBgColor = 'bg-blue-50',
}: MetricCardProps) {
  const iconColor = iconBgColor.includes('green')
    ? 'text-green-600'
    : iconBgColor.includes('red')
    ? 'text-red-600'
    : iconBgColor.includes('yellow')
    ? 'text-yellow-600'
    : 'text-blue-600';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {progress !== undefined ? (
          <CircularProgress
            percentage={progress}
            size={56}
            strokeWidth={5}
            color={progressColor || '#3B82F6'}
          />
        ) : (
          <div className={`${iconBgColor} p-3 rounded-xl`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
      <div className="border-t border-gray-100 pt-3">
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={`text-xs font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}
