import { Header } from './components/Header'
import { HabitGrid } from './components/HabitGrid'
import styles from './App.module.css'

// Placeholder counts — habit logic added in future stories
const COMPLETED_TODAY = 0
const TOTAL_HABITS = 0

export default function App() {
  return (
    <div className="page-wrapper">
      <Header
        completedToday={COMPLETED_TODAY}
        totalHabits={TOTAL_HABITS}
      />
      <main className={`page-content ${styles.main}`} id="main-content">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className="section-title">Today's habits</h2>
            <p className="section-subtitle">
              {TOTAL_HABITS === 0
                ? 'No habits tracked yet'
                : `${COMPLETED_TODAY} of ${TOTAL_HABITS} completed`}
            </p>
          </div>
        </div>

        <HabitGrid
          habitCount={TOTAL_HABITS}
          onAddHabit={() => {
            /* wired up in future story */
          }}
        />
      </main>
    </div>
  )
}
