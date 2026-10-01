import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import { ago } from '@workspace/shared/format'
import { GENRES, SEASONS } from '@workspace/shared/options'
import { useAiring, useHome, useRecommendations } from '@/hooks/useAnime'
import { useLibrary } from '@/lib/store'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Header from '@/components/Header'
import Shelf from '@/components/Shelf'
import { ErrorState, PosterSkeletonRow } from '@/components/State'
import Typo from '@/components/Typo'

const currentSeason = () => {
  const m = new Date().getMonth()
  return m < 3 ? 'WINTER' : m < 6 ? 'SPRING' : m < 9 ? 'SUMMER' : 'FALL'
}

export default function DiscoverScreen() {
  const router = useRouter()
  const scrollY = useSharedValue(0)
  const [season, setSeason] = useState(currentSeason())

  const home = useHome()
  const airing = useAiring()
  const liked = useLibrary((s) => s.liked)
  const likedIds = useMemo(() => liked, [liked])
  const recs = useRecommendations(likedIds)

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = Math.min(1, Math.max(0, e.contentOffset.y / 120))
  })

  const seasonal = useMemo(() => {
    const seasonIndex = SEASONS.findIndex(([v]) => v === season)
    return (
      home.data?.popular
        .filter((a) => a.season === SEASONS[seasonIndex]?.[0])
        .slice(0, 20) ?? []
    )
  }, [home.data, season])

  const upcomingAiring = (airing.data ?? []).slice(0, 20)

  return (
    <View style={styles.screen}>
      <Header scrollProgress={scrollY} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Typo size={28} fontWeight="900">
            Discover
          </Typo>
          <Typo size={13} color={colors.textMuted}>
            Personalized rails, seasons and what's airing next.
          </Typo>
        </View>

        <View style={styles.quickRow}>
          <QuickAction
            icon="sparkles"
            label="For you"
            onPress={() => router.push('/browse')}
          />
          <QuickAction
            icon="calendar"
            label="Airing"
            onPress={() => router.push('/browse?status=RELEASING')}
          />
          <QuickAction
            icon="chart.bar.fill"
            label="Top rated"
            onPress={() => router.push('/browse?sort=SCORE_DESC')}
          />
        </View>

        {recs.data?.personal && recs.data.items.length > 0 ? (
          <Shelf
            title="Because you liked…"
            subtitle={recs.data.genres.join(' · ')}
            items={recs.data.items}
          />
        ) : null}

        {home.isLoading ? (
          <PosterSkeletonRow />
        ) : home.isError ? (
          <ErrorState message={home.error?.message} onRetry={() => home.refetch()} />
        ) : null}

        <View style={styles.section}>
          <Typo size={17} fontWeight="700" style={styles.sectionTitle}>
            Browse by season
          </Typo>
          <View style={styles.seasonRow}>
            {SEASONS.map(([value, label]) => (
              <Pressable
                key={value}
                onPress={() => setSeason(value)}
                style={[styles.seasonChip, season === value && styles.seasonChipActive]}
              >
                <Typo
                  size={13}
                  fontWeight="600"
                  color={season === value ? colors.black : colors.textLight}
                >
                  {label}
                </Typo>
              </Pressable>
            ))}
          </View>
          {seasonal.length > 0 ? (
            <Shelf title={`${season} picks`} items={seasonal} preview={false} />
          ) : (
            <Typo size={13} color={colors.textFaint} style={styles.sectionTitle}>
              No titles cached for this season yet.
            </Typo>
          )}
        </View>

        <View style={styles.section}>
          <Typo size={17} fontWeight="700" style={styles.sectionTitle}>
            Genres
          </Typo>
          <View style={styles.grid}>
            {GENRES.map((g) => (
              <Pressable
                key={g}
                onPress={() => router.push(`/browse?genre=${encodeURIComponent(g)}`)}
                style={styles.genre}
              >
                <Typo size={13} fontWeight="600" numberOfLines={1}>
                  {g}
                </Typo>
              </Pressable>
            ))}
          </View>
        </View>

        {upcomingAiring.length > 0 ? (
          <View style={styles.section}>
            <Typo size={17} fontWeight="700" style={styles.sectionTitle}>
              Airing calendar
            </Typo>
            {upcomingAiring.slice(0, 8).map((a) => (
              <Pressable
                key={a.id}
                onPress={() => router.push(`/title/${a.id}`)}
                style={styles.calendarRow}
              >
                <View style={styles.calendarDot} />
                <View style={styles.calendarText}>
                  <Typo size={13} fontWeight="600" numberOfLines={1}>
                    {a.title.english ?? a.title.romaji}
                  </Typo>
                  <Typo size={11} color={colors.textMuted}>
                    EP {a.nextAiringEpisode?.episode} · {ago((a.nextAiringEpisode?.airingAt ?? 0) * 1000)}
                  </Typo>
                </View>
                <Icon name="chevron.right" size={13} color={colors.textFaint} />
              </Pressable>
            ))}
          </View>
        ) : null}
      </Animated.ScrollView>
    </View>
  )
}

const QuickAction = ({
  icon,
  label,
  onPress,
}: {
  icon: 'sparkles' | 'calendar' | 'chart.bar.fill'
  label: string
  onPress: () => void
}) => (
  <Pressable onPress={onPress} style={styles.quick}>
    <Icon name={icon} size={18} color={colors.primarySoft} />
    <Typo size={12} fontWeight="600" color={colors.textLight}>
      {label}
    </Typo>
  </Pressable>
)

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: spacingY.y64, paddingBottom: spacingY.y48 },
  intro: { paddingHorizontal: spacingX.x16, gap: spacingY.y4 },
  quickRow: {
    flexDirection: 'row',
    gap: spacingX.x8,
    paddingHorizontal: spacingX.x16,
    marginTop: spacingY.y16,
  },
  quick: {
    flex: 1,
    alignItems: 'center',
    gap: spacingY.y6,
    paddingVertical: spacingY.y12,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  section: { marginTop: spacingY.y28 },
  sectionTitle: { paddingHorizontal: spacingX.x16, marginBottom: spacingY.y12 },
  seasonRow: {
    flexDirection: 'row',
    gap: spacingX.x8,
    paddingHorizontal: spacingX.x16,
    marginBottom: spacingY.y16,
  },
  seasonChip: {
    paddingHorizontal: spacingX.x14,
    height: 34,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  seasonChipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingX.x8,
    paddingHorizontal: spacingX.x16,
  },
  genre: {
    width: '31%',
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: spacingX.x12,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  calendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.x12,
    paddingHorizontal: spacingX.x16,
    paddingVertical: spacingY.y10,
  },
  calendarDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  calendarText: { flex: 1, gap: spacingY.y2 },
})
