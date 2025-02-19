import { StyleSheet, View, Image, TouchableOpacity, Platform } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import { useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import LoadingSpinner from "@/components/loading-spinner";
import { useCameraStore } from "@/store/useCameraStore";
import { useRouter } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { usePostHog } from "posthog-react-native";

export default function ReviewScreen() {
	const router = useRouter();
	const settingsStore = useSettingsStore();
	const posthog = usePostHog();

	const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_REVIEW_BANNER_AD_IOS : process.env.EXPO_PUBLIC_REVIEW_BANNER_AD_ANDROID;

	const [isUploading, setIsUploading] = useState(false);
	const [takenPhotoUri] = useState<string>(useCameraStore((state) => state.takenPhotoUri));
	const [showAdvertisements, setShowAdvertisements] = useState<boolean>(settingsStore.showAdvertisements);

	const uploadPhoto = useCameraStore((state) => state.uploadPhoto);
	const setTakenPhotoUri = useCameraStore((state) => state.setTakenPhotoUri);
	const addSavedPhoto = useCameraStore((state) => state.addSavedPhoto);

	useEffect(() => {
		setShowAdvertisements(settingsStore.showAdvertisements);
	}, [settingsStore]);

	const retakePhoto = () => {
		setTakenPhotoUri(undefined);
		posthog.capture("photo_deleted");
		Toast.show({
			type: 'success',
			text1: 'Photo deleted.',
		});
		router.replace('/(app)/(tabs)/camera');
	}

	const submitPhoto = async () => {
		setIsUploading(true);
		try {
			await uploadPhoto(takenPhotoUri)
			setTakenPhotoUri(undefined);
			router.replace('/(app)/(tabs)/camera');
			posthog.capture("photo_uploaded");
			Toast.show({
				type: 'success',
				text1: 'Photo successfully uploaded!',
				text2: 'Your points will be pending until reviewed.',
			});
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Something went wrong while uploading your photo',
				text2: `${error}`,
			});
		} finally {
			setIsUploading(false);
		}
	}

	const savePhoto = () => {
		try {
			addSavedPhoto(takenPhotoUri);
			setTakenPhotoUri(undefined);
			router.replace('/(app)/(tabs)/camera');
			posthog.capture("photo_saved");
			Toast.show({
				type: 'success',
				text1: 'Photo successfully saved!',
				text2: 'Go to your profile to upload it later.',
			});
		} catch (error) {
			Toast.show({
				type: 'success',
				text1: 'Something went wrong while saving your photo',
				text2: `${error}`,
			});
		}
	}

	const bannerRef = useRef<BannerAd>(null);

	useForeground(() => {
		Platform.OS === 'ios' && bannerRef.current?.load();
	})

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={{ uri: takenPhotoUri }} style={styles.image} />
			</View>
			<View style={styles.options}>
				<TouchableOpacity style={styles.option} onPress={retakePhoto}>
					<FontAwesome name="trash-o" size={24} color="black" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.shutterOuter} onPress={submitPhoto}>
					<View style={styles.shutterInner}>
						{isUploading ?
							<LoadingSpinner size={24} colour="#f2f2f2" />
							:
							<MaterialIcons name="file-upload" size={36} color="#f2f2f2" />
						}
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.option} onPress={savePhoto}>
					<FontAwesome name="save" size={24} color="black" />
				</TouchableOpacity>
			</View>
			<View style={{ marginTop: 'auto' }}>
				{(adUnitId && showAdvertisements) &&
					<BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
				}
			</View>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: '20%',
		alignItems: 'center',
	},
	imageContainer: {
		width: '80%',
		height: '70%',
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	options: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '50%',
		marginTop: '5%',
		alignItems: 'center'
	},
	option: {
		borderWidth: 2,
		padding: 10,
		width: 48,
		height: 48,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: 'black',
		borderRadius: '100%',
	},
	shutterOuter: {
		alignSelf: 'flex-end',
		justifyContent: 'center',
		width: 64,
		height: 64,
		alignItems: 'center',
		borderRadius: 100,
		borderColor: 'black',
		borderWidth: 2,
		position: 'relative',
	},
	shutterInner: {
		width: 56,
		height: 56,
		borderRadius: 100,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
	},
});