import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import pb from '@/lib/pocketbase';
import { useSession } from '@/hooks/auth-context';
import * as WebBrowser from 'expo-web-browser';
import LoadingSpinner from '@/components/loading-spinner';


export default function AuthScreen() {
	const { signIn, signUp } = useSession();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');
	const [registering, setRegistering] = useState(true);
	const [emailError, setEmailError] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmedPasswordError, setConfirmedPasswordError] = useState('');
	const [canSubmit, setCanSubmit] = useState(false);
	const [loading, setLoading] = useState(false);

	const login = async () => {
		setLoading(true);
		try {
			await signIn(email, password);
		} catch (err: any) {
			Toast.show({
				type: 'error',
				text1: err.message,
				text2: 'Please check your email and password and try again',
			});
		} finally {
			setLoading(false);
		}
	};

	const register = async () => {
		setLoading(true);
		try {
			await signUp(username, email, password)
		} catch (err: any) {
			Toast.show({
				type: 'error',
				text1: err.message,
				text2: 'Please check your email and password and try again',
			});
		} finally {
			setLoading(false);
		}
	}

	const requestPasswordReset = async () => {
		const validEmail = validateEmail();
		if (!validEmail) {
			setEmailError('Enter valid email for recovery');
			return
		};
		Alert.alert('Forgot Password?', `Password reset instructions will be sent to ${email}`, [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Yes please :(',
				onPress: async () => {
					if (email) {
						sendEmail();
					}
				},
				style: 'default',
			},
		]);

		const sendEmail = async () => {
			try {
				await pb.collection('users').requestPasswordReset(email);
				Toast.show({
					type: 'success',
					text1: 'Password change email sent.',
					text2: 'Once changed, all devices will be logged out.',
				});
			} catch (error) {
				Toast.show({
					type: 'error',
					text1: 'Something went wrong.',
					text2: `${error}`,
				});
			}
		}
	}

	const validateEmail = (): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isInvalid = !emailRegex.test(email);

		if (isInvalid) {
			setEmailError('Email is invalid');
			return false
		} else {
			setEmailError('');
			return true;
		}
	}

	const validatePassword = () => {
		const isInvalid = password.length < 8;

		if (isInvalid) {
			setPasswordError('Password too short (min. 8)');
		} else {
			setPasswordError('');
		}
	}

	const validateConfirmedPassword = (confirmed: string) => {
		const isInvalid = password !== confirmed;
		if (isInvalid) {
			setConfirmedPasswordError('Passwords do not match');
		} else {
			setConfirmedPasswordError('');
		}
	}

	const validateUsername = (username: string) => {
		const isInvalid = username.length < 3 || username.length > 24;
		if (isInvalid) {
			setUsernameError('Username must be 3-24 characters');
		} else {
			setUsernameError('');
		}
	}

	useEffect(() => {
		if (
			emailError ||
			passwordError ||
			(registering && confirmedPasswordError) ||
			(registering && usernameError) ||
			!email ||
			!password ||
			(registering && !confirmedPassword) ||
			(registering && !username)
		) {
			setCanSubmit(false);
		} else {
			setCanSubmit(true);
		}
	}, [emailError, passwordError, confirmedPasswordError, email, password, confirmedPassword, registering, usernameError, username]);

	return (
		<SafeAreaView style={styles.container}>
			<Toast />
			<View style={styles.inputView}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
					<Text>Email Address</Text>
					<Text style={styles.error}>{emailError}</Text>
				</View>
				<TextInput
					style={styles.input}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					onBlur={validateEmail}
					autoCapitalize="none"
				/>
			</View>

			{registering && (
				<View style={styles.inputView}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
						<Text>Username</Text>
						<Text style={styles.error}>{usernameError}</Text>
					</View>
					<TextInput
						style={styles.input}
						placeholder="Username"
						value={username}
						onChangeText={(text) => { setUsername(text); validateUsername(text); }}
						autoCapitalize="none"
					/>
				</View>
			)}

			<View style={styles.inputView}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
					<Text>Password</Text>
					<Text style={styles.error}>{passwordError}</Text>
				</View>
				<TextInput
					style={styles.input}
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					onBlur={validatePassword}
					secureTextEntry
				/>
			</View>
			{registering && (
				<View style={styles.inputView}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
						<Text>Confirm Password</Text>
						<Text style={styles.error}>{confirmedPasswordError}</Text>
					</View>
					<TextInput
						style={styles.input}
						placeholder="Confirm Password"
						value={confirmedPassword}
						onChangeText={(text) => { setConfirmedPassword(text); validateConfirmedPassword(text); }}
						secureTextEntry
					/>
				</View>
			)}

			{registering && <Text style={styles.terms}>
				By continuing, you are confirming you understand and agree to our
				<Text onPress={() => WebBrowser.openBrowserAsync('https://hastebin.com/share/jiwabumiya.sql')} style={{ fontWeight: 'bold', color: '#007bff' }}> terms of service</Text>
				<Text> and </Text>
				<Text onPress={() => WebBrowser.openBrowserAsync('https://hastebin.com/share/oyafijadiw.vbnet')} style={{ fontWeight: 'bold', color: '#007bff' }}>privacy policy</Text>
			</Text>}

			<TouchableOpacity
				style={canSubmit ? styles.button : styles.buttonDisabled}
				onPress={registering ? register : login}
				disabled={!canSubmit}
			>
				{loading ?
					<LoadingSpinner size={16} colour="white" />
					:
					<Text style={{ color: 'white' }}>
						{registering ? 'Register' : 'Login'}
					</Text>
				}
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.secondaryButton}
				onPress={() => setRegistering(!registering)}
			>
				<Text style={{ color: 'black', fontSize: 12 }}>
					{registering ? 'Or, Login' : 'Or, Register'}
				</Text>
			</TouchableOpacity>
			{!registering &&
				<TouchableOpacity
					style={[styles.secondaryButton, { marginTop: 10 }]}
					onPress={() => requestPasswordReset()}
				>
					<Text style={{ color: 'black', fontSize: 12 }}>
						Forgot Password
					</Text>
				</TouchableOpacity>
			}
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
	terms: {
		width: '80%',
		textAlign: 'center',
		marginVertical: 25,
	},
	inputView: {
		width: '80%',
		margin: 10,
	},
	button: {
		padding: 10,
		backgroundColor: '#007bff',
		borderRadius: 5,
		width: 90,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonDisabled: {
		padding: 10,
		backgroundColor: 'black',
		borderRadius: 5,
		width: 90,
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
	}
});