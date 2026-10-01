import { useRouter } from 'expo-router'
import { Card, FeatureRow, MarketingShell, Section } from '@/components/Marketing'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'

export default function AboutScreen() {
  const router = useRouter()
  return (
    <MarketingShell
      eyebrow="About"
      title="Built for anime only"
      lede="AniJinx is a focused streaming home for anime. No mixed catalogue, no filler — just the shows, the schedule and your place in them."
    >
      <Section title="What we believe">
        <FeatureRow
          icon="heart.fill"
          title="Taste over volume"
          body="Discovery should feel curated. Rails, seasons and 'because you liked' beat an endless grid."
        />
        <FeatureRow
          icon="lock.shield.fill"
          title="Play only what we own"
          body="We stream licensed content. Metadata and trailers come from AniList."
        />
        <FeatureRow
          icon="bolt.fill"
          title="Fast and quiet"
          body="Built to be read and changed by one person — plain TypeScript, plain Postgres."
        />
      </Section>

      <Section title="How it works" delay={120}>
        <Card>
          <Typo size={15} fontWeight="700">
            1. Discover
          </Typo>
          <Typo size={12} color={colors.textMuted}>
            Rails and a dedicated Discover surface surface something worth your evening.
          </Typo>
        </Card>
        <Card delay={60}>
          <Typo size={15} fontWeight="700">
            2. Preview
          </Typo>
          <Typo size={12} color={colors.textMuted}>
            Focused cards play a muted trailer; full detail pages play it on demand.
          </Typo>
        </Card>
        <Card delay={120}>
          <Typo size={15} fontWeight="700">
            3. Watch and resume
          </Typo>
          <Typo size={12} color={colors.textMuted}>
            Watch progress is saved per episode so Continue Watching is always right.
          </Typo>
        </Card>
      </Section>

      <Button
        style={{ backgroundColor: colors.primarySoft }}
        onPress={() => router.push('/')}
      >
        <Typo size={15} fontWeight="700" color={colors.black}>
          Open AniJinx
        </Typo>
      </Button>
    </MarketingShell>
  )
}
