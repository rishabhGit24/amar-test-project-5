import { useEffect, useRef, useState } from 'react'
import type { Habit } from '../store/habitStore'
import { useHabitStore } from '../store/habitStore'
import styles from './HabitModal.module.css'

const PRESET_COLORS = [
  '#7c3aed', // violet
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#10b981', // emerald
  '#f43f5e', // rose
  '#3b82f6', // blue
]

const DEFAULT_COLOR = PRESET_COLORS[0]

interface HabitModalProps {
  /** Habit to edit; undefined = add mode */
  editTarget: Habit | undefined
  onClose: () => void
}

export function HabitModal({ editTarget, onClose }: HabitModalProps) {
  const addHabit = useHabitStore((s) => s.addHabit)
  const updateHabit = useHabitStore((s) => s.updateHabit)

  const dialogRef = useRef<HTMLDialogElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const isEdit = editTarget !== undefined

  const [name, setName] = useState(editTarget?.name ?? '')
  const [emoji, setEmoji] = useState(editTarget?.emoji ?? '✨')
  const [accentColor, setAccentColor] = useState(editTarget?.accentColor ?? DEFAULT_COLOR)
  const [nameError, setNameError] = useState(false)

  // Open dialog via showModal() on mount
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    // Focus first input after animation
    const t = setTimeout(() => firstInputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [])

  // Close on Escape (dialog handles it natively, but we sync state)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handler = () => onClose()
    dialog.addEventListener('cancel', handler)
    return () => dialog.removeEventListener('cancel', handler)
  }, [onClose])

  // Trap focus inside dialog
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    dialog.addEventListener('keydown', handler)
    return () => dialog.removeEventListener('keydown', handler)
  }, [])

  function handleClose() {
    const dialog = dialogRef.current
    if (dialog) dialog.close()
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError(true)
      firstInputRef.current?.focus()
      return
    }
    if (isEdit && editTarget) {
      updateHabit(editTarget.id, { name: trimmed, emoji, accentColor })
    } else {
      addHabit({ name: trimmed, emoji, accentColor })
    }
    handleClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className={styles.modalHeader}>
        <h2 id="modal-title" className={styles.modalTitle}>
          {isEdit ? 'Edit habit' : 'New habit'}
        </h2>
        <button
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close modal"
          type="button"
        >
          ✕
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Emoji + Name row */}
        <div className={styles.nameRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="habit-emoji">
              Emoji
            </label>
            <input
              id="habit-emoji"
              className={styles.input}
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              maxLength={2}
              placeholder="✨"
              aria-label="Habit emoji"
              style={{ textAlign: 'center', fontSize: '1.25rem' }}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="habit-name">
              Name <span aria-hidden="true">*</span>
            </label>
            <input
              id="habit-name"
              ref={firstInputRef}
              className={`${styles.input} ${nameError ? styles.inputError : ''}`}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, 40))
                if (nameError) setNameError(false)
              }}
              maxLength={40}
              placeholder="e.g. Morning run"
              aria-label="Habit name"
              aria-required="true"
              aria-invalid={nameError}
              aria-describedby={nameError ? 'name-error' : undefined}
            />
            {nameError && (
              <span id="name-error" className={styles.errorMsg} role="alert">
                Name is required
              </span>
            )}
          </div>
        </div>

        {/* Accent color */}
        <div className={styles.fieldGroup}>
          <span className={styles.label}>Accent color</span>
          <div className={styles.swatchRow} role="radiogroup" aria-label="Accent color">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.swatch} ${accentColor === color ? styles.swatchActive : ''}`}
                style={
                  {
                    backgroundColor: color,
                    '--sw-color': color,
                  } as React.CSSProperties
                }
                onClick={() => setAccentColor(color)}
                aria-label={`Color ${color}`}
                aria-pressed={accentColor === color}
              />
            ))}
            {/* Custom color picker */}
            <div
              className={styles.colorPickerWrap}
              title="Custom color"
              style={
                !PRESET_COLORS.includes(accentColor)
                  ? { borderColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }
                  : {}
              }
            >
              <span className={styles.colorPickerIcon}>🎨</span>
              <input
                className={styles.colorPickerInput}
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                aria-label="Custom accent color"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            {isEdit ? 'Save changes' : 'Add habit'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
