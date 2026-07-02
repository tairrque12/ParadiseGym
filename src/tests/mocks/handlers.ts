import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post(/\/api\/membership-request$/, () =>
    HttpResponse.json({ success: true })
  ),
  http.post(/\/api\/tour-request$/, () => HttpResponse.json({ success: true })),
]
