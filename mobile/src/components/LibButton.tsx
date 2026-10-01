import { Pressable, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated'
import { colors, radius } from '@/constants/theme'
import { useLibrary } from '@/lib/store'
import { likeFeedback, tapFeedback } from '@/utils/haptics'
import { spring, useReducedMotion } from '@/utils/motion'
import type { ListKey } from '@workspace/shared/types'
import Icon, { type IconName } from './Icon'

const LIST_ICONS: Record<ListKey, IconName> = {
  liked: 'heart.fill',
  watchlist: 'bookmark.fill',
  reminders: 'bell.fill',
}

interface Props {
  list: ListKey
  animeId: number
  size?: number
  variant?: 'plain' | 'surface'
}

const LibButton = ({ list, animeId, size = 22, variant = 'plain' }: Props) => {
  const reduced = useReducedMotion()
  const active = useLibrary((s) => s[list].includes(animeId))
  const toggle = useLibrary((s) => s.toggle)
  const scale = useSharedValue(1)

  // Animate a plain View — never wrap the icon component itself, or Reanimated
  // tries to find a host instance on a component that may render nothing.
  const burst = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const onPress = () => {
    if (list === 'liked') likeFeedback()
    else tapFeedback()
    toggle(list, animeId)
    if (!reduced) {
      scale.value = withSequence(withSpring(1.35, spring), withSpring(1, spring))
    }
  }

  return (
    <Pressable
      hitSlop={8}
      onPress={onPress}
      style={[styles.base, variant === 'surface' && styles.surface]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${active ? 'Remove from' : 'Add to'} ${list}`}
    >
      <Animated.View style={burst}>
        <Icon
          name={LIST_ICONS[list]}
          size={size}
          color={active ? colors.primary : colors.textLight}
        />
      </Animated.View>
    </Pressable>
  )
}

export default LibButton

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', padding: 6 },
  surface: {
    backgroundColor: colors.surfaceAlpha,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 10,
  },
})
