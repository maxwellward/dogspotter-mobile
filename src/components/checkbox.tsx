import { useEffect, useState } from "react";
import Checkbox from 'expo-checkbox';
import { StyleSheet, Text, Pressable } from "react-native";

interface Props {
	text: string;
	value: boolean;
	onChange: (value: boolean) => void;
}

export function CheckboxComponent(props: Props) {
	const [value, setValue] = useState(props.value);

	useEffect(() => {
		setValue(props.value);
	}, [props.value])

	const onChange = (state: boolean) => {
		setValue(state);
		props.onChange(state);
	}

	return (
		<Pressable style={styles.setting} onPress={() => onChange(!value)}>
			<Checkbox style={styles.checkbox} value={value} onValueChange={(state: boolean) => onChange(state)} />
			<Text style={styles.settingText}>{props.text}</Text>
		</Pressable>
	)
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
})