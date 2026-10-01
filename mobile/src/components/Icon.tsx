import {
  ArrowDownCircle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bookmark,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  CirclePlay,
  Clapperboard,
  Film,
  Heart,
  Home,
  Info,
  LayoutGrid,
  Library,
  Minus,
  Pause,
  Play,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
  XCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react-native'
import type { ColorValue, StyleProp, ViewStyle } from 'react-native'

/**
 * `expo-symbols` (SF Symbols) is iOS-only — on Android it renders nothing, which
 * also breaks Reanimated when it wraps it. Every icon goes through here instead,
 * using lucide so iOS and Android look identical.
 *
 * Keys are the SF Symbol names used at the call sites, so screens stay readable.
 */
const ICONS = {
  'magnifyingglass': Search,
  'xmark': X,
  'xmark.circle.fill': XCircle,
  'plus': Check,
  'checkmark': Check,
  'checkmark.circle.fill': CheckCircle2,
  'minus': Minus,
  'star': Star,
  'star.fill': Star,
  'heart': Heart,
  'heart.fill': Heart,
  'bookmark': Bookmark,
  'bookmark.fill': Bookmark,
  'bell': Bell,
  'bell.fill': Bell,
  'play': Play,
  'play.fill': Play,
  'pause.fill': Pause,
  'play.rectangle.fill': CirclePlay,
  'backward.fill': SkipBack,
  'forward.fill': SkipForward,
  'info.circle': Info,
  'questionmark.circle': CircleHelp,
  'speaker.slash': VolumeX,
  'speaker.wave.2': Volume2,
  'paperplane.fill': Send,
  'trash': Trash2,
  'slider.horizontal.3': SlidersHorizontal,
  'sparkles': Sparkles,
  'sparkle': Sparkles,
  'calendar': CalendarDays,
  'calendar.badge.clock': CalendarClock,
  'chart.bar.fill': BarChart3,
  'chevron.left': ChevronLeft,
  'chevron.right': ChevronRight,
  'chevron.up': ChevronUp,
  'chevron.down': ChevronDown,
  'arrow.up.right': ArrowUpRight,
  'arrow.down.circle': ArrowDownCircle,
  'arrow.triangle.2.circlepath': RefreshCw,
  'film': Film,
  'gearshape': Settings,
  'house': Home,
  'house.fill': Home,
  'square.grid.2x2': LayoutGrid,
  'square.grid.2x2.fill': LayoutGrid,
  'books.vertical': Library,
  'books.vertical.fill': Library,
  'bolt.fill': Zap,
  'lock.shield.fill': ShieldCheck,
  'clapperboard': Clapperboard,
  'chart.line.uptrend.xyaxis': TrendingUp,
} as const satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

interface Props {
  name: IconName
  size?: number
  /** ColorValue so tab bars can pass their own tint type straight through. */
  color?: ColorValue
  /** Filled variants keep lucide's outline shape but mark the icon as active. */
  filled?: boolean
  strokeWidth?: number
  style?: StyleProp<ViewStyle>
}

const Icon = ({ name, size = 20, color = '#FFFFFF', strokeWidth = 2, style }: Props) => {
  const Component = ICONS[name] as LucideIcon | undefined
  if (!Component) return null
  return (
    <Component
      size={size}
      color={color as string}
      strokeWidth={strokeWidth}
      style={style}
    />
  )
}

export default Icon
