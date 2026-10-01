import { useCallback } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { useEvent, useEventListener } from 'expo'
import { VideoView, useVideoPlayer } from 'expo-video'
import type { PlaybackSource } from '@workspace/shared/playback'
import { colors } from '@/constants/theme'
import Typo from './Typo'

interface Props {
  source: PlaybackSource
  /** Start playing as soon as the player is ready. */
  autoPlay?: boolean
  /** Roughly once per second while playing. */
  onProgress?: (positionSeconds: number, durationSeconds: number) => void
  onEnded?: () => void
}

/**
 * The real player: native `expo-video` (AVPlayer / ExoPlayer) rather than a
 * WebView iframe. It plays HLS manifests and progressive files from our own
 * `video_assets`, with native controls, fullscreen and Picture-in-Picture.
 *
 * Trailers stay on the WebView path in `PreviewVideo` because YouTube/Dailymotion
 * embeds are pages, not media URLs.
 */
const VideoPlayer = ({ source, autoPlay = true, onProgress, onEnded }: Props) => {
  // `useVideoPlayer` recreates the player whenever the source URL changes, so
  // switching episodes swaps the stream cleanly.
  const player = useVideoPlayer(source.url, (p) => {
    p.timeUpdateEventInterval = 1
    p.loop = false
    if (autoPlay) p.play()
  })

  const { status, error } = useEvent(player, 'statusChange', { status: player.status })

  useEventListener(player, 'timeUpdate', ({ currentTime }) => {
    onProgress?.(currentTime, player.duration)
  })

  useEventListener(player, 'playToEnd', () => {
    onEnded?.()
  })

  const onFirstFrame = useCallback(() => {
    // no-op hook for callers that want to hide a poster behind the player
  }, [])

  return (
    <View style={styles.root}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls
        contentFit="contain"
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
        // Android: textureView avoids the upstream out-of-bounds bug when video
        // surfaces overlap; it is also a no-op on iOS/web.
        surfaceType="textureView"
        onFirstFrameRender={onFirstFrame}
      />

      {status === 'loading' ? (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator color={colors.primarySoft} />
        </View>
      ) : null}

      {status === 'error' ? (
        <View style={styles.overlay} pointerEvents="none">
          <Typo size={13} color={colors.textMuted} style={styles.errorText}>
            {error?.message ?? 'This stream could not be played.'}
          </Typo>
        </View>
      ) : null}
    </View>
  )
}

export default VideoPlayer

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black, justifyContent: 'center' },
  video: { flex: 1, backgroundColor: colors.black },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: { textAlign: 'center' },
})
