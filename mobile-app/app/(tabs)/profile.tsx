import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const [ownerName, setOwnerName] = useState('Ayoub Nour');
  const [phone, setPhone] = useState('+216 XX XXX XXX');
  const [email, setEmail] = useState('example@email.com');

  const [mainPet, setMainPet] = useState('Buddy');
  const [petAge, setPetAge] = useState('3 years');
  const [petWeight, setPetWeight] = useState('30 kg');

  const handleSaveProfile = () => {
    setModalVisible(false);
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Profile</Text>

          <View style={styles.profileCard}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-circle" size={90} color="#5B8DEF" />
            </View>

            <Text style={styles.profileName}>{ownerName}</Text>
            <Text style={styles.profileInfo}>Pet Owner</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Owner Information</Text>

            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#5B8DEF" />
              <Text style={styles.infoText}>{ownerName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#67B56E" />
              <Text style={styles.infoText}>{phone}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#F09A3E" />
              <Text style={styles.infoText}>{email}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Pet Details</Text>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="dog" size={20} color="#67B56E" />
              <Text style={styles.infoText}>Main Pet: {mainPet}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#5B8DEF" />
              <Text style={styles.infoText}>Age: {petAge}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="weight-kilogram"
                size={20}
                color="#F09A3E"
              />
              <Text style={styles.infoText}>Weight: {petWeight}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#E35D5D" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.inputLabel}>Owner Name</Text>
            <TextInput
              style={styles.input}
              value={ownerName}
              onChangeText={setOwnerName}
              placeholder="Owner name"
              placeholderTextColor="#8A97A6"
            />

            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              placeholderTextColor="#8A97A6"
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#8A97A6"
            />

            <Text style={styles.inputLabel}>Main Pet</Text>
            <TextInput
              style={styles.input}
              value={mainPet}
              onChangeText={setMainPet}
              placeholder="Main pet"
              placeholderTextColor="#8A97A6"
            />

            <Text style={styles.inputLabel}>Pet Age</Text>
            <TextInput
              style={styles.input}
              value={petAge}
              onChangeText={setPetAge}
              placeholder="Pet age"
              placeholderTextColor="#8A97A6"
            />

            <Text style={styles.inputLabel}>Pet Weight</Text>
            <TextInput
              style={styles.input}
              value={petWeight}
              onChangeText={setPetWeight}
              placeholder="Pet weight"
              placeholderTextColor="#8A97A6"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  overlay: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingTop: 55,
    paddingBottom: 30,
    paddingHorizontal: 12,

  },
  title: {
  fontSize: 28,
  fontWeight: '800',
  color: '#24364B',
  marginBottom: 15,
  textAlign: 'center', // ✅ THIS is correct
},
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2162ab',
  },
  profileInfo: {
    fontSize: 14,
    color: '#738295',
    marginTop: 4,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5D70',
  },
  actionButton: {
    backgroundColor: '#5B8DEF',
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoutText: {
    color: '#E35D5D',
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#33465C',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#F7F8FB',
    borderWidth: 1,
    borderColor: '#D8DEE8',
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#24364B',
  },
  saveButton: {
    backgroundColor: '#5B8DEF',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});