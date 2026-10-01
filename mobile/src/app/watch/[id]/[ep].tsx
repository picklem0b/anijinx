import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import { WebView } from 'react-native-webview'
import { titleOf } from '@workspace/shared/format'
import { officialLinks, resolvePlayback } from '@workspace/shared/playback'
import { useAnime, usePlayback } from '@/hooks/useAnime'
import { useLibrary } from '@/lib/store'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Button from '@/components/Button'
import Comments from '@/components/Comments'
import Skeleton from '@/components/Skeleton'
import VideoPlayer from '@/components/VideoPlayer'
import { ErrorState } from '@/components/State'
import Typo from '@/components/Typo'

const { width } = Dimensions.get('window')

export default function WatchScreen() {
  const { id, ep } = useLocalSearchParams<{ id: string; ep: string }>()
  const animeId = Number(id)
  const episode = Number(ep)
  const router = useRouter()

  const { data: anime, isLoading, isError, error, refetch } = useAnime(animeId)
  const { data: asset } = usePlayback(animeId, episode)
  const saveProgress = useLibrary((s) => s.saveProgress)
  const progress = useLibrary((s) => s.progress[`${animeId}:${episode}`])

  const [showNext, setShowNext] = useState(false)
  /** Last playhead reported by the native player, in seconds. */
  const positionRef = useRef(0)

  const episodeCount = anime
    ? (anime.episodes ?? (anime.nextAiringEpisode ? anime.nextAiringEpisode.episode - 1 : 0))
    : 0

  const nextEpisode = episode < episodeCount ? episode + 1 : null
  const prevEpisode = episode > 1 ? episode - 1 : null

  // Honest resolution: a licensed asset when the API has one, otherwise an
  // explicitly-labelled trailer preview. We never present the trailer as EP n.
  const source = useMemo(
    () => (anime ? resolvePlayback(anime, episode, asset?.url) : null),
    [anime, episode, asset?.url],
  )
  const official = useMemo(
    () => (anime ? officialLinks(anime, episode) : []),
    [anime, episode],
  )

  const onProgress = useCallback((seconds: number) => {
    positionRef.current = seconds
  }, [])

  // Persist the real playhead (not wall-clock time) when leaving the episode.
  useEffect(() => {
    positionRef.current = 0
    return () => {
      const seconds = Math.round(positionRef.current)
      if (seconds > 5) {
        saveProgress({
          animeId,
          episode,
          positionSeconds: seconds,
          durationSeconds: anime?.duration ? anime.duration * 60 : 1440,
        })
      }
    }
  }, [animeId, episode, anime?.duration, saveProgress])

  useEffect(() => {
    if (!nextEpisode) return
    const t = setTimeout(() => setShowNext(true), 8000)
    return () => clearTimeout(t)
  }, [nextEpisode])

  const go = useCallback(
    (n: number) => {
      router.replace(`/watch/${animeId}/${n}`)
      setShowNext(false)
    },
    [router, animeId],
  )

  if (isError) {
    return (
      <View style={styles.screen}>
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.player}>
        {isLoading || !anime ? (
          <Skeleton height="100%" width="100%" />
        ) : source && source.kind !== 'trailer' ? (
          // Licensed asset → native player (HLS/file).
          <VideoPlayer source={source} onProgress={onProgress} />
        ) : source ? (
          // Trailer → WebView, because YouTube/Dailymotion are embeds, not media.
          <WebView
            source={{ uri: source.url }}
            style={styles.web}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
            androidLayerType="hardware"
          />
        ) : (
          <View style={styles.noSource}>
            <Icon name="film" size={28} color={colors.textFaint} />
            <Typo size={13} color={colors.textMuted}>
              No licensed source for this title yet.
            </Typo>
          </View>
        )}

        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Icon name="chevron.left" size={18} color={colors.textLight} />
        </Pressable>

        {source ? (
          <View style={[styles.sourceTag, source.isEpisode ? styles.sourceTagReal : styles.sourceTagPreview]}>
            <Typo size={10} fontWeight="600" color={colors.textLight}>
              {source.isEpisode ? 'EPISODE' : 'PREVIEW'}
            </Typo>
          </View>
        ) : null}

        {showNext && nextEpisode ? (
          <View style={styles.nextCard}>
            <Typo size={11} color={colors.textMuted} fontWeight="600">
              Up next
            </Typo>
            <Typo size={14} fontWeight="700" numberOfLines={1}>
              Episode {nextEpisode}
            </Typo>
            <Button style={styles.nextBtn} onPress={() => go(nextEpisode)}>
              <Typo size={13} fontWeight="700" color={colors.black}>
                Play
              </Typo>
            </Button>
            <Pressable onPress={() => setShowNext(false)} hitSlop={8}>
              <Typo size={12} color={colors.textFaint}>
                Dismiss
              </Typo>
            </Pressable>
          </View>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {anime ? (
          <>
            <Typo size={17} fontWeight="700" numberOfLines={2}>
              {titleOf(anime)}
            </Typo>
            <View style={styles.subRow}>
              <Typo size={12} color={colors.textMuted}>
                Episode {episode}
                {anime.episodes ? ` of ${anime.episodes}` : ''}
              </Typo>
              {progress ? (
                <Typo size={12} color={colors.primarySoft}>
                  Resumed at {Math.floor(progress.positionSeconds / 60)}m
                </Typo>
              ) : null}
            </View>

            <View style={styles.controls}>
              <Pressable
                disabled={!prevEpisode}
                onPress={() => prevEpisode && go(prevEpisode)}
                style={[styles.control, !prevEpisode && styles.controlOff]}
              >
                <Icon name="backward.fill" size={16} color={colors.textLight} />
                <Typo size={12} color={colors.textLight} fontWeight="600">
                  Prev
                </Typo>
              </Pressable>

              <Pressable
                disabled={!nextEpisode}
                onPress={() => nextEpisode && go(nextEpisode)}
                style={[styles.control, !nextEpisode && styles.controlOff]}
              >
                <Typo size={12} color={colors.textLight} fontWeight="600">
                  Next
                </Typo>
                <Icon name="forward.fill" size={16} color={colors.textLight} />
              </Pressable>
            </View>

            <Typo size={13} color={colors.textMuted} fontWeight="600" style={styles.epTitle}>
              Episodes
            </Typo>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.epRow}
            >
              {Array.from({ length: episodeCount }).map((_, i) => {
                const n = i + 1
                const on = n === episode
                return (
                  <Pressable
                    key={n}
                    onPress={() => go(n)}
                    style={[styles.ep, on && styles.epOn]}
                  >
                    <Typo size={14} fontWeight="700" color={on ? colors.black : colors.text}>
                      {n}
                    </Typo>
                  </Pressable>
                )
              })}
            </ScrollView>

            <Comments animeId={animeId} episode={episode} title={`Episode ${episode} comments`} />

            {official.length > 0 ? (
              <View style={styles.official}>
                <Typo size={13} fontWeight="700">
                  {source?.isEpisode ? 'Also available on' : 'Watch the full episode on'}
                </Typo>
                {official.map((l) => (
                  <Pressable
                    key={l.url}
                    onPress={() => Linking.openURL(l.url).catch(() => {})}
                    style={styles.officialRow}
                  >
                    <Typo size={13} color={colors.primarySoft} fontWeight="600">
                      {l.site}
                    </Typo>
                    <Icon name="arrow.up.right" size={13} color={colors.textFaint} />
                  </Pressable>
                ))}
              </View>
            ) : null}

            <View style={styles.licence}>
              <Image
                source={{ uri: anime.coverImage.extraLarge }}
                style={styles.licenceArt}
                contentFit="cover"
              />
              <Typo size={11} color={colors.textFaint} style={styles.licenceText}>
                {source?.isEpisode
                  ? 'Playing a licensed asset for this episode.'
                  : 'Only the official trailer can play here. Licensed episode streams connect once the video pipeline is built — no public API provides anime episode streams.'}
              </Typo>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  player: {
    width,
    height: width * 0.62,
    backgroundColor: colors.black,
    justifyContent: 'center',
  },
  web: { flex: 1, backgroundColor: colors.black },
  noSource: { alignItems: 'center', gap: spacingY.y10 },
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
  nextCard: {
    position: 'absolute',
    right: spacingX.x16,
    bottom: spacingY.y16,
    backgroundColor: colors.surfaceAlpha,
    borderRadius: radius.md,
    padding: spacingX.x14,
    gap: spacingY.y6,
    width: 180,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  nextBtn: { height: 36, backgroundColor: colors.white },
  sourceTag: {
    position: 'absolute',
    top: spacingY.y48,
    right: spacingX.x16,
    paddingHorizontal: spacingX.x10,
    paddingVertical: spacingY.y4,
    borderRadius: radius.pill,
  },
  sourceTagReal: { backgroundColor: 'rgba(34,197,94,0.85)' },
  sourceTagPreview: { backgroundColor: 'rgba(245,158,11,0.85)' },
  body: { padding: spacingX.x16, paddingBottom: spacingY.y64, gap: spacingY.y10 },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x12 },
  controls: { flexDirection: 'row', gap: spacingX.x10, marginTop: spacingY.y6 },
  control: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingX.x8,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
  },
  controlOff: { opacity: 0.4 },
  epTitle: { marginTop: spacingY.y12 },
  epRow: { gap: spacingX.x8, paddingVertical: spacingY.y4 },
  ep: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  epOn: { backgroundColor: colors.primarySoft },
  official: { gap: spacingY.y8, marginTop: spacingY.y20 },
  officialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacingY.y10,
    paddingHorizontal: spacingX.x14,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
  },
  licence: {
    flexDirection: 'row',
    gap: spacingX.x12,
    alignItems: 'center',
    marginTop: spacingY.y24,
  },
  licenceArt: { width: 44, height: 62, borderRadius: radius.xs },
  licenceText: { flex: 1, lineHeight: 16 },
})
