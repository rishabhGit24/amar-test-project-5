import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTodayISO } from '../utils/dateUtils'

export interface Habit {
  id: string
  name: string
  emoji: string
  accentColor: string
  completions: string[]
}

interface HabitStore {
  habits: Habit[]
  addHabit: (habit: Omit<Habit, 'id' | 'completions'>) => void
  updateHabit: (id: string, patch: Partial<Omit<Habit, 'id'>>) => void
  deleteHabit: (id: string) => void
  toggleToday: (id: string) => void
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id: crypto.randomUUID(),
              completions: [],
            },
          ],
        })),

      updateHabit: (id, patch) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...patch } : h
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      toggleToday: (id) => {
        const today = getTodayISO()
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h
            const has = h.completions.includes(today)
            return {
              ...h,
              completions: has
                ? h.completions.filter((d) => d !== today)
                : [...h.completions, today],
            }
          }),
        }))
      },
    }),
    { name: 'habit-tracker-v1' }
  )
)
