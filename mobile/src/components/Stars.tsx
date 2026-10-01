import { Pressable, StyleSheet, View } from 'react-native'
import Icon from '@/components/Icon'
import { colors, spacingX } from '@/constants/theme'
import { selectFeedback } from '@/utils/haptics'
import type { StarsProps } from '@/types'

const Stars = ({ value, size = 22, onChange }: StarsProps) => (
  <View style={styles.row}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Pressable
        key={n}
        disabled={!onChange}
        hitSlop={8}
        onPress={() => {
          selectFeedback()
          onChange?.(value === n ? 0 : n)
        }}
      >
        <Icon
          name={n <= value ? 'star.fill' : 'star'}
          size={size}
          color={n <= value ? colors.warning : colors.textFaint}
        />
      </Pressable>
    ))}
  </View>
)

export default Stars

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacingX.x6, alignItems: 'center' },
})
