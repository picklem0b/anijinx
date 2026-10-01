import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Icon from '@/components/Icon'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { ago } from '@workspace/shared/format'
import type { Comment } from '@workspace/shared/types'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useLibrary } from '@/lib/store'
import { tapFeedback } from '@/utils/haptics'
import { stagger } from '@/utils/motion'
import Input from './Input'
import Typo from './Typo'

interface Props {
  animeId: number
  /** null = comments for the title as a whole. */
  episode?: number | null
  title?: string
}

/**
 * Stable reference for the "no comments yet" case. Zustand v5 reads selectors
 * through useSyncExternalStore, which requires getSnapshot to return a cached
 * value — an inline `?? []` hands React a brand-new array on every render and
 * loops forever ("The result of getSnapshot should be cached").
 */
const EMPTY_COMMENTS: Comment[] = []

/** Local-only comments for now; the API lands in a later milestone. */
const Comments = ({ animeId, episode = null, title = 'Comments' }: Props) => {
  const [draft, setDraft] = useState('')
  const comments = useLibrary((s) => s.comments[animeId] ?? EMPTY_COMMENTS)
  const addComment = useLibrary((s) => s.addComment)
  const removeComment = useLibrary((s) => s.removeComment)

  const visible = comments.filter((c) => (episode == null ? true : c.ep === episode))

  const submit = () => {
    const text = draft.trim()
    if (!text) return
    addComment(animeId, text, episode)
    setDraft('')
    tapFeedback()
  }

  return (
    <View style={styles.root}>
      <View style={styles.head}>
        <Typo size={17} fontWeight="700">
          {title}
        </Typo>
        <Typo size={12} color={colors.textFaint}>
          {visible.length}
        </Typo>
      </View>

      <View style={styles.composer}>
        <Input
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={submit}
          placeholder="Add a comment…"
          returnKeyType="send"
          style={styles.input}
        />
        <Pressable onPress={submit} hitSlop={8} style={styles.send} disabled={!draft.trim()}>
          <Icon
            name="paperplane.fill"
            size={16}
            color={draft.trim() ? colors.black : colors.textFaint}
          />
        </Pressable>
      </View>

      {visible.length === 0 ? (
        <Typo size={13} color={colors.textFaint} style={styles.empty}>
          No comments yet. Be the first.
        </Typo>
      ) : (
        visible.map((c, i) => (
          <Animated.View
            key={c.id}
            entering={FadeInDown.duration(280).delay(stagger(i, 45))}
            style={styles.comment}
          >
            <View style={styles.avatar} />
            <View style={styles.body}>
              <View style={styles.meta}>
                <Typo size={13} fontWeight="600">
                  You
                </Typo>
                <Typo size={11} color={colors.textFaint}>
                  {ago(c.at)}
                  {c.ep ? ` · EP ${c.ep}` : ''}
                </Typo>
              </View>
              <Typo size={13} color={colors.textLight} style={styles.text}>
                {c.text}
              </Typo>
            </View>
            <Pressable onPress={() => removeComment(animeId, c.id)} hitSlop={8}>
              <Icon name="trash" size={14} color={colors.textFaint} />
            </Pressable>
          </Animated.View>
        ))
      )}
    </View>
  )
}

export default Comments

const styles = StyleSheet.create({
  root: { marginTop: spacingY.y24, paddingHorizontal: spacingX.x16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x8, marginBottom: spacingY.y12 },
  composer: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x8 },
  input: { flex: 1 },
  send: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { marginTop: spacingY.y16 },
  comment: {
    flexDirection: 'row',
    gap: spacingX.x10,
    marginTop: spacingY.y16,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  body: { flex: 1, gap: spacingY.y4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacingX.x8 },
  text: { lineHeight: 19 },
})
