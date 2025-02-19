import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="camera"
				options={{
					title: "Camera",
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons name={focused ? 'camera' : 'camera-outline'} color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: "Account",
					tabBarIcon: ({ color, size, focused }) => (
						<MaterialCommunityIcons name={focused ? 'account' : 'account-outline'} color={color} size={size} />
					),
				}}
			/>
		</Tabs>
	);
}
