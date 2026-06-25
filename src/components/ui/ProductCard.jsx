import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const image = product.images?.[0]

  return (
    <div className="group flex flex-col">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block mb-4">
        <div className="bg-card-gray rounded-2xl aspect-square overflow-hidden relative flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="text-charcoal-300 text-xs text-center p-4">No image</div>
          )}
          {/* Overlay actions — only when in stock */}
          {product.stock > 0 && (
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-all duration-300 rounded-2xl flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    addToCart(product)
                  }}
                  className="bg-charcoal text-white text-xs px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 hover:bg-charcoal-700 transition-colors active:scale-95"
                >
                  <ShoppingCart size={13} />
                  {t('common.add_to_cart')}
                </button>
              </div>
            </div>
          )}
          {/* Status badge */}
          {product.stock === 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
              {t('common.out_of_stock')}
            </div>
          )}
          {product.featured && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-charcoal text-white text-[10px] font-semibold px-2 py-1 rounded-full">
              {t('common.featured')}
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1">
        <p className="text-xs text-charcoal-400 uppercase tracking-widest mb-1 font-medium">
          {product.categories?.name || t('product_card.accessory')}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-charcoal dark:text-white text-base mb-1 hover:underline underline-offset-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="font-semibold text-charcoal dark:text-charcoal-200 text-sm">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  )
}
