import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function VetLoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing information', 'Please enter your email and password.');
      return;
    }

    router.push('/vet/(tabs)/dashboard');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={require('../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" />

          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Image
              source={require('../assets/images/rita.jpeg')}
              style={styles.logo}
              resizeMode="cover"
            />

            <Text style={styles.title}>Vet Login</Text>
            <Text style={styles.subtitle}>
              Sign in to manage patients, appointments, and health alerts.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.formTitle}>Welcome back</Text>

            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <Ionicons name="mail-outline" size={20} color="#7B8EA3" />
              </View>

              <TextInput
                placeholder="Email"
                placeholderTextColor="#9AAABD"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <Ionicons name="lock-closed-outline" size={20} color="#7B8EA3" />
              </View>

              <TextInput
                placeholder="Password"
                placeholderTextColor="#9AAABD"
                style={styles.input}
                secureTextEntry={secureTextEntry}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={() => setSecureTextEntry(!secureTextEntry)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#7B8EA3"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerRow}>
              <Text style={styles.registerText}>Don’t have a vet account? </Text>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.bottomText}>
            Dedicated access for veterinarians and clinic staff.
          </Text>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
  },
  header: {
    alignItems: 'center',
    marginTop: 0.5,
  },
  logo: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#eaeaea',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 17,
  },
  card: {
     backgroundColor: 'rgba(242, 241, 247, 0.82)',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(220,230,240,0.85)',
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#24364B',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FBFE',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7DBE8A',
    marginBottom: 20,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIconBox: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#24364B',
  },
  eyeButton: {
    paddingLeft: 8,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 40,
    marginTop: 2,
  },
  forgotText: {
    fontSize: 13,
    color: '#7FA5C7',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#7DBE8A',
    height: 56,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  registerText: {
    fontSize: 13,
    color: '#6E8094',
  },
  registerLink: {
    fontSize: 13,
    color: '#76B78A',
    fontWeight: '700',
  },
  bottomText: {
    fontSize: 13,
    color: '#E0EAF3',
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 10,
  },
});