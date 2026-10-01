import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import Animated, { FadeInUp } from 'react-native-reanimated'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'

const PERKS = ['Sync your library', 'Airing reminders', 'Downloads on Premium']

export default function SignUpScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View style={styles.screen}>
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.close}>
        <Icon name="xmark" size={18} color={colors.textLight} />
      </Pressable>

      <Animated.View entering={FadeInUp.duration(360)} style={styles.body}>
        <Typo size={30} fontWeight="900">
          Create your account
        </Typo>
        <Typo size={13} color={colors.textMuted}>
          No server yet — this screen is the interface only.
        </Typo>

        <View style={styles.perks}>
          {PERKS.map((p) => (
            <View key={p} style={styles.perk}>
              <Icon name="checkmark.circle.fill" size={15} color={colors.success} />
              <Typo size={12} color={colors.textLight}>
                {p}
              </Typo>
            </View>
          ))}
        </View>

        <View style={styles.form}>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
          />
          <Button style={styles.submit} disabled={!email || !password} onPress={() => router.replace('/')}>
            <Typo size={15} fontWeight="700" color={colors.black}>
              Create account
            </Typo>
          </Button>
        </View>

        <Pressable onPress={() => router.replace('/sign-in')} style={styles.switch}>
          <Typo size={13} color={colors.textMuted}>
            Already have an account?{' '}
            <Typo size={13} color={colors.primarySoft} fontWeight="700">
              Sign in
            </Typo>
          </Typo>
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  close: {
    position: 'absolute',
    top: spacingY.y64,
    left: spacingX.x16,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlpha,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: spacingX.x24, gap: spacingY.y10 },
  perks: { gap: spacingY.y8, marginTop: spacingY.y12 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x8 },
  form: { gap: spacingX.x10, marginTop: spacingY.y16 },
  submit: { backgroundColor: colors.primarySoft, marginTop: spacingY.y4 },
  switch: { alignSelf: 'center', marginTop: spacingY.y16 },
})
