import { useState } from 'react'
import { Plus, Trash2, Copy, Check, RefreshCw, Eye, EyeOff, KeyRound } from 'lucide-react'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { useAdminUsers } from '../../hooks/useUsers'
import { useAuth } from '../../contexts/AuthContext'
import { formatDate } from '../../utils/helpers'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// ── Password generator ──────────────────────────────────────────
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
function generatePassword(length = 14) {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => CHARS[b % CHARS.length])
    .join('')
}

// ── Copy-to-clipboard button ────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-charcoal-100 dark:hover:bg-charcoal-700 transition-all"
      title="Copy"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  )
}

export default function UsersPage() {
  const { users, loading, createAdminUser, updateUserRole, deleteUser } = useAdminUsers()
  const { profile: myProfile } = useAuth()

  const [createModal, setCreateModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [creating, setCreating] = useState(false)
  const [createdCreds, setCreatedCreds] = useState(null) // { email, password } after success
  const [showPassword, setShowPassword] = useState(false)

  const [generatedPassword, setGeneratedPassword] = useState(() => generatePassword())

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const openCreateModal = () => {
    setCreatedCreds(null)
    setShowPassword(false)
    setGeneratedPassword(generatePassword())
    reset()
    setCreateModal(true)
  }

  const handleCreate = async (data) => {
    setCreating(true)
    try {
      await createAdminUser({
        email: data.email,
        password: generatedPassword,
        fullName: data.fullName,
        role: data.role,
      })
      setCreatedCreds({ email: data.email, password: generatedPassword })
      toast.success('Admin account created!')
    } catch (err) {
      toast.error(err.message)
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
      toast.success('Admin account deleted')
      setConfirmDelete(null)
    } catch (err) {
      toast.error('Failed: ' + err.message)
    }
  }

  return (
    <div className="flex min-h-screen bg-cream dark:bg-charcoal-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Admin Users" subtitle="Manage admin and super admin accounts" />
        <main className="p-6">

          {/* Toolbar */}
          <div className="flex justify-end mb-6">
            <Button onClick={openCreateModal}>
              <Plus size={16} />
              Add Admin
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <PageLoader />
          ) : users.length === 0 ? (
            <EmptyState
              type="users"
              title="No admins yet"
              description="Add your first admin account."
              action={<Button onClick={openCreateModal}><Plus size={15} /> Add Admin</Button>}
            />
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
                              <div className="w-9 h-9 bg-charcoal dark:bg-white rounded-full flex items-center justify-center shrink-0">
                                <span className="text-white dark:text-charcoal text-xs font-bold">
                                  {(user.full_name || user.email || 'A')[0].toUpperCase()}
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
                              title={isSelf ? "You can't delete yourself" : 'Delete admin'}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                                isSelf
                                  ? 'text-charcoal-200 dark:text-charcoal-600 cursor-not-allowed'
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

      {/* ── Create Admin Modal ── */}
      <Modal
        isOpen={createModal}
        onClose={() => { setCreateModal(false); setCreatedCreds(null) }}
        title={createdCreds ? 'Admin Created' : 'Add New Admin'}
        size="md"
      >
        {createdCreds ? (
          /* ── Success screen: show credentials ── */
          <div className="space-y-5">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm text-green-700 dark:text-green-300">
              Account created successfully. Share these credentials with the new admin — the password will not be shown again.
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-charcoal-400 mb-1 font-medium">Email</p>
                <div className="flex items-center gap-2 bg-charcoal-50 dark:bg-charcoal-700 rounded-xl px-3 py-2.5">
                  <span className="flex-1 text-sm font-mono text-charcoal dark:text-white">{createdCreds.email}</span>
                  <CopyButton text={createdCreds.email} />
                </div>
              </div>
              <div>
                <p className="text-xs text-charcoal-400 mb-1 font-medium">Password</p>
                <div className="flex items-center gap-2 bg-charcoal-50 dark:bg-charcoal-700 rounded-xl px-3 py-2.5">
                  <span className="flex-1 text-sm font-mono text-charcoal dark:text-white tracking-wider">
                    {showPassword ? createdCreds.password : '•'.repeat(createdCreds.password.length)}
                  </span>
                  <button
                    onClick={() => setShowPassword((v) => !v)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-charcoal-100 dark:hover:bg-charcoal-600 transition-all"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <CopyButton text={createdCreds.password} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button onClick={() => { setCreateModal(false); setCreatedCreds(null) }} className="flex-1">
                Done
              </Button>
              <Button
                variant="outline"
                onClick={() => { setCreatedCreds(null); setGeneratedPassword(generatePassword()); reset() }}
                className="flex-1"
              >
                Add Another
              </Button>
            </div>
          </div>
        ) : (
          /* ── Create form ── */
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                className="input-field"
                placeholder="Admin's full name (optional)"
                {...register('fullName')}
              />
            </div>

            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Role *</label>
              <select className="input-field" {...register('role', { required: true })}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="label">Generated Password</label>
              <div className="flex items-center gap-2 bg-charcoal-50 dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-xl px-3 py-2.5">
                <KeyRound size={14} className="text-charcoal-400 shrink-0" />
                <span className="flex-1 text-sm font-mono text-charcoal dark:text-white tracking-wider">
                  {generatedPassword}
                </span>
                <CopyButton text={generatedPassword} />
                <button
                  type="button"
                  onClick={() => setGeneratedPassword(generatePassword())}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-charcoal-100 dark:hover:bg-charcoal-600 transition-all"
                  title="Regenerate"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
              <p className="text-xs text-charcoal-400 mt-1">
                Auto-generated. The admin can change it after first login.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={creating} className="flex-1">
                {creating ? 'Creating...' : 'Create Admin'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete Admin"
        size="sm"
      >
        <p className="text-sm text-charcoal-500 dark:text-charcoal-300 mb-1">
          Permanently delete the account for:
        </p>
        <p className="font-semibold text-charcoal dark:text-white mb-6">{confirmDelete?.email}</p>
        <p className="text-xs text-charcoal-400 mb-6">
          This will delete the auth account and remove all access. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => handleDelete(confirmDelete.id)} className="flex-1">
            Delete Account
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(null)} className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
