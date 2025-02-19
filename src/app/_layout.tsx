import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import { SessionProvider } from "@/hooks/auth-context";
import { useOnForegroundFocus } from "@/hooks/useOnForegroundFocus";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/useUser";
import { useSettingsStore } from "@/store/useSettingsStore";
import { usePostHog, PostHogProvider } from 'posthog-react-native'
import { Text } from "react-native";

export default function RootLayout() {
	const router = useRouter();
	const { fetchUser } = useUser();


	useOnForegroundFocus(async () => {
		const openToCamera = useSettingsStore.getState().openToCamera;
		if (openToCamera) {
			router.replace('/camera');
		}

		const user = await fetchUser();

		if (!user) {
			router.replace('/(auth)/sign-in')
			return;
		};

		if (!user.verified) {
			router.replace('/(auth)/verify')
			return;
		}

		if (!user.agreedToRules) {
			router.replace('/(auth)/rules')
			return;
		}
	}, true);

	return (
		<PostHogProvider apiKey={process.env.EXPO_PUBLIC_POSTHOG_PUBLIC_API_KEY} options={{
			host: 'https://us.i.posthog.com',
		}}>
			<SessionProvider>
				<Slot />
				<StatusBar style="dark" />
			</SessionProvider>
		</PostHogProvider>
	);
}