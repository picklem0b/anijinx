import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const [shortDimension, longDimension] =
	SCREEN_WIDTH < SCREEN_HEIGHT
		? [SCREEN_WIDTH, SCREEN_HEIGHT]
		: [SCREEN_HEIGHT, SCREEN_WIDTH];

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) =>
	Math.round(
		PixelRatio.roundToNearestPixel(
			(shortDimension / guidelineBaseWidth) * size
		)
	);

export const verticalScale = (size: number) =>
	Math.round(
		PixelRatio.roundToNearestPixel(
			(longDimension / guidelineBaseHeight) * size
		)
	);

/** Clamp a scaled value so huge tablets don't blow up typography. */
export const moderateScale = (size: number, factor = 0.5) =>
	Math.round(size + (scale(size) - size) * factor);

/** Spreadable absolute-fill object (StyleSheet.absoluteFillObject is not typed on all RN builds). */
export const absoluteFill = {
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0
} as const;
