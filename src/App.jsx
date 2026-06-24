import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/admin/ProtectedRoute'

// Client Pages
import HomePage from './pages/client/HomePage'
import ProductsPage from './pages/client/ProductsPage'
import ProductDetailPage from './pages/client/ProductDetailPage'
import CartPage from './pages/client/CartPage'
import CheckoutPage from './pages/client/CheckoutPage'
import OrderConfirmationPage from './pages/client/OrderConfirmationPage'

// Admin Pages
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import AdminProductsPage from './pages/admin/ProductsPage'
import OrdersPage from './pages/admin/OrdersPage'
import UsersPage from './pages/admin/UsersPage'
import SettingsPage from './pages/admin/SettingsPage'

function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal-900 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1A1A1A',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  iconTheme: { primary: '#22c55e', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
            <Routes>
              {/* ── Client Routes ── */}
              <Route path="/" element={<ClientLayout><HomePage /></ClientLayout>} />
              <Route path="/products" element={<ClientLayout><ProductsPage /></ClientLayout>} />
              <Route path="/products/:id" element={<ClientLayout><ProductDetailPage /></ClientLayout>} />
              <Route path="/cart" element={<ClientLayout><CartPage /></ClientLayout>} />
              <Route path="/checkout" element={<ClientLayout><CheckoutPage /></ClientLayout>} />
              <Route path="/order-confirmation/:id" element={<ClientLayout><OrderConfirmationPage /></ClientLayout>} />

              {/* ── Admin Routes ── */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute superAdminOnly><SettingsPage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
