import pb from "@/lib/pocketbase";
import * as SecureStore from 'expo-secure-store';

export interface User {
	token: string;
	id: string,
	created: Date,
	updated: Date,
	email: string,
	username: string,
	verified: boolean,
	agreedToRules: boolean,
	modelTrainingAllowed: boolean,
	totalPoints: number,
}

export function useUser() {
	const updateUser = async (data: Partial<User>) => {
		const session = JSON.parse(await SecureStore.getItemAsync('session') ?? '{}');
		if (!session) return;
		const { token, record } = await pb.collection("users").update(session.record.id, data);

		const updatedUser: User = {
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

		SecureStore.setItemAsync('session', JSON.stringify({ token, record: updatedUser }));
	}

	const fetchUser = async (): Promise<User | undefined> => {
		const session = await SecureStore.getItemAsync('session');

		if ((!pb.authStore.isValid || !pb.authStore.record) && session) {
			const auth = JSON.parse(session);
			await pb.authStore.save(auth.token, auth.record);
		};

		if (!pb.authStore.record) return;

		const record = await pb.collection("users").getOne(pb.authStore.record.id);

		const updatedUser: User = {
			token: pb.authStore.token,
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

		SecureStore.setItemAsync('session', JSON.stringify({ token: pb.authStore.token, record: updatedUser }));
		return updatedUser;
	}

	return { fetchUser, updateUser };
}
