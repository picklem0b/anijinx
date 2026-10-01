import { Platform } from 'react-native'
import { scale, verticalScale } from '@/utils/styling'

/**
 * AniJinx design tokens. Screens and components must never hard-code a hex —
 * everything comes from here so the theme can change in one place.
 */
export const colors = {
  // Brand — keep the AniJinx violet rather than Netflix red.
  primary: '#7C5CFF',
  primarySoft: '#9B85FF',
  primaryDeep: '#4B2FD6',

  // Surfaces (Netflix-style near-black stack)
  background: '#0B0B0F',
  surface: '#14141B',
  surfaceRaised: '#1C1C25',
  surfaceAlpha: 'rgba(20,20,27,0.72)',
  border: '#26262F',

  // Text
  text: '#FFFFFF',
  textLight: '#E6E6EC',
  textMuted: '#A0A0AD',
  textFaint: '#6C6C7A',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#38BDF8',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.55)',
  scrim: 'rgba(11,11,15,0)',
  scrimSolid: '#0B0B0F',
} as const

export const spacingX = {
  x2: scale(2),
  x4: scale(4),
  x6: scale(6),
  x8: scale(8),
  x10: scale(10),
  x12: scale(12),
  x14: scale(14),
  x16: scale(16),
  x20: scale(20),
  x24: scale(24),
  x28: scale(28),
  x32: scale(32),
  x40: scale(40),
  x48: scale(48),
} as const

export const spacingY = {
  y2: verticalScale(2),
  y4: verticalScale(4),
  y6: verticalScale(6),
  y8: verticalScale(8),
  y10: verticalScale(10),
  y12: verticalScale(12),
  y14: verticalScale(14),
  y16: verticalScale(16),
  y20: verticalScale(20),
  y24: verticalScale(24),
  y28: verticalScale(28),
  y32: verticalScale(32),
  y40: verticalScale(40),
  y48: verticalScale(48),
  y64: verticalScale(64),
  y72: verticalScale(72),
} as const

export const radius = {
  xs: scale(6),
  sm: scale(10),
  md: scale(14),
  lg: scale(18),
  xl: scale(24),
  pill: 999,
} as const

export const fontSize = {
  xs: verticalScale(11),
  sm: verticalScale(13),
  base: verticalScale(15),
  md: verticalScale(17),
  lg: verticalScale(20),
  xl: verticalScale(24),
  xxl: verticalScale(30),
  display: verticalScale(38),
} as const

export const duration = {
  fast: 160,
  base: 240,
  slow: 400,
  hero: 600,
} as const

/** Netflix-style card geometry: 2:3 posters with a peek of the next card. */
export const layout = {
  posterRatio: 2 / 3,
  cardWidth: scale(124),
  cardGap: spacingX.x10,
  heroHeight: verticalScale(430),
} as const

export const shadow = Platform.select({
  ios: {
    shadowColor: colors.black,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  default: { elevation: 8 },
})
