import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Card, MarketingShell } from '@/components/Marketing'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'

const DOCS = {
  terms: {
    label: 'Terms of service',
    body: 'AniJinx streams only content it owns or is licensed to distribute. Metadata, artwork and trailers are provided by the AniList API. You agree not to redistribute, re-host or circumvent playback protections.',
  },
  privacy: {
    label: 'Privacy policy',
    body: 'AniJinx stores your library, ratings, comments and watch progress on your device under an anonymous identifier. No account is required. When the sync API is enabled, that identifier is the only thing sent — never your name or email.',
  },
  cookies: {
    label: 'Cookies & storage',
    body: 'The mobile app uses device storage rather than cookies. The website uses strictly necessary storage to keep you signed in and remember your preferences. No third-party advertising trackers are used.',
  },
} as const

type DocKey = keyof typeof DOCS

export default function LegalScreen() {
  const [tab, setTab] = useState<DocKey>('terms')
  const doc = DOCS[tab]

  return (
    <MarketingShell
      eyebrow="Legal"
      title="Terms & privacy"
      lede="Short and readable, like the rest of the app."
    >
      <View style={styles.tabs}>
        {(Object.keys(DOCS) as DocKey[]).map((key) => {
          const on = key === tab
          return (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={[styles.tab, on && styles.tabOn]}
            >
              <Typo size={12} fontWeight="600" color={on ? colors.black : colors.textLight}>
                {DOCS[key].label.replace(' policy', '').replace(' of service', '')}
              </Typo>
            </Pressable>
          )
        })}
      </View>

      <Animated.View key={tab} entering={FadeIn.duration(220)}>
        <Card>
          <Typo size={15} fontWeight="700">
            {doc.label}
          </Typo>
          <Typo size={13} color={colors.textMuted} style={styles.body}>
            {doc.body}
          </Typo>
          <Typo size={11} color={colors.textFaint}>
            Last updated 1 October 2026
          </Typo>
        </Card>
      </Animated.View>
    </MarketingShell>
  )
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: spacingX.x8 },
  tab: {
    paddingHorizontal: spacingX.x14,
    height: 34,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tabOn: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  body: { lineHeight: 20, marginTop: spacingY.y6 },
})
