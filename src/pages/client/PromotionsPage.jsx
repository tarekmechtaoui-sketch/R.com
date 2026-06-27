import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ui/ProductCard'
import { CardSkeleton } from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { useLanguage } from '../../contexts/LanguageContext'

export default function PromotionsPage() {
  const { t } = useLanguage()
  const { products, loading, error } = useProducts({ promotionOnly: true })
  const [selectedCategory, setSelectedCategory] = useState('all')

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-red-700 dark:text-red-400">
          <h1 className="text-2xl font-bold mb-2">{t('promo.title1')}</h1>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-charcoal dark:text-white mb-3">{t('promo.title1')} {t('promo.title2')}</h1>
        <p className="text-charcoal-500 dark:text-charcoal-400 text-sm">{t('promo.description')}</p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          type="products"
          title="No promotions available"
          description="There are no active promotions right now. Check back later."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
