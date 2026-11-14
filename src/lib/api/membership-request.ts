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

  const fields = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    age: data.age,
    membership_type: data.membership_type,
  }

  let saved = false

  try {
    const supabase = getSupabaseServerClient()

    try {
      const { error: insertError } = await supabase.from('membership_requests').insert({
        ...fields,
        status: 'new',
      })

      if (insertError) {
        console.error('Membership insert failed:', insertError)
      } else {
        saved = true
      }
    } catch (error) {
      console.error('Membership insert failed:', error)
    }
  } catch (error) {
    console.error('Supabase configuration error:', error)
  }

  let emailed = false

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
    } else {
      emailed = true
    }
  } catch (error) {
    console.error('Membership email failed:', error)
  }

  if (!saved && !emailed) {
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
