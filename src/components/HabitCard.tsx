import { useMemo } from 'react'
import type { Habit } from '../store/habitStore'
import { useHabitStore } from '../store/habitStore'
import {
  buildHeatmapBuckets,
  calcCurrentStreak,
  calcBestStreak,
  calcWeeklyCompletion,
  getTodayISO,
} from '../utils/dateUtils'
import styles from './HabitCard.module.css'

// SVG ring constants
const R = 18
const CX = 22
const CY = 22
const CIRCUMFERENCE = 2 * Math.PI * R // ≈ 113.1

interface HabitCardProps {
  habit: Habit
  onEdit: (habit: Habit) => void
}

// Pencil icon
function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61a.75.75 0 0 1-.35.198l-3.25.75a.75.75 0 0 1-.91-.91l.75-3.25a.75.75 0 0 1 .198-.35l8.61-8.61Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Trash icon
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.5 1.75a.25.25 0 0 1 .25-.25h2.5a.25.25 0 0 1 .25.25V3h-3V1.75Zm4.5 0V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15H5.405a1.748 1.748 0 0 1-1.741-1.576l-.66-6.6a.75.75 0 1 1 1.492-.149Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Check icon
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const toggleToday = useHabitStore((s) => s.toggleToday)
  const deleteHabit = useHabitStore((s) => s.deleteHabit)

  const today = getTodayISO()
  const isCompletedToday = habit.completions.includes(today)

  const cells = useMemo(() => buildHeatmapBuckets(habit.completions), [habit.completions])
  const currentStreak = useMemo(() => calcCurrentStreak(habit.completions), [habit.completions])
  const bestStreak = useMemo(() => calcBestStreak(habit.completions), [habit.completions])
  const weeklyFraction = useMemo(() => calcWeeklyCompletion(habit.completions), [habit.completions])

  const dashOffset = CIRCUMFERENCE * (1 - weeklyFraction)

  function handleDelete() {
    if (window.confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
      deleteHabit(habit.id)
    }
  }

  return (
    <article
      className={styles.card}
      style={{ '--accent': habit.accentColor } as React.CSSProperties}
      aria-label={`Habit: ${habit.name}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.emoji} role="img" aria-label={habit.name}>
            {habit.emoji}
          </span>
          <span className={styles.name}>{habit.name}</span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={() => onEdit(habit)}
            aria-label={`Edit ${habit.name}`}
            type="button"
          >
            <PencilIcon />
          </button>
          <button
            className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
            onClick={handleDelete}
            aria-label={`Delete ${habit.name}`}
            type="button"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Stats row: streaks + weekly ring */}
      <div className={styles.statsRow}>
        <div className={styles.streakBadge} title="Current streak">
          <span>🔥</span>
          <span>{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span>
        </div>
        <div className={styles.streakBadge} title="Best streak">
          <span>⭐</span>
          <span>{bestStreak} best</span>
        </div>
        <div className={styles.ringWrap}>
          <span className={styles.ringLabel}>week</span>
          <svg
            className={styles.ring}
            width="44"
            height="44"
            viewBox="0 0 44 44"
            aria-label={`Weekly completion: ${Math.round(weeklyFraction * 100)}%`}
            role="img"
          >
            <circle className={styles.ringTrack} cx={CX} cy={CY} r={R} />
            <circle
              className={styles.ringFill}
              cx={CX}
              cy={CY}
              r={R}
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={dashOffset}
            />
          </svg>
        </div>
      </div>

      {/* Heatmap */}
      <div className={styles.heatmapWrap}>
        <span className={styles.heatmapLabel}>20-week history</span>
        <div
          className={styles.heatmap}
          role="img"
          aria-label={`Completion heatmap for ${habit.name}`}
        >
          {cells.map((cell) => (
            <div
              key={cell.date}
              className={styles.cell}
              title={cell.date}
              style={
                cell.level === 1
                  ? {
                      backgroundColor: habit.accentColor,
                      boxShadow: `0 0 6px ${habit.accentColor}`,
                    }
                  : {
                      backgroundColor: `color-mix(in srgb, ${habit.accentColor} 15%, transparent)`,
                    }
              }
            />
          ))}
        </div>
      </div>

      {/* Mark today button */}
      <button
        className={`${styles.markBtn} ${isCompletedToday ? styles.markBtnOn : styles.markBtnOff}`}
        onClick={() => toggleToday(habit.id)}
        aria-label={
          isCompletedToday
            ? `Unmark ${habit.name} as done today`
            : `Mark ${habit.name} as done today`
        }
        aria-pressed={isCompletedToday}
        type="button"
      >
        {isCompletedToday && <CheckIcon />}
        {isCompletedToday ? 'Done today ✓' : 'Mark today'}
      </button>
    </article>
  )
}
