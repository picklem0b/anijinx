import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Comment, ListKey, Progress } from '@workspace/shared/types';

export interface Settings {
	autoplayPreviews: boolean;
	preferSubtitles: boolean;
	notifications: boolean;
	dataSaver: boolean;
}

interface LibraryState {
	/** Stable anonymous device id — sent as x-device-id once the API is live. */
	deviceId: string;
	liked: number[];
	watchlist: number[];
	reminders: number[];
	ratings: Record<number, number>;
	comments: Record<number, Comment[]>;
	progress: Record<string, Progress>;

	toggle: (list: ListKey, id: number) => void;
	isIn: (list: ListKey, id: number) => boolean;
	rate: (id: number, value: number) => void;
	addComment: (id: number, text: string, ep: number | null) => void;
	removeComment: (id: number, commentId: string) => void;
	saveProgress: (p: Omit<Progress, 'updatedAt'>) => void;
	removeProgress: (animeId: number, episode: number) => void;
	continueWatching: () => Progress[];

	settings: Settings;
	setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const newId = () =>
	'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});

export const useLibrary = create<LibraryState>()(
	persist(
		(set, get) => ({
			deviceId: newId(),
			liked: [],
			watchlist: [],
			reminders: [],
			ratings: {},
			comments: {},
			progress: {},
			settings: {
				autoplayPreviews: true,
				preferSubtitles: false,
				notifications: true,
				dataSaver: false
			},

			toggle: (list, id) =>
				set(s => {
					const next = s[list].includes(id)
						? s[list].filter(x => x !== id)
						: [id, ...s[list]];
					if (list === 'liked') return { liked: next };
					if (list === 'watchlist') return { watchlist: next };
					return { reminders: next };
				}),

			isIn: (list, id) => get()[list].includes(id),

			rate: (id, value) =>
				set(s => {
					const ratings = { ...s.ratings };
					if (value <= 0 || ratings[id] === value) delete ratings[id];
					else ratings[id] = value;
					return { ratings };
				}),

			addComment: (id, text, ep) =>
				set(s => ({
					comments: {
						...s.comments,
						[id]: [
							{
								id:
									Date.now().toString(36) +
									Math.random().toString(36).slice(2, 7),
								text,
								at: Date.now(),
								ep
							},
							...(s.comments[id] ?? [])
						]
					}
				})),

			removeComment: (id, commentId) =>
				set(s => ({
					comments: {
						...s.comments,
						[id]: (s.comments[id] ?? []).filter(
							c => c.id !== commentId
						)
					}
				})),

			saveProgress: p =>
				set(s => ({
					progress: {
						...s.progress,
						[`${p.animeId}:${p.episode}`]: {
							...p,
							updatedAt: Date.now()
						}
					}
				})),

			removeProgress: (animeId, episode) =>
				set(s => {
					const progress = { ...s.progress };
					delete progress[`${animeId}:${episode}`];
					return { progress };
				}),

			continueWatching: () =>
				Object.values(get().progress)
					.filter(
						p =>
							p.durationSeconds > 0 &&
							p.positionSeconds / p.durationSeconds < 0.95
					)
					.sort((a, b) => b.updatedAt - a.updatedAt),

			setSetting: (key, value) =>
				set(s => ({ settings: { ...s.settings, [key]: value } }))
		}),
		{
			name: 'anijinx-mobile',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: s => ({
				deviceId: s.deviceId,
				liked: s.liked,
				watchlist: s.watchlist,
				reminders: s.reminders,
				ratings: s.ratings,
				comments: s.comments,
				progress: s.progress,
				settings: s.settings
			})
		}
	)
);
