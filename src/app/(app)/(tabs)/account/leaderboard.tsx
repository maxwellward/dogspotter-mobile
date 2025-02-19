import pb from "@/lib/pocketbase";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";

interface LeaderboardUser {
	username: string;
	score: number;
}

export default function LeaderboardScreen() {
	const navigation = useNavigation();
	const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

	useEffect(() => {
		navigation.setOptions({
			title: 'Leaderboard',
		});
	}, [navigation]);

	const fetchLeaderboard = async () => {
		const result = await pb.send('/leaderboard', {
			method: 'GET',
		});

		const entries = [] as LeaderboardUser[];
		result.topUsers.forEach((user: { username: any; totalPoints: any; }) => {
			entries.push({
				username: user.username,
				score: user.totalPoints
			} as LeaderboardUser)
		});;

		setLeaderboard(entries);
	};

	useFocusEffect(
		useCallback(() => {
			fetchLeaderboard();
		}, [])
	);


	return (
		<ScrollView style={styles.container}>
			{leaderboard.map((user, index) => (
				<View key={index} style={{ marginBottom: 16 }}>
					<Text style={styles.huge}>#{index + 1}</Text>
					<Text>{user.username}</Text>
					<Text style={styles.large}>{user.score} points</Text>
				</View>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: 'center',
		marginTop: 15,
		width: '90%',
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 0
	},
	subheading: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 5
	},
	subtitle: {
		fontSize: 14,
	},
	huge: {
		fontSize: 36,
		fontWeight: 'bold',
	},
	large: {
		fontSize: 24,
		fontWeight: 'bold',
	}
});