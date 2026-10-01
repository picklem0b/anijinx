import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import Animated, {
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useReducedMotion } from '@/utils/motion'
import SearchField from './SearchField'
import Typo from './Typo'

interface Props {
  /** 0 → transparent, 1 → blurred/scrolled. Wire to the screen's scroll offset. */
  scrollProgress?: SharedValue<number>
}

/**
 * The global chrome. Layout order is deliberate and tested against the PRD:
 *   [ logo ] … [ search input ] [ avatar ]
 * The search field collapses to an icon on narrow screens and expands on focus.
 */
const Header = ({ scrollProgress }: Props) => {
  const router = useRouter()
  const reduced = useReducedMotion()
  const [expanded, setExpanded] = useState(false)

  const progress = useDerivedValue(() => scrollProgress?.value ?? 0)
  const surface = useAnimatedStyle(() => {
    if (reduced) return {
      backgroundColor: colors.surfaceAlpha,
      borderBottomColor: colors.border,
    }
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['rgba(11,11,15,0)', colors.surfaceAlpha],
      ),
      borderBottomColor: interpolateColor(
        progress.value,
        [0, 1],
        ['rgba(11,11,15,0)', colors.border],
      ),
    }
  })

  return (
    <Animated.View style={[styles.root, surface]}>
      {!reduced ? (
        <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}

      <Pressable onPress={() => router.push('/')} hitSlop={8}>
        <Typo size={20} fontWeight="900" style={styles.logo}>
          ANIJINX
        </Typo>
      </Pressable>

      <View style={styles.right}>
        {/* Search sits immediately to the left of the avatar. */}
        <SearchField expanded={expanded} onToggle={() => setExpanded((v) => !v)} />

        <Pressable
          onPress={() => router.push('/profile')}
          hitSlop={8}
          accessibilityLabel="Profile"
          style={styles.avatar}
        >
          <Image
            source={{ uri: 'https://api.dicebear.com/9.x/thumbs/png?seed=anijinx' }}
            style={styles.avatarImg}
            contentFit="cover"
          />
        </Pressable>
      </View>
    </Animated.View>
  )
}

export default Header

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX.x16,
    paddingBottom: spacingY.y10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: { color: colors.primary, letterSpacing: 1.2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x10, flexShrink: 1 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceRaised,
  },
  avatarImg: { width: '100%', height: '100%' },
})
