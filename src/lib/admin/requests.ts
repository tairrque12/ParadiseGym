import type { SupabaseClient } from '@supabase/supabase-js'

export type MembershipRequestRecord = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  age: number
  membership_type: string
  status: string
}

export type TourRequestRecord = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  preferred_date: string | null
  preferred_time: string | null
  status: string
}

export async function fetchMembershipRequests(client: SupabaseClient) {
  return client
    .from('membership_requests')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function fetchTourRequests(client: SupabaseClient) {
  return client
    .from('tour_requests')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function updateMembershipRequestStatus(
  client: SupabaseClient,
  id: string,
  status: string
) {
  return client.from('membership_requests').update({ status }).eq('id', id)
}

export async function updateTourRequestStatus(
  client: SupabaseClient,
  id: string,
  status: string
) {
  return client.from('tour_requests').update({ status }).eq('id', id)
}
