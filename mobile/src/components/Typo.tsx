import { Text, type TextStyle } from 'react-native'
import { colors } from '@/constants/theme'
import type { TypoProps } from '@/types'
import { verticalScale } from '@/utils/styling'

const Typo = ({
  size,
  color = colors.text,
  fontWeight = '400',
  children,
  style,
  textProps,
  ...rest
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(15),
    color,
    fontWeight,
  }
  return (
    <Text style={[textStyle, style]} {...textProps} {...rest}>
      {children}
    </Text>
  )
}

export default Typo
