import type { ReactNode } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useLibrary } from '@/lib/store'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Typo from '@/components/Typo'

export default function SettingsScreen() {
  const router = useRouter()
  const settings = useLibrary((s) => s.settings)
  const setSetting = useLibrary((s) => s.setSetting)
  const deviceId = useLibrary((s) => s.deviceId)

  const toggles = [
    {
      key: 'autoplayPreviews' as const,
      label: 'Autoplay previews',
      hint: 'Play muted trailers on focused cards',
    },
    {
      key: 'preferSubtitles' as const,
      label: 'Subtitles by default',
      hint: 'Turn captions on when playback starts',
    },
    {
      key: 'notifications' as const,
      label: 'Airing reminders',
      hint: 'Notify me when a followed episode drops',
    },
    {
      key: 'dataSaver' as const,
      label: 'Data saver',
      hint: 'Never autoplay previews on cellular',
    },
  ]

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.head}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Icon name="chevron.left" size={18} color={colors.textLight} />
        </Pressable>
        <Typo size={26} fontWeight="900" style={styles.headTitle}>
          Settings
        </Typo>
      </View>

      <Typo size={12} color={colors.textFaint} fontWeight="700" style={styles.group}>
        Playback
      </Typo>
      <View style={styles.card}>
        {toggles.slice(0, 2).map((t, i) => (
          <Animated.View key={t.key} entering={FadeInDown.duration(240).delay(i * 50)}>
            <Row label={t.label} hint={t.hint}>
              <Switch
                value={settings[t.key]}
                onValueChange={(v) => setSetting(t.key, v)}
                trackColor={{ true: colors.primary, false: colors.surfaceRaised }}
                thumbColor={colors.white}
              />
            </Row>
          </Animated.View>
        ))}
      </View>

      <Typo size={12} color={colors.textFaint} fontWeight="700" style={styles.group}>
        Notifications & data
      </Typo>
      <View style={styles.card}>
        {toggles.slice(2).map((t, i) => (
          <Animated.View key={t.key} entering={FadeInDown.duration(240).delay(100 + i * 50)}>
            <Row label={t.label} hint={t.hint}>
              <Switch
                value={settings[t.key]}
                onValueChange={(v) => setSetting(t.key, v)}
                trackColor={{ true: colors.primary, false: colors.surfaceRaised }}
                thumbColor={colors.white}
              />
            </Row>
          </Animated.View>
        ))}
      </View>

      <Typo size={12} color={colors.textFaint} fontWeight="700" style={styles.group}>
        Downloads
      </Typo>
      <View style={styles.card}>
        <Row label="Offline downloads" hint="Coming with the licensed video pipeline">
          <Icon name="arrow.down.circle" size={18} color={colors.textFaint} />
        </Row>
        <Row label="Storage used" hint="Nothing downloaded yet">
          <Typo size={13} color={colors.textFaint}>
            0 MB
          </Typo>
        </Row>
      </View>

      <Typo size={12} color={colors.textFaint} fontWeight="700" style={styles.group}>
        Device
      </Typo>
      <View style={styles.card}>
        <Row label="Device id" hint="Anonymous — identifies your library to the API">
          <Typo size={10} color={colors.textFaint}>
            {deviceId.slice(0, 8)}…
          </Typo>
        </Row>
        {[
          ['/about', 'About'],
          ['/help', 'Help centre'],
          ['/contact', 'Contact'],
          ['/legal', 'Terms & privacy'],
        ].map(([href, label]) => (
          <Pressable
            key={href}
            onPress={() => router.push(href as never)}
            style={styles.clickable}
          >
            <Typo size={13} color={colors.textLight}>
              {label}
            </Typo>
            <Icon name="chevron.right" size={13} color={colors.textFaint} />
          </Pressable>
        ))}
      </View>

      <Typo size={11} color={colors.textFaint} style={styles.version}>
        AniJinx mobile 0.1.0
      </Typo>
    </ScrollView>
  )
}

const Row = ({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) => (
  <View style={styles.row}>
    <View style={styles.rowText}>
      <Typo size={13} fontWeight="600">
        {label}
      </Typo>
      {hint ? (
        <Typo size={11} color={colors.textFaint}>
          {hint}
        </Typo>
      ) : null}
    </View>
    {children}
  </View>
)

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacingX.x16, paddingTop: spacingY.y64, paddingBottom: spacingY.y64 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x12 },
  back: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlpha,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headTitle: { flex: 1 },
  group: { marginTop: spacingY.y28, marginBottom: spacingY.y8, letterSpacing: 0.6 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacingX.x14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacingX.x12,
    paddingVertical: spacingY.y14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowText: { flex: 1, gap: spacingY.y2 },
  clickable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacingY.y14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  version: { marginTop: spacingY.y32, textAlign: 'center' },
})
