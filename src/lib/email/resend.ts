import { Resend } from 'resend'

export {
  buildNotificationEmailHtml,
  buildNotificationEmailText,
  formatFieldsHtml,
  formatFieldsText,
  formatMembershipRequestEmail,
  formatTourRequestEmail,
} from '@/lib/email/templates'

type EmailPayload = {
  subject: string
  html: string
  text: string
  replyTo?: string
}

export async function sendOwnerNotificationEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const notificationEmail = process.env.NOTIFICATION_EMAIL

  if (!apiKey || !fromEmail || !notificationEmail) {
    console.error('Resend environment variables are not configured')
    return { error: new Error('Resend environment variables are not configured') }
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: notificationEmail,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo,
  })

  return { error }
}
