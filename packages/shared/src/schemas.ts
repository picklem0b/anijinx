import { z } from 'zod'
import { FORMATS, SEASONS, SORTS, STATUSES } from './options'

export const listKeySchema = z.enum(['liked', 'watchlist', 'reminders'])

export const filtersSchema = z.object({
  q: z.string().default(''),
  genres: z.array(z.string()).default([]),
  year: z.string().default(''),
  season: z.string().default(''),
  format: z.string().default(''),
  status: z.string().default(''),
  sort: z.string().default('POPULARITY_DESC'),
})

/** Query params arrive as strings over the wire; this coerces them. */
export const searchQuerySchema = z.object({
  q: z.string().optional().default(''),
  genre: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (v == null ? [] : Array.isArray(v) ? v : [v])),
  year: z.coerce.number().int().optional(),
  season: z.enum(SEASONS.map(([v]) => v) as [string, ...string[]]).optional(),
  format: z.enum(FORMATS.map(([v]) => v) as [string, ...string[]]).optional(),
  status: z.enum(STATUSES.map(([v]) => v) as [string, ...string[]]).optional(),
  sort: z.enum(SORTS.map(([v]) => v) as [string, ...string[]]).default('POPULARITY_DESC'),
  cursor: z.coerce.number().int().min(1).default(1),
})

export const progressInputSchema = z.object({
  animeId: z.number().int().positive(),
  episode: z.number().int().min(1),
  positionSeconds: z.number().min(0),
  durationSeconds: z.number().min(0),
})

export const ratingInputSchema = z.object({ value: z.number().int().min(1).max(5) })

export const commentInputSchema = z.object({
  animeId: z.number().int().positive(),
  episode: z.number().int().min(1).nullable().default(null),
  body: z.string().min(1).max(2000),
})

export type SearchQuery = z.infer<typeof searchQuerySchema>
export type ProgressInput = z.infer<typeof progressInputSchema>
export type CommentInput = z.infer<typeof commentInputSchema>
