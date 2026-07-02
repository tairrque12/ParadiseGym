'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { MembershipRequestsTable } from '@/components/admin/membership-requests-table'
import { TourRequestsTable } from '@/components/admin/tour-requests-table'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  countRequestsByStatus,
  filterRequestsBySearch,
} from '@/lib/admin/filter-requests'
import {
  fetchMembershipRequests,
  fetchTourRequests,
  updateMembershipRequestStatus,
  updateTourRequestStatus,
  type MembershipRequestRecord,
  type TourRequestRecord,
} from '@/lib/admin/requests'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export function AdminDashboard() {
  const router = useRouter()
  const [membershipRequests, setMembershipRequests] = useState<
    MembershipRequestRecord[]
  >([])
  const [tourRequests, setTourRequests] = useState<TourRequestRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [toastError, setToastError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const loadRequests = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const supabase = createSupabaseBrowserClient()
      const [membershipResult, tourResult] = await Promise.all([
        fetchMembershipRequests(supabase),
        fetchTourRequests(supabase),
      ])

      if (membershipResult.error || tourResult.error) {
        setLoadError('Unable to load requests right now.')
        return
      }

      setMembershipRequests((membershipResult.data ?? []) as MembershipRequestRecord[])
      setTourRequests((tourResult.data ?? []) as TourRequestRecord[])
    } catch {
      setLoadError('Unable to load requests right now.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRequests()
  }, [loadRequests])

  useEffect(() => {
    if (!toastError) return
    const timer = window.setTimeout(() => setToastError(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toastError])

  const filteredMembershipRequests = useMemo(
    () => filterRequestsBySearch(membershipRequests, searchQuery),
    [membershipRequests, searchQuery]
  )

  const filteredTourRequests = useMemo(
    () => filterRequestsBySearch(tourRequests, searchQuery),
    [tourRequests, searchQuery]
  )

  const newMembershipCount = countRequestsByStatus(membershipRequests, 'new')
  const newTourCount = countRequestsByStatus(tourRequests, 'new')

  const handleMembershipStatusChange = async (id: string, status: string) => {
    const previous = membershipRequests
    setMembershipRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    )
    setUpdatingId(id)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await updateMembershipRequestStatus(supabase, id, status)

      if (error) {
        setMembershipRequests(previous)
        setToastError('Failed to update membership request status.')
      }
    } catch {
      setMembershipRequests(previous)
      setToastError('Failed to update membership request status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleTourStatusChange = async (id: string, status: string) => {
    const previous = tourRequests
    setTourRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    )
    setUpdatingId(id)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await updateTourRequestStatus(supabase, id, status)

      if (error) {
        setTourRequests(previous)
        setToastError('Failed to update tour request status.')
      }
    } catch {
      setTourRequests(previous)
      setToastError('Failed to update tour request status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
      router.push('/admin/login')
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-carbon px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader onLogout={handleLogout} isLoggingOut={isLoggingOut} />

        {toastError ? (
          <div
            role="alert"
            className="mb-4 rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {toastError}
          </div>
        ) : null}

        <div className="mb-6">
          <label htmlFor="admin-search" className="sr-only">
            Search requests
          </label>
          <Input
            id="admin-search"
            aria-label="Search requests"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name or email"
            className="h-11 max-w-xl rounded-sm border-white/15 bg-[#141414] text-white focus-visible:border-neon focus-visible:ring-neon/40"
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-white/60">Loading requests...</p>
        ) : loadError ? (
          <p className="text-sm text-red-400">{loadError}</p>
        ) : (
          <Tabs defaultValue="membership">
            <TabsList>
              <TabsTrigger value="membership">
                Membership Requests
                {newMembershipCount > 0 ? (
                  <span className="rounded-full bg-carbon/80 px-2 py-0.5 text-[10px] font-bold text-neon">
                    {newMembershipCount}
                  </span>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="tour">
                Tour Requests
                {newTourCount > 0 ? (
                  <span className="rounded-full bg-carbon/80 px-2 py-0.5 text-[10px] font-bold text-neon">
                    {newTourCount}
                  </span>
                ) : null}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="membership" className="pt-2">
              <MembershipRequestsTable
                requests={filteredMembershipRequests}
                updatingId={updatingId}
                onStatusChange={handleMembershipStatusChange}
              />
            </TabsContent>

            <TabsContent value="tour" className="pt-2">
              <TourRequestsTable
                requests={filteredTourRequests}
                updatingId={updatingId}
                onStatusChange={handleTourStatusChange}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
