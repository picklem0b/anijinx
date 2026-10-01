import { Pressable, StyleSheet, View } from 'react-native'
import Icon from '@/components/Icon'
import { Card, MarketingShell, Section } from '@/components/Marketing'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    features: ['Unlimited browsing', 'Discover + seasonal rails', 'Library on one device', 'Ad-supported previews'],
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$6.99',
    cadence: 'per month',
    features: ['Ad-free episodes', 'Offline downloads', 'Full HD + higher bitrate', 'Cross-device sync', 'Airing reminders'],
    highlight: true,
  },
  {
    name: 'Annual',
    price: '$59.99',
    cadence: 'per year',
    features: ['Everything in Premium', 'Two months free', 'Early access to new features'],
    highlight: false,
  },
]

const COMPARISON = [
  ['Browse & discover', true, true, true],
  ['Ad-supported previews', true, false, false],
  ['Offline downloads', false, true, true],
  ['Cross-device sync', false, true, true],
  ['Airing reminders', false, true, true],
] as const

export default function PricingScreen() {
  return (
    <MarketingShell
      eyebrow="Plans"
      title="Straightforward pricing"
      lede="Start free. Upgrade when you want downloads and ad-free playback."
    >
      {TIERS.map((tier, i) => (
        <Card key={tier.name} delay={i * 70}>
          <View style={styles.tierHead}>
            <View>
              <Typo size={16} fontWeight="800" color={tier.highlight ? colors.primarySoft : colors.text}>
                {tier.name}
              </Typo>
              <Typo size={11} color={colors.textFaint}>
                {tier.cadence}
              </Typo>
            </View>
            <Typo size={24} fontWeight="900">
              {tier.price}
            </Typo>
          </View>

          <View style={styles.features}>
            {tier.features.map((f) => (
              <View key={f} style={styles.feature}>
                <Icon name="checkmark.circle.fill" size={15} color={colors.success} />
                <Typo size={12} color={colors.textLight} style={styles.featureText}>
                  {f}
                </Typo>
              </View>
            ))}
          </View>

          <Button
            style={tier.highlight ? styles.ctaOn : styles.ctaOff}
          >
            <Typo
              size={14}
              fontWeight="700"
              color={tier.highlight ? colors.black : colors.textLight}
            >
              {tier.name === 'Free' ? 'Current plan' : `Choose ${tier.name}`}
            </Typo>
          </Button>
        </Card>
      ))}

      <Section title="Compare" delay={240}>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeadRow]}>
            <Typo size={11} color={colors.textFaint} style={styles.cellWide}>
              FEATURE
            </Typo>
            <Typo size={11} color={colors.textFaint} style={styles.cell}>
              FREE
            </Typo>
            <Typo size={11} color={colors.textFaint} style={styles.cell}>
              PREM
            </Typo>
            <Typo size={11} color={colors.textFaint} style={styles.cell}>
              YEAR
            </Typo>
          </View>
          {COMPARISON.map(([label, a, b, c]) => (
            <View key={label} style={styles.tableRow}>
              <Typo size={12} color={colors.textLight} style={styles.cellWide}>
                {label}
              </Typo>
              {[a, b, c].map((on, i) => (
                <View key={i} style={styles.cell}>
                  <Icon
                    name={on ? 'checkmark' : 'minus'}
                    size={13}
                    color={on ? colors.success : colors.textFaint}
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      </Section>
    </MarketingShell>
  )
}

const styles = StyleSheet.create({
  tierHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  features: { gap: spacingY.y8, marginTop: spacingY.y8 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x8 },
  featureText: { flex: 1 },
  ctaOn: { backgroundColor: colors.white, height: 42, marginTop: spacingY.y8 },
  ctaOff: { backgroundColor: colors.surfaceRaised, height: 42, marginTop: spacingY.y8 },
  table: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingY.y10,
    paddingHorizontal: spacingX.x12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tableHeadRow: { backgroundColor: colors.surfaceRaised },
  cellWide: { flex: 1 },
  cell: { width: 52, alignItems: 'center' },
})
