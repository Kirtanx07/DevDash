// src/lib/supabase.js
// Uncomment and use this once you add @supabase/supabase-js
// npm install @supabase/supabase-js

// import { createClient } from '@supabase/supabase-js'
//
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON
// )
//
// ── Resources ────────────────────────────────────────────────
// export async function fetchResources(userId) {
//   const { data, error } = await supabase
//     .from('resources').select('*')
//     .eq('user_id', userId)
//     .order('created_at', { ascending: false })
//   if (error) throw error
//   return data
// }
//
// export async function upsertResource(userId, resource) {
//   const { data, error } = await supabase
//     .from('resources')
//     .upsert({ ...resource, user_id: userId, updated_at: new Date().toISOString() })
//     .select()
//   if (error) throw error
//   return data[0]
// }
//
// export async function removeResource(id) {
//   const { error } = await supabase.from('resources').delete().eq('id', id)
//   if (error) throw error
// }
//
// ── File Upload ───────────────────────────────────────────────
// export async function uploadFile(file, userId) {
//   const path = `${userId}/${Date.now()}_${file.name}`
//   const { error } = await supabase.storage.from('user-files').upload(path, file)
//   if (error) throw error
//   const { data } = supabase.storage.from('user-files').getPublicUrl(path)
//   return data.publicUrl
// }

export const supabase = null // placeholder until you configure
