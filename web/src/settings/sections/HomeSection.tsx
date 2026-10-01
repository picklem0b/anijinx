import { languages, textSizes, themes, uiStyles } from '../data';
import { Card, Label } from '../components/Card';
import { DayNightSwitch } from '../components/DayNightSwitch';
import { Icon } from '../components/Icon';
import { Row } from '../components/Row';
import { Screen } from '../components/Screen';
import { useSettings } from '../store';
import type { ScreenName } from '../types';

interface HomeSectionProps {
	onBack: () => void;
	onOpen: (screen: ScreenName) => void;
	onReview: () => void;
}

export function HomeSection({ onBack, onOpen, onReview }: HomeSectionProps) {
	const { draft, set } = useSettings();
	const theme = themes.find(t => t.id === draft.theme)!.label;
	const size = textSizes.find(t => t.id === draft.textSize)!.label;
	const style = uiStyles.find(t => t.id === draft.uiStyle)!.label;
	const language = languages.find(l => l.id === draft.language)!.native;
	const alerts = !draft.push
		? 'Paused'
		: draft.messages && draft.promotions
			? 'Messages and promotions'
			: draft.messages
				? 'Messages only'
				: draft.promotions
					? 'Promotions only'
					: 'Nothing selected';

	return (
		<Screen
			title='Settings'
			subtitle='Make the app feel like yours.'
			onBack={onBack}
		>
			<Card>
				<Row
					icon={draft.dark ? 'moon' : 'sun'}
					title={draft.dark ? 'Dark mode' : 'Light mode'}
					subtitle={
						draft.dark ? 'Tap for daylight' : 'Tap to go dark'
					}
					checked={draft.dark}
					onClick={() => set('dark', !draft.dark)}
					trailing={<DayNightSwitch dark={draft.dark} />}
				/>
			</Card>
			<Label>Personalization</Label>
			<Card>
				<Row
					icon='brush'
					title='Appearance'
					subtitle={`${theme} · ${size} text · ${style}`}
					onClick={() => onOpen('appearance')}
				/>
				<Row
					icon='language'
					title='Language'
					subtitle={language}
					onClick={() => onOpen('language')}
				/>
			</Card>
			<Label>Alerts</Label>
			<Card>
				<Row
					icon='bell'
					title='Notifications'
					subtitle={alerts}
					onClick={() => onOpen('notifications')}
				/>
			</Card>
			<Label>Privacy & security</Label>
			<Card>
				<Row
					icon='globe'
					title='Privacy'
					subtitle='Open · Visible to everyone'
					trailing={<Icon name='chevron' size={18} />}
				/>
				<Row
					icon='shield'
					title='Security'
					subtitle='Basic protection'
					trailing={<Icon name='chevron' size={18} />}
				/>
			</Card>
			<Card>
				<Row
					icon='sparkle'
					title='Your experience'
					subtitle='See it all together before saving'
					onClick={onReview}
				/>
			</Card>
		</Screen>
	);
}
