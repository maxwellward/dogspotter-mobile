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
	setAllowModelTraining: (value: boolean) => void;
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
			setAllowModelTraining: (value) => set({ allowModelTraining: value }),
			setAllowAnalytics: (value) => set({ allowAnalytics: value }),
		}),
		{
			name: 'settings-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)