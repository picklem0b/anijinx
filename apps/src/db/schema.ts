import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

/* ------------------------------------------------------------------ *
 * Content — AniList is the source of truth for metadata; we mirror it.
 * The id is the AniList media id, so client URLs keep working.
 * ------------------------------------------------------------------ */

export const anime = pgTable(
  'anime',
  {
    id: integer('id').primaryKey(),
    romaji: text('romaji').notNull(),
    english: text('english'),
    synopsis: text('synopsis'),
    coverUrl: text('cover_url'),
    coverColor: text('cover_color'),
    bannerUrl: text('banner_url'),
    format: text('format'),
    status: text('status'),
    episodesCount: integer('episodes_count'),
    duration: integer('duration'),
    season: text('season'),
    seasonYear: integer('season_year'),
    score: real('score'),
    popularity: integer('popularity'),
    trailerId: text('trailer_id'),
    trailerSite: text('trailer_site'),
    nextEpisode: integer('next_episode'),
    nextAiringAt: timestamp('next_airing_at', { withTimezone: true }),
    studio: text('studio'),
    raw: jsonb('raw'),
    syncedAt: timestamp('synced_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('anime_status_idx').on(t.status),
    index('anime_season_year_idx').on(t.seasonYear),
    index('anime_popularity_idx').on(t.popularity),
  ],
)

export const genres = pgTable(
  'genres',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    name: text('name').notNull().unique(),
  },
  (t) => [uniqueIndex('genres_name_idx').on(t.name)],
)

export const animeGenres = pgTable(
  'anime_genres',
  {
    animeId: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    genreId: integer('genre_id')
      .notNull()
      .references(() => genres.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.animeId, t.genreId] }),
    index('anime_genres_genre_idx').on(t.genreId),
  ],
)

/** Episodes are ours — this is the content we own or license. */
export const episodes = pgTable(
  'episodes',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    animeId: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    number: integer('number').notNull(),
    title: text('title'),
    synopsis: text('synopsis'),
    thumbnailUrl: text('thumbnail_url'),
    durationSeconds: integer('duration_seconds'),
    airDate: timestamp('air_date', { withTimezone: true }),
    videoAssetId: integer('video_asset_id'),
  },
  (t) => [
    uniqueIndex('episodes_anime_number_idx').on(t.animeId, t.number),
    index('episodes_anime_idx').on(t.animeId),
  ],
)

export const videoAssets = pgTable('video_assets', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  provider: text('provider').notNull(), // 'mux' | 'hls' | 'file'
  playbackId: text('playback_id'),
  status: text('status').default('ready').notNull(),
  durationSeconds: integer('duration_seconds'),
  aspectRatio: text('aspect_ratio'),
})

/** Curated Netflix-style rails. */
export const rows = pgTable(
  'rows',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    key: text('key').notNull().unique(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    kind: text('kind').default('curated').notNull(), // curated | trending | popular | upcoming
    position: integer('position').default(0).notNull(),
  },
  (t) => [index('rows_position_idx').on(t.position)],
)

export const rowItems = pgTable(
  'row_items',
  {
    rowId: integer('row_id')
      .notNull()
      .references(() => rows.id, { onDelete: 'cascade' }),
    animeId: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    position: integer('position').default(0).notNull(),
  },
  (t) => [primaryKey({ columns: [t.rowId, t.animeId] })],
)

/* ------------------------------------------------------------------ *
 * Device state — anonymous, keyed by an x-device-id header. No auth.
 * A users table is added later; these rows can be re-owned then.
 * ------------------------------------------------------------------ */

export const devices = pgTable('devices', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).defaultNow().notNull(),
})

export const libraryEntries = pgTable(
  'library_entries',
  {
    deviceId: uuid('device_id')
      .notNull()
      .references(() => devices.id, { onDelete: 'cascade' }),
    animeId: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    list: text('list').notNull(), // watchlist | liked | reminders
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.deviceId, t.animeId, t.list] }),
    index('library_entries_device_idx').on(t.deviceId),
  ],
)

export const ratings = pgTable(
  'ratings',
  {
    deviceId: uuid('device_id')
      .notNull()
      .references(() => devices.id, { onDelete: 'cascade' }),
    animeId: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    value: smallint('value').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.deviceId, t.animeId] })],
)

export const watchProgress = pgTable(
  'watch_progress',
  {
    deviceId: uuid('device_id')
      .notNull()
      .references(() => devices.id, { onDelete: 'cascade' }),
    episodeId: integer('episode_id')
      .notNull()
      .references(() => episodes.id, { onDelete: 'cascade' }),
    positionSeconds: integer('position_seconds').default(0).notNull(),
    durationSeconds: integer('duration_seconds').default(0).notNull(),
    completed: boolean('completed').default(false).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.deviceId, t.episodeId] }),
    index('watch_progress_device_idx').on(t.deviceId, t.updatedAt),
  ],
)

export const comments = pgTable(
  'comments',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    deviceId: uuid('device_id')
      .notNull()
      .references(() => devices.id, { onDelete: 'cascade' }),
    animeId: integer('anime_id')
      .notNull()
      .references(() => anime.id, { onDelete: 'cascade' }),
    episodeNumber: integer('episode_number'),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('comments_anime_idx').on(t.animeId, t.createdAt)],
)
