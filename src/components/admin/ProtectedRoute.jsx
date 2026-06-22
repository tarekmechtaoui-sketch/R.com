import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { PageLoader } from '../ui/LoadingSpinner'

export default function ProtectedRoute({ children, superAdminOnly = false }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (superAdminOnly && profile?.role !== 'super_admin') {
    return <Navigate to="/admin" replace />
  }

  return children
}
