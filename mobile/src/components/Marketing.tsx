import type { ReactNode } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Typo from './Typo'

export function MarketingShell({
  eyebrow,
  title,
  lede,
  children,
  showBack = true,
}: {
  eyebrow?: string
  title: string
  lede?: string
  children?: ReactNode
  showBack?: boolean
}) {
  const router = useRouter()
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {showBack ? (
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Icon name="chevron.left" size={18} color={colors.textLight} />
        </Pressable>
      ) : null}

      <Animated.View entering={FadeInUp.duration(380)} style={styles.head}>
        {eyebrow ? (
          <Typo size={11} fontWeight="800" color={colors.primarySoft} style={styles.eyebrow}>
            {eyebrow.toUpperCase()}
          </Typo>
        ) : null}
        <Typo size={30} fontWeight="900" style={styles.title}>
          {title}
        </Typo>
        {lede ? (
          <Typo size={14} color={colors.textMuted} style={styles.lede}>
            {lede}
          </Typo>
        ) : null}
      </Animated.View>

      <View style={styles.body}>{children}</View>
    </ScrollView>
  )
}

export function Section({
  title,
  children,
  delay = 0,
}: {
  title: string
  children: ReactNode
  delay?: number
}) {
  return (
    <Animated.View entering={FadeInDown.duration(320).delay(delay)} style={styles.section}>
      <Typo size={17} fontWeight="700">
        {title}
      </Typo>
      <View style={styles.sectionBody}>{children}</View>
    </Animated.View>
  )
}

export function Card({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <Animated.View entering={FadeInDown.duration(320).delay(delay)} style={styles.card}>
      {children}
    </Animated.View>
  )
}

export function FeatureRow({
  icon,
  title,
  body,
}: {
  icon: 'bolt.fill' | 'sparkles' | 'play.rectangle.fill' | 'bell.fill' | 'lock.shield.fill' | 'heart.fill'
  title: string
  body: string
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Icon name={icon} size={16} color={colors.primarySoft} />
      </View>
      <View style={styles.featureText}>
        <Typo size={14} fontWeight="600">
          {title}
        </Typo>
        <Typo size={12} color={colors.textMuted} style={styles.featureBody}>
          {body}
        </Typo>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacingX.x16, paddingTop: spacingY.y72, paddingBottom: spacingY.y64 },
  back: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlpha,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingY.y20,
  },
  head: { gap: spacingY.y8 },
  eyebrow: { letterSpacing: 1.4 },
  title: { letterSpacing: -0.6 },
  lede: { lineHeight: 21 },
  body: { marginTop: spacingY.y24, gap: spacingY.y20 },
  section: { gap: spacingY.y10 },
  sectionBody: { gap: spacingY.y10 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacingX.x16,
    gap: spacingY.y10,
  },
  feature: { flexDirection: 'row', gap: spacingX.x12, alignItems: 'flex-start' },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(124,92,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, gap: spacingY.y2 },
  featureBody: { lineHeight: 18 },
})
