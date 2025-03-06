import { Button, Text, StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import * as WebBrowser from 'expo-web-browser';
import { useSession } from "@/hooks/auth-context";
import LoadingSpinner from "@/components/loading-spinner";
import { useUser } from "@/hooks/useUser";
import { useCameraStore } from "@/store/useCameraStore";
import { Link, useNavigation } from "expo-router";
import Settings from "@/components/settings";
import { useStatsStore } from "@/store/useStatsStore";
import React from "react";

export default function AccountScreen() {
	const { signOut } = useSession();
	const { fetchUser } = useUser();

	const navigation = useNavigation();

	const cameraStore = useCameraStore();
	const statsStore = useStatsStore();

	const [time, setTime] = useState("");
	const [points, setPoints] = useState(0);
	const [leaderboardPosition, setLeaderboardPosition] = useState(0);
	const [loadingPoints, setLoadingPoints] = useState(true);
	const [username, setUsername] = useState('');
	const [savedPhotos, setSavedPhotos] = useState<string[]>(cameraStore.savedPhotos);

	useEffect(() => {
		setSavedPhotos(cameraStore.savedPhotos);
	}, [cameraStore]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			const fetchData = async () => {
				const points = await statsStore.getTotalPoints();
				const leaderboardPosition = await statsStore.getLeaderboardPosition();

				setPoints(points);
				setLeaderboardPosition(leaderboardPosition);

				setLoadingPoints(false);

				try {
					const u = await fetchUser();
					if (u) {
						setUsername(u?.username);
					}
				} catch (error) {
					console.error(error);
				}
			}
			fetchData();
		});

		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	}, [fetchUser, navigation, statsStore]);

	useEffect(() => {
		const currentHour = new Date().getHours();
		if (currentHour < 12) {
			setTime("morning");
		} else if (currentHour < 18) {
			setTime("afternoon");
		} else {
			setTime("evening");
		}
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View>
					<View>
						<Text style={styles.header}>Good {time}</Text>
						<Text style={styles.subtitle}>{username}</Text>
					</View>
					<View style={{ marginTop: 20, height: 64 }}>
						<Text style={styles.subheading}>Total Points</Text>
						{loadingPoints ? <LoadingSpinner colour="black" size={32} /> : <Text style={styles.huge}>{points.toLocaleString()}</Text>}
					</View>
					<View style={{ marginTop: 20, height: 64 }}>
						<Text style={styles.subheading}>Leaderboard Position</Text>
						{loadingPoints ?
							<LoadingSpinner colour="black" size={32} />
							:
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={styles.huge}>#{leaderboardPosition.toLocaleString()}</Text>
								<Link style={{ padding: 10 }} href="/(app)/(tabs)/account/leaderboard">View Leaderboard</Link>
							</View>
						}
					</View>
					<View style={{ marginTop: 20 }}>
						<Text style={styles.subheading}>Photos Waiting to Upload</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.huge}>{savedPhotos.length}</Text>
							<Link style={{ padding: 10 }} href="/(app)/(tabs)/account/saved">View</Link>
						</View>
					</View>
					<View style={{ marginTop: 20 }}>
						<Text style={styles.large}>Settings</Text>
						<Settings />
					</View>
				</View>

			</ScrollView>
			<View style={{ alignItems: 'center' }}>
				<Button title="Sign Out" onPress={() => signOut()} />
				<Text style={{ color: '#767676' }}>Version {Constants.expoConfig?.version}</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
					<Text onPress={() => WebBrowser.openBrowserAsync('https://hastebin.com/share/jiwabumiya.sql')} style={{ color: '#767676' }}>Terms of Service</Text>
					<Text style={{ color: '#767676' }}> | </Text>
					<Text onPress={() => WebBrowser.openBrowserAsync('https://hastebin.com/share/oyafijadiw.vbnet')} style={{ color: '#767676' }}>Privacy Policy</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
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