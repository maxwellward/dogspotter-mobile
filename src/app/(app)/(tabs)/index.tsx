import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "@/components/carousel";

export default function HomeScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>🐶 Dogspotter</Text>
			<Text style={styles.subtitle}>We love dogs, so we made a game about it</Text>

			<View style={styles.instructions}>
				<Text>
					<Text style={{ fontWeight: 'bold' }}>Spot a dog. </Text>
					<Text>Find a dog almost anywhere in the world and snap a photo of it, provided you respect the owner, the dog, and our rules.</Text>
				</Text>
				<Text>
					<Text style={{ fontWeight: 'bold' }}>Submit your photo. </Text>
					<Text>We’ll review it and make sure it follows our rules, and you’ll be awarded a point for each unique dog in your photo.</Text>
				</Text>
				<Text>
					<Text style={{ fontWeight: 'bold' }}>Climb the ranks. </Text>
					<Text>With each point you gain, you’re closer to taking the #1 spot on the leaderboard and obtaining the ultimate bragging rights.</Text>
				</Text>
			</View>
			<View style={{ marginTop: 24 }}>
				<Carousel />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 14,
		marginTop: 8,
		marginBottom: 48,
	},
	instructions: {
		gap: 16,
		width: '75%',
	},
});