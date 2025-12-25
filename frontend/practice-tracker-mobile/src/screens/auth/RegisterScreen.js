import { useContext, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
    const { register } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {

        //validation
        if (!email || !username || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const result = await register(email, username, password);

        setIsLoading(false);

        if (result.success) {
            Alert.alert(
                'Success!',
                result.message,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login')
                    }
                ]
            );
        } else {
            Alert.alert('Registration Failed', result.error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>🎵</Text>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join Practice Tracker today</Text>
                </View>

                {/* Register Form */}
                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="your.email@example.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!isLoading}
                    />

                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Choose a username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        editable={!isLoading}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="At least 6 characters"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!isLoading}
                    />

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        editable={!isLoading}
                    />

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <TouchableOpacity
                        style={styles.linkContainer}
                        onPress={() => navigation.navigate('Login')}
                        disabled={isLoading}
                    >
                        <Text style={styles.linkText}>
                            Already have an account? <Text style={styles.linkBold}>Log In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  linkBold: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
