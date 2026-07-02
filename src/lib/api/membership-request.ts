import { NextResponse } from 'next/server'
import { membershipRequestSchema } from '@/lib/validations/membership'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  formatMembershipRequestEmail,
} from '@/lib/email/templates'
import { sendOwnerNotificationEmail } from '@/lib/email/resend'

export async function handleMembershipRequest(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = membershipRequestSchema.safeParse(body)
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

  const { error: insertError } = await supabase
    .from('membership_requests')
    .insert({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      age: data.age,
      membership_type: data.membership_type,
      status: 'new',
    })

  if (insertError) {
    console.error('Membership insert failed:', insertError)
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
  }

  const fields = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    age: data.age,
    membership_type: data.membership_type,
  }

  try {
    const { html, text } = formatMembershipRequestEmail(fields)

    const emailResult = await sendOwnerNotificationEmail({
      subject: 'New Paradise Gym Membership Request',
      html,
      text,
      replyTo: data.email,
    })

    if (emailResult.error) {
      console.error('Membership email failed:', emailResult.error)
    }
  } catch (error) {
    console.error('Membership email failed:', error)
  }

  return NextResponse.json({ success: true })
}
