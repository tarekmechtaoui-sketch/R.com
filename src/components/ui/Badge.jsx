import { cn } from '../../utils/helpers'

const variants = {
  default: 'bg-charcoal-100 text-charcoal-700',
  primary: 'bg-charcoal text-white',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  indigo: 'bg-indigo-100 text-indigo-700',
}

export default function Badge({ children, variant = 'default', className, dot }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full bg-current')} />
      )}
      {children}
    </span>
  )
}
