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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterVetScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !clinicName.trim() ||
      !licenseNumber.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert('Missing information', 'Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.multiSet([
        [
          'vetProfile',
          JSON.stringify({
            fullName:       fullName.trim(),
            email:          email.trim(),
            phone:          phone.trim(),
            clinicName:     clinicName.trim(),
            specialization: specialization.trim(),
            licenseNumber:  licenseNumber.trim(),
          }),
        ],
        [
          'vetCredentials',
          JSON.stringify({ email: email.trim().toLowerCase(), password }),
        ],
      ]);
      router.replace('/(vet-tabs)');
    } catch {
      Alert.alert('Error', 'Could not save your profile. Please try again.');
    } finally {
      setLoading(false);
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
              onPress={() => router.replace('/choose-role' as any)}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#2B3B52" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Veterinarian</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="stethoscope" size={40} color="#7DBE8A" />
            </View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Register as a veterinarian to manage your patients and appointments.
            </Text>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#7DBE8A" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Dr. First Last"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Email *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#7DBE8A" />
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
                <Ionicons name="call-outline" size={20} color="#7DBE8A" />
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
              <Text style={styles.label}>Clinic Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="business-outline" size={20} color="#7DBE8A" />
                <TextInput
                  value={clinicName}
                  onChangeText={setClinicName}
                  placeholder="Enter your clinic name"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Specialization (optional)</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="certificate-outline" size={20} color="#7DBE8A" />
                <TextInput
                  value={specialization}
                  onChangeText={setSpecialization}
                  placeholder="e.g. Surgery, Dentistry"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>License Number *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={20} color="#7DBE8A" />
                <TextInput
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                  placeholder="Enter your license number"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#7DBE8A" />
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
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#7DBE8A" />
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
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EEF8F0',
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#dde1e8',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#7DBE8A',
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
  loginLink: { fontSize: 13, color: '#8FAFD6', fontWeight: '700' },
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    color: '#6D7A89',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
