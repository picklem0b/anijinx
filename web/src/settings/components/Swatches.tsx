import { motion } from 'framer-motion';
import { themes } from '../data';
import { spring } from '../motion';
import type { ThemeColor } from '../types';
import { Icon } from './Icon';

export function Swatches({
	value,
	onChange
}: {
	value: ThemeColor;
	onChange: (value: ThemeColor) => void;
}) {
	return (
		<div className='st-swatches' role='radiogroup' aria-label='Theme color'>
			{themes.map(t => (
				<button
					key={t.id}
					role='radio'
					aria-checked={value === t.id}
					aria-label={t.label}
					className='st-swatch'
					onClick={() => onChange(t.id)}
				>
					{value === t.id && (
						<motion.span
							layoutId='swatch-ring'
							className='st-swatch-ring'
							transition={spring}
						/>
					)}
					<span
						className='st-swatch-dot'
						style={{ background: t.color }}
					>
						{value === t.id && <Icon name='check' size={16} />}
					</span>
				</button>
			))}
		</div>
	);
}
