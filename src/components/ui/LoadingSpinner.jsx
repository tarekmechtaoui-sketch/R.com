import { cn } from '../../utils/helpers'

export default function LoadingSpinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  }
  return (
    <div
      className={cn(
        'rounded-full border-charcoal-200 border-t-charcoal dark:border-charcoal-600 dark:border-t-white animate-spin',
        sizes[size],
        className
      )}
    />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-card-gray rounded-2xl aspect-square mb-4" />
      <div className="h-3 bg-charcoal-200 rounded w-1/3 mb-2" />
      <div className="h-4 bg-charcoal-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-charcoal-200 rounded w-1/4" />
    </div>
  )
}
