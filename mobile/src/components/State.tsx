import { StyleSheet, View } from 'react-native'
import { colors, layout, radius, spacingX, spacingY } from '@/constants/theme'
import Typo from './Typo'
import Skeleton from './Skeleton'
import Button from './Button'

/** Matches an AnimeCard poster so the placeholder has the same footprint. */
const POSTER_HEIGHT = layout.cardWidth / layout.posterRatio

export function PosterSkeletonRow({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.card}>
          <Skeleton height={POSTER_HEIGHT} round />
          <Skeleton height={10} width="80%" style={{ marginTop: spacingY.y8 }} />
          <Skeleton height={10} width="50%" style={{ marginTop: spacingY.y6 }} />
        </View>
      ))}
    </View>
  )
}

export function HeroSkeleton() {
  return (
    <View style={styles.hero}>
      <Skeleton height="100%" width="100%" style={styles.heroFill} />
    </View>
  )
}

export function EmptyState({
  title,
  message,
  action,
  onAction,
}: {
  title: string
  message?: string
  action?: string
  onAction?: () => void
}) {
  return (
    <View style={styles.center}>
      <Typo size={17} fontWeight="700">
        {title}
      </Typo>
      {message ? (
        <Typo size={13} color={colors.textMuted} style={styles.centerText}>
          {message}
        </Typo>
      ) : null}
      {action ? (
        <Button onPress={onAction} style={styles.action}>
          <Typo size={14} fontWeight="600">
            {action}
          </Typo>
        </Button>
      ) : null}
    </View>
  )
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      title="Something went wrong"
      message={message ?? 'We could not load this. Check your connection and try again.'}
      action={onRetry ? 'Try again' : undefined}
      onAction={onRetry}
    />
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: layout.cardGap, paddingHorizontal: spacingX.x16 },
  card: { width: layout.cardWidth },
  hero: { height: layout.heroHeight, paddingHorizontal: spacingX.x16 },
  heroFill: { borderRadius: radius.lg },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingY.y48,
    paddingHorizontal: spacingX.x24,
    gap: spacingY.y8,
  },
  centerText: { textAlign: 'center' },
  action: { marginTop: spacingY.y12, paddingHorizontal: spacingX.x24 },
})
