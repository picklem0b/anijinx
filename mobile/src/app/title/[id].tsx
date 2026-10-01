import { useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import Animated, { FadeInDown, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { formatOf, plain, releaseLabel, runtimeOf, scoreOf, streamEp, titleOf } from '@workspace/shared/format'
import type { Anime } from '@workspace/shared/types'
import { useAnime } from '@/hooks/useAnime'
import { useLibrary } from '@/lib/store'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Button from '@/components/Button'
import Comments from '@/components/Comments'
import LibButton from '@/components/LibButton'
import PreviewVideo, { useDelayedActive } from '@/components/PreviewVideo'
import Shelf from '@/components/Shelf'
import Skeleton from '@/components/Skeleton'
import Stars from '@/components/Stars'
import { ErrorState } from '@/components/State'
import Typo from '@/components/Typo'

export default function TitleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const animeId = Number(id)
  const router = useRouter()
  const scrollY = useSharedValue(0)
  const [previewing, setPreviewing] = useState(false)
  const [epsOpen, setEpsOpen] = useState(false)

  const { data: anime, isLoading, isError, error, refetch } = useAnime(animeId)
  const rating = useLibrary((s) => s.ratings[animeId] ?? 0)
  const rate = useLibrary((s) => s.rate)

  const previewReady = useDelayedActive(previewing || !!anime, 900)
  const recommendations = useMemo(
    () =>
      (anime?.recommendations?.nodes ?? [])
        .map((n) => n.mediaRecommendation)
        .filter((a): a is Anime => !!a),
    [anime],
  )

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = Math.min(1, Math.max(0, e.contentOffset.y / 160))
  })

  if (isError) {
    return (
      <View style={styles.screen}>
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      </View>
    )
  }

  const episodeCount = anime
    ? (anime.episodes ?? (anime.nextAiringEpisode ? anime.nextAiringEpisode.episode - 1 : 0))
    : 0

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {anime ? (
            <Image
              source={{ uri: anime.bannerImage ?? anime.coverImage.extraLarge }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={260}
            />
          ) : (
            <Skeleton height="100%" width="100%" />
          )}

          {anime?.trailer && previewReady ? (
            <PreviewVideo trailer={anime.trailer} active={previewing} />
          ) : null}

          <LinearGradient
            colors={[colors.scrim, 'rgba(11,11,15,0.4)', colors.scrimSolid]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />

          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
            <Icon name="chevron.left" size={18} color={colors.textLight} />
          </Pressable>

          {anime?.trailer ? (
            <Pressable onPress={() => setPreviewing((p) => !p)} hitSlop={10} style={styles.previewToggle}>
              <Icon
                name={previewing ? 'pause.fill' : 'play.fill'}
                size={14}
                color={colors.textLight}
              />
              <Typo size={11} color={colors.textLight} fontWeight="600">
                {previewing ? 'Pause preview' : 'Play preview'}
              </Typo>
            </Pressable>
          ) : null}
        </View>

        <Animated.View entering={FadeInDown.duration(360)} style={styles.body}>
          {isLoading || !anime ? (
            <View style={styles.loading}>
              <Skeleton height={240} round />
            </View>
          ) : (
            <>
              <View style={styles.titleRow}>
                <Typo size={26} fontWeight="900" numberOfLines={2} style={styles.title}>
                  {titleOf(anime)}
                </Typo>
                <LibButton list="liked" animeId={anime.id} size={24} />
              </View>

              <View style={styles.metaRow}>
                {scoreOf(anime) ? (
                  <Typo size={13} color={colors.primarySoft} fontWeight="700">
                    ★ {scoreOf(anime)}
                  </Typo>
                ) : null}
                <Typo size={12} color={colors.textMuted}>
                  {formatOf(anime)}
                </Typo>
                {anime.seasonYear ? (
                  <Typo size={12} color={colors.textMuted}>
                    {anime.seasonYear}
                  </Typo>
                ) : null}
                {runtimeOf(anime) ? (
                  <Typo size={12} color={colors.textMuted}>
                    {runtimeOf(anime)}
                  </Typo>
                ) : null}
                <View style={styles.airPill}>
                  <Typo size={10} color={colors.textLight} fontWeight="700">
                    {releaseLabel(anime)}
                  </Typo>
                </View>
              </View>

              <View style={styles.genres}>
                {anime.genres.map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => router.push(`/browse?genre=${encodeURIComponent(g)}`)}
                    style={styles.genre}
                  >
                    <Typo size={11} color={colors.textLight} fontWeight="600">
                      {g}
                    </Typo>
                  </Pressable>
                ))}
              </View>

              <View style={styles.actions}>
                <Button
                  style={styles.play}
                  onPress={() => router.push(`/watch/${anime.id}/1`)}
                >
                  <View style={styles.actionInner}>
                    <Icon name="play.fill" size={16} color={colors.black} />
                    <Typo size={15} fontWeight="700" color={colors.black}>
                      Play EP 1
                    </Typo>
                  </View>
                </Button>
                <LibButton list="watchlist" animeId={anime.id} variant="surface" />
                <LibButton list="reminders" animeId={anime.id} variant="surface" />
              </View>

              <View style={styles.ratingBlock}>
                <Typo size={13} color={colors.textMuted} fontWeight="600">
                  Your rating
                </Typo>
                <Stars value={rating} onChange={(v) => rate(anime.id, v)} />
              </View>

              <Typo size={14} color={colors.textLight} style={styles.synopsis}>
                {plain(anime.description) || 'No synopsis available.'}
              </Typo>

              <View style={styles.studioBlock}>
                <Typo size={12} color={colors.textFaint}>
                  Studio
                </Typo>
                <Typo size={13} fontWeight="600">
                  {anime.studios.nodes.map((s) => s.name).join(', ') || '—'}
                </Typo>
              </View>

              <View style={styles.episodeHead}>
                <Typo size={17} fontWeight="700">
                  Episodes
                </Typo>
                {episodeCount > 6 ? (
                  <Pressable onPress={() => setEpsOpen(true)}>
                    <Typo size={13} color={colors.primarySoft} fontWeight="600">
                      All {episodeCount}
                    </Typo>
                  </Pressable>
                ) : null}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.episodeRow}
              >
                {Array.from({ length: Math.max(episodeCount, 0) }).map((_, i) => {
                  const n = i + 1
                  const streamed = streamEp(anime, n)
                  return (
                    <Pressable
                      key={n}
                      onPress={() => router.push(`/watch/${anime.id}/${n}`)}
                      style={styles.episode}
                    >
                      <Typo size={18} fontWeight="800">
                        {n}
                      </Typo>
                      <Typo size={10} color={colors.textFaint} numberOfLines={1}>
                        {streamed ? 'Streaming' : 'EP ' + n}
                      </Typo>
                    </Pressable>
                  )
                })}
                {episodeCount === 0 ? (
                  <Typo size={13} color={colors.textFaint}>
                    Episode list not published yet.
                  </Typo>
                ) : null}
              </ScrollView>

              {recommendations.length > 0 ? (
                <Shelf title="More like this" items={recommendations} preview={false} />
              ) : null}

              <Comments animeId={anime.id} />

              {anime.externalLinks.length > 0 ? (
                <View style={styles.links}>
                  <Typo size={13} color={colors.textFaint} fontWeight="600">
                    Official links
                  </Typo>
                  {anime.externalLinks.slice(0, 5).map((l) => (
                    <Pressable
                      key={l.url}
                      onPress={() => router.push(`/watch/${anime.id}/1`)}
                      style={styles.link}
                    >
                      <Typo size={13} color={colors.primarySoft} numberOfLines={1}>
                        {l.site}
                      </Typo>
                      <Icon name="arrow.up.right" size={12} color={colors.textFaint} />
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </>
          )}
        </Animated.View>
      </Animated.ScrollView>

      <Modal visible={epsOpen} animationType="slide" transparent onRequestClose={() => setEpsOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setEpsOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Typo size={18} fontWeight="800" style={styles.sheetTitle}>
            All episodes
          </Typo>
          <ScrollView contentContainerStyle={styles.sheetGrid}>
            {Array.from({ length: episodeCount }).map((_, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  setEpsOpen(false)
                  router.push(`/watch/${animeId}/${i + 1}`)
                }}
                style={styles.sheetEpisode}
              >
                <Typo size={14} fontWeight="700">
                  {i + 1}
                </Typo>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacingY.y64 },
  hero: { height: 340, justifyContent: 'flex-start' },
  back: {
    position: 'absolute',
    top: spacingY.y48,
    left: spacingX.x16,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlpha,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewToggle: {
    position: 'absolute',
    bottom: spacingY.y16,
    right: spacingX.x16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.x6,
    paddingHorizontal: spacingX.x10,
    paddingVertical: spacingY.y6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlpha,
  },
  body: { paddingHorizontal: spacingX.x16, marginTop: -spacingY.y24, gap: spacingY.y12 },
  loading: { marginTop: spacingY.y24 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacingX.x10 },
  title: { flex: 1 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacingX.x10 },
  airPill: {
    paddingHorizontal: spacingX.x10,
    paddingVertical: spacingY.y4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: spacingX.x6 },
  genre: {
    paddingHorizontal: spacingX.x10,
    paddingVertical: spacingY.y4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x10, marginTop: spacingY.y4 },
  play: { flex: 1, backgroundColor: colors.white, height: 46 },
  actionInner: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x8 },
  ratingBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  synopsis: { lineHeight: 21 },
  studioBlock: { gap: spacingY.y2 },
  episodeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacingY.y12,
  },
  episodeRow: { gap: spacingX.x10, paddingVertical: spacingY.y4 },
  episode: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingY.y4,
  },
  links: { gap: spacingY.y8, marginTop: spacingY.y12 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacingY.y10,
    paddingHorizontal: spacingX.x14,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
  },
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderCurve: 'continuous',
    maxHeight: '70%',
    paddingBottom: spacingY.y24,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginTop: spacingY.y10,
  },
  sheetTitle: { paddingHorizontal: spacingX.x16, marginTop: spacingY.y14 },
  sheetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingX.x8,
    paddingHorizontal: spacingX.x16,
    paddingTop: spacingY.y12,
  },
  sheetEpisode: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
