import {
  Pressable,
  StyleSheet,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import Animated, { FadeIn } from 'react-native-reanimated'
import { scoreOf, titleOf } from '@workspace/shared/format'
import type { Anime } from '@workspace/shared/types'
import { colors, layout, radius, spacingX, spacingY } from '@/constants/theme'
import { stagger, usePressScale } from '@/utils/motion'
import Typo from './Typo'
import PreviewVideo, { useDelayedActive } from './PreviewVideo'

interface Props {
  anime: Anime
  index?: number
  width?: DimensionValue
  /** Poster shows a trailer preview once it's mostly visible. */
  preview?: boolean
  active?: boolean
  showScore?: boolean
  showRank?: number
  style?: StyleProp<ViewStyle>
}

const AnimeCard = ({
  anime,
  index = 0,
  width = layout.cardWidth,
  preview = false,
  active = false,
  showScore = true,
  showRank,
  style,
}: Props) => {
  const router = useRouter()
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale()
  const previewActive = useDelayedActive(active)

  return (
    <Animated.View entering={FadeIn.duration(320).delay(stagger(index))}>
      <Pressable
        onPress={() => router.push(`/title/${anime.id}`)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={style}
      >
        <Animated.View style={[styles.poster, { width }, pressStyle]}>
          <Image
            source={{ uri: anime.coverImage.extraLarge }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={220}
            placeholder={{ blurhash: 'L03[]6~q00xt00Rj00M{' }}
            cachePolicy="memory-disk"
          />
          {preview && previewActive && anime.trailer ? (
            <PreviewVideo trailer={anime.trailer} active={active} />
          ) : null}

          {showRank ? (
            <View style={styles.rank}>
              <Typo size={26} fontWeight="900" style={styles.rankText}>
                {showRank}
              </Typo>
            </View>
          ) : null}
        </Animated.View>

        <Typo size={13} fontWeight="600" numberOfLines={2} style={styles.title}>
          {titleOf(anime)}
        </Typo>
        <View style={styles.meta}>
          <Typo size={11} color={colors.textFaint}>
            {anime.format?.replace('_', ' ') ?? 'Anime'}
          </Typo>
          {showScore && scoreOf(anime) ? (
            <Typo size={11} color={colors.primarySoft} fontWeight="700">
              ★ {scoreOf(anime)}
            </Typo>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  )
}

export default AnimeCard

const styles = StyleSheet.create({
  poster: {
    aspectRatio: layout.posterRatio,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.surfaceRaised,
    width: '100%',
  },
  title: { marginTop: spacingY.y8, paddingRight: spacingX.x4 },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacingY.y4,
  },
  rank: { position: 'absolute', left: 6, bottom: 0 },
  rankText: { color: colors.white, textShadowColor: colors.black, textShadowRadius: 6 },
})
