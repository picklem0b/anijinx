import { ErrorState } from '@/components/anime/State'
import { Hero } from '@/components/anime/Hero'
import { Shelf } from '@/components/anime/Shelf'
import { useFetch } from '@/hooks/useFetch'
import { getHome, getRecommendations } from '@/lib/anilist'
import { useLibrary } from '@/lib/store'

export default function HomePage() {
  const home = useFetch(getHome, [])
  const liked = useLibrary((s) => s.liked)
  const rec = useFetch(() => getRecommendations(liked), [liked.join(',')])

  if (home.error) return <ErrorState text={home.error} />

  return (
    <>
      <Hero items={home.data?.trending ?? null} />
      <div className="relative z-10 -mt-12 space-y-10">
        <Shelf title="Trending now" subtitle="What everyone is watching this week" items={home.data?.trending ?? null} to="/browse?sort=TRENDING_DESC" />
        <Shelf title="Popular" subtitle="All-time crowd favorites" items={home.data?.popular ?? null} to="/browse?sort=POPULARITY_DESC" />
        <Shelf
          title={rec.data?.personal ? 'Recommended for you' : 'Top rated'}
          subtitle={rec.data?.personal ? 'Based on the anime you liked' : 'Like a few titles and this row becomes yours'}
          items={rec.data?.items ?? null}
          to="/browse?sort=SCORE_DESC"
        />
        <Shelf title="Coming soon" subtitle="Tap the bell to get a reminder" items={home.data?.upcoming ?? null} upcoming to="/browse?status=NOT_YET_RELEASED" />
      </div>
    </>
  )
}
