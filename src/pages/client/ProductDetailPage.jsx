import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Minus, Plus, Check, ChevronRight } from 'lucide-react'
import { useProduct } from '../../hooks/useProducts'
import { useCart } from '../../contexts/CartContext'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { formatPrice } from '../../utils/helpers'
import Button from '../../components/ui/Button'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)
  const { addToCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setSelectedImage(0)
    setQuantity(1)
  }, [id])

  if (loading) return <PageLoader />
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-4">Product not found</h2>
        <Link to="/products" className="btn-primary inline-flex">
          Back to Products
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const inStock = product.stock > 0

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-8">
        <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-charcoal transition-colors">Products</Link>
        <ChevronRight size={14} />
        <span className="text-charcoal dark:text-white font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          {/* Main image */}
          <div className="bg-card-gray rounded-3xl aspect-square flex items-center justify-center overflow-hidden mb-4">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            ) : (
              <div className="text-charcoal-300 text-sm">No image</div>
            )}
          </div>
          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 bg-card-gray rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === i
                      ? 'ring-2 ring-charcoal dark:ring-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Category */}
          <p className="text-xs text-charcoal-400 uppercase tracking-widest font-medium mb-2">
            {product.categories?.name || 'Accessory'}
          </p>

          {/* Name */}
          <h1 className="text-3xl md:text-4xl font-black text-charcoal dark:text-white mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-black text-charcoal dark:text-white mb-6">
            {formatPrice(product.price)}
          </p>

          {/* Description */}
          {product.description && (
            <p className="text-charcoal-500 dark:text-charcoal-300 text-sm leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity */}
          {inStock && (
            <div className="mb-6">
              <label className="label">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-charcoal-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-lg text-charcoal dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 bg-charcoal-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 min-w-[180px]"
            >
              {added ? (
                <><Check size={16} /> Added!</>
              ) : (
                <><ShoppingCart size={16} /> Add to Cart</>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                addToCart(product, quantity)
                navigate('/checkout')
              }}
              disabled={!inStock}
              className="flex-1 min-w-[140px]"
            >
              Buy Now
            </Button>
          </div>

          {/* Back */}
          <Link
            to="/products"
            className="mt-6 flex items-center gap-2 text-sm font-medium text-charcoal-400 hover:text-charcoal dark:hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={15} />
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  )
}
