import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts({ categorySlug, brandSlug, search, featured, limit } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('products')
        .select('*, categories(id, name, slug), brands(id, name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (featured) query = query.eq('featured', true)
      if (search) query = query.ilike('name', `%${search}%`)
      if (limit) query = query.limit(limit)
      if (categorySlug && categorySlug !== 'all') {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single()
        if (cat) query = query.eq('category_id', cat.id)
      }

      if (brandSlug && brandSlug !== 'all') {
        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('slug', brandSlug)
          .single()
        if (brand) query = query.eq('brand_id', brand.id)
      }

      const { data, error: err } = await query
      if (err) throw err
      setProducts(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [categorySlug, search, featured, limit])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetch = async () => {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('products')
        .select('*, categories(id, name, slug), brands(id, name)')
        .eq('id', id)
        .single()
      if (err) setError(err.message)
      else setProduct(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  return { product, loading, error }
}

// Admin: fetch all products (including inactive)
export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('products')
      .select('*, categories(id, name, slug), brands(id, name)')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const createProduct = async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select('*, categories(id, name, slug), brands(id, name)')
      .single()
    if (error) throw error
    await fetchProducts()
    return data
  }

  const updateProduct = async (id, productData) => {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select('*, categories(id, name, slug), brands(id, name)')
      .single()
    if (error) throw error
    await fetchProducts()
    return data
  }

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    await fetchProducts()
  }

  return { products, loading, error, createProduct, updateProduct, deleteProduct, refetch: fetchProducts }
}
