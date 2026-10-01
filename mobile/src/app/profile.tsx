import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { ago } from '@workspace/shared/format'
import { useByIds } from '@/hooks/useAnime'
import { useLibrary } from '@/lib/store'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Button from '@/components/Button'
import Typo from '@/components/Typo'

export default function ProfileScreen() {
  const router = useRouter()
  const liked = useLibrary((s) => s.liked)
  const watchlist = useLibrary((s) => s.watchlist)
  const ratings = useLibrary((s) => s.ratings)
  const progress = useLibrary((s) => s.progress)

  const recentIds = Object.values(progress)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((p) => p.animeId)
    .filter((id, i, arr) => arr.indexOf(id) === i)
    .slice(0, 6)
  const { data: recent } = useByIds(recentIds)

  const minutes = Math.round(
    Object.values(progress).reduce((sum, p) => sum + p.positionSeconds, 0) / 60,
  )
  const latest = Object.values(progress).sort((a, b) => b.updatedAt - a.updatedAt)[0]

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
        <Icon name="chevron.left" size={18} color={colors.textLight} />
      </Pressable>

      <Animated.View entering={FadeInDown.duration(320)} style={styles.card}>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: 'https://api.dicebear.com/9.x/thumbs/png?seed=anijinx' }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <Typo size={20} fontWeight="900">
          AniJinx Viewer
        </Typo>
        <Typo size={12} color={colors.textMuted}>
          Local profile · no account yet
        </Typo>

        <View style={styles.stats}>
          <Stat label="Watchlist" value={watchlist.length} />
          <Stat label="Liked" value={liked.length} />
          <Stat label="Rated" value={Object.keys(ratings).length} />
          <Stat label="Minutes" value={minutes} />
        </View>

        <View style={styles.actions}>
          <Button style={styles.settingsBtn} onPress={() => router.push('/settings')}>
            <View style={styles.btnInner}>
              <Icon name="gearshape" size={15} color={colors.black} />
              <Typo size={14} fontWeight="700" color={colors.black}>
                Settings
              </Typo>
            </View>
          </Button>
          <Button style={styles.signinBtn} onPress={() => router.push('/sign-in')}>
            <Typo size={14} fontWeight="600" color={colors.textLight}>
              Sign in
            </Typo>
          </Button>
        </View>
      </Animated.View>

      <View style={styles.section}>
        <Typo size={15} fontWeight="700" style={styles.sectionTitle}>
          Recent activity
        </Typo>
        {recent && recent.length > 0 ? (
          recent.map((a, i) => (
            <Animated.View key={a.id} entering={FadeInDown.duration(260).delay(i * 50)}>
              <Pressable onPress={() => router.push(`/title/${a.id}`)} style={styles.activity}>
                <Image
                  source={{ uri: a.coverImage.extraLarge }}
                  style={styles.activityArt}
                  contentFit="cover"
                />
                <View style={styles.activityText}>
                  <Typo size={13} fontWeight="600" numberOfLines={1}>
                    {a.title.english ?? a.title.romaji}
                  </Typo>
                  <Typo size={11} color={colors.textMuted}>
                    {latest ? ago(latest.updatedAt) : 'Recently'}
                  </Typo>
                </View>
                <Icon name="chevron.right" size={13} color={colors.textFaint} />
              </Pressable>
            </Animated.View>
          ))
        ) : (
          <Typo size={13} color={colors.textFaint}>
            Watch something and it will show up here.
          </Typo>
        )}
      </View>

      <View style={styles.section}>
        <Typo size={15} fontWeight="700" style={styles.sectionTitle}>
          About AniJinx
        </Typo>
        {[
          ['/about', 'About us'],
          ['/pricing', 'Plans & pricing'],
          ['/help', 'Help centre'],
          ['/contact', 'Contact'],
          ['/legal', 'Terms & privacy'],
        ].map(([href, label]) => (
          <Pressable key={href} onPress={() => router.push(href as never)} style={styles.linkRow}>
            <Typo size={13} color={colors.textLight}>
              {label}
            </Typo>
            <Icon name="chevron.right" size={13} color={colors.textFaint} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.stat}>
    <Typo size={18} fontWeight="800">
      {value}
    </Typo>
    <Typo size={11} color={colors.textFaint}>
      {label}
    </Typo>
  </View>
)

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacingX.x16, paddingTop: spacingY.y64, paddingBottom: spacingY.y64 },
  back: {
    position: 'absolute',
    top: spacingY.y64,
    left: spacingX.x16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlpha,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    gap: spacingY.y6,
    padding: spacingX.x20,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginTop: spacingY.y32,
  },
  avatarWrap: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatar: { width: '100%', height: '100%' },
  stats: { flexDirection: 'row', gap: spacingX.x24, marginTop: spacingY.y16 },
  stat: { alignItems: 'center' },
  actions: { flexDirection: 'row', gap: spacingX.x10, marginTop: spacingY.y20, alignSelf: 'stretch' },
  settingsBtn: { flex: 1, height: 44, backgroundColor: colors.white },
  signinBtn: { flex: 1, height: 44, backgroundColor: colors.surfaceRaised },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x8 },
  section: { marginTop: spacingY.y28, gap: spacingY.y8 },
  sectionTitle: { marginBottom: spacingY.y4 },
  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.x12,
    paddingVertical: spacingY.y8,
  },
  activityArt: { width: 38, height: 54, borderRadius: radius.xs },
  activityText: { flex: 1, gap: spacingY.y2 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacingY.y12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
})
