import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { tapFeedback } from '@/utils/haptics';
import type { CustomButtonProps } from '@/types';
import Loading from './Loading';

const Button = ({
	style,
	onPress,
	loading = false,
	children,
	...rest
}: CustomButtonProps) => {
	if (loading) {
		return (
			<TouchableOpacity
				disabled
				style={[styles.button, style, styles.loading]}
			>
				<Loading />
			</TouchableOpacity>
		);
	}
	return (
		<TouchableOpacity
			activeOpacity={0.85}
			onPress={e => {
				tapFeedback();
				onPress?.(e);
			}}
			style={[styles.button, style]}
			{...rest}
		>
			{children}
		</TouchableOpacity>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.primary,
		borderRadius: radius.md,
		borderCurve: 'continuous',
		height: verticalScale(50),
		paddingHorizontal: spacingY.y24,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loading: {
		backgroundColor: colors.surfaceRaised
	}
});
