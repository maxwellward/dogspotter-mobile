import pb from '@/lib/pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SettingsState {
	openToCamera: boolean;
	showAdvertisements: boolean;
	allowModelTraining: boolean;
	allowAnalytics: boolean;
	setOpenToCamera: (value: boolean) => void;
	setShowAdvertisements: (value: boolean) => void;
	setAllowModelTraining: (value: boolean, local?: boolean) => void;
	setAllowAnalytics: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set, get) => ({
			openToCamera: false,
			showAdvertisements: true,
			allowModelTraining: true,
			allowAnalytics: true,
			setOpenToCamera: (value) => set({ openToCamera: value }),
			setShowAdvertisements: (value) => set({ showAdvertisements: value }),
			setAllowModelTraining: async (state, local) => {
				set({ allowModelTraining: state });
				if (!local) {
					await toggleModelTraining(state);
				}
			},
			setAllowAnalytics: (value) => set({ allowAnalytics: value }),
		}),
		{
			name: 'settings-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)

const toggleModelTraining = async (allowed: boolean, local?: boolean) => {
	if (!pb.authStore.record) return;

	await pb.collection("users").update(pb.authStore.record.id, { 'modelTrainingAllowed': allowed });


}