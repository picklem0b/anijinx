import { Card, Chip, Label } from '../components/Card';
import { Icon, type IconName } from '../components/Icon';
import { Row } from '../components/Row';
import { Screen } from '../components/Screen';
import { Toggle } from '../components/Toggle';
import { useSettings } from '../store';

type BoolKey = 'push' | 'messages' | 'promotions' | 'sound' | 'vibration';

function SwitchRow({
	field,
	icon,
	title,
	subtitle
}: {
	field: BoolKey;
	icon: IconName;
	title: string;
	subtitle: string;
}) {
	const { draft, set } = useSettings();
	return (
		<Row
			icon={icon}
			title={title}
			subtitle={subtitle}
			checked={draft[field]}
			onClick={() => set(field, !draft[field])}
			trailing={<Toggle checked={draft[field]} />}
		/>
	);
}

export function NotificationsSection({ onBack }: { onBack: () => void }) {
	const { draft } = useSettings();

	return (
		<Screen
			title='Notifications'
			subtitle='Choose what’s worth a buzz.'
			onBack={onBack}
		>
			<Card className={`st-notif ${draft.push ? '' : 'st-paused'}`}>
				<div className='st-notif-top'>
					<span className='st-tile'>
						<Icon name={draft.push ? 'chat' : 'bell'} />
					</span>
					<div>
						<b>AI Chat</b>
						<small>
							{draft.push
								? 'Your plan for the week is ready.'
								: 'Notifications are paused'}
						</small>
					</div>
					<em>now</em>
				</div>
				<div className='st-chips'>
					<Chip off={!draft.push || !draft.sound}>
						<Icon name='speaker' size={13} />
						Chime
					</Chip>
					<Chip off={!draft.push || !draft.vibration}>
						<Icon name='vibrate' size={13} />
						Buzz
					</Chip>
				</div>
			</Card>
			<Card>
				<SwitchRow
					field='push'
					icon='bell'
					title='Push notifications'
					subtitle={
						draft.push
							? 'On for this device'
							: 'Paused. You won’t get any alerts'
					}
				/>
			</Card>
			<div className='st-group' data-disabled={!draft.push}>
				<Label>Notify me about</Label>
				<Card>
					<SwitchRow
						field='messages'
						icon='chat'
						title='Messages'
						subtitle='Replies and new chats'
					/>
					<SwitchRow
						field='promotions'
						icon='megaphone'
						title='Promotions'
						subtitle='Offers and product news'
					/>
				</Card>
				<Label>Sound & vibration</Label>
				<Card>
					<SwitchRow
						field='sound'
						icon='speaker'
						title='Sound'
						subtitle='A soft chime for new alerts'
					/>
					<SwitchRow
						field='vibration'
						icon='vibrate'
						title='Vibration'
						subtitle='A gentle buzz for new alerts'
					/>
				</Card>
			</div>
		</Screen>
	);
}
