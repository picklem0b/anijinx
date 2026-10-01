import type { ReactNode } from 'react';

export function Card({
	children,
	className = ''
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={`st-card ${className}`}>{children}</div>;
}

export function Label({
	children,
	value
}: {
	children: ReactNode;
	value?: string;
}) {
	return (
		<div className='st-label'>
			<span>{children}</span>
			{value && <em>{value}</em>}
		</div>
	);
}

export function Chip({
	children,
	off = false
}: {
	children: ReactNode;
	off?: boolean;
}) {
	return (
		<span className='st-chip' data-off={off}>
			{children}
		</span>
	);
}
