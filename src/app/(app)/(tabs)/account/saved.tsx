import { useEffect, useState } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SavedPhoto from "@/components/saved-photo";
import { ScrollView } from "react-native-gesture-handler";
import { useCameraStore } from "@/store/useCameraStore";

export default function SavedScreen() {
	const cameraStore = useCameraStore();
	const [savedPhotos, setSavedPhotos] = useState<string[]>(cameraStore.savedPhotos);

	useEffect(() => {
		setSavedPhotos(cameraStore.savedPhotos);
	}, [cameraStore]);

	const deviceWidth = Dimensions.get('window').width;

	const dynamicStyles = StyleSheet.create({
		photoContainer: {
			width: deviceWidth - 50,
			height: '100%',
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
	});

	return (
		<GestureHandlerRootView style={savedPhotos.length > 0 ? styles.container : styles.emptyContainer}>
			<View>
				{savedPhotos.length > 0 ? (
					<ScrollView horizontal showsHorizontalScrollIndicator={true} >
						{savedPhotos.map((photo, index) => (
							<View
								key={index}
								style={dynamicStyles.photoContainer}
							>
								<SavedPhoto key={index} photoUri={photo} />
							</View>
						))}
					</ScrollView>
				) : (
					<View style={styles.emptyContainer}>
						<Text style={styles.title}>No saved photos</Text>
						<Text>Poor reception? Save a photo to upload it later.</Text>
					</View>

				)}
			</View>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
});