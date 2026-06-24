import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

/**
 * Admin client that uses the service_role key.
 * Only used for super-admin operations (create/delete auth users).
 * This client bypasses RLS — keep VITE_SUPABASE_SERVICE_KEY secret and
 * never expose it to untrusted users.
 */
export const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null
