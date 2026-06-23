import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package, MapPin, Phone, User, ShoppingBag, Building2, Home } from 'lucide-react'
import { getOrderById } from '../../hooks/useOrders'
import { formatPrice, formatDate } from '../../utils/helpers'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { ORDER_STATUSES } from '../../utils/constants'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    // If order data was passed via navigation state, no DB fetch needed
    if (location.state?.order) return
    if (!id) return
    getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-4">Order not found</h2>
        <Link to="/" className="btn-primary inline-flex">Go Home</Link>
      </div>
    )
  }

  const statusInfo = ORDER_STATUSES[order.status] || ORDER_STATUSES.new

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 animate-fade-in">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-charcoal dark:text-white mb-2">
          Order Confirmed!
        </h1>
        <p className="text-charcoal-500 dark:text-charcoal-300">
          Thank you for your order. We'll contact you soon to confirm delivery.
        </p>
      </div>

      {/* Order Card */}
      <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-soft overflow-hidden mb-6">
        {/* Order header */}
        <div className="bg-charcoal-50 dark:bg-charcoal-700 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-400 font-medium">Order ID</p>
            <p className="font-mono text-sm font-bold text-charcoal dark:text-white">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-charcoal-400 font-medium">Date</p>
            <p className="text-sm font-semibold text-charcoal dark:text-white">
              {formatDate(order.created_at)}
            </p>
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer Info */}
          <div>
            <h3 className="font-bold text-sm text-charcoal dark:text-white mb-3 uppercase tracking-widest">
              Delivery Info
            </h3>
            <div className="space-y-2">
              {[
                { icon: User, label: order.customer_name },
                { icon: Phone, label: order.phone },
                { icon: MapPin, label: `${order.wilaya} — ${order.commune}` },
                {
                  icon: order.delivery_type === 'home' ? Home : Building2,
                  label: order.delivery_type === 'home' ? 'Home Delivery (+700 DA)' : 'Delivery to Desk / Agency (+500 DA)',
                },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={15} className="text-charcoal-400 shrink-0" />
                  <span className="text-sm text-charcoal-600 dark:text-charcoal-300">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-charcoal-100 dark:border-charcoal-700 pt-5">
            <h3 className="font-bold text-sm text-charcoal dark:text-white mb-3 uppercase tracking-widest">
              Items Ordered
            </h3>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-card-gray rounded-xl overflow-hidden shrink-0">
                    {item.products?.images?.[0] && (
                      <img src={item.products.images[0]} alt="" className="w-full h-full object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal dark:text-white line-clamp-1">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-charcoal-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-charcoal dark:text-white shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-charcoal-100 dark:border-charcoal-700 pt-4 space-y-2">
            {order.delivery_fee != null && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Subtotal</span>
                  <span className="font-semibold text-charcoal dark:text-charcoal-200">
                    {formatPrice(order.total_price - order.delivery_fee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Delivery fee</span>
                  <span className="font-semibold text-charcoal dark:text-charcoal-200">
                    +{formatPrice(order.delivery_fee)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between pt-2 border-t border-charcoal-100 dark:border-charcoal-700">
              <span className="font-bold text-charcoal dark:text-white">Total</span>
              <span className="font-black text-xl text-charcoal dark:text-white">
                {formatPrice(order.total_price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Link to="/" className="btn-primary inline-flex">
          Continue Shopping
        </Link>
        <Link to="/products" className="btn-secondary inline-flex">
          Browse More
        </Link>
      </div>
    </div>
  )
}
