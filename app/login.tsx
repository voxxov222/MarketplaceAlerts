import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/layout/Screen';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    console.log('Starting authentication...', { isSignUp, email });
    setLoading(true);
    
    try {
      const result = isSignUp
        ? await signUp(email, password, fullName)
        : await signIn(email, password);
      
      console.log('Auth result:', { error: result.error?.message });
      setLoading(false);

      if (result.error) {
        const errorMsg = result.error.message || 'Authentication failed';
        console.error('Auth error:', errorMsg);
        Alert.alert('Error', errorMsg);
      } else if (isSignUp) {
        console.log('Sign up successful');
        Alert.alert(
          'Success',
          'Account created successfully!',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        console.log('Sign in successful');
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Marketplace Alerts</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Create your account' : 'Sign in to continue'}
            </Text>
          </View>

          <View style={styles.form}>
            {isSignUp && (
              <Input
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your name"
                autoCapitalize="words"
              />
            )}

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title={isSignUp ? 'Sign Up' : 'Sign In'}
              onPress={handleSubmit}
              loading={loading}
              fullWidth
              size="lg"
            />

            <Button
              title={isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              onPress={() => setIsSignUp(!isSignUp)}
              variant="ghost"
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },

  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  form: {
    gap: theme.spacing.md,
  },
});
