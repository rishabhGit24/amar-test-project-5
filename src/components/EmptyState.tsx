import styles from './EmptyState.module.css'

interface EmptyStateProps {
  onAddHabit?: () => void
}

export function EmptyState({ onAddHabit }: EmptyStateProps) {
  return (
    <div className={styles.root} role="region" aria-label="No habits yet">
      {/* Ambient glow behind illustration */}
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.illustration} aria-hidden="true">
        <div className={styles.emojiRing}>
          <span className={styles.emojiMain}>🌱</span>
          <span className={`${styles.emojiOrbit} ${styles.orbit1}`}>⚡</span>
          <span className={`${styles.emojiOrbit} ${styles.orbit2}`}>🎯</span>
          <span className={`${styles.emojiOrbit} ${styles.orbit3}`}>✨</span>
        </div>
      </div>

      <div className={styles.copy}>
        <h2 className={styles.heading}>Your journey starts here</h2>
        <p className={styles.subtext}>
          Build habits that stick. Track your streaks, celebrate consistency,
          and watch small actions compound into lasting change.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          className={`btn btn-primary ${styles.ctaPrimary}`}
          onClick={onAddHabit}
          aria-label="Add your first habit"
          type="button"
        >
          <span aria-hidden="true">+</span>
          Add your first habit
        </button>
        <button
          className={`btn btn-outline ${styles.ctaSecondary}`}
          type="button"
          aria-label="Browse habit templates"
        >
          Browse templates
        </button>
      </div>

      <div className={styles.featureRow} aria-hidden="true">
        {[
          { icon: '🔥', label: 'Streaks' },
          { icon: '📊', label: 'Insights' },
          { icon: '🏆', label: 'Milestones' },
        ].map(({ icon, label }) => (
          <div key={label} className={styles.featureChip}>
            <span>{icon}</span>
            <span className={styles.featureLabel}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
