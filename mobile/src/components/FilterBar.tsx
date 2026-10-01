import { useState, type ReactNode } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Icon from '@/components/Icon'
import { GENRES, FORMATS, SEASONS, SORTS, STATUSES, YEARS } from '@workspace/shared/options'
import type { Filters } from '@workspace/shared/types'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Button from './Button'
import Typo from './Typo'

interface Props {
  filters: Filters
  onChange: (next: Partial<Filters>) => void
  onReset: () => void
}

const OPTION_GROUPS: { key: keyof Filters; label: string; options: readonly (readonly [string, string])[] }[] = [
  { key: 'season', label: 'Season', options: SEASONS },
  { key: 'format', label: 'Format', options: FORMATS },
  { key: 'status', label: 'Status', options: STATUSES },
  { key: 'sort', label: 'Sort by', options: SORTS },
]

const FilterBar = ({ filters, onChange, onReset }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <View style={styles.row}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="Filters" icon="slider.horizontal.3" onPress={() => setOpen(true)} tone="accent" />
          {filters.genres.map((g) => (
            <Chip
              key={g}
              label={g}
              onPress={() => onChange({ genres: filters.genres.filter((x) => x !== g) })}
              tone="active"
            />
          ))}
          <Chip
            label={filters.q ? `“${filters.q}”` : 'Genre'}
            onPress={() => onChange({ genres: [] })}
            tone={filters.q ? 'active' : 'default'}
          />
        </ScrollView>
      </View>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Typo size={20} fontWeight="800" style={styles.sheetTitle}>
            Filters
          </Typo>

          <ScrollView contentContainerStyle={styles.sheetBody}>
            <Section title="Genre">
              <View style={styles.wrap}>
                {GENRES.map((g) => {
                  const on = filters.genres.includes(g)
                  return (
                    <Chip
                      key={g}
                      label={g}
                      tone={on ? 'active' : 'default'}
                      onPress={() =>
                        onChange({
                          genres: on ? filters.genres.filter((x) => x !== g) : [...filters.genres, g],
                        })
                      }
                    />
                  )
                })}
              </View>
            </Section>

            <Section title="Year">
              <View style={styles.wrap}>
                {YEARS.slice(0, 24).map(([v, l]) => (
                  <Chip
                    key={v}
                    label={l}
                    tone={filters.year === v ? 'active' : 'default'}
                    onPress={() => onChange({ year: filters.year === v ? '' : v })}
                  />
                ))}
              </View>
            </Section>

            {OPTION_GROUPS.map((group) => (
              <Section key={group.key} title={group.label}>
                <View style={styles.wrap}>
                  {group.options.map(([v, l]) => (
                    <Chip
                      key={v}
                      label={l}
                      tone={filters[group.key] === v ? 'active' : 'default'}
                      onPress={() =>
                        onChange({ [group.key]: filters[group.key] === v ? '' : v } as Partial<Filters>)
                      }
                    />
                  ))}
                </View>
              </Section>
            ))}
          </ScrollView>

          <View style={styles.sheetActions}>
            <Button style={styles.reset} onPress={onReset}>
              <Typo size={15} fontWeight="600" color={colors.textLight}>
                Reset
              </Typo>
            </Button>
            <Button style={styles.apply} onPress={() => setOpen(false)}>
              <Typo size={15} fontWeight="700" color={colors.black}>
                Show results
              </Typo>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  )
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <View style={styles.section}>
    <Typo size={13} color={colors.textMuted} fontWeight="600" style={styles.sectionTitle}>
      {title}
    </Typo>
    {children}
  </View>
)

const Chip = ({
  label,
  onPress,
  tone = 'default',
  icon,
}: {
  label: string
  onPress?: () => void
  tone?: 'default' | 'active' | 'accent'
  icon?: 'slider.horizontal.3'
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, tone === 'active' && styles.chipActive, tone === 'accent' && styles.chipAccent]}
  >
    {icon ? (
      <Icon
        name={icon}
        size={13}
        color={tone === 'accent' ? colors.black : colors.textLight}
      />
    ) : null}
    <Typo
      size={13}
      fontWeight="600"
      color={tone === 'accent' ? colors.black : tone === 'active' ? colors.primarySoft : colors.textLight}
    >
      {label}
    </Typo>
  </Pressable>
)

export default FilterBar

const styles = StyleSheet.create({
  row: { marginBottom: spacingY.y10 },
  chips: { gap: spacingX.x8, paddingHorizontal: spacingX.x16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.x6,
    paddingHorizontal: spacingX.x12,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: 'rgba(124,92,255,0.16)' },
  chipAccent: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderCurve: 'continuous',
    maxHeight: '82%',
    paddingBottom: spacingY.y24,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginTop: spacingY.y10,
  },
  sheetTitle: { paddingHorizontal: spacingX.x16, marginTop: spacingY.y14 },
  sheetBody: { paddingHorizontal: spacingX.x16, paddingBottom: spacingY.y16 },
  section: { marginTop: spacingY.y20 },
  sectionTitle: { marginBottom: spacingY.y10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacingX.x8 },
  sheetActions: {
    flexDirection: 'row',
    gap: spacingX.x10,
    paddingHorizontal: spacingX.x16,
    paddingTop: spacingY.y12,
  },
  reset: { flex: 1, backgroundColor: colors.surfaceRaised, height: 46 },
  apply: { flex: 1.5, backgroundColor: colors.primarySoft, height: 46 },
})
