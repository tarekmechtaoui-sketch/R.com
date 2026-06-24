import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ChevronRight, ShoppingBag, Building2, Home } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { placeOrder } from '../../hooks/useOrders'
import { formatPrice } from '../../utils/helpers'
import WILAYAS_DATA from '../../utils/wilayas.json'
import COMMUNES_DATA from '../../utils/communes.json'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const DELIVERY_OPTIONS = [
  {
    value: 'desk',
    label: 'Delivery to Desk / Agency',
    description: 'Pick up from the nearest delivery agency',
    fee: 500,
    icon: Building2,
  },
  {
    value: 'home',
    label: 'Home Delivery',
    description: 'Delivered directly to your address',
    fee: 700,
    icon: Home,
  },
]

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [deliveryType, setDeliveryType] = useState('desk')
  const [selectedWilayaId, setSelectedWilayaId] = useState('')

  const availableCommunes = COMMUNES_DATA.filter(
    (c) => c.wilaya_id === selectedWilayaId
  )

  const selectedDelivery = DELIVERY_OPTIONS.find((o) => o.value === deliveryType)
  const deliveryFee = selectedDelivery.fee
  const grandTotal = cartTotal + deliveryFee

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <ShoppingBag size={48} className="text-charcoal-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-4">Your cart is empty</h2>
        <Link to="/products" className="btn-primary inline-flex">
          Browse Products
        </Link>
      </div>
    )
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const order = await placeOrder({
        customerInfo: {
          fullName: data.fullName,
          phone: data.phone,
          wilaya: data.wilaya,
          commune: data.commune,
          notes: data.notes,
        },
        items,
        total: grandTotal,
        deliveryType,
        deliveryFee,
      })
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/order-confirmation/${order.id}`, {
        state: {
          order: {
            id: order.id,
            customer_name: data.fullName,
            phone: data.phone,
            wilaya: data.wilaya,
            commune: data.commune,
            notes: data.notes || null,
            total_price: grandTotal,
            delivery_type: deliveryType,
            delivery_fee: deliveryFee,
            status: 'new',
            created_at: new Date().toISOString(),
            order_items: items.map((item) => ({
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
              products: { name: item.name, images: item.images || [] },
            })),
          },
        },
      })
    } catch (err) {
      toast.error('Failed to place order: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-8">
        <Link to="/cart" className="hover:text-charcoal transition-colors">Cart</Link>
        <ChevronRight size={14} />
        <span className="text-charcoal dark:text-white font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-black text-charcoal dark:text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* ── Delivery Type ── */}
            <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-soft">
              <h2 className="font-bold text-lg text-charcoal dark:text-white mb-5">
                Delivery Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DELIVERY_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const active = deliveryType === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDeliveryType(option.value)}
                      className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        active
                          ? 'border-charcoal dark:border-white bg-charcoal-50 dark:bg-charcoal-700'
                          : 'border-charcoal-100 dark:border-charcoal-600 hover:border-charcoal-300 dark:hover:border-charcoal-500'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        active ? 'bg-charcoal dark:bg-white' : 'bg-charcoal-100 dark:bg-charcoal-700'
                      }`}>
                        <Icon size={18} className={active ? 'text-white dark:text-charcoal' : 'text-charcoal-500 dark:text-charcoal-300'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${active ? 'text-charcoal dark:text-white' : 'text-charcoal-600 dark:text-charcoal-300'}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-charcoal-400 mt-0.5">{option.description}</p>
                        <p className={`text-sm font-black mt-1 ${active ? 'text-charcoal dark:text-white' : 'text-charcoal-500 dark:text-charcoal-400'}`}>
                          +{formatPrice(option.fee)}
                        </p>
                      </div>
                      {/* Radio dot */}
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        active ? 'border-charcoal dark:border-white' : 'border-charcoal-300 dark:border-charcoal-600'
                      }`}>
                        {active && <div className="w-2.5 h-2.5 rounded-full bg-charcoal dark:bg-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Customer Info ── */}
            <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-soft">
              <h2 className="font-bold text-lg text-charcoal dark:text-white mb-5">
                Delivery Information
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    className="input-field"
                    placeholder="Your full name"
                    {...register('fullName', { required: 'Full name is required' })}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 0555 000 000"
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^0[567][0-9]{8}$/,
                        message: 'Must be 10 digits starting with 05, 06, or 07',
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Wilaya */}
                <div>
                  <label className="label">Wilaya *</label>
                  <select
                    className="input-field"
                    {...register('wilaya', { required: 'Wilaya is required' })}
                    onChange={(e) => {
                      const opt = e.target.options[e.target.selectedIndex]
                      setValue('wilaya', opt.value)
                      setSelectedWilayaId(opt.dataset.id || '')
                      setValue('commune', '')
                    }}
                  >
                    <option value="">Select your wilaya</option>
                    {WILAYAS_DATA.map((w) => (
                      <option
                        key={w.id}
                        value={`${w.code.padStart(2, '0')} - ${w.name}`}
                        data-id={w.id}
                      >
                        {w.code.padStart(2, '0')} - {w.name}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && (
                    <p className="text-xs text-red-500 mt-1">{errors.wilaya.message}</p>
                  )}
                </div>

                {/* Commune */}
                <div>
                  <label className="label">Commune *</label>
                  <select
                    className="input-field"
                    disabled={!selectedWilayaId}
                    {...register('commune', { required: 'Commune is required' })}
                  >
                    <option value="">
                      {selectedWilayaId ? 'Select your commune' : 'Select a wilaya first'}
                    </option>
                    {availableCommunes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.commune && (
                    <p className="text-xs text-red-500 mt-1">{errors.commune.message}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="label">Order Notes (optional)</label>
                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Any additional notes for your order..."
                    {...register('notes')}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              {submitting ? 'Placing Order...' : `Place Order • ${formatPrice(grandTotal)}`}
            </Button>

            <p className="text-xs text-charcoal-400 text-center">
              No account required. We'll contact you on the phone number provided.
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-soft sticky top-24">
            <h2 className="font-bold text-lg text-charcoal dark:text-white mb-5">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-card-gray rounded-xl overflow-hidden shrink-0">
                    {item.images?.[0] && (
                      <img src={item.images[0]} alt="" className="w-full h-full object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-charcoal dark:text-white line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-charcoal-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-charcoal dark:text-white shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal-100 dark:border-charcoal-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500 dark:text-charcoal-400">Subtotal</span>
                <span className="font-semibold text-charcoal dark:text-charcoal-200">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500 dark:text-charcoal-400">
                  Delivery ({selectedDelivery.label.split('/')[0].trim()})
                </span>
                <span className="font-semibold text-charcoal dark:text-charcoal-200">+{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-charcoal-100 dark:border-charcoal-700">
                <span className="font-bold text-charcoal dark:text-white">Total</span>
                <span className="font-black text-lg text-charcoal dark:text-white">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
