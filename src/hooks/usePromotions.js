import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function usePromotions() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPromotions = async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('promotions')
      .select('*, product:products(id, name, price)')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setPromotions(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPromotions() }, [])

  const createPromotion = async (promo) => {
    const { data, error } = await supabase
      .from('promotions')
      .insert(promo)
      .select('*, product:products(id, name, price)')
      .single()
    if (error) throw error
    await fetchPromotions()
    return data
  }

  const updatePromotion = async (id, promo) => {
    const { data, error } = await supabase
      .from('promotions')
      .update(promo)
      .eq('id', id)
      .select('*, product:products(id, name, price)')
      .single()
    if (error) throw error
    await fetchPromotions()
    return data
  }

  const deletePromotion = async (id) => {
    const { error } = await supabase.from('promotions').delete().eq('id', id)
    if (error) throw error
    await fetchPromotions()
  }

  return { promotions, loading, error, createPromotion, updatePromotion, deletePromotion, refetch: fetchPromotions }
}
