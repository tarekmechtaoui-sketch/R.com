import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-3xl font-black text-charcoal dark:text-white mb-8">Your Cart</h1>
        <EmptyState
          type="cart"
          title="Your cart is empty"
          description="Browse our products and add some items to your cart."
          action={
            <Link to="/products" className="btn-primary inline-flex gap-2">
              <ShoppingBag size={16} />
              Browse Products
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <h1 className="text-3xl font-black text-charcoal dark:text-white mb-8">
        Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-charcoal-800 rounded-2xl p-4 flex items-center gap-4 shadow-soft"
            >
              {/* Image */}
              <div className="w-20 h-20 bg-card-gray rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="text-charcoal-300 text-xs">No img</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-charcoal-400 uppercase tracking-widest mb-0.5">
                  {item.categories?.name || 'Accessory'}
                </p>
                <h3 className="font-semibold text-charcoal dark:text-white text-sm line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-charcoal dark:text-charcoal-200 mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-charcoal-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center font-bold text-sm text-charcoal dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, Math.min(item.stock ?? 99, item.quantity + 1))}
                  disabled={item.quantity >= (item.stock ?? 99)}
                  className="w-8 h-8 bg-charcoal-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right shrink-0 w-20 hidden sm:block">
                <p className="font-bold text-sm text-charcoal dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-charcoal-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-soft sticky top-24">
            <h2 className="font-bold text-lg text-charcoal dark:text-white mb-5">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-charcoal-500 dark:text-charcoal-400 truncate flex-1 mr-2">
                    {item.name} ×{item.quantity}
                  </span>
                  <span className="font-semibold text-charcoal dark:text-white shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal-100 dark:border-charcoal-700 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-charcoal dark:text-white">Total</span>
                <span className="font-black text-xl text-charcoal dark:text-white">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <p className="text-xs text-charcoal-400 mt-1">Delivery fee calculated at checkout</p>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              className="w-full"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Button>

            <Link
              to="/products"
              className="mt-3 block text-center text-sm font-medium text-charcoal-400 hover:text-charcoal dark:hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
