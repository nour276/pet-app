import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AddCaseScreen() {
  const router = useRouter();

  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'Dog' | 'Cat' | ''>('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState(false);

  const handleSaveCase = () => {
    if (
      !petName.trim() ||
      !petType ||
      !ownerName.trim() ||
      !symptoms.trim() ||
      !diagnosis.trim()
    ) {
      Alert.alert('Missing information', 'Please fill the important fields first.');
      return;
    }

    Alert.alert('Success', 'New case added successfully.');
    router.replace('/vet/(tabs)/patients');
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#24364B" />
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Add New Case</Text>

            <View style={styles.headerSpacer} />
          </View>

          <Text style={styles.pageSubtitle}>
            Create a new medical case for a pet
          </Text>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Pet Information</Text>

            <Text style={styles.label}>Pet Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter pet name"
              placeholderTextColor="#8FA0B3"
              value={petName}
              onChangeText={setPetName}
            />

            <Text style={styles.label}>Pet Type</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  petType === 'Dog' && styles.activeTypeButton,
                ]}
                onPress={() => setPetType('Dog')}
              >
                <Text
                  style={[
                    styles.typeText,
                    petType === 'Dog' && styles.activeTypeText,
                  ]}
                >
                  Dog
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  petType === 'Cat' && styles.activeTypeButton,
                ]}
                onPress={() => setPetType('Cat')}
              >
                <Text
                  style={[
                    styles.typeText,
                    petType === 'Cat' && styles.activeTypeText,
                  ]}
                >
                  Cat
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Breed</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter breed"
              placeholderTextColor="#8FA0B3"
              value={breed}
              onChangeText={setBreed}
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age"
              placeholderTextColor="#8FA0B3"
              value={age}
              onChangeText={setAge}
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Owner Information</Text>

            <Text style={styles.label}>Owner Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter owner name"
              placeholderTextColor="#8FA0B3"
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#8FA0B3"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Medical Information</Text>

            <Text style={styles.label}>Symptoms</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Describe symptoms"
              placeholderTextColor="#8FA0B3"
              multiline
              value={symptoms}
              onChangeText={setSymptoms}
            />

            <Text style={styles.label}>Diagnosis</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Enter diagnosis"
              placeholderTextColor="#8FA0B3"
              multiline
              value={diagnosis}
              onChangeText={setDiagnosis}
            />

            <Text style={styles.label}>Treatment / Prescription</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Enter treatment or prescription"
              placeholderTextColor="#8FA0B3"
              multiline
              value={treatment}
              onChangeText={setTreatment}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Additional notes"
              placeholderTextColor="#8FA0B3"
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.followUpRow}>
              <View>
                <Text style={styles.followUpTitle}>Follow-up Needed</Text>
                <Text style={styles.followUpSubtext}>
                  Turn on if this pet needs another visit
                </Text>
              </View>

              <Switch
                value={followUp}
                onValueChange={setFollowUp}
                trackColor={{ false: '#D6DEE8', true: '#A9D7B1' }}
                thumbColor={followUp ? '#7DBE8A' : '#FFFFFF'}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveCase}>
            <Ionicons name="save-outline" size={18} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Case</Text>
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
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
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
    fontSize: 14,
    color: '#EAEAEA',
    marginBottom: 18,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7C8F',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#F7F9FC',
    borderWidth: 1,
    borderColor: '#DCE5EF',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#24364B',
  },
  multilineInput: {
    minHeight: 90,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#7FA5C7',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B8FB1',
  },
  activeTypeText: {
    color: '#FFFFFF',
  },
  followUpRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followUpTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#24364B',
    marginBottom: 2,
  },
  followUpSubtext: {
    fontSize: 12.5,
    color: '#6B7C8F',
    maxWidth: 220,
  },
  saveButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#7DBE8A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
});