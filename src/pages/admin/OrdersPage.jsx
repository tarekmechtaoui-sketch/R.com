import { useState } from 'react'
import { Eye, ChevronDown, Building2, Home, Calendar } from 'lucide-react'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { useAdminOrders } from '../../hooks/useOrders'
import { formatPrice, formatDate } from '../../utils/helpers'
import { ORDER_STATUSES } from '../../utils/constants'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  ...Object.entries(ORDER_STATUSES).map(([value, { label }]) => ({ value, label })),
]

const DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
]

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const { orders, loading, updateOrderStatus } = useAdminOrders({ status: statusFilter, dateFilter })
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success('Order status updated')
      // update local modal state if viewing same order
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      toast.error('Failed to update: ' + err.message)
    }
  }

  return (
    <div className="flex min-h-screen bg-cream dark:bg-charcoal-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Orders" subtitle="Manage customer orders" />
        <main className="p-6">
          {/* Status Filter Tabs */}
          <div className="flex gap-2 flex-wrap mb-3">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  statusFilter === opt.value
                    ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                    : 'bg-white dark:bg-charcoal-800 text-charcoal-500 dark:text-charcoal-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Date Filter Row */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <Calendar size={14} className="text-charcoal-400 shrink-0" />
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDateFilter(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  dateFilter === opt.value
                    ? 'bg-navy text-white'
                    : 'bg-white dark:bg-charcoal-800 text-charcoal-500 dark:text-charcoal-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <PageLoader />
          ) : orders.length === 0 ? (
            <EmptyState type="orders" title="No orders" description="No orders found for this filter." />
          ) : (
            <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-charcoal-400 uppercase tracking-wider border-b border-charcoal-100 dark:border-charcoal-700">
                      <th className="px-6 py-3 font-semibold">Customer</th>
                      <th className="px-6 py-3 font-semibold hidden md:table-cell">Wilaya</th>
                      <th className="px-6 py-3 font-semibold hidden lg:table-cell">Delivery</th>
                      <th className="px-6 py-3 font-semibold hidden lg:table-cell">Items</th>
                      <th className="px-6 py-3 font-semibold">Total</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold hidden sm:table-cell">Date</th>
                      <th className="px-6 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-50 dark:divide-charcoal-700">
                    {orders.map((order) => {
                      const s = ORDER_STATUSES[order.status] || ORDER_STATUSES.new
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50 transition-colors"
                        >
                          <td className="px-6 py-3">
                            <p className="font-semibold text-charcoal dark:text-white">{order.customer_name}</p>
                            <p className="text-xs text-charcoal-400">{order.phone}</p>
                          </td>
                          <td className="px-6 py-3 text-charcoal-500 dark:text-charcoal-400 hidden md:table-cell">
                            {order.wilaya}
                          </td>
                          <td className="px-6 py-3 hidden lg:table-cell">
                            <div className="flex items-center gap-1.5 text-charcoal-500 dark:text-charcoal-400">
                              {order.delivery_type === 'home'
                                ? <Home size={13} className="text-blue-500 shrink-0" />
                                : <Building2 size={13} className="text-charcoal-400 shrink-0" />
                              }
                              <span className="text-xs">
                                {order.delivery_type === 'home' ? 'Home' : 'Desk'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-charcoal-500 dark:text-charcoal-400 hidden lg:table-cell">
                            {order.order_items?.length || 0} item{order.order_items?.length !== 1 ? 's' : ''}
                          </td>
                          <td className="px-6 py-3 font-semibold text-charcoal dark:text-charcoal-200">
                            {formatPrice(order.total_price)}
                          </td>
                          <td className="px-6 py-3">
                            <div className="relative">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`appearance-none text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer pr-6 ${s.bg} ${s.text} border-0 focus:outline-none focus:ring-2 focus:ring-charcoal/30`}
                              >
                                {Object.entries(ORDER_STATUSES).map(([val, { label }]) => (
                                  <option key={val} value={val}>{label}</option>
                                ))}
                              </select>
                              <ChevronDown size={10} className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${s.text}`} />
                            </div>
                          </td>
                          <td className="px-6 py-3 text-charcoal-400 text-xs hidden sm:table-cell">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-charcoal-100 dark:hover:text-white dark:hover:bg-charcoal-700 transition-all"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-charcoal-100 dark:border-charcoal-700 text-xs text-charcoal-400">
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Header */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-charcoal-400 text-xs mb-1">Order ID</p>
                <p className="font-mono font-bold text-charcoal dark:text-white">
                  #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs mb-1">Date</p>
                <p className="font-semibold text-charcoal dark:text-white">
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="input-field py-1.5 text-sm"
                  >
                    {Object.entries(ORDER_STATUSES).map(([val, { label }]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs mb-1">Total</p>
                <p className="font-black text-lg text-charcoal dark:text-white">
                  {formatPrice(selectedOrder.total_price)}
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="bg-charcoal-50 dark:bg-charcoal-700 rounded-xl p-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-400 mb-3">Customer</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-charcoal-400 text-xs">Name</p>
                  <p className="font-semibold text-charcoal dark:text-white">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-charcoal-400 text-xs">Phone</p>
                  <p className="font-semibold text-charcoal dark:text-white">{selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-charcoal-400 text-xs">Wilaya</p>
                  <p className="font-semibold text-charcoal dark:text-white">{selectedOrder.wilaya}</p>
                </div>
                <div>
                  <p className="text-charcoal-400 text-xs">Commune</p>
                  <p className="font-semibold text-charcoal dark:text-white">{selectedOrder.commune}</p>
                </div>
                <div>
                  <p className="text-charcoal-400 text-xs">Delivery Type</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {selectedOrder.delivery_type === 'home'
                      ? <Home size={14} className="text-charcoal-500" />
                      : <Building2 size={14} className="text-charcoal-500" />
                    }
                    <p className="font-semibold text-charcoal dark:text-white text-sm">
                      {selectedOrder.delivery_type === 'home' ? 'Home Delivery' : 'Desk / Agency'}
                      <span className="ml-1 text-charcoal-400 font-normal">
                        (+{formatPrice(selectedOrder.delivery_fee ?? (selectedOrder.delivery_type === 'home' ? 700 : 500))})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              {selectedOrder.notes && (
                <div className="mt-3">
                  <p className="text-charcoal-400 text-xs">Notes</p>
                  <p className="text-sm text-charcoal dark:text-white">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-400 mb-3">Items</h4>
              <div className="space-y-2">
                {selectedOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-charcoal-50 dark:bg-charcoal-700 rounded-xl p-3">
                    <div className="w-12 h-12 bg-card-gray rounded-xl overflow-hidden shrink-0">
                      {item.products?.images?.[0] && (
                        <img src={item.products.images[0]} alt="" className="w-full h-full object-contain p-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-charcoal dark:text-white line-clamp-1">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-charcoal-400">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-sm text-charcoal dark:text-white shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
