import { motion } from 'framer-motion';
import { spring } from '../motion';
import { Icon } from './Icon';

export function Toggle({ checked }: { checked: boolean }) {
	return (
		<span className='st-toggle' data-on={checked} aria-hidden='true'>
			<motion.span
				className='st-toggle-knob'
				initial={false}
				animate={{ x: checked ? '1.3em' : '0em' }}
				transition={spring}
			>
				<motion.span
					style={{ display: 'grid' }}
					initial={false}
					animate={{
						scale: checked ? 1 : 0,
						opacity: checked ? 1 : 0
					}}
					transition={spring}
				>
					<Icon name='check' size={13} />
				</motion.span>
			</motion.span>
		</span>
	);
}
