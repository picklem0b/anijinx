import { useState, type ReactNode } from 'react';
import { Icon } from './Icon';

interface ScreenProps {
	title: string;
	subtitle?: string;
	compact?: boolean;
	onBack?: () => void;
	action?: ReactNode;
	children: ReactNode;
}

export function Screen({
	title,
	subtitle,
	compact = false,
	onBack,
	action,
	children
}: ScreenProps) {
	const [scrolled, setScrolled] = useState(false);
	const solid = compact || scrolled;
	return (
		<div className='st-screen'>
			<header className='st-head' data-solid={solid}>
				<button
					className='st-icon-btn'
					onClick={onBack}
					aria-label='Back'
				>
					<Icon name='back' />
				</button>
				<span
					className='st-head-title'
					style={{ opacity: solid ? 1 : 0 }}
				>
					{title}
				</span>
				<span className='st-head-side'>{action}</span>
			</header>
			<div
				className='st-scroll'
				onScroll={e => setScrolled(e.currentTarget.scrollTop > 36)}
			>
				{!compact && (
					<div className='st-hero'>
						<h1>{title}</h1>
						{subtitle && <p>{subtitle}</p>}
					</div>
				)}
				{children}
				<div className='st-spacer' />
			</div>
		</div>
	);
}
