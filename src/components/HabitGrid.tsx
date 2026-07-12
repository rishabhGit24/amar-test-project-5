import { useState } from 'react'
import type { Habit } from '../store/habitStore'
import { useHabitStore } from '../store/habitStore'
import { EmptyState } from './EmptyState'
import { HabitCard } from './HabitCard'
import { HabitModal } from './HabitModal'
import styles from './HabitGrid.module.css'

export function HabitGrid() {
  const habits = useHabitStore((s) => s.habits)

  // Modal state: false = closed, true = add mode, Habit = edit mode
  const [modalState, setModalState] = useState<false | 'add' | Habit>(false)

  const isEmpty = habits.length === 0

  function openAdd() {
    setModalState('add')
  }

  function openEdit(habit: Habit) {
    setModalState(habit)
  }

  function closeModal() {
    setModalState(false)
  }

  return (
    <>
      <section aria-label="Habits" className="habit-grid">
        {isEmpty ? (
          <EmptyState onAddHabit={openAdd} />
        ) : (
          habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onEdit={openEdit} />
          ))
        )}
      </section>

      {/* Floating action button */}
      {!isEmpty && (
        <button
          className={styles.fab}
          onClick={openAdd}
          aria-label="Add new habit"
          type="button"
        >
          <span aria-hidden="true" className={styles.fabIcon}>+</span>
        </button>
      )}

      {/* Modal */}
      {modalState !== false && (
        <HabitModal
          editTarget={modalState === 'add' ? undefined : modalState}
          onClose={closeModal}
        />
      )}
    </>
  )
}
