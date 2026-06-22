import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    if (err) setError(err.message)
    else setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const createCategory = async (categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()
    if (error) throw error
    await fetchCategories()
    return data
  }

  const updateCategory = async (id, categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    await fetchCategories()
    return data
  }

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    await fetchCategories()
  }

  return { categories, loading, error, createCategory, updateCategory, deleteCategory, refetch: fetchCategories }
}
