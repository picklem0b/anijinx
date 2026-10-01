import { AnimatePresence, motion } from 'framer-motion';
import { languages } from '../data';
import { spring } from '../motion';
import { Card, Label } from '../components/Card';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { useSettings } from '../store';

export function LanguageSection({ onBack }: { onBack: () => void }) {
	const { draft, set } = useSettings();
	const current = languages.find(l => l.id === draft.language)!;

	return (
		<Screen
			title='Language'
			subtitle='Pick the language the app speaks.'
			onBack={onBack}
		>
			<Card className='st-greet'>
				<AnimatePresence mode='wait' initial={false}>
					<motion.div
						key={current.id}
						initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
						animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
						transition={{ duration: 0.22 }}
					>
						{current.greeting}
					</motion.div>
				</AnimatePresence>
			</Card>
			<Label>All languages</Label>
			<Card>
				{languages.map(l => (
					<button
						key={l.id}
						role='radio'
						aria-checked={draft.language === l.id}
						className='st-lang'
						onClick={() => set('language', l.id)}
					>
						<span>
							<b>{l.native}</b>
							<small>{l.english}</small>
						</span>
						<AnimatePresence>
							{draft.language === l.id && (
								<motion.span
									className='st-check'
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									exit={{ scale: 0 }}
									transition={spring}
								>
									<Icon name='check' size={14} />
								</motion.span>
							)}
						</AnimatePresence>
					</button>
				))}
			</Card>
		</Screen>
	);
}
