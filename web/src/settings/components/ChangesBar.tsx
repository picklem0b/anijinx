import { AnimatePresence, motion } from 'framer-motion';
import { fieldLabels, formatValue } from '../data';
import { spring } from '../motion';
import { useSettings } from '../store';
import { Icon } from './Icon';

interface ChangesBarProps {
	open: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export function ChangesBar({ open, onOpen, onClose }: ChangesBarProps) {
	const { saved, draft, changed, discard, save } = useSettings();
	const count = changed.length;

	return (
		<>
			<AnimatePresence>
				{count > 0 && !open && (
					<motion.div
						className='st-bar'
						initial={{ y: 90, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 90, opacity: 0 }}
						transition={spring}
					>
						<span className='st-dot' />
						<span className='st-bar-count'>
							{count} {count === 1 ? 'change' : 'changes'}
						</span>
						<button className='st-ghost' onClick={discard}>
							Discard
						</button>
						<button className='st-primary' onClick={onOpen}>
							Review
						</button>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{open && (
					<>
						<motion.div
							key='scrim'
							className='st-scrim'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={onClose}
						/>
						<motion.div
							key='sheet'
							className='st-sheet'
							initial={{ y: '100%' }}
							animate={{ y: 0 }}
							exit={{ y: '100%' }}
							transition={spring}
							drag='y'
							dragConstraints={{ top: 0, bottom: 0 }}
							dragElastic={{ top: 0, bottom: 0.6 }}
							onDragEnd={(_, info) => {
								if (info.offset.y > 100) onClose();
							}}
						>
							<div className='st-grab' />
							<h2>Your experience</h2>
							<p>
								{count
									? 'Everything you changed, together.'
									: 'Nothing to review yet.'}
							</p>
							<ul>
								{changed.map(k => (
									<li key={k}>
										<span>{fieldLabels[k]}</span>
										<span className='st-diff'>
											<s>{formatValue(k, saved[k])}</s>
											<Icon name='chevron' size={14} />
											<b>{formatValue(k, draft[k])}</b>
										</span>
									</li>
								))}
							</ul>
							<div className='st-sheet-actions'>
								<button
									className='st-ghost'
									onClick={() => {
										discard();
										onClose();
									}}
								>
									Discard
								</button>
								<button
									className='st-primary'
									disabled={!count}
									onClick={() => {
										save();
										onClose();
									}}
								>
									Save changes
								</button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
