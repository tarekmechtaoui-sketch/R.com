import { useState } from 'react'
import { Plus, Trash2, Shield, User } from 'lucide-react'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { useAdminUsers } from '../../hooks/useUsers'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../utils/helpers'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const { users, loading, updateUserRole, deleteUser, refetch } = useAdminUsers()
  const { profile: myProfile } = useAuth()
  const [createModal, setCreateModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [creating, setCreating] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const handleCreate = async (data) => {
    setCreating(true)
    try {
      // Note: Creating users requires service role key via Edge Function
      // For now, instruct admin to create user via Supabase dashboard
      // then update role here
      toast.error('To create admins: Go to Supabase Dashboard → Auth → Add User, then update their role here.')
    } finally {
      setCreating(false)
    }
  }

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUserRole(userId, role)
      toast.success('Role updated')
    } catch (err) {
      toast.error('Failed: ' + err.message)
    }
  }

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId)
      toast.success('User removed from admin panel')
      setConfirmDelete(null)
    } catch (err) {
      toast.error('Failed: ' + err.message)
    }
  }

  return (
    <div className="flex min-h-screen bg-cream dark:bg-charcoal-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="User Management" subtitle="Manage admin accounts" />
        <main className="p-6">
          {/* Info banner */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <Shield size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">Creating Admin Users</p>
              <p className="text-amber-700 dark:text-amber-300 text-xs mt-0.5">
                To create new admin accounts, go to your Supabase Dashboard → Authentication → Users → Add User. After creating the user, their profile will appear here and you can assign their role.
              </p>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <PageLoader />
          ) : users.length === 0 ? (
            <EmptyState type="users" title="No admin users" description="Create users via Supabase dashboard." />
          ) : (
            <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-charcoal-400 uppercase tracking-wider border-b border-charcoal-100 dark:border-charcoal-700">
                      <th className="px-6 py-3 font-semibold">User</th>
                      <th className="px-6 py-3 font-semibold">Role</th>
                      <th className="px-6 py-3 font-semibold hidden md:table-cell">Joined</th>
                      <th className="px-6 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-50 dark:divide-charcoal-700">
                    {users.map((user) => {
                      const isSelf = user.id === myProfile?.id
                      return (
                        <tr key={user.id} className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-charcoal rounded-full flex items-center justify-center shrink-0">
                                <span className="text-white text-xs font-bold">
                                  {user.email[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-charcoal dark:text-white">
                                  {user.full_name || 'Admin'}
                                  {isSelf && (
                                    <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">You</span>
                                  )}
                                </p>
                                <p className="text-xs text-charcoal-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <select
                              value={user.role}
                              disabled={isSelf}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-all ${
                                user.role === 'super_admin'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300'
                                  : 'bg-charcoal-50 text-charcoal-600 border-charcoal-200 dark:bg-charcoal-700 dark:border-charcoal-600 dark:text-charcoal-300'
                              } ${isSelf ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-3 text-charcoal-400 text-xs hidden md:table-cell">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => !isSelf && setConfirmDelete(user)}
                              disabled={isSelf}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                                isSelf
                                  ? 'text-charcoal-200 cursor-not-allowed'
                                  : 'text-charcoal-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                              }`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-charcoal-100 dark:border-charcoal-700 text-xs text-charcoal-400">
                {users.length} admin{users.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirm */}
      <Modal
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Remove Admin"
        size="sm"
      >
        <p className="text-sm text-charcoal-500 dark:text-charcoal-300 mb-6">
          Remove <strong>{confirmDelete?.email}</strong> from the admin panel? This does not delete their Supabase auth account.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => handleDelete(confirmDelete.id)} className="flex-1">
            Remove
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(null)} className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
