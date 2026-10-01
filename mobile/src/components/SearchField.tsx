import { useEffect, useRef, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { colors, duration, radius, spacingX } from '@/constants/theme'
import { useReducedMotion } from '@/utils/motion'

const COLLAPSED = 40
const MAX = Math.min(220, Dimensions.get('window').width * 0.5)

interface Props {
  expanded: boolean
  onToggle: () => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const SearchField = ({ expanded, onToggle }: Props) => {
  const router = useRouter()
  const reduced = useReducedMotion()
  const inputRef = useRef<TextInput>(null)
  const [value, setValue] = useState('')
  const width = useSharedValue(COLLAPSED)

  useEffect(() => {
    const target = expanded ? MAX : COLLAPSED
    width.value = reduced ? target : withTiming(target, { duration: duration.base })
    if (expanded) setTimeout(() => inputRef.current?.focus(), 60)
  }, [expanded, reduced, width])

  const animatedStyle = useAnimatedStyle(() => ({ width: width.value }))

  const submit = () => {
    router.push(`/browse?q=${encodeURIComponent(value)}`)
    onToggle()
  }

  return (
    <AnimatedPressable
      onPress={!expanded ? onToggle : undefined}
      style={[styles.root, animatedStyle]}
    >
      <View style={styles.icon}>
        <Icon name="magnifyingglass" size={15} color={colors.textMuted} />
      </View>
      {expanded ? (
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={submit}
          placeholder="Search anime"
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.primarySoft}
          returnKeyType="search"
          style={styles.input}
        />
      ) : null}
    </AnimatedPressable>
  )
}

export default SearchField

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  icon: { width: 40, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingRight: spacingX.x12,
    height: '100%',
  },
})
