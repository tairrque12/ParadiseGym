import { NextResponse } from 'next/server'
import { tourRequestSchema } from '@/lib/validations/tour'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { formatTourRequestEmail } from '@/lib/email/templates'
import { sendOwnerNotificationEmail } from '@/lib/email/resend'

export async function handleTourRequest(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = tourRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data

  let supabase
  try {
    supabase = getSupabaseServerClient()
  } catch (error) {
    console.error('Supabase configuration error:', error)
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
  }

  const { error: insertError } = await supabase.from('tour_requests').insert({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    preferred_date: data.preferred_date || null,
    preferred_time: data.preferred_time || null,
    status: 'new',
  })

  if (insertError) {
    console.error('Tour insert failed:', insertError)
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
  }

  const fields = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    preferred_date: data.preferred_date ?? null,
    preferred_time: data.preferred_time ?? null,
  }

  try {
    const { html, text } = formatTourRequestEmail(fields)

    const emailResult = await sendOwnerNotificationEmail({
      subject: 'New Paradise Gym Tour Request',
      html,
      text,
    })

    if (emailResult.error) {
      console.error('Tour email failed:', emailResult.error)
    }
  } catch (error) {
    console.error('Tour email failed:', error)
  }

  return NextResponse.json({ success: true })
}
