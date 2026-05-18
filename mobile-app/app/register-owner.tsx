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
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RegisterOwnerScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing information', 'Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/add-pet' as any);
    }, 800);
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
              onPress={() => router.replace('/choose-role' as any)}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#2B3B52" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pet Owner</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.card}>
            <Image
              source={require('../assets/images/rita.jpeg')}
              style={styles.logo}
              resizeMode="cover"
            />

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Register as a pet owner to monitor your pet&apos;s health and location.
            </Text>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#7DA66D" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                />
              </View>
            </View>

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
              <Text style={styles.label}>Phone (optional)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color="#7DA66D" />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#7DA66D" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#8A97A6"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#7DA66D" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat your password"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(p => !p)}>
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#8A97A6"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating account...' : 'Register'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginRow}
              onPress={() => router.push('/login' as any)}
            >
              <Text style={styles.loginText}>Already have an account? </Text>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By registering you agree with Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

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
  inputBlock: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#33465C', marginBottom: 8 },
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
  input: { flex: 1, fontSize: 15, color: '#24364B' },
  registerButton: {
    backgroundColor: '#8FAFD6',
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.7 },
  registerButtonText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  loginText: { fontSize: 13, color: '#6D7A89' },
  loginLink: { fontSize: 13, color: '#6FA15B', fontWeight: '700' },
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    color: '#6D7A89',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
