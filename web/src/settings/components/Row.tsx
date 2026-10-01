import type { KeyboardEvent, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

interface RowProps {
	icon: IconName;
	title: string;
	subtitle: string;
	onClick?: () => void;
	trailing?: ReactNode;
	checked?: boolean;
}

export function Row({
	icon,
	title,
	subtitle,
	onClick,
	trailing,
	checked
}: RowProps) {
	const interactive = onClick !== undefined;
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick?.();
		}
	};
	return (
		<div
			className='st-row'
			data-interactive={interactive}
			role={
				interactive
					? checked === undefined
						? 'button'
						: 'switch'
					: undefined
			}
			aria-checked={checked}
			tabIndex={interactive ? 0 : undefined}
			onClick={onClick}
			onKeyDown={interactive ? onKeyDown : undefined}
		>
			<span className='st-tile'>
				<Icon name={icon} />
			</span>
			<span className='st-row-text'>
				<b>{title}</b>
				<small>{subtitle}</small>
			</span>
			{trailing ??
				(interactive && checked === undefined ? (
					<Icon name='chevron' size={18} />
				) : null)}
		</div>
	);
}
