import { useContext, createContext, type PropsWithChildren } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import * as SecureStore from 'expo-secure-store';
import { useSettingsStore } from "@/store/useSettingsStore";
import { User } from "@/hooks/useUser";

const AuthContext = createContext<{
	signIn: (email: string, password: string) => void;
	signOut: () => void;
	signUp: (username: string, email: string, password: string) => void;
	reauthenticate: () => void;
	session?: string | null;
}>({
	signIn: (email, password) => null,
	signOut: () => null,
	signUp: (username, email, password) => null,
	reauthenticate: () => null,
	session: null,
});

// This hook can be used to access the user info.
export function useSession() {
	const value = useContext(AuthContext);
	if (!value) {
		throw new Error("useSession must be wrapped in a <SessionProvider />");
	}

	return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
	const router = useRouter();
	const { login, register, logout, reauthenticate } = useAuth();

	const setAllowModelTraining = useSettingsStore((state) => state.setAllowModelTraining);

	return (
		<AuthContext.Provider
			value={{
				signIn: async (email, password) => {
					const response: User = await login(email, password);
					await SecureStore.setItemAsync('session', JSON.stringify({ token: response.token, record: response }));

					if (response.modelTrainingAllowed) {
						setAllowModelTraining(true, true);
					} else {
						setAllowModelTraining(false, true);
					}

					if (!response.verified) {
						router.replace('/(auth)/verify')
						return;
					}

					if (!response.agreedToRules) {
						router.replace('/(auth)/rules')
						return;
					}

					router.replace('/(app)/(tabs)');
				},
				signOut: async () => {
					await logout();
					router.replace('/(auth)/sign-in');
				},
				signUp: async (username, email, password) => {
					const response = await register(username, email, password);
					await SecureStore.setItemAsync('session', JSON.stringify(response));
					router.replace('/(auth)/verify')
				},
				reauthenticate: async () => {
					await reauthenticate();
				},
				session: JSON.parse(SecureStore.getItem('session') ?? '{}'),
			}}>
			{children}
		</AuthContext.Provider>
	);
}

