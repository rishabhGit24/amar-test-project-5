import { EmptyState } from './EmptyState'

interface HabitGridProps {
  habitCount: number
  onAddHabit?: () => void
}

export function HabitGrid({ habitCount, onAddHabit }: HabitGridProps) {
  const isEmpty = habitCount === 0

  return (
    <section aria-label="Habits" className="habit-grid">
      {isEmpty ? (
        <EmptyState onAddHabit={onAddHabit} />
      ) : (
        /* Future habit cards rendered here */
        <></>
      )}
    </section>
  )
}
