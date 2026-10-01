import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Button from '@/components/Button'
import { Card, FeatureRow, MarketingShell, Section } from '@/components/Marketing'
import Typo from '@/components/Typo'

export default function LandingScreen() {
  const router = useRouter()

  return (
    <MarketingShell
      eyebrow="AniJinx"
      title="Anime, the way it should feel"
      lede="A Netflix-style home for anime only — discover, preview and keep your place across everything you watch."
      showBack={false}
    >
      <Animated.View entering={FadeInUp.duration(420).delay(120)}>
        <LinearGradient
          colors={['rgba(124,92,255,0.35)', 'rgba(11,11,15,0)']}
          style={styles.glow}
        >
          <View style={styles.glowInner}>
            <Typo size={12} color={colors.primarySoft} fontWeight="800">
              NOW STREAMING
            </Typo>
            <Typo size={22} fontWeight="900">
              Discover your next favourite
            </Typo>
            <Typo size={13} color={colors.textMuted}>
              Trailers play as you scroll. Your library follows you.
            </Typo>
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={styles.cta}>
        <Button style={styles.primary} onPress={() => router.push('/')}>
          <Typo size={15} fontWeight="700" color={colors.black}>
            Start watching
          </Typo>
        </Button>
        <Button style={styles.secondary} onPress={() => router.push('/sign-up')}>
          <Typo size={15} fontWeight="600" color={colors.textLight}>
            Create an account
          </Typo>
        </Button>
      </View>

      <Section title="Why AniJinx" delay={200}>
        <FeatureRow
          icon="sparkles"
          title="Discover built in"
          body="Personalized rails, genre grids and a seasonal calendar — not just a search box."
        />
        <FeatureRow
          icon="play.rectangle.fill"
          title="Previews that sell the show"
          body="Muted trailers autoplay on focused cards and stop the moment they leave view."
        />
        <FeatureRow
          icon="bolt.fill"
          title="Continue exactly"
          body="Resume the episode you paused, on whichever device you picked up."
        />
        <FeatureRow
          icon="bell.fill"
          title="Never miss a drop"
          body="Reminders tell you when the next episode of a followed title airs."
        />
      </Section>

      <Section title="Plans" delay={260}>
        <Card>
          <Typo size={16} fontWeight="700">
            Free
          </Typo>
          <Typo size={12} color={colors.textMuted}>
            Browse, discover and build a library. Ad-supported previews.
          </Typo>
        </Card>
        <Card delay={60}>
          <Typo size={16} fontWeight="700" color={colors.primarySoft}>
            Premium
          </Typo>
          <Typo size={12} color={colors.textMuted}>
            Ad-free playback, downloads and higher bitrate streams.
          </Typo>
          <Button style={styles.plan} onPress={() => router.push('/pricing')}>
            <Typo size={13} fontWeight="700" color={colors.black}>
              See plans
            </Typo>
          </Button>
        </Card>
      </Section>
    </MarketingShell>
  )
}

const styles = StyleSheet.create({
  glow: { borderRadius: radius.lg, padding: spacingX.x20, overflow: 'hidden' },
  glowInner: { gap: spacingY.y8 },
  cta: { gap: spacingX.x10, marginTop: spacingY.y20 },
  primary: { backgroundColor: colors.white },
  secondary: { backgroundColor: colors.surfaceRaised },
  plan: { backgroundColor: colors.primarySoft, height: 40, alignSelf: 'flex-start' },
})
