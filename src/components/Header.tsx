import { format } from 'date-fns'
import styles from './Header.module.css'

interface StatPillProps {
  label: string
  value: number
  total: number
}

function StatPill({ label, value, total }: StatPillProps) {
  return (
    <div className={styles.statPill} aria-label={`${label}: ${value} of ${total}`}>
      <span className={styles.statValue}>
        {value}
        <span className={styles.statTotal}>/{total}</span>
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

interface HeaderProps {
  completedToday: number
  totalHabits: number
}

export function Header({ completedToday, totalHabits }: HeaderProps) {
  const today = new Date()
  const dateLabel = format(today, 'EEEE, MMMM d')

  return (
    <header className={styles.header} role="banner">
      {/* Aurora gradient layer — rotates via CSS keyframes */}
      <div className={styles.aurora} aria-hidden="true" />
      {/* Dark scrim for legibility */}
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true">
            <span>✦</span>
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.appTitle}>Streaks</h1>
            <p className={styles.dateLabel}>{dateLabel}</p>
          </div>
        </div>

        <nav className={styles.statsRow} aria-label="Today's progress">
          <StatPill label="done today" value={completedToday} total={totalHabits} />
        </nav>
      </div>
    </header>
  )
}
