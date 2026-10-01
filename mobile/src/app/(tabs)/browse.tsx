import { useEffect, useMemo, useState } from 'react'
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Icon from '@/components/Icon'
import { uniqueById } from '@workspace/shared/format'
import { DEFAULT_FILTERS } from '@workspace/shared/options'
import type { Anime, Filters } from '@workspace/shared/types'
import { useSearch } from '@/hooks/useAnime'
import { colors, layout, radius, spacingX, spacingY } from '@/constants/theme'
import AnimeCard from '@/components/AnimeCard'
import FilterBar from '@/components/FilterBar'
import Skeleton from '@/components/Skeleton'
import { EmptyState, ErrorState } from '@/components/State'
import Typo from '@/components/Typo'
import Input from '@/components/Input'

const initial = (): Filters => ({ ...DEFAULT_FILTERS, genres: [] })

/** Two-column grid, so the placeholder poster matches the rendered card. */
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const GRID_POSTER_HEIGHT =
  ((SCREEN_WIDTH - spacingX.x16 * 2 - layout.cardGap) / 2) / layout.posterRatio

export default function BrowseScreen() {
  const params = useLocalSearchParams<{ q?: string; genre?: string; sort?: string; status?: string }>()
  const router = useRouter()

  const [filters, setFilters] = useState<Filters>(() => ({
    ...initial(),
    q: params.q ?? '',
    genres: params.genre ? [params.genre] : [],
    sort: params.sort ?? DEFAULT_FILTERS.sort,
    status: params.status ?? '',
  }))
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<Anime[]>([])

  const { data, isLoading, isFetching, isError, error, refetch } = useSearch(filters, page)

  // Reset paging whenever the query changes.
  useEffect(() => {
    setPage(1)
    setItems([])
  }, [filters])

  useEffect(() => {
    if (!data) return
    setItems((prev) => (page === 1 ? data.media : uniqueById([...prev, ...data.media])))
  }, [data, page])

  const update = (next: Partial<Filters>) => setFilters((f) => ({ ...f, ...next }))

  const hasFilters = useMemo(
    () =>
      filters.genres.length > 0 ||
      !!filters.year ||
      !!filters.season ||
      !!filters.format ||
      !!filters.status,
    [filters],
  )

  const renderItem = ({ item, index }: { item: Anime; index: number }) => (
    <View style={styles.cell}>
      <AnimeCard anime={item} index={index} width="100%" preview={false} />
    </View>
  )

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <Typo size={26} fontWeight="900">
          Browse
        </Typo>
        <View style={styles.searchRow}>
          <Icon name="magnifyingglass" size={15} color={colors.textMuted} />
          <Input
            value={filters.q}
            onChangeText={(q) => update({ q })}
            placeholder="Search titles…"
            returnKeyType="search"
            style={styles.search}
          />
          {filters.q ? (
            <Pressable onPress={() => update({ q: '' })} hitSlop={8}>
              <Icon name="xmark.circle.fill" size={16} color={colors.textFaint} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FilterBar
        filters={filters}
        onChange={update}
        onReset={() => setFilters(initial())}
      />

      {isError ? (
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(a) => String(a.id)}
          renderItem={renderItem}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.6}
          onEndReached={() => {
            if (data?.hasNext && !isFetching) setPage((p) => p + 1)
          }}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.skeletonRow}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <View key={i} style={styles.cell}>
                    <Skeleton height={GRID_POSTER_HEIGHT} round />
                    <Skeleton height={10} width="80%" style={{ marginTop: spacingY.y8 }} />
                  </View>
                ))}
              </View>
            ) : (
              <EmptyState
                title="No results"
                message={
                  hasFilters
                    ? 'Try removing a filter or widening the year range.'
                    : 'Search for a title, or browse a genre from Discover.'
                }
                action={hasFilters ? 'Clear filters' : 'Open Discover'}
                onAction={() => (hasFilters ? setFilters(initial()) : router.push('/discover'))}
              />
            )
          }
          ListFooterComponent={
            isFetching && items.length > 0 ? (
              <View style={styles.footer}>
                <Icon name="arrow.triangle.2.circlepath" size={16} color={colors.textFaint} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingTop: spacingY.y64 },
  top: { paddingHorizontal: spacingX.x16, gap: spacingY.y12 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.x10,
    paddingHorizontal: spacingX.x14,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  search: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    height: 44,
  },
  list: { paddingHorizontal: spacingX.x16, paddingBottom: spacingY.y48 },
  column: { gap: layout.cardGap },
  cell: { flex: 1, marginBottom: spacingY.y20 },
  skeletonRow: { flexDirection: 'row', gap: layout.cardGap },
  footer: { paddingVertical: spacingY.y24, alignItems: 'center' },
})
