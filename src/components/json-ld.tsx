import { jsonLdScriptContent, type HealthClubJsonLd } from '@/lib/seo'

export function JsonLd({ data }: { data: HealthClubJsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  )
}
