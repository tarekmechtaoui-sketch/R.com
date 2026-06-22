import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import CategoryCard from '../ui/CategoryCard'
import { CardSkeleton } from '../ui/LoadingSpinner'

export default function CategoriesSection({ categories = [], loading = false }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 my-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-charcoal dark:text-white">
          Shop by Category
        </h2>
        <Link
          to="/products"
          className="flex items-center gap-1.5 text-sm font-semibold text-charcoal-500 hover:text-charcoal dark:text-charcoal-300 dark:hover:text-white transition-colors"
        >
          View All
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-card-gray rounded-3xl h-36" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.slice(0, 4).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </section>
  )
}
