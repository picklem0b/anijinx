// Playback resolution lives in @workspace/shared so the web app, the mobile app
// and the API all agree on what is playable and what is only a preview.
export {
  officialLinks,
  resolvePlayback,
  type OfficialLink,
  type PlaybackKind,
  type PlaybackSource,
} from '@workspace/shared/playback'

