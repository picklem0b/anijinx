import { useId } from 'react';
import { motion } from 'framer-motion';
import { textSizes, uiStyles } from '../data';
import { spring } from '../motion';
import type { TextSize, UiStyle } from '../types';

export function TextSizePicker({
	value,
	onChange
}: {
	value: TextSize;
	onChange: (value: TextSize) => void;
}) {
	const group = useId();
	return (
		<div className='st-seg' role='radiogroup' aria-label='Text size'>
			{textSizes.map((s, i) => (
				<button
					key={s.id}
					role='radio'
					aria-checked={value === s.id}
					aria-label={s.label}
					className='st-seg-cell'
					onClick={() => onChange(s.id)}
				>
					{value === s.id && (
						<motion.span
							layoutId={group}
							className='st-seg-pill'
							transition={spring}
						/>
					)}
					<span style={{ fontSize: `${0.8 + i * 0.18}em` }}>Aa</span>
				</button>
			))}
		</div>
	);
}

export function UiStylePicker({
	value,
	onChange
}: {
	value: UiStyle;
	onChange: (value: UiStyle) => void;
}) {
	const group = useId();
	return (
		<div className='st-styles' role='radiogroup' aria-label='UI style'>
			{uiStyles.map(s => (
				<button
					key={s.id}
					role='radio'
					aria-checked={value === s.id}
					className='st-style'
					onClick={() => onChange(s.id)}
				>
					{value === s.id && (
						<motion.span
							layoutId={group}
							className='st-style-ring'
							transition={spring}
						/>
					)}
					<span
						className='st-style-preview'
						style={{ borderRadius: s.radius * 0.6 }}
					>
						<i style={{ borderRadius: s.radius * 0.4 }} />
					</span>
					<b>{s.label}</b>
				</button>
			))}
		</div>
	);
}
