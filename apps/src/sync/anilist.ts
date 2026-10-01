import { gql, type Anime } from '@workspace/shared'
import { desc, eq } from 'drizzle-orm'
import { db } from '../db/client'
import { anime, animeGenres, genres, rowItems, rows } from '../db/schema'

const LIST_QUERY = `
query($page:Int){
  Page(page:$page,perPage:50){
    pageInfo{hasNextPage}
    media(type:ANIME,isAdult:false,sort:POPULARITY_DESC){
      id title{romaji english} coverImage{extraLarge color} bannerImage
      format status episodes duration season seasonYear averageScore popularity
      genres description trailer{id site} nextAiringEpisode{airingAt episode}
      studios(isMain:true){nodes{name}}
    }
  }
}`

function title(a: Anime) {
  return { romaji: a.title.romaji, english: a.title.english }
}

async function upsertGenre(name: string) {
  await db.insert(genres).values({ name }).onConflictDoNothing()
  const [row] = await db.select().from(genres).where(eq(genres.name, name)).limit(1)
  return row
}

export async function syncAnime(pages = 4) {
  let written = 0

  for (let page = 1; page <= pages; page++) {
    const data = await gql<{ Page: { pageInfo: { hasNextPage: boolean }; media: Anime[] } }>(
      LIST_QUERY,
      { page },
    )

    for (const a of data.Page.media) {
      const t = title(a)
      await db
        .insert(anime)
        .values({
          id: a.id,
          romaji: t.romaji,
          english: t.english,
          synopsis: a.description,
          coverUrl: a.coverImage?.extraLarge,
          coverColor: a.coverImage?.color,
          bannerUrl: a.bannerImage,
          format: a.format,
          status: a.status,
          episodesCount: a.episodes,
          duration: a.duration,
          season: a.season,
          seasonYear: a.seasonYear,
          score: a.averageScore,
          popularity: a.popularity,
          trailerId: a.trailer?.id ?? null,
          trailerSite: a.trailer?.site ?? null,
          nextEpisode: a.nextAiringEpisode?.episode ?? null,
          nextAiringAt: a.nextAiringEpisode ? new Date(a.nextAiringEpisode.airingAt * 1000) : null,
          studio: a.studios?.nodes?.[0]?.name ?? null,
          raw: a,
          syncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: anime.id,
          set: {
            romaji: t.romaji,
            english: t.english,
            popularity: a.popularity,
            status: a.status,
            nextEpisode: a.nextAiringEpisode?.episode ?? null,
            nextAiringAt: a.nextAiringEpisode ? new Date(a.nextAiringEpisode.airingAt * 1000) : null,
            score: a.averageScore,
            syncedAt: new Date(),
          },
        })

      for (const name of a.genres ?? []) {
        const g = await upsertGenre(name)
        if (g) {
          await db
            .insert(animeGenres)
            .values({ animeId: a.id, genreId: g.id })
            .onConflictDoNothing()
        }
      }
      written++
    }

    console.log(`page ${page}: ${data.Page.media.length} media (hasNext=${data.Page.pageInfo.hasNextPage})`)
    if (!data.Page.pageInfo.hasNextPage) break
  }

  await seedCuratedRows()
  console.log(`Synced ${written} anime.`)
  return written
}

/** Build the runtime rails so /v1/home has curated rows immediately. */
export async function seedCuratedRows() {
  const definitions = [
    { key: 'top10', title: 'Top 10 This Week', subtitle: 'The most watched right now', order: 'popularity' },
    { key: 'hidden', title: 'Hidden Gems', subtitle: 'Great scores, less buzz', order: 'score' },
    { key: 'classics', title: 'Timeless Classics', subtitle: 'Still worth your time', order: 'score' },
  ] as const

  for (const [i, def] of definitions.entries()) {
    await db
      .insert(rows)
      .values({ key: def.key, title: def.title, subtitle: def.subtitle, kind: 'curated', position: i })
      .onConflictDoNothing()

    const [row] = await db.select().from(rows).where(eq(rows.key, def.key)).limit(1)
    if (!row) continue

    const column = def.order === 'score' ? anime.score : anime.popularity
    const top = await db
      .select({ id: anime.id })
      .from(anime)
      .orderBy(desc(column))
      .limit(12)

    for (const [position, item] of top.entries()) {
      await db
        .insert(rowItems)
        .values({ rowId: row.id, animeId: item.id, position })
        .onConflictDoNothing()
    }
  }
}

const isMain = process.argv[1]?.includes('anilist')
if (isMain) {
  syncAnime()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}
