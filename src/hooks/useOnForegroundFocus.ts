import { useRef, useEffect } from "react";
import { AppState } from "react-native";

export const useOnForegroundFocus = (
	onFocus: () => void,
	runOnStartup: boolean | undefined = false
) => {
	const appState = useRef(AppState.currentState);

	useEffect(() => {
		const subscription = AppState.addEventListener('change', (nextAppState) => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === 'active'
			) {
				onFocus();
			}

			appState.current = nextAppState;
		});

		if (runOnStartup) {
			onFocus();
		}

		return () => {
			subscription?.remove();
		};
	}, [onFocus, runOnStartup]);
};