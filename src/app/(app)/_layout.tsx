import { Redirect, Slot } from "expo-router";
import { useOnForegroundFocus } from "@/hooks/useOnForegroundFocus";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { usePostHog } from "posthog-react-native";

export default function AppLayout() {
	useOnForegroundFocus(async () => {
		const auth = await SecureStore.getItemAsync('session');
		if (!auth) return <Redirect href="/(auth)/sign-in" />;
	}, true);

	const settingsStore = useSettingsStore();
	const posthog = usePostHog();

	const [allowAnalytics, setAllowAnalytics] = useState<boolean>(settingsStore.allowAnalytics);

	useEffect(() => {
		setAllowAnalytics(settingsStore.allowAnalytics);

		if (allowAnalytics) {
			posthog.optIn()
		} else {
			posthog.optOut()
		}
	}, [settingsStore, posthog, allowAnalytics]);

	// This layout can be deferred because it's not the root layout.
	return <Slot />;
}