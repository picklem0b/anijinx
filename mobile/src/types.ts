import type { ReactNode } from 'react'
import type {
  StyleProp,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'

/** Extends TextProps so numberOfLines, onPress, etc. pass straight through. */
export interface TypoProps extends TextProps {
  size?: number
  color?: string
  fontWeight?: TextStyle['fontWeight']
  style?: StyleProp<TextStyle>
  textProps?: TextProps
  children: ReactNode
}

export interface CustomButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>
  loading?: boolean
  children: ReactNode
}

export interface ScreenWrapperProps {
  style?: StyleProp<ViewStyle>
  /** Skip the top padding when the screen renders its own full-bleed header. */
  edgeToEdge?: boolean
  children: ReactNode
}

export interface LoadingProps {
  size?: 'small' | 'large' | number
  color?: string
}

export interface StarsProps {
  value: number
  size?: number
  onChange?: (value: number) => void
}
