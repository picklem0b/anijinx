import { StatusBar, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '@/constants/theme'
import type { ScreenWrapperProps } from '@/types'

const ScreenWrapper = ({ style, edgeToEdge = false, children }: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.root, !edgeToEdge && { paddingTop: insets.top }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {children}
    </View>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
