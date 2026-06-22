import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Place a new order (public)
export async function placeOrder({ customerInfo, items, total, deliveryType, deliveryFee }) {
  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: customerInfo.fullName,
      phone: customerInfo.phone,
      wilaya: customerInfo.wilaya,
      commune: customerInfo.commune,
      total_price: total,
      delivery_type: deliveryType || 'desk',
      delivery_fee: deliveryFee || 500,
      status: 'new',
      notes: customerInfo.notes || null,
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  // Decrement product stock for each ordered item.
  // Requires the decrement_stock function from supabase/schema.sql.
  try {
    await Promise.all(
      items.map((item) =>
        supabase.rpc('decrement_stock', { p_product_id: item.id, p_quantity: item.quantity })
      )
    )
  } catch (stockErr) {
    // Log but don't fail the order — run supabase/schema.sql to enable stock decrement
    console.warn('Stock decrement skipped:', stockErr?.message)
  }

  return order
}

// Get a single order with items (public, for confirmation page)
export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, images))')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// Admin hooks
export function useAdminOrders({ status } = {}) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*, order_items(*, products(name, images))')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error: err } = await query
    if (err) setError(err.message)
    else setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [status])

  const updateOrderStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)
    if (error) throw error
    await fetchOrders()
  }

  const deleteOrder = async (id) => {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (error) throw error
    await fetchOrders()
  }

  return { orders, loading, error, updateOrderStatus, deleteOrder, refetch: fetchOrders }
}
