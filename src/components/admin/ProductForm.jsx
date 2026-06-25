import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Upload, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Button from '../ui/Button'
import toast from 'react-hot-toast'
import { useBrands } from '../../hooks/useBrands'

export default function ProductForm({ product, categories, onSave, onCancel }) {
  const isEditing = Boolean(product?.id)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [images, setImages] = useState(product?.images || [])

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      category_id: product?.category_id || '',
      brand_id: product?.brand_id || '',
      stock: product?.stock || 0,
      status: product?.status || 'active',
      featured: product?.featured || false,
    },
  })

  // Reset form and images whenever a different product is opened for editing
  useEffect(() => {
    reset({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      category_id: product?.category_id || '',
      brand_id: product?.brand_id || '',
      stock: product?.stock || 0,
      status: product?.status || 'active',
      featured: product?.featured || false,
    })
    setImages(product?.images || [])
  }, [product?.id])

  const { brands } = useBrands()

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    setUploadingImage(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage
        .from('R.com')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('R.com').getPublicUrl(data.path)
      setImages((prev) => [...prev, publicUrl])
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Failed to upload image: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = async (url) => {
    setImages((prev) => prev.filter((img) => img !== url))
  }

  const onSubmit = async (data) => {
    try {
      await onSave({
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        images,
      })
    } catch (err) {
      toast.error(err.message || 'Failed to save product')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label className="label">Product Name *</label>
        <input
          className="input-field"
          placeholder="e.g. Premium Phone Case"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Describe the product..."
          {...register('description')}
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Price (DA) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="input-field"
            placeholder="0"
            {...register('price', { required: 'Price is required', min: { value: 0, message: 'Must be positive' } })}
          />
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="label">Stock *</label>
          <input
            type="number"
            min="0"
            className="input-field"
            placeholder="0"
            {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Must be positive' } })}
          />
          {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select className="input-field" {...register('category_id')}>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div>
        <label className="label">Brand</label>
        <select className="input-field" {...register('brand_id')}>
          <option value="">Select brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Status & Featured */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Status</label>
          <select className="input-field" {...register('status')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-charcoal"
              {...register('featured')}
            />
            <span className="text-sm font-semibold text-charcoal dark:text-white">Featured Product</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="label">Product Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 bg-card-gray rounded-xl overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <label className={`w-20 h-20 border-2 border-dashed border-charcoal-200 dark:border-charcoal-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-charcoal transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload size={18} className="text-charcoal-400 mb-1" />
            <span className="text-[10px] text-charcoal-400 font-medium">Upload</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        <p className="text-xs text-charcoal-400">Max 5MB per image. Supported: JPG, PNG, WebP</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {isEditing ? 'Update Product' : 'Create Product'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
