import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function StatsCard({ title, value, icon: Icon, color = 'default', trend, trendValue }) {
  const colors = {
    default: 'bg-charcoal-50 text-charcoal',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">{title}</p>
        {Icon && (
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', colors[color])}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-charcoal dark:text-white mb-2">{value}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trend >= 0 ? (
            <TrendingUp size={14} className="text-green-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(trend)}%
          </span>
          {trendValue && (
            <span className="text-xs text-charcoal-400">{trendValue}</span>
          )}
        </div>
      )}
    </div>
  )
}
