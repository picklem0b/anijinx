import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const canVibrate = Platform.OS === 'ios' || Platform.OS === 'android';

/** Fire-and-forget haptics — never let a missing motor break a tap. */
export const tapFeedback = () => {
	if (!canVibrate) return;
	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export const selectFeedback = () => {
	if (!canVibrate) return;
	Haptics.selectionAsync().catch(() => {});
};

export const successFeedback = () => {
	if (!canVibrate) return;
	Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
		() => {}
	);
};

export const likeFeedback = () => {
	if (!canVibrate) return;
	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
};
