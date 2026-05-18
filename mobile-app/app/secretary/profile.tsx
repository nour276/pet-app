import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const STATS = [
  { label: 'Appointments', value: '12', icon: 'calendar-outline', color: '#5B8DEF' },
  { label: 'Patients',     value: '48', icon: 'paw-outline',      color: '#7DBE8A' },
  { label: 'Messages',     value: '3',  icon: 'chatbubble-outline',color: '#9B8DEF' },
] as const;

const PERMISSIONS = [
  { icon: 'calendar-outline',      text: 'Manage appointments',   color: '#7DBE8A', allowed: true  },
  { icon: 'people-outline',        text: 'View & add patients',   color: '#5B8DEF', allowed: true  },
  { icon: 'chatbubble-outline',    text: 'Reply to messages',     color: '#9B8DEF', allowed: true  },
  { icon: 'document-text-outline', text: 'View medical records',  color: '#F09A3E', allowed: true  },
  { icon: 'create-outline',        text: 'Edit medical records',  color: '#E35D5D', allowed: false },
  { icon: 'cash-outline',          text: 'Manage billing',        color: '#E35D5D', allowed: false },
] as const;

export default function SecretaryProfile() {
  const router = useRouter();
  const [photoUri,   setPhotoUri]   = useState<string | null>(null);
  const [editMode,   setEditMode]   = useState(false);
  const [name,       setName]       = useState('Rania Bouzid');
  const [phone,      setPhone]      = useState('+216 55 789 012');
  const [email,      setEmail]      = useState('secretary@ritacare.com');
  const [department, setDepartment] = useState('Front Desk');

  async function pickPhoto(fromCamera: boolean) {
    const { status } = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to continue.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  function handlePhotoPress() {
    Alert.alert('Profile Photo', 'Choose an option', [
      { text: 'Take Photo',          onPress: () => pickPhoto(true)  },
      { text: 'Choose from Gallery', onPress: () => pickPhoto(false) },
      ...(photoUri
        ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: () => setPhotoUri(null) }]
        : []),
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function handleSave() {
    setEditMode(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  }

  function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => router.replace('/login') },
    ]);
  }

  return (
    <ImageBackground
      source={require('@/assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Secretary account</Text>
          </View>
          <TouchableOpacity
            style={[styles.editBtn, editMode && styles.editBtnActive]}
            onPress={editMode ? handleSave : () => setEditMode(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={editMode ? 'checkmark' : 'create-outline'}
              size={17}
              color={editMode ? '#fff' : '#5B8DEF'}
            />
            <Text style={[styles.editBtnText, editMode && styles.editBtnTextActive]}>
              {editMode ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Profile card ── */}
          <View style={styles.profileCard}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={handlePhotoPress}
              activeOpacity={0.85}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>RB</Text>
                </View>
              )}
              <View style={styles.cameraBtn}>
                <Ionicons name="camera" size={13} color="#fff" />
              </View>
            </TouchableOpacity>

            {editMode ? (
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.nameInput}
                placeholder="Full name"
                placeholderTextColor="#9AAABB"
              />
            ) : (
              <Text style={styles.name}>{name}</Text>
            )}

            <Text style={styles.emailLabel}>{email}</Text>

            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark-outline" size={13} color="#7DBE8A" />
              <Text style={styles.roleText}>Secretary Access</Text>
            </View>
          </View>

          {/* ── Stats row ── */}
          <View style={styles.statsRow}>
            {STATS.map(s => (
              <View key={s.label} style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: s.color + '22' }]}>
                  <Ionicons name={s.icon} size={18} color={s.color} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Account details ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Details</Text>

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#EBF2FF' }]}>
                <Ionicons name="call-outline" size={16} color="#5B8DEF" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                {editMode ? (
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.detailInput}
                    keyboardType="phone-pad"
                    placeholder="+216 XX XXX XXX"
                    placeholderTextColor="#9AAABB"
                  />
                ) : (
                  <Text style={styles.detailValue}>{phone}</Text>
                )}
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#F0EEFF' }]}>
                <Ionicons name="mail-outline" size={16} color="#9B8DEF" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                {editMode ? (
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.detailInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="email@clinic.com"
                    placeholderTextColor="#9AAABB"
                  />
                ) : (
                  <Text style={styles.detailValue}>{email}</Text>
                )}
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#E8F7EE' }]}>
                <Ionicons name="business-outline" size={16} color="#7DBE8A" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Department</Text>
                {editMode ? (
                  <TextInput
                    value={department}
                    onChangeText={setDepartment}
                    style={styles.detailInput}
                    placeholder="Department name"
                    placeholderTextColor="#9AAABB"
                  />
                ) : (
                  <Text style={styles.detailValue}>{department}</Text>
                )}
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#FFF4E8' }]}>
                <Ionicons name="time-outline" size={16} color="#F09A3E" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Working Hours</Text>
                <Text style={styles.detailValue}>Mon – Fri  ·  08:00 – 17:00</Text>
              </View>
            </View>
          </View>

          {/* ── Access permissions ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Access Permissions</Text>
            {PERMISSIONS.map((p, i) => (
              <View key={i}>
                {i > 0 && <View style={styles.detailDivider} />}
                <View style={styles.permRow}>
                  <View style={[styles.permIconBox, { backgroundColor: p.color + '1A' }]}>
                    <Ionicons name={p.icon} size={15} color={p.color} />
                  </View>
                  <Text style={styles.permText}>{p.text}</Text>
                  <Ionicons
                    name={p.allowed ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={p.allowed ? '#7DBE8A' : '#E35D5D'}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* ── Logout ── */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(235,242,255,0.6)',
    paddingTop: 58,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#24364B',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#EBF2FF',
    borderWidth: 1.5,
    borderColor: '#5B8DEF',
    marginTop: 4,
  },
  editBtnActive: {
    backgroundColor: '#5B8DEF',
    borderColor: '#5B8DEF',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B8DEF',
  },
  editBtnTextActive: { color: '#fff' },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    gap: 14,
  },

  /* ── Profile card ── */
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 26,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarImg: {
    width: 92,
    height: 92,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#7DBE8A',
  },
  avatarPlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: '#7DBE8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: '800',
    color: '#24364B',
    borderBottomWidth: 2,
    borderBottomColor: '#5B8DEF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
    minWidth: 180,
    textAlign: 'center',
  },
  emailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9AAABB',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F7E8',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  roleText: {
    color: '#7DBE8A',
    fontSize: 12,
    fontWeight: '800',
  },

  /* ── Stats ── */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#24364B',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9AAABB',
    textAlign: 'center',
  },

  /* ── Shared card ── */
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9AAABB',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  /* ── Detail rows ── */
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  detailContent: { flex: 1 },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AAABB',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#24364B',
  },
  detailInput: {
    fontSize: 14,
    fontWeight: '700',
    color: '#24364B',
    borderBottomWidth: 1.5,
    borderBottomColor: '#5B8DEF',
    paddingVertical: 2,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginLeft: 48,
  },

  /* ── Permissions ── */
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  permIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  permText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#24364B',
  },

  /* ── Logout ── */
  logoutBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#E35D5D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E35D5D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});
