import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Серверный клиент Supabase с service_role.
 * Обходит RLS — использовать ТОЛЬКО в Server Actions / Route Handlers, не на клиенте.
 */
export function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "Нет NEXT_PUBLIC_SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY в .env.local"
    )
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
