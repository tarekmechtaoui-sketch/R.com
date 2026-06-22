import { cn } from '../../utils/helpers'

const variants = {
  primary: 'bg-charcoal text-white hover:bg-charcoal-700 dark:bg-white dark:text-charcoal dark:hover:bg-charcoal-100',
  secondary: 'bg-transparent text-charcoal border-2 border-charcoal hover:bg-charcoal hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-charcoal',
  outline: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-charcoal',
  ghost: 'bg-transparent text-charcoal-500 hover:text-charcoal hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:text-white dark:hover:bg-charcoal-700',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  success: 'bg-green-500 text-white hover:bg-green-600',
}

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-full',
  md: 'px-6 py-3 text-sm rounded-full',
  lg: 'px-8 py-4 text-base rounded-full',
  icon: 'p-2 rounded-full',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'font-semibold transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
