import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState('Dr.Yassine Ktari');
  const [clinic, setClinic] = useState('RitaCare Veterinary Clinic');
  const [phone, setPhone] = useState('+216 12 345 678');
  const [hours, setHours] = useState('Mon - Fri, 08:00 - 17:00');

  const handleSave = () => {
    Alert.alert('Saved', 'Profile updated successfully.');
    router.back();
  };

  return (
    <ImageBackground
      source={require('@/assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#24364B" />
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Edit Profile</Text>

            <View style={styles.headerSpacer} />
          </View>

          <Text style={styles.pageSubtitle}>
            Update your clinic and personal information
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#8FA0B3"
            />

            <Text style={styles.label}>Clinic Name</Text>
            <TextInput
              style={styles.input}
              value={clinic}
              onChangeText={setClinic}
              placeholder="Enter clinic name"
              placeholderTextColor="#8FA0B3"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#8FA0B3"
            />

            <Text style={styles.label}>Working Hours</Text>
            <TextInput
              style={styles.input}
              value={hours}
              onChangeText={setHours}
              placeholder="Enter working hours"
              placeholderTextColor="#8FA0B3"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save-outline" size={18} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
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
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#24364B',
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#EAEAEA',
    marginBottom: 20,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(254, 254, 255, 0.81)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000811',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    minHeight: 50,
    borderRadius: 20,
    backgroundColor: '#c9dcc961',
    borderWidth: 1,
    borderColor: '#118e1af3',
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#0b0000',
  },
  saveButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#46af5b',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    marginLeft: 10,
  },
});