import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import Animated, { FadeInUp } from 'react-native-reanimated'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { successFeedback } from '@/utils/haptics'

export default function SignInScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <View style={styles.screen}>
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.close}>
        <Icon name="xmark" size={18} color={colors.textLight} />
      </Pressable>

      <Animated.View entering={FadeInUp.duration(360)} style={styles.body}>
        <Typo size={30} fontWeight="900">
          Welcome back
        </Typo>
        <Typo size={13} color={colors.textMuted}>
          Accounts are not wired to a server yet. This is the interface, not the backend.
        </Typo>

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
            placeholder="Password"
            secureTextEntry
          />
          <Button
            style={styles.submit}
            disabled={!email || !password}
            onPress={() => {
              successFeedback()
              setSubmitted(true)
            }}
          >
            <Typo size={15} fontWeight="700" color={colors.black}>
              Sign in
            </Typo>
          </Button>
          {submitted ? (
            <Typo size={12} color={colors.primarySoft}>
              No backend yet — nothing was sent. Continue browsing as a guest.
            </Typo>
          ) : null}
        </View>

        <Pressable onPress={() => router.replace('/sign-up')} style={styles.switch}>
          <Typo size={13} color={colors.textMuted}>
            No account?{' '}
            <Typo size={13} color={colors.primarySoft} fontWeight="700">
              Create one
            </Typo>
          </Typo>
        </Pressable>

        <Pressable onPress={() => router.replace('/')} style={styles.switch}>
          <Typo size={13} color={colors.textFaint}>
            Continue as guest
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
  body: { paddingHorizontal: spacingX.x24, gap: spacingY.y12 },
  form: { gap: spacingX.x10, marginTop: spacingY.y16 },
  submit: { backgroundColor: colors.white, marginTop: spacingY.y4 },
  switch: { alignSelf: 'center', marginTop: spacingY.y12 },
})
