import pb from '@/lib/pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface StatsState {
	totalPoints: number;
	leaderboardPosition: number;
	setTotalPoints: (points: number) => void;
	setLeaderboardPosition: (position: number) => void;
	getTotalPoints: () => Promise<number>;
	getLeaderboardPosition: () => Promise<number>;
}

export const useStatsStore = create<StatsState>()(
	persist(
		(set, get) => ({
			totalPoints: 0,
			leaderboardPosition: 0,
			setTotalPoints: (points) => set({ totalPoints: points }),
			setLeaderboardPosition: (position) => set({ leaderboardPosition: position }),
			getTotalPoints: async (): Promise<number> => {
				return await fetchTotalPoints() ?? 0;
			},
			getLeaderboardPosition: async (): Promise<number> => {
				return await fetchLeaderboardPosition() ?? -1;
			},
		}),
		{
			name: 'stats-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)


const fetchTotalPoints = async (): Promise<number | undefined> => {
	try {
		const submissions = await pb.collection("submissions").getFullList({
			filter: `userId = "${pb.authStore.record?.id}"`,
		});

		const totalPoints = submissions.reduce((sum, s) => sum + s.score, 0);

		useStatsStore.getState().setTotalPoints(totalPoints);

		return totalPoints
	} catch (error) {
		console.error('Error fetching total points:', error);
		if (error.originalError) {
			console.error('Original error:', error.originalError);
		}
	}
}

const fetchLeaderboardPosition = async (): Promise<number | undefined> => {
	if (!pb.authStore.record) return;
	const result = await pb.send(`/leaderboard/${pb.authStore.record?.id}`, {
		method: 'GET',
	});

	useStatsStore.getState().setLeaderboardPosition(result.position);

	return result.position;
}