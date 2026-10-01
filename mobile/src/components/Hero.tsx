import { useState } from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { formatOf, plain, titleOf } from '@workspace/shared/format'
import type { Anime } from '@workspace/shared/types'
import { colors, layout, radius, spacingX, spacingY } from '@/constants/theme'
import { absoluteFill } from '@/utils/styling'
import { useReducedMotion } from '@/utils/motion'
import Button from './Button'
import LibButton from './LibButton'
import PreviewVideo, { useDelayedActive } from './PreviewVideo'
import Typo from './Typo'

const { width } = Dimensions.get('window')

interface Props {
  anime: Anime
  preview?: boolean
  /** Parent screen's scroll offset — drives the parallax. */
  scrollY?: SharedValue<number>
}

/** Full-bleed hero. Scroll the page and the artwork parallaxes behind it. */
const Hero = ({ anime, preview = true, scrollY: external }: Props) => {
  const router = useRouter()
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(preview)
  const active = useDelayedActive(!!anime.trailer && playing, 900)

  const internal = useSharedValue(0)
  const scrollY = external ?? internal

  const artStyle = useAnimatedStyle(() => {
    if (reduced) return {}
    return {
      transform: [
        { translateY: interpolate(scrollY.value, [-100, 0, 300], [-40, 0, 120], Extrapolation.CLAMP) },
        {
          scale: interpolate(scrollY.value, [-100, 0], [1.3, 1], Extrapolation.CLAMP),
        },
      ],
    }
  })

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.art, artStyle]}>
        <Image
          source={{ uri: anime.bannerImage ?? anime.coverImage.extraLarge }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
        />
        {active && anime.trailer ? (
          <PreviewVideo trailer={anime.trailer} active={playing} controls={false} />
        ) : null}
      </Animated.View>

      <LinearGradient
        colors={[colors.scrim, 'rgba(11,11,15,0.55)', colors.scrimSolid]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.body}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Typo size={10} fontWeight="800" color={colors.primarySoft}>
              #{1} TRENDING
            </Typo>
          </View>
          <Typo size={11} color={colors.textMuted}>
            {formatOf(anime)}
            {anime.seasonYear ? ` · ${anime.seasonYear}` : ''}
          </Typo>
        </View>

        <Typo size={30} fontWeight="900" numberOfLines={2} style={styles.title}>
          {titleOf(anime)}
        </Typo>

        <Typo size={12} color={colors.textMuted} numberOfLines={2} style={styles.synopsis}>
          {plain(anime.description)}
        </Typo>

        <View style={styles.actions}>
          <Button style={styles.play} onPress={() => router.push(`/watch/${anime.id}/1`)}>
            <View style={styles.playInner}>
              <Icon name="play.fill" size={16} color={colors.black} />
              <Typo size={15} fontWeight="700" color={colors.black}>
                Play
              </Typo>
            </View>
          </Button>
          <Button
            style={styles.more}
            onPress={() => router.push(`/title/${anime.id}`)}
          >
            <View style={styles.playInner}>
              <Icon name="info.circle" size={16} color={colors.textLight} />
              <Typo size={15} fontWeight="600" color={colors.textLight}>
                More Info
              </Typo>
            </View>
          </Button>
        </View>

        <View style={styles.footer}>
          <LibButton list="watchlist" animeId={anime.id} variant="surface" />
          <LibButton list="liked" animeId={anime.id} variant="surface" />
          <LibButton list="reminders" animeId={anime.id} variant="surface" />
          <Pressable onPress={() => setPlaying((p) => !p)} hitSlop={8} style={styles.mute}>
            <Icon
              name={playing ? 'speaker.slash' : 'speaker.wave.2'}
              size={18}
              color={colors.textLight}
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default Hero

const styles = StyleSheet.create({
  root: { height: layout.heroHeight, overflow: 'hidden', justifyContent: 'flex-end' },
  art: { ...absoluteFill },
  body: { paddingHorizontal: spacingX.x16, paddingBottom: spacingY.y32, gap: spacingY.y8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x8 },
  badge: {
    backgroundColor: 'rgba(124,92,255,0.18)',
    borderRadius: radius.xs,
    paddingHorizontal: spacingX.x8,
    paddingVertical: spacingY.y4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(124,92,255,0.4)',
  },
  title: { letterSpacing: -0.5 },
  synopsis: { maxWidth: width * 0.86 },
  actions: { flexDirection: 'row', gap: spacingX.x10, marginTop: spacingY.y8 },
  play: { flex: 1, height: 46, backgroundColor: colors.white },
  more: { flex: 1, height: 46, backgroundColor: colors.surfaceAlpha },
  playInner: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x8 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x6, marginTop: spacingY.y8 },
  mute: { marginLeft: 'auto', padding: 8 },
})
