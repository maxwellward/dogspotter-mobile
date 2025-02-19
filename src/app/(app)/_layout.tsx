import { Redirect, Slot } from "expo-router";
import { useOnForegroundFocus } from "@/hooks/useOnForegroundFocus";
import * as SecureStore from 'expo-secure-store';

export default function AppLayout() {
	useOnForegroundFocus(async () => {
		const auth = await SecureStore.getItemAsync('session');
		if (!auth) return <Redirect href="/(auth)/sign-in" />;
	}, true);

	// This layout can be deferred because it's not the root layout.
	return <Slot />;
}