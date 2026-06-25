import { ArrowUpRight } from 'lucide-react'
import BrandCard from '../ui/BrandCard'
import { useLanguage } from '../../contexts/LanguageContext'

export default function BrandsSection({ brands = [], loading = false }) {
  const { t } = useLanguage()
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 my-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-charcoal dark:text-white">
          {t('brands.title')}
        </h2>
        <a
          href="/products"
          className="flex items-center gap-1.5 text-sm font-semibold text-charcoal-500 hover:text-charcoal dark:text-charcoal-300 dark:hover:text-white transition-colors"
        >
          {t('brands.view_all')}
          <ArrowUpRight size={15} />
        </a>
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
          {brands.slice(0, 4).map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </section>
  )
}
