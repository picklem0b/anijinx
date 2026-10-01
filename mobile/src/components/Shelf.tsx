import { useCallback, useRef, useState } from 'react'
import { FlatList, StyleSheet, View, type ViewToken } from 'react-native'
import { useRouter } from 'expo-router'
import type { Anime } from '@workspace/shared/types'
import { colors, layout, spacingX, spacingY } from '@/constants/theme'
import AnimeCard from './AnimeCard'
import Typo from './Typo'

interface Props {
  title: string
  subtitle?: string | null
  items: Anime[]
  preview?: boolean
  ranked?: boolean
  onSeeAll?: () => void
}

const Shelf = ({ title, subtitle, items, preview = true, ranked = false, onSeeAll }: Props) => {
  /** Only one card previews at a time — whichever is "mostly visible". */
  const [activeId, setActiveId] = useState<number | null>(null)
  const viewability = useRef({ viewAreaCoveragePercentThreshold: 60 }).current

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems.find((v) => v.isViewable)
      setActiveId((first?.item as Anime | undefined)?.id ?? null)
    },
    [],
  )

  if (!items.length) return null

  return (
    <View style={styles.root}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Typo size={17} fontWeight="700">
            {title}
          </Typo>
          {subtitle ? (
            <Typo size={12} color={colors.textFaint} style={styles.sub}>
              {subtitle}
            </Typo>
          ) : null}
        </View>
        {onSeeAll ? (
          <Typo size={12} color={colors.primarySoft} fontWeight="600" onPress={onSeeAll}>
            See all
          </Typo>
        ) : null}
      </View>

      <FlatList
        horizontal
        data={items}
        keyExtractor={(a) => String(a.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        snapToInterval={layout.cardWidth + layout.cardGap}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewability}
        renderItem={({ item, index }) => (
          <AnimeCard
            anime={item}
            index={index}
            preview={preview}
            active={activeId === item.id}
            showRank={ranked ? index + 1 : undefined}
          />
        )}
      />
    </View>
  )
}

export default Shelf

const styles = StyleSheet.create({
  root: { marginTop: spacingY.y24 },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX.x16,
    marginBottom: spacingY.y12,
  },
  headText: { flex: 1 },
  sub: { marginTop: spacingY.y2 },
  list: { gap: layout.cardGap, paddingHorizontal: spacingX.x16 },
})
