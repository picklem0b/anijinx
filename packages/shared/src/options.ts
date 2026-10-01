export const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
]

export const SEASONS = [
  ['WINTER', 'Winter'],
  ['SPRING', 'Spring'],
  ['SUMMER', 'Summer'],
  ['FALL', 'Fall'],
] as const

export const FORMATS = [
  ['TV', 'TV'],
  ['TV_SHORT', 'TV Short'],
  ['MOVIE', 'Movie'],
  ['OVA', 'OVA'],
  ['ONA', 'ONA'],
  ['SPECIAL', 'Special'],
] as const

export const STATUSES = [
  ['RELEASING', 'Airing'],
  ['FINISHED', 'Finished'],
  ['NOT_YET_RELEASED', 'Upcoming'],
  ['CANCELLED', 'Cancelled'],
] as const

export const SORTS = [
  ['POPULARITY_DESC', 'Popularity'],
  ['TRENDING_DESC', 'Trending'],
  ['SCORE_DESC', 'Rating'],
  ['START_DATE_DESC', 'Newest'],
  ['TITLE_ROMAJI', 'Title'],
] as const

const year = new Date().getFullYear()
export const YEARS = Array.from({ length: year + 2 - 1990 }, (_, i) => String(year + 1 - i)).map(
  (y) => [y, y] as const,
)

export const DEFAULT_FILTERS = {
  q: '',
  genres: [] as string[],
  year: '',
  season: '',
  format: '',
  status: '',
  sort: 'POPULARITY_DESC',
} as const
