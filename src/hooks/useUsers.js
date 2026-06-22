import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useAdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isSuperAdmin } = useAuth()

  const fetchUsers = async () => {
    if (!isSuperAdmin) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [isSuperAdmin])

  const updateUserRole = async (userId, role) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    if (error) throw error
    await fetchUsers()
  }

  const deleteUser = async (userId) => {
    // Delete profile (auth user must be deleted via Supabase Edge Function or Admin API)
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (error) throw error
    await fetchUsers()
  }

  return { users, loading, error, updateUserRole, deleteUser, refetch: fetchUsers }
}
