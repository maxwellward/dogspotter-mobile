import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import LoadingSpinner from '@/components/loading-spinner';


export default function ChangeEmailScreen() {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [canSubmit, setCanSubmit] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const changeEmail = async () => {
		setSubmitting(true);
		try {
			// if (!pb.authStore.record) throw Error('No user record found');
			// await dispatch(signIn({ email: pb.authStore.record.email, password })).unwrap();
			// await pb.collection('users').requestEmailChange(email);
			router.back();
			Toast.show({
				type: 'success',
				text1: 'Verification email sent.',
				text2: 'Please check your new email to confirm.',
			});
		} catch (err: any) {
			Toast.show({
				type: 'error',
				text1: 'Something went wrong.',
				text2: err.message,
			});
		} finally {
			setSubmitting(false);
		}
	};

	const validateEmail = async () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isInvalid = !emailRegex.test(email);

		if (isInvalid) {
			setEmailError('Email is invalid');
		} else {
			setEmailError('');
		}
	}

	const validatePassword = async () => {
		const isInvalid = password.length < 8;

		if (isInvalid) {
			setPasswordError('Password too short (min. 8)');
		} else {
			setPasswordError('');
		}
	}

	useEffect(() => {
		if (
			emailError ||
			passwordError ||
			!email ||
			!password
		) {
			setCanSubmit(false);
		} else {
			setCanSubmit(true);
		}
	}, [emailError, passwordError, email, password]);

	return (
		<SafeAreaView style={styles.container}>
			<Toast />

			<View style={styles.warning}>
				<Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Warning</Text>
				<Text>Changing your email to an email you do not own could result in you losing access to your Dogspotter account.</Text>
				<Text style={{ marginTop: 8 }}>Check your new email to finish the email-change process.</Text>
			</View>

			<View style={styles.inputView}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
					<Text>New Email Address</Text>
					<Text style={styles.error}>{emailError}</Text>
				</View>
				<TextInput
					style={styles.input}
					placeholder="New Email"
					value={email}
					onChangeText={setEmail}
					onBlur={validateEmail}
					autoCapitalize="none"
				/>
			</View>

			<View style={styles.inputView}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
					<Text>Current Password</Text>
					<Text style={styles.error}>{passwordError}</Text>
				</View>
				<TextInput
					style={styles.input}
					placeholder="Current Password"
					value={password}
					onChangeText={setPassword}
					onBlur={validatePassword}
					secureTextEntry
				/>
			</View>

			<TouchableOpacity
				style={canSubmit ? styles.button : styles.buttonDisabled}
				onPress={changeEmail}
				disabled={!canSubmit}
			>
				{submitting ?
					<LoadingSpinner size={16} colour="white" />
					:
					<Text style={{ color: 'white' }}>
						Change Email
					</Text>
				}
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5
	},
	inputView: {
		width: '80%',
		margin: 10,
	},
	button: {
		padding: 10,
		backgroundColor: 'red',
		borderRadius: 5,
		width: 120,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonDisabled: {
		padding: 10,
		backgroundColor: 'black',
		borderRadius: 5,
		width: 120,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	secondaryButton: {
		padding: 10,
	},
	error: {
		color: 'red',
		fontWeight: 'bold',
	},
	warning: {
		borderColor: 'red',
		borderWidth: 1,
		backgroundColor: '#ffcccc',
		padding: 16,
		borderRadius: 5,
		marginBottom: 32,
		width: '80%',
	}
});