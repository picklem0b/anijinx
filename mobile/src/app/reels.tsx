import { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  type ViewToken,
} from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import { plain, titleOf, uniqueById } from '@workspace/shared/format'
import type { Anime } from '@workspace/shared/types'
import { useReels } from '@/hooks/useAnime'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import LibButton from '@/components/LibButton'
import PreviewVideo from '@/components/PreviewVideo'
import Skeleton from '@/components/Skeleton'
import { ErrorState } from '@/components/State'
import Typo from '@/components/Typo'

const { height, width } = Dimensions.get('window')

export default function ReelsScreen() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<Anime[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)

  const { data, isLoading, isError, error, refetch } = useReels(page)

  // Accumulate pages; reset whenever page 1 refetches.
  useEffect(() => {
    if (!data) return
    setItems((prev) => (page === 1 ? data.media : uniqueById([...prev, ...data.media])))
  }, [data, page])

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems.find((v) => v.isViewable)?.item as Anime | undefined
      setActiveId(first?.id ?? null)
    },
    [],
  )

  if (isError) {
    return (
      <View style={styles.screen}>
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      </View>
    )
  }

  const list = items.length ? items : (data?.media ?? [])

  return (
    <View style={styles.screen}>
      {isLoading && !list.length ? (
        <Skeleton height={height} width="100%" />
      ) : (
        <FlatList
          data={list}
          pagingEnabled
          keyExtractor={(a) => String(a.id)}
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
          onEndReachedThreshold={0.8}
          onEndReached={() => {
            if (data?.hasNext) setPage((p) => p + 1)
          }}
          renderItem={({ item }) => (
            <View style={styles.page}>
              <Image
                source={{ uri: item.bannerImage ?? item.coverImage.extraLarge }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={220}
              />
              {activeId === item.id && item.trailer ? (
                <PreviewVideo trailer={item.trailer} active controls={false} delayMs={400} />
              ) : null}

              <LinearGradient
                colors={['rgba(11,11,15,0.35)', 'rgba(11,11,15,0.1)', 'rgba(11,11,15,0.95)']}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.rail}>
                <LibButton list="liked" animeId={item.id} size={26} />
                <LibButton list="watchlist" animeId={item.id} size={26} />
                <LibButton list="reminders" animeId={item.id} size={26} />
                <Pressable
                  onPress={() => router.push(`/title/${item.id}`)}
                  hitSlop={8}
                  style={styles.railBtn}
                >
                  <Icon name="info.circle" size={24} color={colors.textLight} />
                </Pressable>
              </View>

              <View style={styles.meta}>
                <Typo size={20} fontWeight="900" numberOfLines={2}>
                  {titleOf(item)}
                </Typo>
                <Typo size={12} color={colors.textLight} numberOfLines={2}>
                  {plain(item.description).slice(0, 140)}
                </Typo>
                <Pressable
                  onPress={() => router.push(`/watch/${item.id}/1`)}
                  style={styles.watch}
                >
                  <Icon name="play.fill" size={14} color={colors.black} />
                  <Typo size={13} fontWeight="700" color={colors.black}>
                    Watch now
                  </Typo>
                </Pressable>
              </View>

              <Pressable onPress={() => router.back()} hitSlop={10} style={styles.close}>
                <Icon name="xmark" size={18} color={colors.textLight} />
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black },
  page: { height, width, justifyContent: 'flex-end' },
  rail: {
    position: 'absolute',
    right: spacingX.x12,
    bottom: height * 0.22,
    gap: spacingY.y16,
    alignItems: 'center',
  },
  railBtn: { padding: 6 },
  meta: {
    paddingHorizontal: spacingX.x20,
    paddingBottom: height * 0.12,
    paddingRight: width * 0.22,
    gap: spacingY.y8,
  },
  watch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.x8,
    alignSelf: 'flex-start',
    paddingHorizontal: spacingX.x16,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    marginTop: spacingY.y8,
  },
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
})
