// The web app, the mobile app and the API all speak the same types.
// These re-exports keep existing `@/lib/types` imports working unchanged.
export type {
  Anime,
  AnimeDetail,
  Comment,
  Filters,
  ListKey,
  Progress,
  Trailer,
} from '@workspace/shared/types'
