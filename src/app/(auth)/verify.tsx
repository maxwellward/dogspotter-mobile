
import { useSession } from '@/hooks/auth-context';
import { useOnForegroundFocus } from '@/hooks/useOnForegroundFocus';
import pb from '@/lib/pocketbase';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, Text } from 'react-native';

export default function VerifyScreen() {
	const { reauthenticate, signOut } = useSession();
	const router = useRouter();

	const checkVerification = async () => {
		await reauthenticate();
		if (pb.authStore.record?.verified) {
			if (pb.authStore.record?.agreedToRules) {
				router.replace('/(app)/(tabs)');
			} else {
				router.replace('/(auth)/rules');
			}

		}
	}

	useOnForegroundFocus(checkVerification, true);

	return (
		<SafeAreaView>
			<Text>Verify</Text>
			<Pressable onPress={checkVerification}>
				<Text>I verified</Text>
			</Pressable>

			<Pressable onPress={signOut}>
				<Text>Get me out</Text>
			</Pressable>
		</SafeAreaView>
	);
}