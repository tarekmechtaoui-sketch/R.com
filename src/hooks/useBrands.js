import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useBrands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBrands = async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('brands')
      .select('*')
      .order('name')
    if (err) setError(err.message)
    else setBrands(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchBrands() }, [])

  const createBrand = async (brandData) => {
    const { data, error } = await supabase
      .from('brands')
      .insert(brandData)
      .select()
      .single()
    if (error) throw error
    await fetchBrands()
    return data
  }

  const updateBrand = async (id, brandData) => {
    const { data, error } = await supabase
      .from('brands')
      .update(brandData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    await fetchBrands()
    return data
  }

  const deleteBrand = async (id) => {
    const { error } = await supabase.from('brands').delete().eq('id', id)
    if (error) throw error
    await fetchBrands()
  }

  return { brands, loading, error, createBrand, updateBrand, deleteBrand, refetch: fetchBrands }
}
