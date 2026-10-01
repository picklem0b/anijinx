import { ActivityIndicator } from 'react-native'
import { colors } from '@/constants/theme'
import type { LoadingProps } from '@/types'

const Loading = ({ size = 'small', color = colors.primarySoft }: LoadingProps) => (
  <ActivityIndicator size={size} color={color} />
)

export default Loading
