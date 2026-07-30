import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

// Never throw at module scope here: a thrown error during import happens
// before React can render anything, which produces a blank white page with
// no visible message. Missing config is instead surfaced by main.tsx via
// `isSupabaseConfigured`, as a real screen the user can read.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

export const EDGE_FUNCTIONS_URL = `${supabaseUrl ?? ''}/functions/v1`
