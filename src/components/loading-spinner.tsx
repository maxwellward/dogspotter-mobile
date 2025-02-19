import AntDesign from "@expo/vector-icons/AntDesign";
import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export type Props = {
	colour: string;
	size: number;
};

export default function LoadingSpinner(props: Props) {
	const spinValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 1500,
				useNativeDriver: true,
			})
		).start();
	}, [spinValue]);

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	return (
		<Animated.View style={{ transform: [{ rotate: spin }], width: props.size, height: props.size }}>
			<AntDesign name="loading2" size={props.size} color={props.colour} />
		</Animated.View>
	)
}