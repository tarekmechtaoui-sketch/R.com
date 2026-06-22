import { useEffect, useState } from 'react'
import { Package, ShoppingBag, TrendingUp, Users, Clock } from 'lucide-react'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import StatsCard from '../../components/admin/StatsCard'
import { supabase } from '../../lib/supabase'
import { formatPrice, formatDate } from '../../utils/helpers'
import { ORDER_STATUSES } from '../../utils/constants'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import Badge from '../../components/ui/Badge'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: productCount },
          { count: orderCount },
          { data: allOrderStats },
          { data: recentOrdersData },
          { count: adminCount },
        ] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('total_price, status'),
          supabase.from('orders').select('total_price, status, created_at, customer_name').order('created_at', { ascending: false }).limit(5),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
        ])

        const totalRevenue = allOrderStats?.reduce((s, o) => s + (o.total_price || 0), 0) || 0
        const newOrders = allOrderStats?.filter((o) => o.status === 'new').length || 0

        setStats({
          products: productCount || 0,
          orders: orderCount || 0,
          revenue: totalRevenue,
          admins: adminCount || 0,
          newOrders,
        })
        setRecentOrders(recentOrdersData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="flex min-h-screen bg-cream dark:bg-charcoal-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Dashboard" subtitle="Welcome back! Here's what's happening." />

        {loading ? (
          <PageLoader />
        ) : (
          <main className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Products"
                value={stats.products}
                icon={Package}
                color="blue"
              />
              <StatsCard
                title="Total Orders"
                value={stats.orders}
                icon={ShoppingBag}
                color="green"
              />
              <StatsCard
                title="Total Revenue"
                value={formatPrice(stats.revenue)}
                icon={TrendingUp}
                color="purple"
              />
              <StatsCard
                title="Admin Users"
                value={stats.admins}
                icon={Users}
                color="orange"
              />
            </div>

            {/* New orders alert */}
            {stats.newOrders > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-800 dark:text-blue-200 text-sm">
                    {stats.newOrders} new order{stats.newOrders > 1 ? 's' : ''} awaiting confirmation
                  </p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  View →
                </Link>
              </div>
            )}

            {/* Recent Orders */}
            <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-soft overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-100 dark:border-charcoal-700">
                <h2 className="font-bold text-charcoal dark:text-white">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-charcoal-400 hover:text-charcoal dark:hover:text-white transition-colors"
                >
                  View all →
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <div className="py-12 text-center text-charcoal-400 text-sm">No orders yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-charcoal-400 uppercase tracking-wider">
                        <th className="px-6 py-3 font-semibold">Customer</th>
                        <th className="px-6 py-3 font-semibold">Total</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal-50 dark:divide-charcoal-700">
                      {recentOrders.map((order) => {
                        const s = ORDER_STATUSES[order.status] || ORDER_STATUSES.new
                        return (
                          <tr key={order.id || order.created_at} className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50 transition-colors">
                            <td className="px-6 py-3 font-medium text-charcoal dark:text-white">
                              {order.customer_name}
                            </td>
                            <td className="px-6 py-3 font-semibold text-charcoal dark:text-charcoal-200">
                              {formatPrice(order.total_price)}
                            </td>
                            <td className="px-6 py-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                                {s.label}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-charcoal-400">
                              {formatDate(order.created_at)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
