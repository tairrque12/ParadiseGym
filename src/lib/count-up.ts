export function interpolateCount(progress: number, target: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1)
  return Math.round(clamped * target)
}

export function formatCountDisplay(
  value: number,
  options?: { suffix?: string }
): string {
  const formatted = value.toLocaleString('en-US')
  return `${formatted}${options?.suffix ?? ''}`
}
