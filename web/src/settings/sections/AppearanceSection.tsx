import { textSizes, themes, uiStyles } from '../data';
import { Card, Label } from '../components/Card';
import { DayNightSwitch } from '../components/DayNightSwitch';
import { Icon } from '../components/Icon';
import { TextSizePicker, UiStylePicker } from '../components/Pills';
import { Row } from '../components/Row';
import { Screen } from '../components/Screen';
import { Swatches } from '../components/Swatches';
import { useSettings } from '../store';

export function AppearanceSection({ onBack }: { onBack: () => void }) {
	const { draft, set } = useSettings();
	const theme = themes.find(t => t.id === draft.theme)!.label;
	const size = textSizes.find(t => t.id === draft.textSize)!.label;
	const style = uiStyles.find(t => t.id === draft.uiStyle)!.label;

	return (
		<Screen
			title='Appearance'
			subtitle='See every change live, right here.'
			onBack={onBack}
		>
			<Card className='st-preview'>
				<div className='st-bubble in'>
					Here’s a calm plan for your week. Want me to add breaks?
				</div>
				<div className='st-bubble out'>Yes, keep Friday light</div>
				<div className='st-input'>
					<span>Ask anything…</span>
					<i>
						<Icon name='arrowUp' size={16} />
					</i>
				</div>
			</Card>
			<Card>
				<Row
					icon='moon'
					title='Dark mode'
					subtitle='Easy on the eyes at night'
					checked={draft.dark}
					onClick={() => set('dark', !draft.dark)}
					trailing={<DayNightSwitch dark={draft.dark} />}
				/>
			</Card>
			<Label value={theme}>Theme color</Label>
			<Card>
				<Swatches value={draft.theme} onChange={v => set('theme', v)} />
			</Card>
			<Label value={size}>Text size</Label>
			<Card>
				<TextSizePicker
					value={draft.textSize}
					onChange={v => set('textSize', v)}
				/>
			</Card>
			<Label value={style}>UI style</Label>
			<Card>
				<UiStylePicker
					value={draft.uiStyle}
					onChange={v => set('uiStyle', v)}
				/>
			</Card>
		</Screen>
	);
}
