import { useMemo, useState } from 'react'
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useByIds } from '@/hooks/useAnime'
import { useLibrary } from '@/lib/store'
import { colors, layout, radius, spacingX, spacingY } from '@/constants/theme'
import AnimeCard from '@/components/AnimeCard'
import { EmptyState, PosterSkeletonRow } from '@/components/State'
import Skeleton from '@/components/Skeleton'
import Typo from '@/components/Typo'

type Segment = 'watchlist' | 'liked' | 'reminders' | 'rated' | 'continue'

/** Two-column grid, so the placeholder poster matches the rendered card. */
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const GRID_POSTER_HEIGHT =
  ((SCREEN_WIDTH - spacingX.x16 * 2 - layout.cardGap) / 2) / layout.posterRatio

const SEGMENTS: { key: Segment; label: string }[] = [
  { key: 'continue', label: 'Continue' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'liked', label: 'Liked' },
  { key: 'reminders', label: 'Reminders' },
  { key: 'rated', label: 'Rated' },
]

export default function LibraryScreen() {
  const router = useRouter()
  const [segment, setSegment] = useState<Segment>('continue')

  const watchlist = useLibrary((s) => s.watchlist)
  const liked = useLibrary((s) => s.liked)
  const reminders = useLibrary((s) => s.reminders)
  const ratings = useLibrary((s) => s.ratings)
  const progress = useLibrary((s) => s.progress)

  const ids = useMemo(() => {
    if (segment === 'watchlist') return watchlist
    if (segment === 'liked') return liked
    if (segment === 'reminders') return reminders
    if (segment === 'rated') return Object.keys(ratings).map(Number)
    return Object.values(progress)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((p) => p.animeId)
      .filter((id, i, arr) => arr.indexOf(id) === i)
  }, [segment, watchlist, liked, reminders, ratings, progress])

  const { data, isLoading } = useByIds(ids)

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <Typo size={26} fontWeight="900">
          My Library
        </Typo>
        <Typo size={13} color={colors.textMuted}>
          Saved on this device. Sync arrives with the API.
        </Typo>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
        style={styles.tabsWrap}
      >
        {SEGMENTS.map((s) => {
          const count =
            s.key === 'watchlist'
              ? watchlist.length
              : s.key === 'liked'
                ? liked.length
                : s.key === 'reminders'
                  ? reminders.length
                  : s.key === 'rated'
                    ? Object.keys(ratings).length
                    : Object.keys(progress).length
          const on = segment === s.key
          return (
            <Pressable
              key={s.key}
              onPress={() => setSegment(s.key)}
              style={[styles.tab, on && styles.tabOn]}
            >
              <Typo
                size={13}
                fontWeight="700"
                color={on ? colors.black : colors.textLight}
              >
                {s.label}
              </Typo>
              {count > 0 ? (
                <Typo size={11} color={on ? colors.black : colors.textFaint}>
                  {count}
                </Typo>
              ) : null}
            </Pressable>
          )
        })}
      </ScrollView>

      {isLoading && ids.length > 0 ? (
        <PosterSkeletonRow />
      ) : (
        <FlatList
          data={data ?? []}
          numColumns={2}
          keyExtractor={(a) => String(a.id)}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.cell}>
              <AnimeCard
                anime={item}
                index={index}
                width="100%"
                preview={false}
                showScore={segment !== 'rated'}
              />
              {segment === 'rated' && ratings[item.id] ? (
                <Typo size={11} color={colors.warning} fontWeight="700" style={styles.rating}>
                  ★ {ratings[item.id]}/5
                </Typo>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            ids.length > 0 && isLoading ? (
              <View style={styles.cell}>
                <Skeleton height={GRID_POSTER_HEIGHT} round />
              </View>
            ) : (
              <EmptyState
                title="Nothing here yet"
                message={
                  segment === 'continue'
                    ? 'Start watching and we will remember your place.'
                    : 'Tap the heart or bookmark on any title to save it.'
                }
                action="Find something"
                onAction={() => router.push('/discover')}
              />
            )
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingTop: spacingY.y64 },
  top: { paddingHorizontal: spacingX.x16, gap: spacingY.y4 },
  tabsWrap: { flexGrow: 0, marginTop: spacingY.y16 },
  tabs: { gap: spacingX.x8, paddingHorizontal: spacingX.x16, paddingBottom: spacingY.y12 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.x6,
    paddingHorizontal: spacingX.x14,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tabOn: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  list: { paddingHorizontal: spacingX.x16, paddingBottom: spacingY.y48 },
  column: { gap: layout.cardGap },
  cell: { flex: 1, marginBottom: spacingY.y20 },
  rating: { marginTop: spacingY.y6 },
})
