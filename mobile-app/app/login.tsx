import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// ─── Forgot Password Modal ────────────────────────────────────────────────────

function ForgotPasswordModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [resetEmail, setResetEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleSend = async () => {
    setError('');
    if (!resetEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(resetEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  };

  const handleClose = () => {
    setResetEmail('');
    setSending(false);
    setSent(false);
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          {!sent ? (
            <>
              <View style={styles.modalIconCircle}>
                <Ionicons name="lock-open-outline" size={30} color="#5A8FD4" />
              </View>
              <Text style={styles.modalTitle}>Forgot Password?</Text>
              <Text style={styles.modalSubtitle}>
                Enter the email linked to your account and we'll send you a reset link.
              </Text>

              <View style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}>
                <Ionicons name="mail-outline" size={20} color={error ? '#E05B5B' : '#7DA66D'} />
                <TextInput
                  value={resetEmail}
                  onChangeText={(t) => { setResetEmail(t); setError(''); }}
                  placeholder="Your email address"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.resetButton, sending && styles.buttonDisabled]}
                onPress={handleSend}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={[styles.modalIconCircle, styles.modalIconSuccess]}>
                <Ionicons name="checkmark" size={34} color="#4CAF7D" />
              </View>
              <Text style={styles.modalTitle}>Check Your Inbox</Text>
              <Text style={styles.modalSubtitle}>
                A password reset link has been sent to{'\n'}
                <Text style={styles.emailHighlight}>{resetEmail.trim()}</Text>
              </Text>
              <Text style={styles.spamNote}>Didn't receive it? Check your spam folder.</Text>
              <TouchableOpacity style={styles.resetButton} onPress={handleClose}>
                <Text style={styles.resetButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main Login Screen ────────────────────────────────────────────────────────

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [forgotVisible, setForgotVisible] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter your email and password.');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const secCredRaw = await AsyncStorage.getItem('secretaryCredentials');
        if (secCredRaw) {
          const secCred = JSON.parse(secCredRaw);
          if (
            email.trim().toLowerCase() === secCred.email.trim().toLowerCase() &&
            password === secCred.password
          ) {
            await AsyncStorage.multiSet([
              ['userToken', 'secretary-token'],
              ['secretaryMode', 'true'],
            ]);
            router.replace('/secretary/dashboard' as any);
            return;
          }
        }

        const vetCredRaw = await AsyncStorage.getItem('vetCredentials');
        if (vetCredRaw) {
          const vetCred = JSON.parse(vetCredRaw);
          if (
            email.trim().toLowerCase() === vetCred.email.trim().toLowerCase() &&
            password === vetCred.password
          ) {
            await AsyncStorage.multiSet([
              ['userToken', 'vet-token'],
              ['secretaryMode', 'false'],
            ]);
            router.replace('/(vet-tabs)' as any);
            return;
          }
        }

        await AsyncStorage.setItem('userToken', 'fake-token');
        router.replace('/(tabs)');
      } catch {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading('google');
    try {
      // Simulates the OAuth redirect flow — replace with real Google client ID in production
      await new Promise((r) => setTimeout(r, 1200));
      Alert.alert(
        'Google Sign-In',
        'Google authentication requires a Google OAuth Client ID configured in your project. Set GOOGLE_CLIENT_ID in your app config to enable this feature.',
        [{ text: 'Got it', style: 'default' }]
      );
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebookSignIn = async () => {
    setSocialLoading('facebook');
    try {
      await new Promise((r) => setTimeout(r, 1200));
      Alert.alert(
        'Facebook Sign-In',
        'Facebook authentication requires a Facebook App ID configured in your project. Set FACEBOOK_APP_ID in your app config to enable this feature.',
        [{ text: 'Got it', style: 'default' }]
      );
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <>
      <ForgotPasswordModal visible={forgotVisible} onClose={() => setForgotVisible(false)} />

      <ImageBackground
        source={require('../assets/images/sky.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.overlay}>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => router.replace('/onboarding')}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color="#2B3B52" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Login</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Card */}
            <View style={styles.card}>
              <Image
                source={require('../assets/images/rita.jpeg')}
                style={styles.logo}
                resizeMode="cover"
              />

              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to monitor your pet's health and location.
              </Text>

              {/* Email */}
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#7DA66D" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#8A97A6"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputBlock}>
                <View style={styles.passwordLabelRow}>
                  <Text style={styles.label}>Password</Text>
                  <TouchableOpacity onPress={() => setForgotVisible(true)}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#7DA66D" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#8A97A6"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#8A97A6"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading || socialLoading !== null}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={handleGoogleSignIn}
                  disabled={loading || socialLoading !== null}
                  activeOpacity={0.85}
                >
                  {socialLoading === 'google' ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <FontAwesome5 name="google" size={16} color="#fff" solid />
                      <Text style={[styles.socialButtonText, styles.socialButtonTextLight]}>
                        Google
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={handleFacebookSignIn}
                  disabled={loading || socialLoading !== null}
                  activeOpacity={0.85}
                >
                  {socialLoading === 'facebook' ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <FontAwesome5 name="facebook-f" size={16} color="#fff" />
                      <Text style={[styles.socialButtonText, styles.socialButtonTextLight]}>
                        Facebook
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Register */}
              <TouchableOpacity
                style={styles.registerRow}
                onPress={() => router.push('/choose-role' as any)}
              >
                <Text style={styles.registerText}>Don't have an account? </Text>
                <Text style={styles.registerLink}>Create one</Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By signing in you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
}

//{style}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 60,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  backButton: { width: 34, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#24364B' },
  headerSpacer: { width: 34 },

  // Card
  card: {
    backgroundColor: 'rgba(242, 241, 247, 0.90)',
    borderRadius: 30,
    paddingTop: 24,
    paddingHorizontal: 18,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: '#dde1e8',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A2B3C',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#556273',
    textAlign: 'center',
    marginBottom: 22,
    paddingHorizontal: 8,
  },

  // Inputs
  inputBlock: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#33465C', marginBottom: 7 },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: { fontSize: 12, color: '#5A8FD4', fontWeight: '600' },
  inputWrapper: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F7F8FB',
    borderWidth: 1.5,
    borderColor: '#D8DEE8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  inputWrapperError: { borderColor: '#E05B5B' },
  input: { flex: 1, fontSize: 15, color: '#24364B' },
  errorText: { fontSize: 12, color: '#d10000', marginTop: 5, marginLeft: 4 },

  // Login button
  loginButton: {
    backgroundColor: '#4A80C4',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 18,
    shadowColor: '#4A80C4',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  buttonDisabled: { opacity: 0.65 },
  loginButtonText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#CBD5E0' },
  dividerText: { fontSize: 12, color: '#7A8A9A', fontWeight: '500' },

  // Social buttons
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  socialButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  googleButton: {
    backgroundColor: '#EA4335',
    shadowColor: '#EA4335',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    shadowColor: '#1877F2',
  },
  socialButtonText: { fontSize: 14, fontWeight: '700' },
  socialButtonTextLight: { color: '#fff' },

  // Register
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  registerText: { fontSize: 13, color: '#6D7A89' },
  registerLink: { fontSize: 13, color: '#4CAF7D', fontWeight: '700' },

  // Terms
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    color: '#8A97A6',
    paddingHorizontal: 10,
  },
  termsLink: { color: '#5A8FD4', fontWeight: '600' },

  //{ Password }
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF2FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconSuccess: { backgroundColor: '#E8F8EF' },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A2B3C',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#556273',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emailHighlight: { fontWeight: '700', color: '#4A80C4' },
  spamNote: {
    fontSize: 12,
    color: '#8A97A6',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
  resetButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: '#4A80C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4A80C4',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  resetButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cancelButton: { paddingVertical: 6 },
  cancelText: { fontSize: 14, color: '#8A97A6', fontWeight: '500' },
});
