import type {
	LanguageCode,
	SettingsState,
	TextSize,
	ThemeColor,
	UiStyle
} from './types';

export const defaultSettings: SettingsState = {
	dark: false,
	theme: 'violet',
	textSize: 'default',
	uiStyle: 'rounded',
	language: 'en',
	push: true,
	messages: true,
	promotions: false,
	sound: true,
	vibration: true
};

export const themes: {
	id: ThemeColor;
	label: string;
	color: string;
}[] = [
	{ id: 'violet', label: 'Violet', color: '#7c5cff' },
	{ id: 'ocean', label: 'Ocean', color: '#2f7cf6' },
	{ id: 'rose', label: 'Rose', color: '#e0458f' },
	{ id: 'forest', label: 'Forest', color: '#159a77' },
	{ id: 'sunset', label: 'Sunset', color: '#e8691c' }
];

export const textSizes: { id: TextSize; label: string; scale: number }[] = [
	{ id: 'small', label: 'Small', scale: 0.9 },
	{ id: 'default', label: 'Default', scale: 1 },
	{ id: 'large', label: 'Large', scale: 1.12 },
	{ id: 'xlarge', label: 'Extra large', scale: 1.25 }
];

export const uiStyles: { id: UiStyle; label: string; radius: number }[] = [
	{ id: 'rounded', label: 'Rounded', radius: 22 },
	{ id: 'soft', label: 'Soft', radius: 14 },
	{ id: 'crisp', label: 'Crisp', radius: 5 }
];

export const languages: {
	id: LanguageCode;
	native: string;
	english: string;
	greeting: string;
}[] = [
	{ id: 'en', native: 'English', english: 'English', greeting: 'Hello' },
	{
		id: 'zh',
		native: '简体中文',
		english: 'Chinese, Simplified',
		greeting: '你好'
	},
	{
		id: 'ms',
		native: 'Bahasa Melayu',
		english: 'Malay',
		greeting: 'Selamat datang'
	},
	{ id: 'ja', native: '日本語', english: 'Japanese', greeting: 'こんにちは' },
	{ id: 'ko', native: '한국어', english: 'Korean', greeting: '안녕하세요' },
	{ id: 'hi', native: 'हिन्दी', english: 'Hindi', greeting: 'नमस्ते' },
	{ id: 'es', native: 'Español', english: 'Spanish', greeting: 'Hola' },
	{ id: 'fr', native: 'Français', english: 'French', greeting: 'Bonjour' }
];

export const profile = {
	name: 'Bryan',
	handle: '@bryan',
	role: 'Developer',
	interests: ['Design', 'Travel', 'Tech'],
	goals: ['Boost productivity', 'Learn new skills', 'Grow my career'],
	helpsWith: ['Writing', 'Learning', 'Coding']
};

export const fieldLabels: Record<keyof SettingsState, string> = {
	dark: 'Dark mode',
	theme: 'Theme color',
	textSize: 'Text size',
	uiStyle: 'UI style',
	language: 'Language',
	push: 'Push notifications',
	messages: 'Messages',
	promotions: 'Promotions',
	sound: 'Sound',
	vibration: 'Vibration'
};

export function formatValue(
	key: keyof SettingsState,
	value: SettingsState[keyof SettingsState]
): string {
	if (key === 'theme') return themes.find(t => t.id === value)?.label ?? '';
	if (key === 'textSize')
		return textSizes.find(t => t.id === value)?.label ?? '';
	if (key === 'uiStyle')
		return uiStyles.find(t => t.id === value)?.label ?? '';
	if (key === 'language')
		return languages.find(l => l.id === value)?.native ?? '';
	return value ? 'On' : 'Off';
}
