import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Modal,
  TextInput,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import VetMap from '@/components/VetMap';

export default function ProfileScreen() {
  const [editModal, setEditModal] = useState(false);
  const [ownerName, setOwnerName] = useState('Nour Ayoub');
  const [phone, setPhone] = useState('+216 XX XXX XXX');
  const [email, setEmail] = useState('example@email.com');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [petsCount, setPetsCount] = useState(2);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('pets').then(saved => {
        if (saved) {
          try { setPetsCount(JSON.parse(saved).length); } catch {}
        }
      });
      AsyncStorage.getItem('profilePhoto').then(p => { if (p) setProfilePhoto(p); });
    }, [])
  );

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photo library to set a profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setProfilePhoto(uri);
      await AsyncStorage.setItem('profilePhoto', uri);
    }
  };

  const handleLogout = () => router.replace('/login');

  const initials = ownerName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.overlay}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Profile</Text>
            <TouchableOpacity style={styles.editIconBtn} onPress={() => setEditModal(true)}>
              <Ionicons name="create-outline" size={20} color="#5B8DEF" />
            </TouchableOpacity>
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickPhoto} activeOpacity={0.85}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Text style={styles.initials}>{initials}</Text>
                </View>
              )}
              <View style={styles.cameraButton}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.profileName}>{ownerName}</Text>
            <Text style={styles.profileRole}>Pet Owner</Text>

            <View style={styles.emailRow}>
              <Ionicons name="mail-outline" size={14} color="#9AAABB" />
              <Text style={styles.profileEmail}>{email}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{petsCount}</Text>
                <Text style={styles.statLabel}>Pets</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>6</Text>
                <Text style={styles.statLabel}>Vet Visits</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>14</Text>
                <Text style={styles.statLabel}>Alerts</Text>
              </View>
            </View>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#EEF4FF' }]}>
                <Ionicons name="person-outline" size={18} color="#5B8DEF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{ownerName}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#E8F7E8' }]}>
                <Ionicons name="call-outline" size={18} color="#67B56E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{phone}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.infoIcon, { backgroundColor: '#FFF3E8' }]}>
                <Ionicons name="mail-outline" size={18} color="#F09A3E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{email}</Text>
              </View>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.toggleRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#EEF4FF' }]}>
                <Ionicons name="notifications-outline" size={18} color="#5B8DEF" />
              </View>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Switch value={notifEnabled} onValueChange={setNotifEnabled}
                trackColor={{ false: '#D0D7E2', true: '#5B8DEF' }} thumbColor="#fff" />
            </View>
            <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.infoIcon, { backgroundColor: '#E8F7E8' }]}>
                <Ionicons name="location-outline" size={18} color="#67B56E" />
              </View>
              <Text style={styles.toggleLabel}>Location Tracking</Text>
              <Switch value={locationEnabled} onValueChange={setLocationEnabled}
                trackColor={{ false: '#D0D7E2', true: '#67B56E' }} thumbColor="#fff" />
            </View>
          </View>

          {/* My Pets */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <TouchableOpacity style={[styles.linkRow, { borderBottomWidth: 0 }]} activeOpacity={0.7}
              onPress={() => router.push('/(tabs)' as any)}>
              <View style={[styles.infoIcon, { backgroundColor: '#E8F7E0' }]}>
                <Ionicons name="paw-outline" size={18} color="#88BC55" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkLabel}>Manage Pets</Text>
                <Text style={styles.linkSub}>{petsCount} pet{petsCount !== 1 ? 's' : ''} registered</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#B0BAC6" />
            </TouchableOpacity>
          </View>

          {/* Nearby Vets Map */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearby Vets</Text>
            <VetMap />
          </View>

          {/* More */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More</Text>
            {[
              { icon: 'shield-checkmark-outline', label: 'Privacy Policy', color: '#5B8DEF', bg: '#EEF4FF', onPress: () => Alert.alert('Privacy Policy', 'Our full privacy policy will be available soon.') },
              { icon: 'document-text-outline', label: 'Terms of Service', color: '#F09A3E', bg: '#FFF3E8', onPress: () => Alert.alert('Terms of Service', 'Our terms of service will be available soon.') },
              { icon: 'help-circle-outline', label: 'Help & Support', color: '#67B56E', bg: '#E8F7E8', onPress: () => Alert.alert('Help & Support', 'For assistance, contact us at support@ritacare.com') },
            ].map((item, i, arr) => (
              <TouchableOpacity key={item.label}
                style={[styles.linkRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}
                activeOpacity={0.7} onPress={item.onPress}>
                <View style={[styles.infoIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                <Text style={styles.linkLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color="#B0BAC6" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#E35D5D" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>RitaCare+ v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit modal */}
      <Modal visible={editModal} transparent animationType="slide" onRequestClose={() => setEditModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setEditModal(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Edit Profile</Text>
            {[
              { label: 'Full Name', value: ownerName, setter: setOwnerName },
              { label: 'Phone', value: phone, setter: setPhone },
              { label: 'Email', value: email, setter: setEmail },
            ].map(field => (
              <View key={field.label}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <TextInput style={styles.input} value={field.value}
                  onChangeText={field.setter} placeholder={field.label}
                  placeholderTextColor="#8A97A6" />
              </View>
            ))}
            <TouchableOpacity style={styles.saveButton} onPress={() => setEditModal(false)}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  overlay: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingTop: 58,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#24364B' },
  editIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#5B8DEF',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B8DEF',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  initials: { fontSize: 36, fontWeight: '800', color: '#fff' },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: { fontSize: 22, fontWeight: '800', color: '#24364B' },
  profileRole: {
    fontSize: 13,
    color: '#738295',
    fontWeight: '600',
    marginTop: 3,
    marginBottom: 6,
    backgroundColor: 'rgba(91,141,239,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 18,
  },
  profileEmail: { fontSize: 13, color: '#9AAABB', fontWeight: '500' },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EDF0F5',
    paddingTop: 16,
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#24364B' },
  statLabel: { fontSize: 11, color: '#738295', fontWeight: '600', marginTop: 3 },
  statDivider: { width: 1, backgroundColor: '#EDF0F5' },
  section: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9AAABB',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingTop: 14,
    paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#9AAABB', fontWeight: '600' },
  infoValue: { fontSize: 15, fontWeight: '700', color: '#24364B', marginTop: 2 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
    gap: 12,
  },
  toggleLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#24364B' },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
    gap: 12,
  },
  linkLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#24364B' },
  linkSub: { fontSize: 12, color: '#9AAABB', fontWeight: '600', marginTop: 1 },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(227,93,93,0.2)',
  },
  logoutText: { color: '#E35D5D', fontSize: 16, fontWeight: '800' },
  version: { textAlign: 'center', fontSize: 12, color: '#B0BAC6', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: '#D0D7E2',
    borderRadius: 2, alignSelf: 'center', marginBottom: 18,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#24364B', marginBottom: 16, textAlign: 'center' },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#4B5D70', marginBottom: 6, marginTop: 10 },
  input: {
    height: 50, borderRadius: 14, backgroundColor: '#F7F8FB',
    borderWidth: 1, borderColor: '#D8DEE8', paddingHorizontal: 14,
    fontSize: 15, color: '#24364B',
  },
  saveButton: {
    backgroundColor: '#5B8DEF', borderRadius: 18,
    paddingVertical: 16, alignItems: 'center', marginTop: 22,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
