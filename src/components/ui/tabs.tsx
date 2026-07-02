'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type TabsContextValue = {
  value: string
  setValue: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')
  const currentValue = value ?? internalValue

  const setValue = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternalValue(next)
      onValueChange?.(next)
    },
    [onValueChange, value]
  )

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={cn('space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex flex-wrap gap-2 border-b border-white/10 pb-3',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const { value: activeValue, setValue } = useTabsContext()
  const isActive = activeValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setValue(value)}
      className={cn(
        'inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] transition-colors',
        isActive
          ? 'bg-neon text-carbon'
          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const { value: activeValue } = useTabsContext()
  if (activeValue !== value) return null

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  )
}
