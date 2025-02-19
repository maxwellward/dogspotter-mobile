import pb from '@/lib/pocketbase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface CameraState {
	takenPhotoUri: string
	savedPhotos: string[]
	addSavedPhoto: (uri: string) => void
	removeSavedPhoto: (uri: string) => void
	setTakenPhotoUri: (uri: string | undefined) => void
	uploadPhoto: (uri: string) => void
}

export const useCameraStore = create<CameraState>()(
	persist(
		(set, get) => ({
			takenPhotoUri: '',
			savedPhotos: [],
			addSavedPhoto: (uri) => set((state) => ({ savedPhotos: [...state.savedPhotos, uri] })),
			removeSavedPhoto: (uri) => set((state) => ({ savedPhotos: state.savedPhotos.filter((photo) => photo !== uri) })),
			setTakenPhotoUri: (uri) => set((state) => ({ takenPhotoUri: uri })),
			uploadPhoto: async (uri) => {
				await uploadPhoto(uri);
			},
		}),
		{
			name: 'camera-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({ savedPhotos: state.savedPhotos }),
		},
	),
)


const uploadPhoto = async (uri: string) => {
	if (!pb.authStore.record) return;

	const manipResult = await manipulateAsync(uri, [{ resize: { width: 640 } }], { compress: 1, format: SaveFormat.JPEG });

	const formData = new FormData();
	formData.append('userId', pb.authStore.record.id)
	formData.append('image', {
		uri: manipResult.uri,
		name: 'image.jpg',
		type: 'image/jpeg',
	} as any);

	await pb.collection('submissions').create(formData);
}