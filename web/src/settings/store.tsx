import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode
} from 'react';
import { defaultSettings } from './data';
import type { SettingsState } from './types';

type Key = keyof SettingsState;

interface Store {
	saved: SettingsState;
	draft: SettingsState;
	changed: Key[];
	set: <K extends Key>(key: K, value: SettingsState[K]) => void;
	discard: () => void;
	save: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [saved, setSaved] = useState<SettingsState>(defaultSettings);
	const [draft, setDraft] = useState<SettingsState>(defaultSettings);

	const changed = useMemo(
		() => (Object.keys(draft) as Key[]).filter(k => draft[k] !== saved[k]),
		[draft, saved]
	);
	const set = useCallback(
		<K extends Key>(key: K, value: SettingsState[K]) =>
			setDraft(d => ({ ...d, [key]: value })),
		[]
	);
	const discard = useCallback(() => setDraft(saved), [saved]);
	const save = useCallback(() => setSaved(draft), [draft]);

	const value = useMemo(
		() => ({
			saved,
			draft,
			changed,
			set,
			discard,
			save
		}),
		[saved, draft, changed, set, discard, save]
	);
	return (
		<StoreContext.Provider value={value}>{children}</StoreContext.Provider>
	);
}

export function useSettings() {
	const value = useContext(StoreContext);
	if (!value) throw new Error('SettingsProvider is missing');
	return value;
}
