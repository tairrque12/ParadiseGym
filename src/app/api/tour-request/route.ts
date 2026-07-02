import { handleTourRequest } from '@/lib/api/tour-request'

export async function POST(request: Request) {
  return handleTourRequest(request)
}
