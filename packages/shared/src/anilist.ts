import type { Anime, AnimeDetail, Filters } from './types'

const ENDPOINT = 'https://graphql.anilist.co'

const M =
  'id title{romaji english} coverImage{extraLarge large color} bannerImage format status episodes duration season seasonYear averageScore popularity genres description trailer{id site} nextAiringEpisode{airingAt episode} startDate{year month day} studios(isMain:true){nodes{name}}'

const cache = new Map<string, Promise<unknown>>()

export async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const key = query + JSON.stringify(variables)
  const hit = cache.get(key)
  if (hit) return hit as Promise<T>
  const request = fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
    .then(async (r) => {
      const json = (await r.json()) as {
        data?: T
        errors?: { message: string }[]
      }
      if (!r.ok || json.errors) throw new Error(json.errors?.[0]?.message ?? 'Request failed')
      return json.data as T
    })
    .catch((e) => {
      cache.delete(key)
      throw e
    })
  cache.set(key, request)
  return request
}

interface PageResult {
  Page: { pageInfo: { hasNextPage: boolean }; media: Anime[] }
}

export async function getHome() {
  const d = await gql<Record<'trending' | 'popular' | 'upcoming', { media: Anime[] }>>(
    `query{
      trending:Page(perPage:20){media(type:ANIME,isAdult:false,sort:TRENDING_DESC){${M}}}
      popular:Page(perPage:20){media(type:ANIME,isAdult:false,sort:POPULARITY_DESC){${M}}}
      upcoming:Page(perPage:20){media(type:ANIME,isAdult:false,status:NOT_YET_RELEASED,sort:POPULARITY_DESC){${M}}}
    }`,
  )
  return { trending: d.trending.media, popular: d.popular.media, upcoming: d.upcoming.media }
}

export async function getByIds(ids: number[]) {
  // Dedupe first: a repeated id would otherwise come back twice and collide on
  // the list's key. (Selection order is preserved.)
  const unique = [...new Set(ids)]
  if (!unique.length) return []
  const d = await gql<{ Page: { media: Anime[] } }>(
    `query($ids:[Int]){Page(perPage:50){media(id_in:$ids,type:ANIME){${M}}}}`,
    { ids: unique },
  )
  return unique.map((id) => d.Page.media.find((a) => a.id === id)).filter((a): a is Anime => !!a)
}

export async function getRecommendations(liked: number[]) {
  const seen = await getByIds(liked)
  const count = new Map<string, number>()
  seen.forEach((a) => a.genres.forEach((g) => count.set(g, (count.get(g) ?? 0) + 1)))
  const genres = [...count.entries()]
    .sort((x, y) => y[1] - x[1])
    .slice(0, 3)
    .map(([g]) => g)
  const d = await gql<{ Page: { media: Anime[] } }>(
    `query($g:[String]){Page(perPage:30){media(type:ANIME,isAdult:false,genre_in:$g,sort:SCORE_DESC,popularity_greater:20000){${M}}}}`,
    genres.length ? { g: genres } : {},
  )
  return { personal: genres.length > 0, genres, items: d.Page.media.filter((a) => !liked.includes(a.id)) }
}

export async function searchAnime(f: Filters, page: number) {
  /**
   * IMPORTANT: never send an explicit `null` for the enum-typed filters
   * (`format`, `status`). AniList silently returns zero rows when they are
   * present-but-null, which made every Browse/search request come back empty.
   * Only attach a key when it actually has a value.
   */
  const variables: Record<string, unknown> = {
    page,
    sort: [f.sort || (f.q ? 'SEARCH_MATCH' : 'POPULARITY_DESC')],
  }
  if (f.q) variables.search = f.q
  if (f.genres.length) variables.genres = f.genres
  if (f.year) variables.year = Number(f.year)
  if (f.season) variables.season = f.season
  if (f.format) variables.format = f.format
  if (f.status) variables.status = f.status

  const d = await gql<PageResult>(
    `query($page:Int,$search:String,$genres:[String],$year:Int,$season:MediaSeason,$format:MediaFormat,$status:MediaStatus,$sort:[MediaSort]){
      Page(page:$page,perPage:24){pageInfo{hasNextPage} media(type:ANIME,isAdult:false,search:$search,genre_in:$genres,seasonYear:$year,season:$season,format:$format,status:$status,sort:$sort){${M}}}
    }`,
    variables,
  )
  return { media: d.Page.media, hasNext: d.Page.pageInfo.hasNextPage }
}

export async function getReels(page: number) {
  const d = await gql<PageResult>(
    `query($page:Int){Page(page:$page,perPage:30){pageInfo{hasNextPage} media(type:ANIME,isAdult:false,sort:TRENDING_DESC){${M}}}}`,
    { page },
  )
  return { media: d.Page.media.filter((a) => a.trailer), hasNext: d.Page.pageInfo.hasNextPage }
}

export async function getSeasonal(season: string, year: number) {
  const d = await gql<{ Page: { media: Anime[] } }>(
    `query($s:MediaSeason,$y:Int){Page(perPage:30){media(type:ANIME,isAdult:false,season:$s,seasonYear:$y,sort:POPULARITY_DESC){${M}}}}`,
    { s: season, y: year },
  )
  return d.Page.media
}

export async function getAiring() {
  const d = await gql<{ Page: { media: Anime[] } }>(
    `query{Page(perPage:30){media(type:ANIME,isAdult:false,status:RELEASING,sort:TRENDING_DESC){${M}}}}`,
  )
  return d.Page.media.filter((a) => a.nextAiringEpisode)
}

export async function getAnime(id: number) {
  const d = await gql<{ Media: AnimeDetail }>(
    `query($id:Int){Media(id:$id,type:ANIME){${M}
      streamingEpisodes{title thumbnail url site}
      externalLinks{site url type}
      recommendations(perPage:12,sort:RATING_DESC){nodes{mediaRecommendation{${M}}}}
    }}`,
    { id },
  )
  return d.Media
}
