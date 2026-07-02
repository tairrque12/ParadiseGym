type FieldMap = Record<string, string | number | null | undefined>

type EmailTemplateOptions = {
  heading: string
  fields: FieldMap
  highlightFields?: string[]
  highlightOnlyWhenPresent?: boolean
  submittedAt?: Date
}

const SITE_URL = 'paradisegymofficial.com'

const BRAND = {
  carbon: '#0A0A0A',
  neon: '#39FF14',
  bodyBg: '#e8e8e8',
  cardBg: '#ffffff',
  footerBg: '#f0f0f0',
  rowAlt: '#f7f7f7',
  rowBase: '#ffffff',
  label: '#1a1a1a',
  value: '#333333',
  muted: '#666666',
  border: '#e0e0e0',
} as const

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function formatLabel(key: string): string {
  return key.replaceAll('_', ' ')
}

function formatDisplayValue(key: string, value: string | number): string {
  if (key === 'membership_type' && typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
  return String(value)
}

function hasValue(value: string | number | null | undefined): boolean {
  return value !== null && value !== undefined && String(value).trim() !== ''
}

function formatSubmittedAt(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

function renderHighlightedValue(
  key: string,
  value: string | number
): string {
  const display = escapeHtml(formatDisplayValue(key, value))

  if (key === 'membership_type') {
    return `<span style="display:inline-block;background-color:${BRAND.carbon};color:${BRAND.neon};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.5px;line-height:1;padding:6px 14px;border-radius:999px;text-transform:uppercase;">${display}</span>`
  }

  return `<span style="display:inline-block;background-color:${BRAND.carbon};color:${BRAND.neon};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;line-height:1;padding:6px 14px;border-radius:6px;">${display}</span>`
}

function renderFieldValue(
  key: string,
  value: string | number | null | undefined,
  highlighted: boolean
): string {
  if (!hasValue(value)) {
    return `<span style="color:${BRAND.muted};font-family:Arial,Helvetica,sans-serif;font-size:15px;">—</span>`
  }

  if (highlighted) {
    return renderHighlightedValue(key, value as string | number)
  }

  return `<span style="color:${BRAND.value};font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.5;">${escapeHtml(formatDisplayValue(key, value as string | number))}</span>`
}

function buildDataRows(
  fields: FieldMap,
  highlightFields: string[],
  highlightOnlyWhenPresent: boolean
): string {
  return Object.entries(fields)
    .map(([key, value], index) => {
      const shaded = index % 2 === 1
      const rowBg = shaded ? BRAND.rowAlt : BRAND.rowBase
      const shouldHighlight =
        highlightFields.includes(key) &&
        (!highlightOnlyWhenPresent || hasValue(value))

      return `
        <tr>
          <td style="background-color:${rowBg};border-bottom:1px solid ${BRAND.border};color:${BRAND.label};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1.4;padding:14px 18px;vertical-align:top;width:38%;">
            ${escapeHtml(formatLabel(key))}
          </td>
          <td style="background-color:${rowBg};border-bottom:1px solid ${BRAND.border};padding:14px 18px;vertical-align:top;width:62%;">
            ${renderFieldValue(key, value, shouldHighlight)}
          </td>
        </tr>`
    })
    .join('')
}

export function buildNotificationEmailHtml({
  heading,
  fields,
  highlightFields = [],
  highlightOnlyWhenPresent = false,
  submittedAt = new Date(),
}: EmailTemplateOptions): string {
  const rows = buildDataRows(fields, highlightFields, highlightOnlyWhenPresent)
  const timestamp = escapeHtml(formatSubmittedAt(submittedAt))

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:${BRAND.bodyBg};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.bodyBg};border-collapse:collapse;margin:0;padding:0;width:100%;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:600px;width:100%;">
            <tr>
              <td style="background-color:${BRAND.carbon};border-radius:8px 8px 0 0;padding:24px 32px;">
                <div style="color:${BRAND.neon};font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:700;letter-spacing:1.5px;line-height:1.2;text-transform:uppercase;">
                  Paradise Gym
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color:${BRAND.cardBg};padding:28px 32px 8px;">
                <h1 style="color:${BRAND.label};font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;line-height:1.3;margin:0 0 20px;">
                  ${escapeHtml(heading)}
                </h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.border};border-collapse:collapse;border-radius:6px;overflow:hidden;width:100%;">
                  ${rows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color:${BRAND.footerBg};border-radius:0 0 8px 8px;padding:16px 32px 24px;">
                <p style="color:${BRAND.muted};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;margin:0;">
                  Submitted via ${SITE_URL}<br />
                  ${timestamp}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function buildNotificationEmailText({
  heading,
  fields,
  submittedAt = new Date(),
}: EmailTemplateOptions): string {
  const lines = Object.entries(fields).map(([key, value]) => {
    const display = hasValue(value)
      ? formatDisplayValue(key, value as string | number)
      : '—'
    return `${formatLabel(key)}: ${display}`
  })

  return `${heading}

${lines.join('\n')}

Submitted via ${SITE_URL}
${formatSubmittedAt(submittedAt)}`
}

export function formatMembershipRequestEmail(
  fields: FieldMap,
  submittedAt = new Date()
) {
  const options: EmailTemplateOptions = {
    heading: 'New Membership Request',
    fields,
    highlightFields: ['membership_type'],
    submittedAt,
  }

  return {
    html: buildNotificationEmailHtml(options),
    text: buildNotificationEmailText(options),
  }
}

export function formatTourRequestEmail(
  fields: FieldMap,
  submittedAt = new Date()
) {
  const options: EmailTemplateOptions = {
    heading: 'New Tour Request',
    fields,
    highlightFields: ['preferred_date', 'preferred_time'],
    highlightOnlyWhenPresent: true,
    submittedAt,
  }

  return {
    html: buildNotificationEmailHtml(options),
    text: buildNotificationEmailText(options),
  }
}

// Backward-compatible helpers used by older call sites/tests.
export function formatFieldsHtml(
  title: string,
  fields: FieldMap,
  submittedAt = new Date()
) {
  const isTour = title.toLowerCase().includes('tour')
  const email = isTour
    ? formatTourRequestEmail(fields, submittedAt)
    : formatMembershipRequestEmail(fields, submittedAt)

  return email.html
}

export function formatFieldsText(
  title: string,
  fields: FieldMap,
  submittedAt = new Date()
) {
  const isTour = title.toLowerCase().includes('tour')
  const email = isTour
    ? formatTourRequestEmail(fields, submittedAt)
    : formatMembershipRequestEmail(fields, submittedAt)

  return email.text
}
