import { Stack } from "expo-router";

export default function AccountLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Account",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="saved"
				options={{
					title: "Saved",
					headerShown: true,
					headerBackTitle: 'Account',
				}}
			/>
			<Stack.Screen
				name="change-email"
				options={{
					title: "Change Email",
					headerShown: true,
					headerBackTitle: 'Account',
				}}
			/>
		</Stack>
	);
}