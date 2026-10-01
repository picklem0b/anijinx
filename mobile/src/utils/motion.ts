import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'
import {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type WithSpringConfig,
} from 'react-native-reanimated'
import { duration } from '@/constants/theme'

/** Reacts to the OS "Reduce Motion" setting, live. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    let alive = true
    AccessibilityInfo.isReduceMotionEnabled().then((v) => alive && setReduced(v))
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => setReduced(v))
    return () => {
      alive = false
      sub.remove()
    }
  }, [])

  return reduced
}

/** Entrance animations collapse to instant when motion is reduced. */
export const fadeIn = (delay = 0) => FadeIn.duration(duration.base).delay(delay)
export const riseIn = (delay = 0) => FadeInUp.duration(duration.slow).delay(delay)
export const dropIn = (delay = 0) => FadeInDown.duration(duration.slow).delay(delay)

export const stagger = (index: number, step = 55, cap = 8) => Math.min(index, cap) * step

export const spring: WithSpringConfig = { damping: 18, stiffness: 180, mass: 0.6 }

export const smooth = (value: number, ms = duration.base) =>
  withTiming(value, { duration: ms, easing: Easing.out(Easing.cubic) })

/**
 * A press-scale animated style for cards. Returns the style plus handlers to
 * spread onto a Pressable.
 */
export function usePressScale(scaleTo = 0.96, disabled = false) {
  const reduced = useReducedMotion()
  const pressed = useSharedValue(1)

  const style = useAnimatedStyle(() => ({ transform: [{ scale: pressed.value }] }))

  const onPressIn = () => {
    if (!disabled && !reduced) pressed.value = withSpring(scaleTo, spring)
  }
  const onPressOut = () => {
    if (!disabled) pressed.value = withSpring(1, spring)
  }

  return { style, onPressIn, onPressOut }
}

/** Card viewability helper — index-based approximation of ">60% visible". */
export function isMostlyVisible(
  viewable: { index: number; isViewable: boolean }[],
  index: number,
) {
  return viewable.some((v) => v.index === index && v.isViewable)
}
