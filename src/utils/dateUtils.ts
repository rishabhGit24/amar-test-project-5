export interface HeatmapCell {
  date: string
  level: 0 | 1
}

/** Returns today as YYYY-MM-DD in local time */
export function getTodayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Adds `days` calendar days to a YYYY-MM-DD string */
function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Returns 140 cells (20 weeks × 7 days), oldest first, ending on today.
 * Level 1 if the date is in the completions set.
 */
export function buildHeatmapBuckets(completions: string[]): HeatmapCell[] {
  const set = new Set(completions)
  const today = getTodayISO()
  // Start 139 days before today
  const start = addDays(today, -139)
  const cells: HeatmapCell[] = []
  for (let i = 0; i < 140; i++) {
    const date = addDays(start, i)
    cells.push({ date, level: set.has(date) ? 1 : 0 })
  }
  return cells
}

/**
 * Counts consecutive completed days ending today.
 * Today counts only if completed.
 */
export function calcCurrentStreak(completions: string[]): number {
  const set = new Set(completions)
  const today = getTodayISO()
  if (!set.has(today)) return 0
  let streak = 0
  let cursor = today
  while (set.has(cursor)) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

/** Longest consecutive run in the full history */
export function calcBestStreak(completions: string[]): number {
  if (completions.length === 0) return 0
  const sorted = [...completions].sort()
  let best = 1
  let current = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]
    if (addDays(prev, 1) === curr) {
      current++
      if (current > best) best = current
    } else {
      current = 1
    }
  }
  return best
}

/**
 * Fraction (0–1) of the last 7 days (Mon–Sun of current ISO week) completed.
 */
export function calcWeeklyCompletion(completions: string[]): number {
  const set = new Set(completions)
  const today = new Date()
  // ISO week: Monday = 0 offset
  const dayOfWeek = today.getDay() // 0=Sun,1=Mon,...,6=Sat
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  let completed = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    const iso = `${y}-${mo}-${da}`
    if (set.has(iso)) completed++
  }
  return completed / 7
}
