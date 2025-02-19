import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'expo-router';

export default function RulesScreen() {
	const [modelTrainingAllowed, setModelTrainingAllowed] = useState(true);

	const { updateUser } = useUser();
	const router = useRouter();

	const agree = async () => {
		try {
			updateUser({ agreedToRules: true, modelTrainingAllowed });
			router.replace('/(app)/(tabs)')
		} catch (err: any) {
			console.error(err);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>One More Thing...</Text>
			<Text style={styles.subtitle}>
				<Text>
					You must agree to our rules before getting started. By continuing, you are confirming you understand and agree to these rules.
				</Text>
			</Text>

			<ScrollView style={styles.instructions}>
				<Text style={styles.instruction}>
					<Text style={{ fontWeight: 'bold', }}>You must take the photo. </Text>
					<Text>All photos you submit must be taken by you. As a measure to help prevent cheating, all photos must be taken from the app.</Text>
				</Text>
				<Text style={styles.instruction}>
					<Text style={{ fontWeight: 'bold' }}>Every dog is unique. </Text>
					<Text>Your photos need to be as unique as the dogs that are in them. Purposefully submitting the same dog multiple times will result in point deductions.</Text>
				</Text>
				<Text style={styles.instruction}>
					<Text style={{ fontWeight: 'bold' }}>Respect the dog and their owner. </Text>
					<Text>Not everyone wants their photo taken, and that’s okay. If someone asks you not to take a photo, please respect that wish.</Text>
				</Text>
				<Text style={styles.instruction}>
					<Text style={{ fontWeight: 'bold' }}>Dogs must be "in the wild". </Text>
					<Text>Dogs must be out and about and be "spotted" by you. Please avoid taking photos at places such as shelters as this goes against the spirit of the game. Dog parks are generally okay, but be mindful of the unique dogs rule.</Text>
				</Text>
				<Text>
					<Text style={{ fontWeight: 'bold' }}>Privacy is a human right. </Text>
					<Text>Your images may be used to train an image classifier model for exclusive use inside the Dogspotter ecosystem. Your images are linked to your user ID for points-tracking purposes, but will never be shared or sold to a third-party, and all sensitive metadata is removed from the image during the upload process.</Text>
					<Text style={{ fontWeight: 'bold' }}> If you'd like to opt-out of the use of your images for model training, please un-check the box below.</Text>
				</Text>
			</ScrollView>
			<View style={styles.setting}>
				<Checkbox style={styles.checkbox} value={modelTrainingAllowed} onValueChange={(state) => setModelTrainingAllowed(state)} />
				<Text style={styles.settingText}>Allow Model Training</Text>
			</View>
			<View>
				<TouchableOpacity onPress={agree} style={styles.button}>
					<Text style={{ color: 'white' }}>I understand and agree</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 24,
	},
	button: {
		padding: 10,
		backgroundColor: '#007bff',
		borderRadius: 5,
	},
	title: {
		marginTop: 16,
		fontSize: 20,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 14,
		marginTop: 8,
		marginBottom: 24,
		textAlign: 'center'
	},
	instructions: {
		width: '80%',
	},
	instruction: {
		marginBottom: 16,
	},
	setting: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginTop: 10,
		marginBottom: 10,
	},
	settingText: {
		fontSize: 16,
	},
	checkbox: {
		margin: 0,
	},
});