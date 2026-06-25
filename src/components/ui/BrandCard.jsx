import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

export default function BrandCard({ brand }) {
  const { t } = useLanguage()
  return (
    <Link
      to={`/products?brand=${brand.slug}`}
      className="group relative bg-white dark:bg-charcoal-800 border-2 border-charcoal-100 dark:border-charcoal-700 rounded-3xl p-6 flex items-center justify-between overflow-hidden hover:border-charcoal dark:hover:border-charcoal-400 transition-all duration-300 hover:shadow-medium"
    >
      {/* Text Content */}
      <div className="flex-1 pr-4 z-10">
        <h3 className="text-2xl font-black text-charcoal dark:text-white mb-2">
          {brand.name}
        </h3>
        <p className="text-sm text-charcoal-400 dark:text-charcoal-300 leading-relaxed mb-5 line-clamp-2">
          {brand.description || 'Shop all products from this brand'}
        </p>
        <span className="inline-flex items-center gap-1.5 border-2 border-charcoal dark:border-charcoal-400 text-charcoal dark:text-charcoal-200 text-xs font-semibold px-4 py-2 rounded-full group-hover:bg-charcoal group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-charcoal transition-all duration-200">
          Shop
        </span>
      </div>

      {/* Image */}
      {brand.image && (
        <div className="w-32 h-28 shrink-0 flex items-center justify-center">
          <img
            src={brand.image}
            alt={brand.name}
            className="w-full h-full object-contain drop-shadow-md"
            loading="lazy"
          />
        </div>
      )}

      {/* Arrow icon */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white group-hover:rotate-0 rotate-45 transition-transform duration-300">
        <ArrowUpRight size={14} />
      </div>
    </Link>
  )
}
