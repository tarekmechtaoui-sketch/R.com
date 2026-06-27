import { useState } from 'react'
import { Plus, Trash2, Edit2, RefreshCw, Search, X } from 'lucide-react'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { usePromotions } from '../../hooks/usePromotions'
import { useAdminProducts } from '../../hooks/useProducts'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { formatDate, formatPrice } from '../../utils/helpers'

export default function PromotionsPage() {
  const { promotions, loading, error, createPromotion, updatePromotion, deletePromotion, refetch } = usePromotions()
  const { products } = useAdminProducts()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productSearch, setProductSearch] = useState('')

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { product_id: '', new_price: '', start_at: '', end_at: '' }
  })

  const openCreate = () => {
    setEditingId(null)
    reset({ product_id: '', new_price: '', start_at: '', end_at: '' })
    setProductSearch('')
    setIsModalOpen(true)
  }

  const openEdit = (promo) => {
    const product = products.find((p) => p.id === promo.product_id)
    setEditingId(promo.id)
    reset({
      product_id: promo.product_id,
      new_price: promo.new_price,
      start_at: promo.start_at ? promo.start_at.slice(0,16) : '',
      end_at: promo.end_at ? promo.end_at.slice(0,16) : '',
    })
    setProductSearch(product?.name || '')
    setIsModalOpen(true)
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const product = products.find(p => p.id === data.product_id)
      if (!product) throw new Error('Product not found')
      const promoPayload = {
        product_id: data.product_id,
        name: product.name,
        old_price: product.price,
        new_price: parseFloat(data.new_price),
        start_at: new Date(data.start_at).toISOString(),
        end_at: new Date(data.end_at).toISOString(),
        active: true,
      }
      if (editingId) {
        await updatePromotion(editingId, promoPayload)
        toast.success('Promotion updated')
      } else {
        await createPromotion(promoPayload)
        toast.success('Promotion created')
      }
      setIsModalOpen(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePromotion(id)
      toast.success('Promotion deleted')
      setConfirmDelete(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="flex h-screen bg-cream dark:bg-charcoal-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-charcoal dark:text-white mb-1 flex items-center gap-3">Promotions</h1>
                <p className="text-charcoal-500 dark:text-charcoal-400 text-sm">Create and manage product promotions</p>
              </div>
              <Button onClick={openCreate} variant="primary" className="gap-2"><Plus size={18} /> New Promotion</Button>
            </div>

            {loading && <PageLoader />}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                <p className="font-medium">Failed to load promotions</p>
                <p className="text-sm mt-1">{error}</p>
                <Button onClick={refetch} variant="ghost" size="sm" className="mt-3 gap-2"><RefreshCw size={16} /> Try again</Button>
              </div>
            )}

            {!loading && promotions.length === 0 && (
              <EmptyState title="No promotions" description="Create a promotion to offer discounts" action={<Button onClick={openCreate}><Plus size={14} /> Create Promotion</Button>} />
            )}

            {!loading && promotions.length > 0 && (
              <div className="bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-100 dark:border-charcoal-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-charcoal-400 uppercase tracking-wider border-b border-charcoal-100 dark:border-charcoal-700">
                      <th className="px-6 py-3 font-semibold">Product</th>
                      <th className="px-6 py-3 font-semibold">Old Price</th>
                      <th className="px-6 py-3 font-semibold">New Price</th>
                      <th className="px-6 py-3 font-semibold">Range</th>
                      <th className="px-6 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-50 dark:divide-charcoal-700">
                    {promotions.map((p) => (
                      <tr key={p.id} className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50 transition-colors">
                        <td className="px-6 py-3 font-semibold text-charcoal dark:text-white">{p.product?.name || '—'}</td>
                        <td className="px-6 py-3">{formatPrice(p.old_price)}</td>
                        <td className="px-6 py-3 text-amber-600 font-bold">{formatPrice(p.new_price)}</td>
                        <td className="px-6 py-3">{formatDate(p.start_at)} - {formatDate(p.end_at)}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-charcoal-100 dark:hover:text-white dark:hover:bg-charcoal-700 transition-all"><Edit2 size={14} /></button>
                            <button onClick={() => setConfirmDelete(p)} className="w-8 h-8 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><Trash2 size={14} /></button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Promotion' : 'Create Promotion'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">Product *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value)
                  setValue('product_id', '')
                }}
                placeholder="Search products..."
                className="input-field pl-10"
              />
              {productSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setProductSearch('')
                    setValue('product_id', '')
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-400 hover:text-charcoal"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-charcoal-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800">
              {filteredProducts.length === 0 ? (
                <div className="px-4 py-3 text-sm text-charcoal-500 dark:text-charcoal-400">No matching products</div>
              ) : (
                filteredProducts.slice(0, 8).map((pr) => (
                  <button
                    type="button"
                    key={pr.id}
                    onClick={() => {
                      setValue('product_id', pr.id)
                      setProductSearch(pr.name)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-charcoal-50 dark:hover:bg-charcoal-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-charcoal dark:text-white">{pr.name}</span>
                      <span className="text-sm text-charcoal-500 dark:text-charcoal-400">{formatPrice(pr.price)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
            <input type="hidden" {...register('product_id', { required: 'Product is required' })} />
            {errors.product_id && <p className="text-xs text-red-500 mt-1">{errors.product_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">New Price (DA) *</label>
            <input type="number" step="0.01" {...register('new_price', { required: 'New price is required' })} className="input-field" />
            {errors.new_price && <p className="text-xs text-red-500 mt-1">{errors.new_price.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">Start</label>
              <input type="datetime-local" {...register('start_at', { required: 'Start date required' })} className="input-field" />
              {errors.start_at && <p className="text-xs text-red-500 mt-1">{errors.start_at.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">End</label>
              <input type="datetime-local" {...register('end_at', { required: 'End date required' })} className="input-field" />
              {errors.end_at && <p className="text-xs text-red-500 mt-1">{errors.end_at.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {confirmDelete && (
        <Modal isOpen={true} onClose={() => setConfirmDelete(null)} title="Delete Promotion">
          <div className="space-y-4">
            <p className="text-charcoal dark:text-charcoal-300">Are you sure you want to delete this promotion?</p>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleDelete(confirmDelete.id)}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
