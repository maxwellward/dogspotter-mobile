import { View, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from "react";
import Toast from "react-native-toast-message";
import LoadingSpinner from "@/components/loading-spinner";
import { useCameraStore } from "@/store/useCameraStore";
import { usePostHog } from "posthog-react-native";

export type Props = {
	photoUri: string;
};

export default function SavedPhoto(props: Props) {
	const posthog = usePostHog();

	const [isUploading, setIsUploading] = useState(false);

	const removeSavedPhoto = useCameraStore((state) => state.removeSavedPhoto);
	const uploadPhoto = useCameraStore((state) => state.uploadPhoto);

	const openDeleteAlert = () => {
		Alert.alert('Delete Saved Photo', 'Are you sure? This cannot be undone.', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Delete',
				onPress: () => removePhoto(),
				style: 'destructive',
			},
		]);
	}
	const openUploadAlert = () => {
		Alert.alert('Upload Saved Photo', 'The photo will also be removed from your saved photos.', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Upload',
				onPress: () => _uploadPhoto(),
				style: 'default',
			},
		]);
	}

	const removePhoto = () => {
		removeSavedPhoto(props.photoUri);
		posthog.capture("saved_photo_deleted");
		Toast.show({
			type: 'success',
			text1: 'Photo successfully deleted!',
		});
	}

	const _uploadPhoto = async () => {
		setIsUploading(true);
		try {
			await uploadPhoto(props.photoUri);
			removeSavedPhoto(props.photoUri);
			console.log('caputring evet s');

			posthog.capture("saved_photo_uploaded");
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

	return (
		<View style={styles.container}>
			<Image source={{ uri: props.photoUri }} style={styles.image} />
			<View style={styles.options}>
				<TouchableOpacity style={styles.option} onPress={openDeleteAlert}>
					<FontAwesome name="trash-o" size={24} color="black" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.option} onPress={openUploadAlert}>
					{isUploading ?
						<LoadingSpinner size={20} colour="black" />
						:
						<MaterialIcons name="file-upload" size={24} color="black" />
					}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '90%',
		height: '90%',
	},
	image: {
		width: '100%',
		height: '90%',
		borderRadius: 10,
	},
	options: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		marginTop: 20,
		justifyContent: 'space-around',
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
})