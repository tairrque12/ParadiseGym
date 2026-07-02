import { Resend } from 'resend'
import { CONTACT } from '@/lib/contact'

type EmailPayload = {
  subject: string
  html: string
  text: string
}

export async function sendOwnerNotificationEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !fromEmail) {
    console.error('Resend environment variables are not configured')
    return { error: new Error('Resend environment variables are not configured') }
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: CONTACT.email,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  })

  return { error }
}

export function formatFieldsHtml(
  title: string,
  fields: Record<string, string | number | null | undefined>
) {
  const rows = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;text-transform:capitalize;">${key.replaceAll('_', ' ')}</td><td style="padding:8px 12px;">${value ?? '—'}</td></tr>`
    )
    .join('')

  return `
    <h2 style="font-family:sans-serif;color:#39FF14;">${title}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;color:#f5f5f5;background:#141414;">
      ${rows}
    </table>
  `
}

export function formatFieldsText(
  title: string,
  fields: Record<string, string | number | null | undefined>
) {
  const lines = Object.entries(fields).map(
    ([key, value]) => `${key.replaceAll('_', ' ')}: ${value ?? '—'}`
  )
  return `${title}\n\n${lines.join('\n')}`
}
