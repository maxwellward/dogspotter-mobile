import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, View, GestureResponderEvent, PanResponder, PanResponderGestureState, Linking, Pressable } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useCameraStore } from '@/store/useCameraStore';
import { useRouter } from 'expo-router';
import { usePostHog } from 'posthog-react-native';

export default function CameraScreen() {
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);
	const [zoom, setZoom] = useState<number>(0);
	const initialDistanceRef = useRef<number | null>(null);
	// If the user is in the process of doing something else that should stop camera usage
	const [takePhotoDisabled, setTakePhotoDisabled] = useState(false);
	const [takenPhotoUri] = useState<string | null>(useCameraStore((state) => state.takenPhotoUri));

	const router = useRouter();
	const posthog = usePostHog();

	const setTakenPhotoUri = useCameraStore((state) => state.setTakenPhotoUri);

	useEffect(() => {
		if (takenPhotoUri) {
			setTakePhotoDisabled(true);
		} else {
			setTakePhotoDisabled(false);
		}
	}, [takenPhotoUri]);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		requestPermission();
		return (
			<SafeAreaView style={[styles.container, {
				width: '75%',
				alignSelf: 'center',
			}]}>
				<Text style={{ textAlign: 'center', marginBottom: 12 }}>Dogspotter doesn't have permission to access your camera</Text>
				<Button title="Open Settings" onPress={() => Linking.openSettings()} />
			</SafeAreaView>
		);
	}

	async function toggleCameraFacing() {
		try {
			setTakePhotoDisabled(true);
			await setFacing(current => (current === 'back' ? 'front' : 'back'));
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Something went wrong while flipping the camera.',
				text2: `${error}`,
			});
		} finally {
			setTakePhotoDisabled(false);
		}
	}

	async function takePhoto() {
		if (takePhotoDisabled) return;
		setTakePhotoDisabled(true);

		try {
			if (cameraRef.current) {
				const photo = await cameraRef.current.takePictureAsync({
					quality: 0.3,
				});
				if (photo) {
					posthog.capture("photo_taken");
					setTakenPhotoUri(photo.uri);
					router.push('/(app)/(tabs)/camera/review');
				}
			}
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Something went wrong while taking a photo.',
				text2: `${error}`,
			});
		} finally {
			setTakePhotoDisabled(false);
		}
	}

	const onPinchGestureEvent = (evt: GestureResponderEvent) => {
		const touches = evt.nativeEvent.touches;
		if (touches.length < 2) return;

		const touch1 = touches[0];
		const touch2 = touches[1];

		const dx = touch1.pageX - touch2.pageX;
		const dy = touch1.pageY - touch2.pageY;

		const distance = Math.sqrt(dx * dx + dy * dy);

		if (!cameraRef.current) return;

		if (initialDistanceRef.current === null) {
			initialDistanceRef.current = distance;
			return;
		}

		const distanceChange = distance - initialDistanceRef.current;

		// Ignore micro-movements
		if (Math.abs(distanceChange) < 5) return;

		let newZoom = zoom + distanceChange / 750; // Adjust the divisor to control zoom sensitivity

		if (newZoom < 0) newZoom = 0;
		else if (newZoom > 1) newZoom = 1;

		setZoom(newZoom);
		initialDistanceRef.current = distance; // Update the initial distance to the current distance
	};

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
			if (gestureState.numberActiveTouches === 2) {
				onPinchGestureEvent(evt);
			}
		},
		onPanResponderRelease: () => {
			initialDistanceRef.current = null;
		},
	});

	return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
				<View style={styles.buttonContainer}>
					<Pressable style={[styles.shutterOuter, takePhotoDisabled ? { borderColor: '#A9A9A9' } : {}]} onPress={takePhoto} disabled={takePhotoDisabled}>
						<View style={[styles.shutterInner, takePhotoDisabled ? { backgroundColor: '#A9A9A9' } : {}]}>
							{takePhotoDisabled ? <AntDesign name="frowno" size={24} color="white" /> : <FontAwesome5 name="dog" size={24} color="black" />}
						</View>
					</Pressable>
					<Pressable style={[styles.flip, takePhotoDisabled ? { backgroundColor: '#A9A9A9' } : {}]} onPress={toggleCameraFacing} disabled={takePhotoDisabled}>
						<MaterialCommunityIcons name="camera-flip-outline" size={24} color={takePhotoDisabled ? "grey" : "black"} />
					</Pressable>
				</View>
			</View>

			<CameraView ref={cameraRef} style={styles.camera} facing={facing} zoom={zoom} {...panResponder.panHandlers} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	camera: {
		flex: 1,
		width: '100%',
	},
	buttonContainer: {
		position: 'absolute',
		bottom: '4%',
		zIndex: 10,
		flex: 1,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
	},
	shutterOuter: {
		alignSelf: 'flex-end',
		justifyContent: 'center',
		width: 64,
		height: 64,
		alignItems: 'center',
		borderRadius: 100,
		borderColor: 'white',
		borderWidth: 2,
		position: 'relative',
	},
	shutterInner: {
		width: 56,
		height: 56,
		borderRadius: 100,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
	},
	flip: {
		position: 'absolute',
		flex: 1,
		alignSelf: 'flex-end',
		justifyContent: 'center',
		alignItems: 'center',
		width: 48,
		height: 48,
		right: 40,
		bottom: 8,
		backgroundColor: 'white',
		borderRadius: 10,
	}
});