import { useHabitStore } from './store/habitStore'
import { getTodayISO } from './utils/dateUtils'
import { Header } from './components/Header'
import { HabitGrid } from './components/HabitGrid'
import styles from './App.module.css'

export default function App() {
  const habits = useHabitStore((s) => s.habits)
  const today = getTodayISO()

  const completedToday = habits.filter((h) => h.completions.includes(today)).length
  const totalHabits = habits.length

  return (
    <div className="page-wrapper">
      <Header
        completedToday={completedToday}
        totalHabits={totalHabits}
      />
      <main className={`page-content ${styles.main}`} id="main-content">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className="section-title">Today's habits</h2>
            <p className="section-subtitle">
              {totalHabits === 0
                ? 'No habits tracked yet — add your first below'
                : `${completedToday} of ${totalHabits} completed today`}
            </p>
          </div>
        </div>

        <HabitGrid />
      </main>
    </div>
  )
}
