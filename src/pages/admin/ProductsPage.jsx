import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import Sidebar from '../../components/admin/Sidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ProductForm from '../../components/admin/ProductForm'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { useAdminProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'default' },
  out_of_stock: { label: 'Out of Stock', variant: 'danger' },
}

export default function AdminProductsPage() {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useAdminProducts()
  const { categories } = useCategories()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'all' || p.category_id === categoryFilter
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  })

  const handleSave = async (data) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data)
        toast.success('Product updated!')
      } else {
        await createProduct(data)
        toast.success('Product created!')
      }
      setModalOpen(false)
      setEditingProduct(null)
    } catch (err) {
      throw err
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      setConfirmDelete(null)
    } catch (err) {
      toast.error('Failed to delete: ' + err.message)
    }
  }

  const openCreate = () => { setEditingProduct(null); setModalOpen(true) }
  const openEdit = (p) => { setEditingProduct(p); setModalOpen(true) }

  return (
    <div className="flex min-h-screen bg-cream dark:bg-charcoal-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Products" subtitle="Manage your product catalog" />
        <main className="p-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field py-1.5 text-xs w-auto pr-8"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Status filter */}
            {['all', 'active', 'inactive', 'out_of_stock'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                    : 'bg-white dark:bg-charcoal-800 text-charcoal-500 dark:text-charcoal-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-700'
                }`}
              >
                {s === 'all' ? 'All Status' : s === 'out_of_stock' ? 'Out of Stock' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <PageLoader />
          ) : filtered.length === 0 ? (
            <EmptyState
              type="products"
              title={search ? 'No matching products' : 'No products yet'}
              description={search ? 'Try a different search.' : 'Create your first product.'}
              action={!search && <Button onClick={openCreate}><Plus size={15} /> Add Product</Button>}
            />
          ) : (
            <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-charcoal-400 uppercase tracking-wider border-b border-charcoal-100 dark:border-charcoal-700">
                      <th className="px-6 py-3 font-semibold">Product</th>
                      <th className="px-6 py-3 font-semibold">Category</th>
                      <th className="px-6 py-3 font-semibold">Brand</th>
                      <th className="px-6 py-3 font-semibold">Price</th>
                      <th className="px-6 py-3 font-semibold">Stock</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-50 dark:divide-charcoal-700">
                    {filtered.map((p) => {
                      const status = STATUS_MAP[p.status] || STATUS_MAP.active
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50 transition-colors"
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-card-gray rounded-xl overflow-hidden shrink-0">
                                {p.images?.[0] ? (
                                  <img src={p.images[0]} alt="" className="w-full h-full object-contain p-1" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-charcoal-300 text-xs">?</div>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-charcoal dark:text-white line-clamp-1">
                                  {p.name}
                                </p>
                                {p.featured && (
                                  <span className="text-[10px] text-amber-600 font-semibold">★ Featured</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-charcoal-500 dark:text-charcoal-400">
                            {p.categories?.name || '—'}
                          </td>
                          <td className="px-6 py-3 text-charcoal-500 dark:text-charcoal-400">
                            {p.brands?.name || '—'}
                          </td>
                          <td className="px-6 py-3 font-semibold text-charcoal dark:text-charcoal-200">
                            {formatPrice(p.price)}
                          </td>
                          <td className="px-6 py-3">
                            <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-yellow-600' : 'text-charcoal dark:text-charcoal-200'}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEdit(p)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-charcoal-100 dark:hover:text-white dark:hover:bg-charcoal-700 transition-all"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setConfirmDelete(p)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-charcoal-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-charcoal-100 dark:border-charcoal-700 text-xs text-charcoal-400">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null) }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditingProduct(null) }}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete Product"
        size="sm"
      >
        <p className="text-sm text-charcoal-500 dark:text-charcoal-300 mb-6">
          Are you sure you want to delete <strong className="text-charcoal dark:text-white">{confirmDelete?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => handleDelete(confirmDelete.id)} className="flex-1">
            Delete
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(null)} className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
