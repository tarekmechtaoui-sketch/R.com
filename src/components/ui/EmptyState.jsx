import { PackageX, ShoppingCart, Users, FileText } from 'lucide-react'

const icons = {
  products: PackageX,
  orders: FileText,
  cart: ShoppingCart,
  users: Users,
  default: PackageX,
}

export default function EmptyState({
  type = 'default',
  title = 'Nothing here yet',
  description = 'There are no items to display.',
  action,
}) {
  const Icon = icons[type] || icons.default
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 bg-card-gray dark:bg-charcoal-700 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={28} className="text-charcoal-300 dark:text-charcoal-500" />
      </div>
      <h3 className="font-bold text-lg text-charcoal dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-charcoal-400 dark:text-charcoal-400 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
