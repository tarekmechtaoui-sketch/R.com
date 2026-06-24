import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut,
  Store, Menu, X
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Settings', to: '/admin/settings', icon: Settings, superAdminOnly: true },
]

export default function Sidebar() {
  const { profile, signOut, isSuperAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/admin/login')
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const visibleItems = navItems.filter((item) => !item.superAdminOnly || isSuperAdmin)

  return (
    <>
      {/* ── Mobile hamburger button (fixed, always on top) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-50 w-9 h-9 bg-charcoal dark:bg-white text-white dark:text-charcoal rounded-xl flex items-center justify-center shadow-medium"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          md:sticky md:top-0 md:min-h-screen
          w-64 bg-white dark:bg-charcoal-900
          border-r border-charcoal-100 dark:border-charcoal-800
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo + mobile close */}
        <div className="px-6 py-6 border-b border-charcoal-100 dark:border-charcoal-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-charcoal rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-black">R</span>
            </div>
            <div>
              <p className="font-black text-charcoal dark:text-white text-base leading-none">R.com</p>
              <p className="text-[10px] text-charcoal-400 font-medium mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-charcoal-400 hover:text-charcoal hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all"
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest mb-3">
            Main Menu
          </p>
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.exact}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                          : 'text-charcoal-500 hover:text-charcoal hover:bg-charcoal-50 dark:text-charcoal-400 dark:hover:text-white dark:hover:bg-charcoal-800'
                      }`
                    }
                  >
                    <Icon size={17} />
                    <span className="flex-1">{item.label}</span>
                    {item.superAdminOnly && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">
                        SA
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 pt-6 border-t border-charcoal-100 dark:border-charcoal-800">
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal-500 hover:text-charcoal hover:bg-charcoal-50 dark:text-charcoal-400 dark:hover:text-white dark:hover:bg-charcoal-800 transition-all duration-200"
            >
              <Store size={17} />
              <span>View Store</span>
            </NavLink>
          </div>
        </nav>

        {/* Profile */}
        <div className="px-3 py-4 border-t border-charcoal-100 dark:border-charcoal-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2">
            <div className="w-8 h-8 bg-charcoal dark:bg-white rounded-full flex items-center justify-center shrink-0">
              <span className="text-white dark:text-charcoal text-xs font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-charcoal dark:text-white truncate">
                {profile?.full_name || profile?.email || 'Admin'}
              </p>
              <p className="text-[10px] text-charcoal-400 capitalize">
                {profile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
