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
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing information', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      setTimeout(async () => {
        await AsyncStorage.setItem('userToken', 'fake-token');
        Alert.alert('Success', 'Login successful');
        router.replace('/(tabs)');
      }, 800);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleNewUserFlow = async () => {
    try {
      await AsyncStorage.setItem('userToken', 'fake-token');
      router.replace('/add-pet');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.overlay}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.replace('/choose-role')}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#2B3B52" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Login</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.card}>
            <Image
              source={require('../assets/images/rita.jpeg')}
              style={styles.logo}
              resizeMode="cover"
            />

            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>
              Sign in to your account to monitor your pet&apos;s health and location.
            </Text>

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
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity>
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
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleNewUserFlow}
              >
                <FontAwesome name="google" size={20} color="#DB4437" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleNewUserFlow}
              >
                <FontAwesome name="facebook" size={20} color="#1877F2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerRow}
              onPress={handleNewUserFlow}
            >
              <Text style={styles.registerText}>Don&apos;t have an account? </Text>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By signing in you agree with Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  backButton: {
    width: 34,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#24364B',
  },
  headerSpacer: {
    width: 34,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(242, 241, 247, 0.82)',
    borderRadius: 30,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#dde1e8',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#080808',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#556273',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  inputBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#33465C',
    marginBottom: 8,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 12,
    color: '#7FA4CC',
    fontWeight: '500',
  },
  inputWrapper: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F7F8FB',
    borderWidth: 1,
    borderColor: '#D8DEE8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#24364B',
  },
  loginButton: {
    backgroundColor: '#8FAFD6',
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#56bd16',
  },
  dividerText: {
    fontSize: 12,
    color: '#4072ab',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  socialButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F7F8FB',
    borderWidth: 1,
    borderColor: '#D8DEE8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#064b9b',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  registerText: {
    fontSize: 13,
    color: '#6D7A89',
  },
  registerLink: {
    fontSize: 13,
    color: '#6FA15B',
    fontWeight: '700',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    color: '#6D7A89',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});