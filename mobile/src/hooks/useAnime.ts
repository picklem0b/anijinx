import { useQuery } from '@tanstack/react-query';
import type { Filters } from '@workspace/shared/types';
import { api, apiUrl, fetchPlayback } from '@/lib/api';

export const keys = {
	home: ['home'] as const,
	anime: (id: number) => ['anime', id] as const,
	search: (f: Filters, page: number) => ['search', f, page] as const,
	reels: (page: number) => ['reels', page] as const,
	byIds: (ids: number[]) => ['byIds', ids] as const,
	recs: (liked: number[]) => ['recs', liked] as const,
	airing: ['airing'] as const,
	playback: (animeId: number, episode: number) => ['playback', animeId, episode] as const
};

export const useHome = () =>
	useQuery({ queryKey: keys.home, queryFn: () => api.home() });

export const useAnime = (id: number) =>
	useQuery({
		queryKey: keys.anime(id),
		queryFn: () => api.anime(id),
		enabled: Number.isInteger(id)
	});

export const useSearch = (filters: Filters, page: number) =>
	useQuery({
		queryKey: keys.search(filters, page),
		queryFn: () => api.search(filters, page),
		placeholderData: prev => prev
	});

export const useReels = (page: number) =>
	useQuery({
		queryKey: keys.reels(page),
		queryFn: () => api.reels(page)
	});

export const useByIds = (ids: number[]) =>
	useQuery({
		queryKey: keys.byIds(ids),
		queryFn: () => api.byIds(ids),
		enabled: ids.length > 0
	});

export const useRecommendations = (liked: number[]) =>
	useQuery({
		queryKey: keys.recs(liked),
		queryFn: () => api.recommendations(liked),
		enabled: liked.length > 0
	});

export const useAiring = () =>useQuery({
		queryKey: keys.airing,
		queryFn: () => api.airing()
	});

/** Resolves a licensed stream for one episode. Disabled unless the API is configured. */
export const usePlayback = (animeId: number, episode: number) =>
	useQuery({
		queryKey: keys.playback(animeId, episode),
		queryFn: () => fetchPlayback(animeId, episode),
		enabled: !!apiUrl && Number.isInteger(animeId) && episode > 0,
		staleTime: 60_000,
		retry: false
	});
