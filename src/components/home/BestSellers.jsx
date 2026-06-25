import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ProductCard from '../ui/ProductCard'
import { CardSkeleton } from '../ui/LoadingSpinner'
import EmptyState from '../ui/EmptyState'
import { useLanguage } from '../../contexts/LanguageContext'

export default function BestSellers({ products = [], loading = false }) {
  const { t } = useLanguage()
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 my-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-charcoal dark:text-white">
          {t('bestsellers.title')}
        </h2>
        <div className="flex items-center gap-2">
          <Link
            to="/products"
            className="border-2 border-charcoal-200 dark:border-charcoal-600 text-charcoal dark:text-charcoal-200 px-5 py-2 rounded-full text-sm font-semibold hover:border-charcoal hover:bg-charcoal hover:text-white dark:hover:border-white dark:hover:text-white transition-all duration-200"
          >
            {t('bestsellers.view_more')}
          </Link>
          <Link
            to="/products"
            className="w-10 h-10 bg-charcoal dark:bg-white rounded-full flex items-center justify-center text-white dark:text-charcoal hover:bg-charcoal-700 dark:hover:bg-charcoal-100 transition-all duration-200 active:scale-95"
            aria-label="View all products"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState type="products" title="No featured products" description="Check back soon!" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
