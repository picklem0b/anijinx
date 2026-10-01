import { useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import './settings.css';
import { ChangesBar } from './components/ChangesBar';
import { textSizes, themes, uiStyles } from './data';
import { spring } from './motion';
import { AppearanceSection } from './sections/AppearanceSection';
import { HomeSection } from './sections/HomeSection';
import { LanguageSection } from './sections/LanguageSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { ProfileSection } from './sections/ProfileSection';
import { SettingsProvider, useSettings } from './store';
import type { ScreenName } from './types';

const pageVariants: Variants = {
	enter: (d: number) => ({ x: d > 0 ? '28%' : '-18%', opacity: 0 }),
	center: { x: 0, opacity: 1 },
	exit: (d: number) => ({ x: d > 0 ? '-18%' : '28%', opacity: 0 })
};

function Shell() {
	const { draft } = useSettings();
	const [stack, setStack] = useState<ScreenName[]>(['profile']);
	const [direction, setDirection] = useState(1);
	const [review, setReview] = useState(false);
	const current = stack[stack.length - 1];

	const open = (screen: ScreenName) => {
		setDirection(1);
		setStack(s => [...s, screen]);
	};
	const back = () => {
		setDirection(-1);
		setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
	};

	const vars = {
		'--accent': themes.find(t => t.id === draft.theme)!.color,
		'--scale': textSizes.find(t => t.id === draft.textSize)!.scale,
		'--r': `${uiStyles.find(t => t.id === draft.uiStyle)!.radius}px`
	} as CSSProperties;

	const screens: Record<ScreenName, ReactNode> = {
		profile: (
			<ProfileSection onBack={back} onSettings={() => open('settings')} />
		),
		settings: (
			<HomeSection
				onBack={back}
				onOpen={open}
				onReview={() => setReview(true)}
			/>
		),
		appearance: <AppearanceSection onBack={back} />,
		language: <LanguageSection onBack={back} />,
		notifications: <NotificationsSection onBack={back} />
	};

	return (
		<div
			className='st-root'
			data-theme={draft.dark ? 'dark' : 'light'}
			style={vars}
		>
			<AnimatePresence initial={false} custom={direction}>
				<motion.div
					key={current}
					className='st-page'
					custom={direction}
					variants={pageVariants}
					initial='enter'
					animate='center'
					exit='exit'
					transition={spring}
				>
					{screens[current]}
				</motion.div>
			</AnimatePresence>
			<ChangesBar
				open={review}
				onOpen={() => setReview(true)}
				onClose={() => setReview(false)}
			/>
		</div>
	);
}

export default function Page() {
	return (
		<SettingsProvider>
			<Shell />
		</SettingsProvider>
	);
}
