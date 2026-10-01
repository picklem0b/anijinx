import { forwardRef } from 'react'
import { StyleSheet, TextInput, type TextInputProps } from 'react-native'
import { colors, fontSize, radius, spacingX } from '@/constants/theme'

const Input = forwardRef<TextInput, TextInputProps>(({ style, ...props }, ref) => (
  <TextInput
    ref={ref}
    placeholderTextColor={colors.textFaint}
    selectionColor={colors.primarySoft}
    style={[styles.input, style]}
    {...props}
  />
))

Input.displayName = 'Input'

export default Input

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    color: colors.text,
    fontSize: fontSize.base,
    height: 44,
    paddingHorizontal: spacingX.x14,
  },
})
