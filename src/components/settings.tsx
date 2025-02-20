import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useSettingsStore } from "@/store/useSettingsStore";
import pb from "@/lib/pocketbase";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { CheckboxComponent } from "@/components/checkbox";

export default function Settings() {
	const settingsStore = useSettingsStore();
	const router = useRouter();
	const { fetchUser } = useUser();

	const [openToCamera, setOpenToCamera] = useState<boolean>(settingsStore.openToCamera);
	const [showAdvertisements, setShowAdvertisements] = useState<boolean>(settingsStore.showAdvertisements);
	const [allowModelTraining, setAllowModelTraining] = useState<boolean>(settingsStore.allowModelTraining);
	const [allowAnalytics, setAllowAnalytics] = useState<boolean>(settingsStore.allowAnalytics);
	const [email, setEmail] = useState<string | undefined>(undefined);

	useEffect(() => {
		const fetchEmail = async () => {
			const user = await fetchUser();
			setEmail(user?.email);
		};
		fetchEmail();
		setOpenToCamera(settingsStore.openToCamera);
		setShowAdvertisements(settingsStore.showAdvertisements);
		setAllowModelTraining(settingsStore.allowModelTraining);
		setAllowAnalytics(settingsStore.allowAnalytics);
	}, [settingsStore, fetchUser]);

	const changePassword = () => {
		Alert.alert('Change Password', `Password reset instructions will be sent to ${email}.`, [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Request',
				onPress: () => {
					if (email) {
						sendEmail(email);
					}
				},
				style: 'default',
			},
		]);

		const sendEmail = async (e: string) => {
			try {
				await pb.collection('users').requestPasswordReset(e);
				Toast.show({
					type: 'success',
					text1: 'Password change email sent.',
					text2: 'Once changed, all devices will be logged out.',
				});
			} catch (error) {
				Toast.show({
					type: 'error',
					text1: 'Something went wrong.',
					text2: `${error}`,
				});
			}
		}
	}

	const toggleModelTraining = (allowed: boolean) => {
		settingsStore.setAllowModelTraining(allowed);
		if (!allowed) {
			Alert.alert('Important Privacy Note', 'Going forward, your Dogspotter images will no longer be used to train an image classifier model. However, depending on how long this setting was previously enabled, your images may have already been used in a previous data model.', [
				{
					text: 'I Understand',
					style: 'default',
				},
			]);
		}
	}

	return (
		<View>
			<CheckboxComponent text="Open to Camera" value={openToCamera} onChange={(state) => settingsStore.setOpenToCamera(state)} />
			<CheckboxComponent text="Show Advertisements" value={showAdvertisements} onChange={(state) => settingsStore.setShowAdvertisements(state)} />
			<CheckboxComponent text="Allow Model Training" value={allowModelTraining} onChange={(state) => toggleModelTraining(state)} />
			<CheckboxComponent text="Allow Analytics" value={allowAnalytics} onChange={(state) => settingsStore.setAllowAnalytics(state)} />
			<Text style={styles.header}>Account</Text>
			<View style={styles.accountSettings}>
				<TouchableOpacity onPress={changePassword}>
					<Text style={styles.accountSetting}>Change Password</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => { router.push('/(app)/(tabs)/account/change-email') }}>
					<Text style={styles.accountSetting}>Change Email</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	checkbox: {
		margin: 0,
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
	accountSettings: {
		marginTop: 8,
		flex: 1,
		flexDirection: 'column',
		gap: 12,
	},
	accountSetting: {
		fontSize: 16,
		color: '#007bff'
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 12,
	}
})