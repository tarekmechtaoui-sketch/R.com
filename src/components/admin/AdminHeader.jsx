import { Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function AdminHeader({ title, subtitle }) {
  const { toggleTheme, isDark } = useTheme()

  return (
    <header className="h-16 bg-white dark:bg-charcoal-900 border-b border-charcoal-100 dark:border-charcoal-800 flex items-center justify-between pl-14 pr-6 md:px-6 sticky top-0 z-10">
      <div>
        <h1 className="font-bold text-charcoal dark:text-white text-lg leading-none">{title}</h1>
        {subtitle && (
          <p className="text-xs text-charcoal-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full text-charcoal-500 hover:text-charcoal hover:bg-charcoal-100 dark:text-charcoal-400 dark:hover:text-white dark:hover:bg-charcoal-800 transition-all"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-charcoal-500 hover:text-charcoal hover:bg-charcoal-100 dark:text-charcoal-400 dark:hover:text-white dark:hover:bg-charcoal-800 transition-all">
          <Bell size={17} />
        </button>
      </div>
    </header>
  )
}
