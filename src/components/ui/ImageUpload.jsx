import { Upload, X } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ImageUpload({ value = '', onChange }) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB')
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('R.com').upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('R.com').getPublicUrl(data.path)
      onChange(publicUrl)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally { setUploading(false) }
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
          <img src={value} alt="logo" className="w-full h-full object-contain" />
          <button type="button" onClick={() => onChange('')} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={12} /></button>
        </div>
      ) : (
        <label className={`w-20 h-20 border-2 border-dashed border-charcoal-200 dark:border-charcoal-600 rounded-xl flex flex-col items-center justify-center cursor-pointer`}> 
          <Upload size={18} className="text-charcoal-400 mb-1" />
          <span className="text-[10px] text-charcoal-400 font-medium">Upload</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  )
}
