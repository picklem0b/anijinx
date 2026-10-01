import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Comment, Progress } from './types'

export type ListKey = 'liked' | 'watchlist' | 'reminders'

interface Library {
  liked: number[]
  watchlist: number[]
  reminders: number[]
  ratings: Record<number, number>
  comments: Record<number, Comment[]>
  /** Keyed `animeId:episode` so Continue Watching is always per-episode. */
  progress: Record<string, Progress>

  toggle: (list: ListKey, id: number) => void
  rate: (id: number, value: number) => void
  addComment: (id: number, text: string, ep: number | null) => void
  removeComment: (id: number, commentId: string) => void
  saveProgress: (p: Omit<Progress, 'updatedAt'>) => void
  removeProgress: (animeId: number, episode: number) => void
}

export const useLibrary = create<Library>()(
  persist(
    (set) => ({
      liked: [],
      watchlist: [],
      reminders: [],
      ratings: {},
      comments: {},
      progress: {},

      toggle: (list, id) =>
        set((s) => {
          const next = s[list].includes(id)
            ? s[list].filter((x) => x !== id)
            : [id, ...s[list]]
          return list === 'liked'
            ? { liked: next }
            : list === 'watchlist'
              ? { watchlist: next }
              : { reminders: next }
        }),

      rate: (id, value) =>
        set((s) => {
          const ratings = { ...s.ratings }
          if (value <= 0 || ratings[id] === value) delete ratings[id]
          else ratings[id] = value
          return { ratings }
        }),

      addComment: (id, text, ep) =>
        set((s) => ({
          comments: {
            ...s.comments,
            [id]: [
              {
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
                text,
                at: Date.now(),
                ep,
              },
              ...(s.comments[id] ?? []),
            ],
          },
        })),

      removeComment: (id, commentId) =>
        set((s) => ({
          comments: {
            ...s.comments,
            [id]: (s.comments[id] ?? []).filter((c) => c.id !== commentId),
          },
        })),

      saveProgress: (p) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [`${p.animeId}:${p.episode}`]: { ...p, updatedAt: Date.now() },
          },
        })),

      removeProgress: (animeId, episode) =>
        set((s) => {
          const progress = { ...s.progress }
          delete progress[`${animeId}:${episode}`]
          return { progress }
        }),
    }),
    { name: 'anijinx-library' },
  ),
)
