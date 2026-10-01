import { useEffect } from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { colors, radius as radii } from '@/constants/theme'
import { useReducedMotion } from '@/utils/motion'

/** Wide enough to sweep across a full-width hero block. */
const SWEEP_WIDTH = Math.max(200, Dimensions.get('window').width)

interface SkeletonProps {
  width?: DimensionValue
  height?: DimensionValue
  style?: StyleProp<ViewStyle>
  round?: boolean
}

/**
 * Shimmer skeleton.
 *
 * The old version pulsed the whole rectangle's opacity on a near-black surface,
 * which reads as a muddy flicker. A soft highlight that sweeps across a clipped
 * block reads as "loading" instead. Under Reduce Motion the block stays static.
 */
const Skeleton = ({ width = '100%', height = 16, style, round = false }: SkeletonProps) => {
  const reduced = useReducedMotion()
  const progress = useSharedValue(0)

  useEffect(() => {
    if (reduced) {
      progress.value = 0
      return
    }
    progress.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    )
  }, [reduced, progress])

  const sweep = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-SWEEP_WIDTH, SWEEP_WIDTH]) },
    ],
  }))

  return (
    <View
      style={[
        styles.base,
        { width, height, borderRadius: round ? radii.pill : radii.sm },
        style,
      ]}
    >
      {!reduced ? (
        <Animated.View style={[styles.sweep, sweep]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.075)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  )
}

export default Skeleton

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sweep: { position: 'absolute', top: 0, bottom: 0, left: 0, width: SWEEP_WIDTH },
})
