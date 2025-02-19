import { Stack } from "expo-router";

export default function CameraLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Camera",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="review"
				options={{
					title: "Review",
					headerShown: false,
				}}
			/>
		</Stack>
	);
}