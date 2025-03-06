import { useState, useEffect } from "react";
import pb from "@/lib/pocketbase";
import { User } from "@/hooks/useUser";
import * as SecureStore from 'expo-secure-store';

export function useAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);

	useEffect(() => {
		function handleAuthChange() {
			setIsAuthenticated(pb.authStore.isValid);
		}

		pb.authStore.onChange(handleAuthChange);
	}, []);

	const login = async (email: string, password: string): Promise<User> => {
		const { token, record } = await pb.collection('users').authWithPassword(email.toLowerCase(), password);
		setIsAuthenticated(true);

		return {
			token,
			id: record.id,
			created: record.created,
			updated: record.updated,
			email: record.email,
			username: record.username,
			verified: record.verified,
			agreedToRules: record.agreedToRules,
			modelTrainingAllowed: record.modelTrainingAllowed,
			totalPoints: record.totalPoints,
		};
	}

	const register = async (username: string, email: string, password: string): Promise<{ token: string, record: object }> => {
		const data = {
			password,
			passwordConfirm: password,
			email: email.toLowerCase(),
			modelTrainingAllowed: true,
			username,
		};

		await pb.collection('users').create(data);
		await pb.collection('users').requestVerification(email.toLowerCase());

		setIsAuthenticated(true);

		const { token, record } = await pb.collection('users').authWithPassword(email.toLowerCase(), password);
		return { token, record };
	}

	const reauthenticate = async (): Promise<void> => {
		await pb.collection('users').authRefresh();
		setIsAuthenticated(pb.authStore.isValid)
	}

	const logout = async () => {
		pb.authStore.clear();
		setIsAuthenticated(false);
		await SecureStore.deleteItemAsync('session');
	};

	return { isAuthenticated, login, register, reauthenticate, logout };
}


