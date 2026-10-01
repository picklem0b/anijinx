import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import Animated, { FadeInUp } from 'react-native-reanimated'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { colors, spacingY } from '@/constants/theme'

export default function NotFoundScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <Animated.View entering={FadeInUp.duration(380)} style={styles.body}>
        <Icon name="questionmark.circle" size={44} color={colors.primarySoft} />
        <Typo size={28} fontWeight="900" style={styles.center}>
          Page not found
        </Typo>
        <Typo size={13} color={colors.textMuted} style={styles.center}>
          That route does not exist in AniJinx yet.
        </Typo>
        <Button style={styles.cta} onPress={() => router.replace('/')}>
          <Typo size={15} fontWeight="700" color={colors.black}>
            Back to Home
          </Typo>
        </Button>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  body: { alignItems: 'center', gap: spacingY.y10, paddingHorizontal: 40 },
  center: { textAlign: 'center' },
  cta: { backgroundColor: colors.white, marginTop: spacingY.y16, alignSelf: 'stretch' },
})
