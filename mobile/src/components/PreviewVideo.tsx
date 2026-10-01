import { useEffect, useState } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { WebView } from 'react-native-webview'
import { trailerEmbed } from '@workspace/shared/format'
import type { Trailer } from '@workspace/shared/types'
import { colors } from '@/constants/theme'
import { useLibrary } from '@/lib/store'
import { absoluteFill } from '@/utils/styling'
import { useReducedMotion } from '@/utils/motion'

/**
 * Delay gate: keeps a fast scroll from firing a dozen players at once.
 * Returns true only after `active` has stayed true for `delayMs`.
 */
export function useDelayedActive(active: boolean, delayMs = 650) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!active) {
      setReady(false)
      return
    }
    const t = setTimeout(() => setReady(true), delayMs)
    return () => clearTimeout(t)
  }, [active, delayMs])

  return ready
}

interface Props {
  trailer: Trailer | null
  /** Autoplay only when the card is mostly visible. */
  active: boolean
  delayMs?: number
  style?: StyleProp<ViewStyle>
  controls?: boolean
}

/**
 * Phase 1 previews embed the AniList trailer (YouTube/Dailymotion) in a WebView
 * because React Native has no <iframe>. `PreviewVideo` is the single seam: phase 3
 * swaps the body for expo-video + a Mux clip without any caller changing.
 */
const PreviewVideo = ({ trailer, active, delayMs = 650, style, controls = false }: Props) => {
  const reduced = useReducedMotion()
  const autoplayPreviews = useLibrary((s) => s.settings.autoplayPreviews)
  const dataSaver = useLibrary((s) => s.settings.dataSaver)
  const ready = useDelayedActive(active, delayMs)

  const shouldPlay = ready && !!trailer && autoplayPreviews && !dataSaver && !reduced

  if (!shouldPlay || !trailer) return null

  return (
    <View style={[styles.wrap, style]} pointerEvents="none">
      <WebView
        source={{ uri: trailerEmbed(trailer, true, controls) }}
        style={styles.web}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        originWhitelist={['*']}
        androidLayerType="hardware"
      />
    </View>
  )
}

export default PreviewVideo

const styles = StyleSheet.create({
  wrap: { ...absoluteFill, backgroundColor: colors.black, overflow: 'hidden' },
  web: { flex: 1, backgroundColor: colors.black },
})
