import { handleMembershipRequest } from '@/lib/api/membership-request'

export async function POST(request: Request) {
  return handleMembershipRequest(request)
}
