export type ThemeColor = 'violet' | 'ocean' | 'rose' | 'forest' | 'sunset';
export type TextSize = 'small' | 'default' | 'large' | 'xlarge';
export type UiStyle = 'rounded' | 'soft' | 'crisp';
export type LanguageCode =
	| 'en'
	| 'zh'
	| 'ms'
	| 'ja'
	| 'ko'
	| 'hi'
	| 'es'
	| 'fr';
export type ScreenName =
	| 'profile'
	| 'settings'
	| 'appearance'
	| 'language'
	| 'notifications';

export interface SettingsState {
	dark: boolean;
	theme: ThemeColor;
	textSize: TextSize;
	uiStyle: UiStyle;
	language: LanguageCode;
	push: boolean;
	messages: boolean;
	promotions: boolean;
	sound: boolean;
	vibration: boolean;
}
