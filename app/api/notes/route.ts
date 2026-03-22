import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getSupabaseAdmin()
  const { data } = await db.from('notes').select('content').eq('user_id', userId).single()
  return NextResponse.json({ content: data?.content ?? '' })
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { content } = await req.json()
  const db = getSupabaseAdmin()
  await db.from('notes').upsert({ user_id: userId, content, updated_at: new Date().toISOString() })
  return NextResponse.json({ success: true })
}
