import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { supabaseAdmin } from '../lib/supabaseAdmin'
import { useAuth } from '../contexts/AuthContext'

export function useAdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAdmin } = useAuth()

  const fetchUsers = async () => {
    if (!isAdmin) { setLoading(false); return }
    setLoading(true)
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [isAdmin])

  const createAdminUser = async ({ email, password, fullName, role }) => {
    if (!supabaseAdmin) throw new Error('Service key not configured. Add VITE_SUPABASE_SERVICE_KEY to .env')

    // Create the auth user
    const { data, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName || '' },
    })
    if (createErr) throw createErr

    // Set the role in profiles (trigger auto-creates profile, but we update role)
    const { error: profileErr } = await supabaseAdmin
      .from('profiles')
      .update({ role, full_name: fullName || '' })
      .eq('id', data.user.id)
    if (profileErr) throw profileErr

    await fetchUsers()
    return data.user
  }

  const updateUserRole = async (userId, role) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) throw error
    await fetchUsers()
  }

  const deleteUser = async (userId) => {
    if (!supabaseAdmin) throw new Error('Service key not configured. Add VITE_SUPABASE_SERVICE_KEY to .env')
    // Delete from auth (cascades to profiles via DB trigger)
    const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authErr) throw authErr
    await fetchUsers()
  }

  return { users, loading, error, createAdminUser, updateUserRole, deleteUser, refetch: fetchUsers }
}
