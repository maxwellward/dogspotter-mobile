import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SettingsState {
	openToCamera: boolean;
	showAdvertisements: boolean;
	allowModelTraining: boolean;
	setOpenToCamera: (value: boolean) => void;
	setShowAdvertisements: (value: boolean) => void;
	setAllowModelTraining: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set, get) => ({
			openToCamera: false,
			showAdvertisements: true,
			allowModelTraining: true,
			setOpenToCamera: (value) => set({ openToCamera: value }),
			setShowAdvertisements: (value) => set({ showAdvertisements: value }),
			setAllowModelTraining: (value) => set({ allowModelTraining: value }),
		}),
		{
			name: 'settings-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)