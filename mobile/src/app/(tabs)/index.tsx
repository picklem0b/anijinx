import { useCallback, useMemo } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { useByIds, useHome, useRecommendations } from '@/hooks/useAnime'
import { useLibrary } from '@/lib/store'
import { colors, spacingX, spacingY } from '@/constants/theme'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Shelf from '@/components/Shelf'
import { EmptyState, ErrorState, HeroSkeleton, PosterSkeletonRow } from '@/components/State'
import Typo from '@/components/Typo'

export default function HomeScreen() {
  const qc = useQueryClient()
  const scrollY = useSharedValue(0)

  const { data, isLoading, isError, error, refetch, isRefetching } = useHome()
  const liked = useLibrary((s) => s.liked)
  const watchlist = useLibrary((s) => s.watchlist)
  const progress = useLibrary((s) => s.progress)

  const recs = useRecommendations(liked)
  const savedIds = useMemo(
    () => [...new Set([...watchlist, ...liked])].slice(0, 20),
    [watchlist, liked],
  )
  const saved = useByIds(savedIds)

  const continueIds = useMemo(
    () =>
      Object.values(progress)
        .filter((p) => p.durationSeconds > 0 && p.positionSeconds / p.durationSeconds < 0.95)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map((p) => p.animeId)
        .filter((id, i, arr) => arr.indexOf(id) === i)
        .slice(0, 20),
    [progress],
  )
  const continueItems = useByIds(continueIds)

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = Math.min(1, Math.max(0, e.contentOffset.y / 120))
  })

  const onRefresh = useCallback(() => {
    qc.invalidateQueries()
    refetch()
  }, [qc, refetch])

  const hero = data?.trending?.[0]

  if (isError) {
    return (
      <View style={styles.screen}>
        <Header />
        <View style={styles.fill}>
          <ErrorState message={error?.message} onRetry={() => refetch()} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <Header scrollProgress={scrollY} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.primarySoft}
          />
        }
      >
        {isLoading || !hero ? (
          <View style={styles.loadingHero}>
            <HeroSkeleton />
          </View>
        ) : (
          <Hero anime={hero} scrollY={scrollY} />
        )}

        <View style={styles.rails}>
          {continueItems.data && continueItems.data.length > 0 ? (
            <Shelf
              title="Continue Watching"
              subtitle="Pick up where you left off"
              items={continueItems.data}
              onSeeAll={() => {}}
            />
          ) : null}

          {isLoading ? (
            <>
              <PosterSkeletonRow />
              <PosterSkeletonRow />
            </>
          ) : (
            <>
              {data && data.trending.length > 0 ? (
                <Shelf
                  title="Trending Now"
                  subtitle="What everyone is watching"
                  items={data.trending}
                  ranked
                />
              ) : null}
              {recs.data?.personal && recs.data.items.length > 0 ? (
                <Shelf
                  title="Because you liked…"
                  subtitle={`More ${recs.data.genres.join(', ')}`}
                  items={recs.data.items}
                  preview={false}
                />
              ) : null}
              {data && data.popular.length > 0 ? (
                <Shelf title="Popular on AniJinx" items={data.popular} />
              ) : null}
              {data && data.upcoming.length > 0 ? (
                <Shelf title="Coming Soon" subtitle="Mark your calendar" items={data.upcoming} />
              ) : null}
              {saved.data && saved.data.length > 0 ? (
                <Shelf title="In your library" items={saved.data} />
              ) : null}
            </>
          )}
        </View>

        {!isLoading && !data?.trending?.length ? (
          <EmptyState
            title="Nothing to show yet"
            message="Pull to refresh and we'll fetch the latest from AniList."
            action="Refresh"
            onAction={onRefresh}
          />
        ) : null}

        <View style={styles.footer}>
          <Typo size={11} color={colors.textFaint}>
            Metadata and trailers via AniList. Playback is limited to licensed content.
          </Typo>
        </View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacingY.y48 },
  loadingHero: { marginTop: spacingY.y64 },
  rails: { marginTop: -spacingY.y8 },
  fill: { flex: 1, justifyContent: 'center' },
  footer: { paddingHorizontal: spacingX.x16, paddingTop: spacingY.y32, alignItems: 'center' },
})
