import { motion } from 'framer-motion';
import { spring } from '../motion';

export function DayNightSwitch({ dark }: { dark: boolean }) {
	return (
		<span className='st-dn' data-dark={dark} aria-hidden='true'>
			<span className='st-dn-stars'>
				<i />
				<i />
				<i />
				<i />
			</span>
			<span className='st-dn-cloud' />
			<motion.span
				className='st-dn-knob'
				initial={false}
				animate={{
					x: dark ? '2.2em' : '0em',
					backgroundColor: dark ? '#f3f1ff' : '#ffb526'
				}}
				transition={spring}
			>
				<motion.span
					className='st-dn-bite'
					initial={false}
					animate={{ scale: dark ? 1 : 0 }}
					transition={spring}
				/>
			</motion.span>
		</span>
	);
}
