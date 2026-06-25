import { useState } from 'react'
import { Plus, Trash2, Edit2, RefreshCw, Tag } from 'lucide-react'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { useBrands } from '../../hooks/useBrands'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function BrandsPage() {
  const { brands, loading, error, createBrand, updateBrand, deleteBrand, refetch } = useBrands()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
    defaultValues: editingId
      ? brands.find((b) => b.id === editingId) || { name: '', description: '' }
      : { name: '', description: '' },
  })

  const openCreateModal = () => {
    setEditingId(null)
    reset({ name: '', description: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (brand) => {
    setEditingId(brand.id)
    reset({ name: brand.name, description: brand.description || '' })
    setIsModalOpen(true)
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const slug = data.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      
      const brandData = { ...data, slug }
      
      if (editingId) {
        await updateBrand(editingId, brandData)
        toast.success('Brand updated')
      } else {
        await createBrand(brandData)
        toast.success('Brand created')
      }
      setIsModalOpen(false)
      reset()
    } catch (err) {
      toast.error(err.message || 'Failed to save brand')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteBrand(id)
      toast.success('Brand deleted')
      setConfirmDelete(null)
    } catch (err) {
      toast.error(err.message || 'Failed to delete brand')
    }
  }

  return (
    <div className="flex h-screen bg-cream dark:bg-charcoal-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-charcoal dark:text-white mb-1 flex items-center gap-3">
                  <div className="w-8 h-8 bg-charcoal dark:bg-white rounded-lg flex items-center justify-center">
                    <Tag size={16} className="text-white dark:text-charcoal" />
                  </div>
                  Manage Brands
                </h1>
                <p className="text-charcoal-500 dark:text-charcoal-400 text-sm">Create, edit, and delete product brands</p>
              </div>
              <Button
                onClick={openCreateModal}
                variant="primary"
                className="gap-2"
              >
                <Plus size={18} />
                Add Brand
              </Button>
            </div>

            {/* Loading State */}
            {loading && <PageLoader />}

            {/* Error State */}
            {error && !loading && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                <p className="font-medium">Failed to load brands</p>
                <p className="text-sm mt-1">{error}</p>
                <Button
                  onClick={refetch}
                  variant="ghost"
                  size="sm"
                  className="mt-3 gap-2"
                >
                  <RefreshCw size={16} />
                  Try again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && brands.length === 0 && (
              <EmptyState
                icon={Tag}
                title="No brands yet"
                description="Create your first brand to organize products"
                action={
                  <Button onClick={openCreateModal} variant="primary" className="gap-2">
                    <Plus size={18} />
                    Create Brand
                  </Button>
                }
              />
            )}

            {/* Brands Table */}
            {!loading && !error && brands.length > 0 && (
              <div className="bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-100 dark:border-charcoal-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-charcoal-50 dark:bg-charcoal-700 border-b border-charcoal-100 dark:border-charcoal-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-charcoal dark:text-white uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-charcoal dark:text-white uppercase tracking-widest">Description</th>
                      <th className="px-6 py-4 text-right text-xs font-black text-charcoal dark:text-white uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-100 dark:divide-charcoal-700">
                    {brands.map((brand) => (
                      <tr
                        key={brand.id}
                        className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-charcoal dark:text-white">{brand.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-charcoal-500 dark:text-charcoal-400 text-sm">
                            {brand.description || '—'}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(brand)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-charcoal-100 dark:hover:bg-charcoal-700 transition-all"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(brand)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Brand' : 'Create Brand'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Apple"
              {...register('name', {
                required: 'Brand name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' },
                maxLength: { value: 100, message: 'Maximum 100 characters' },
              })}
              className="w-full px-3 py-2 border border-charcoal-200 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-700 text-charcoal dark:text-white placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:ring-2 focus:ring-charcoal focus:border-transparent"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
              Description (optional)
            </label>
            <textarea
              placeholder="Describe this brand..."
              {...register('description', {
                maxLength: { value: 500, message: 'Maximum 500 characters' },
              })}
              rows={3}
              className="w-full px-3 py-2 border border-charcoal-200 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-700 text-charcoal dark:text-white placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:ring-2 focus:ring-charcoal focus:border-transparent"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <Modal
          isOpen={true}
          onClose={() => setConfirmDelete(null)}
          title="Delete Brand"
        >
          <div className="space-y-4">
            <p className="text-charcoal dark:text-charcoal-300">
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(confirmDelete.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
