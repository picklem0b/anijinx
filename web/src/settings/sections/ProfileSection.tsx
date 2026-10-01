import { profile } from '../data';
import { Card, Chip, Label } from '../components/Card';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';

const stats = [
	['Interests', profile.interests.length],
	['Goals', profile.goals.length],
	['Focus areas', profile.helpsWith.length]
] as const;

const groups = [
	{ title: 'Interests', items: profile.interests },
	{ title: 'Goals', items: profile.goals },
	{ title: 'Helps with', items: profile.helpsWith }
];

export function ProfileSection({
	onBack,
	onSettings
}: {
	onBack: () => void;
	onSettings: () => void;
}) {
	return (
		<Screen
			title='Profile'
			compact
			onBack={onBack}
			action={
				<button
					className='st-icon-btn'
					onClick={onSettings}
					aria-label='Settings'
				>
					<Icon name='gear' />
				</button>
			}
		>
			<div className='st-profile'>
				<div className='st-avatar'>
					<span>{profile.name[0]}</span>
				</div>
				<h2>{profile.name}</h2>
				<p>
					{profile.handle} · {profile.role}
				</p>
			</div>
			<Card className='st-stats'>
				{stats.map(([label, count]) => (
					<div key={label}>
						<b>{count}</b>
						<span>{label}</span>
					</div>
				))}
			</Card>
			<Label>What your AI knows</Label>
			<Card className='st-know'>
				{groups.map(g => (
					<div key={g.title} className='st-know-group'>
						<small>{g.title}</small>
						<div className='st-chips'>
							{g.items.map(item => (
								<Chip key={item}>{item}</Chip>
							))}
						</div>
					</div>
				))}
			</Card>
		</Screen>
	);
}
