import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Icon from '@/components/Icon'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { Card, MarketingShell, Section } from '@/components/Marketing'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'

const FAQ = [
  {
    q: 'Where does the show information come from?',
    a: 'Metadata, artwork and trailers come from the public AniList GraphQL API. Episode playback uses licensed video assets we host separately.',
  },
  {
    q: 'Why does a card play a video while I scroll?',
    a: 'Focused cards autoplay their trailer muted and loop it. It stops the moment the card leaves the viewport, and you can turn it off entirely in Settings.',
  },
  {
    q: 'Does my library sync between devices?',
    a: 'Not yet. Right now it is stored on this device. Cross-device sync arrives with the API, which uses an anonymous device id — no account needed.',
  },
  {
    q: 'Can I download episodes?',
    a: 'Downloads are planned for Premium once the licensed video pipeline is connected.',
  },
  {
    q: 'How do I turn off animations?',
    a: 'AniJinx respects your system Reduce Motion setting. Turn it on in your device settings and every animation degrades to an instant change.',
  },
]

export default function HelpScreen() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <MarketingShell
      eyebrow="Support"
      title="Help centre"
      lede="The questions people actually ask, answered plainly."
    >
      <Animated.View entering={FadeInUp.duration(320)}>
        <Typo size={12} color={colors.textFaint} fontWeight="700" style={styles.label}>
          FREQUENTLY ASKED
        </Typo>
      </Animated.View>

      {FAQ.map((item, i) => {
        const isOpen = open === i
        return (
          <Animated.View key={item.q} entering={FadeInDown.duration(280).delay(i * 45)}>
            <Pressable onPress={() => setOpen(isOpen ? null : i)} style={styles.item}>
              <View style={styles.qRow}>
                <Typo size={14} fontWeight="600" style={styles.qText}>
                  {item.q}
                </Typo>
                <Icon
                  name={isOpen ? 'chevron.up' : 'chevron.down'}
                  size={13}
                  color={colors.textFaint}
                />
              </View>
              {isOpen ? (
                <Typo size={12} color={colors.textMuted} style={styles.answer}>
                  {item.a}
                </Typo>
              ) : null}
            </Pressable>
          </Animated.View>
        )
      })}

      <Section title="Still stuck?" delay={240}>
        <Card>
          <Typo size={13} color={colors.textMuted}>
            Reach out and we will get back to you.
          </Typo>
        </Card>
      </Section>
    </MarketingShell>
  )
}

const styles = StyleSheet.create({
  label: { letterSpacing: 1, marginBottom: spacingY.y4 },
  item: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacingX.x14,
    gap: spacingY.y8,
  },
  qRow: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x12 },
  qText: { flex: 1 },
  answer: { lineHeight: 18 },
})
