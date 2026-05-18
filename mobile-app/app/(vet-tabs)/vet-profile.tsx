import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Switch,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

type VetProfile = {
  fullName: string;
  email: string;
  phone: string;
  clinicName: string;
  specialization: string;
  licenseNumber: string;
};

type SecretaryProfile = { name: string; email: string };
type InfoModal = 'privacy' | 'terms' | 'help' | null;

export default function VetProfileScreen() {
  const [profile, setProfile] = useState<VetProfile>({
    fullName: 'Dr. Veterinarian', email: '', phone: '',
    clinicName: '', specialization: '', licenseNumber: '',
  });
  const [photoUri,      setPhotoUri]      = useState<string | null>(null);
  const [notifEnabled,  setNotifEnabled]  = useState(true);
  const [apptReminders, setApptReminders] = useState(true);
  const [isSecretary,   setIsSecretary]   = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editDraft,        setEditDraft]        = useState<VetProfile>(profile);

  const [secProfile,      setSecProfile]      = useState<SecretaryProfile | null>(null);
  const [secModalVisible, setSecModalVisible] = useState(false);
  const [secDraft,        setSecDraft]        = useState({ name: '', email: '', password: '' });

  const [infoModal, setInfoModal] = useState<InfoModal>(null);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const [profRaw, secRaw, secMode, photo] = await Promise.all([
          AsyncStorage.getItem('vetProfile'),
          AsyncStorage.getItem('secretaryProfile'),
          AsyncStorage.getItem('secretaryMode'),
          AsyncStorage.getItem('vetPhotoUri'),
        ]);
        if (profRaw) {
          const p: VetProfile = JSON.parse(profRaw);
          setProfile(p);
          setEditDraft(p);
        }
        if (secRaw) setSecProfile(JSON.parse(secRaw));
        setIsSecretary(secMode === 'true');
        if (photo) setPhotoUri(photo);
      };
      load();
    }, [])
  );

  const initials = profile.fullName
    .replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || 'DV';

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload a profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await AsyncStorage.setItem('vetPhotoUri', uri);
    }
  };

  const removePhoto = () => {
    Alert.alert('Remove Photo', 'Remove your profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          setPhotoUri(null);
          await AsyncStorage.removeItem('vetPhotoUri');
        },
      },
    ]);
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('vetProfile', JSON.stringify(editDraft));
      setProfile(editDraft);
      setEditModalVisible(false);
    } catch {
      Alert.alert('Error', 'Could not save profile.');
    }
  };

  const saveSecretary = async () => {
    if (!secDraft.name.trim() || !secDraft.email.trim() || !secDraft.password.trim()) {
      Alert.alert('Missing Info', 'Please fill in name, email, and password.');
      return;
    }
    try {
      const prof = { name: secDraft.name.trim(), email: secDraft.email.trim() };
      const cred = { email: secDraft.email.trim().toLowerCase(), password: secDraft.password };
      await AsyncStorage.multiSet([
        ['secretaryProfile',     JSON.stringify(prof)],
        ['secretaryCredentials', JSON.stringify(cred)],
      ]);
      setSecProfile(prof);
      setSecModalVisible(false);
    } catch {
      Alert.alert('Error', 'Could not save secretary access.');
    }
  };

  const removeSecretary = () => {
    Alert.alert('Remove Secretary', 'Are you sure you want to remove secretary access?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['secretaryProfile', 'secretaryCredentials']);
          setSecProfile(null);
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['userToken', 'secretaryMode']);
          router.replace('/login');
        },
      },
    ]);
  };

  const stats = [
    { label: 'Patients',   value: '28' },
    { label: 'Appts.',     value: '6'  },
    { label: 'Exp. (yrs)', value: '5'  },
  ];

  const infoRows = [
    { icon: 'mail-outline',     bg: '#FFF3E8', color: '#F09A3E', label: 'Email',          value: profile.email         },
    { icon: 'call-outline',     bg: '#E8F7E8', color: '#7DBE8A', label: 'Phone',          value: profile.phone || '—'  },
    { icon: 'business-outline', bg: '#EEF4FF', color: '#5B8DEF', label: 'Clinic',         value: profile.clinicName    },
    { icon: 'card-outline',     bg: '#F0EEFF', color: '#9B8DEF', label: 'License Number', value: profile.licenseNumber },
  ];

  /* ── Info modal content ── */
  const INFO_CONTENT: Record<NonNullable<InfoModal>, { title: string; icon: string; color: string; bg: string; sections: { heading: string; body: string }[] }> = {
    privacy: {
      title: 'Privacy Policy',
      icon: 'shield-checkmark-outline',
      color: '#5B8DEF',
      bg: '#EEF4FF',
      sections: [
        { heading: 'Data We Collect', body: 'We collect the information you provide when creating your account, including your name, email, phone number, clinic details, and professional license number. We also collect appointment and patient data you enter in the app.' },
        { heading: 'How We Use Your Data', body: 'Your data is used to operate the RitaCare+ platform, provide veterinary management features, send appointment reminders, and improve the app experience. We do not sell your personal data to third parties.' },
        { heading: 'Data Security', body: 'All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information. Access is restricted to authorized personnel only.' },
        { heading: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@ritacare.com to exercise these rights.' },
        { heading: 'Contact', body: 'For any privacy-related questions, email us at privacy@ritacare.com or visit ritacare.com/privacy.' },
      ],
    },
    terms: {
      title: 'Terms of Service',
      icon: 'document-text-outline',
      color: '#7DBE8A',
      bg: '#E8F7E8',
      sections: [
        { heading: 'Acceptance', body: 'By using RitaCare+, you agree to these Terms of Service. If you do not agree, please discontinue use of the app immediately.' },
        { heading: 'Professional Responsibility', body: 'RitaCare+ is a management tool and does not replace professional veterinary judgment. All clinical decisions remain the sole responsibility of the licensed veterinarian.' },
        { heading: 'Account', body: 'You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. Notify us immediately of any unauthorized access.' },
        { heading: 'Prohibited Use', body: 'You may not use the platform for unlawful purposes, to share false patient data, or to circumvent professional regulations. Violations may result in account termination.' },
        { heading: 'Changes', body: 'We may update these terms at any time. Continued use after changes constitutes acceptance. Full terms at ritacare.com/terms.' },
      ],
    },
    help: {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      color: '#F09A3E',
      bg: '#FFF3E8',
      sections: [
        { heading: '📧  Email Support', body: 'support@ritacare.com\nWe respond within 24 hours on business days.' },
        { heading: '📞  Phone Support', body: '+216 71 000 000\nMonday – Friday, 8 am – 6 pm (CET)' },
        { heading: '❓  FAQ – Can I add a secretary?', body: 'Yes! Go to My Profile → Secretary Access → Add Secretary Access. Your secretary can log in with their own credentials and manage appointments on your behalf.' },
        { heading: '❓  FAQ – How do I reset my password?', body: 'On the login screen, tap "Forgot Password?" and follow the email instructions sent to your registered address.' },
        { heading: '❓  FAQ – Is my patient data backed up?', body: 'Patient records entered in the app are stored locally on your device. We recommend taking regular exports from Settings for backup purposes.' },
        { heading: '🌐  Website', body: 'ritacare.com — documentation, video guides, and release notes.' },
      ],
    },
  };

  const activeInfo = infoModal ? INFO_CONTENT[infoModal] : null;

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.overlay}>

          {/* Secretary mode banner */}
          {isSecretary && (
            <View style={styles.secBanner}>
              <Ionicons name="person-outline" size={15} color="#9B8DEF" />
              <Text style={styles.secBannerText}>Secretary Mode — limited access</Text>
            </View>
          )}

          {/* Header row */}
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>My Profile</Text>
            {!isSecretary && (
              <TouchableOpacity style={styles.editBtn} onPress={() => { setEditDraft(profile); setEditModalVisible(true); }}>
                <Ionicons name="create-outline" size={18} color="#7DBE8A" />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Avatar card */}
          <View style={styles.avatarCard}>
            <TouchableOpacity onPress={pickPhoto} onLongPress={photoUri ? removePhoto : undefined} activeOpacity={0.85}>
              <View style={styles.avatarRing}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.avatarPhoto} />
                ) : (
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  </View>
                )}
                {/* Camera overlay */}
                <View style={styles.cameraOverlay}>
                  <Ionicons name="camera" size={14} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.photoHint}>
              {photoUri ? 'Tap to change · Long-press to remove' : 'Tap to add photo'}
            </Text>

            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
              <Text style={styles.verifiedText}>Verified Vet</Text>
            </View>

            <Text style={styles.nameText}>{profile.fullName}</Text>
            {!!profile.specialization && (
              <View style={styles.specialtyChip}>
                <MaterialCommunityIcons name="stethoscope" size={13} color="#7DBE8A" />
                <Text style={styles.specialtyText}>{profile.specialization}</Text>
              </View>
            )}
            {!!profile.clinicName && (
              <View style={styles.clinicRow}>
                <Ionicons name="business-outline" size={12} color="#9AAABB" />
                <Text style={styles.clinicText}>{profile.clinicName}</Text>
              </View>
            )}

            <View style={styles.statsRow}>
              {stats.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <View style={styles.statsDivider} />}
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Contact info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            {infoRows.map((row, i, arr) => (
              <View key={row.label} style={[styles.infoRow, i === arr.length - 1 && styles.lastRow]}>
                <View style={[styles.infoIcon, { backgroundColor: row.bg }]}>
                  <Ionicons name={row.icon as any} size={17} color={row.color} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value || '—'}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.toggleRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#EEF4FF' }]}>
                <Ionicons name="notifications-outline" size={17} color="#5B8DEF" />
              </View>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Switch value={notifEnabled} onValueChange={setNotifEnabled} trackColor={{ false: '#D0D7E2', true: '#7DBE8A' }} thumbColor="#fff" />
            </View>
            <View style={[styles.toggleRow, styles.lastRow]}>
              <View style={[styles.infoIcon, { backgroundColor: '#E8F7E8' }]}>
                <Ionicons name="calendar-outline" size={17} color="#7DBE8A" />
              </View>
              <Text style={styles.toggleLabel}>Appointment Reminders</Text>
              <Switch value={apptReminders} onValueChange={setApptReminders} trackColor={{ false: '#D0D7E2', true: '#7DBE8A' }} thumbColor="#fff" />
            </View>
          </View>

          {/* Secretary Access — hidden for secretary users */}
          {!isSecretary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Secretary Access</Text>
              {secProfile ? (
                <View style={[styles.infoRow, styles.lastRow]}>
                  <View style={[styles.infoIcon, { backgroundColor: '#F0EEFF' }]}>
                    <Ionicons name="person-add-outline" size={17} color="#9B8DEF" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Secretary</Text>
                    <Text style={styles.infoValue}>{secProfile.name}</Text>
                    <Text style={[styles.infoLabel, { marginTop: 2 }]}>{secProfile.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.secActionBtn}
                    onPress={() => { setSecDraft({ name: secProfile.name, email: secProfile.email, password: '' }); setSecModalVisible(true); }}
                  >
                    <Ionicons name="create-outline" size={16} color="#9B8DEF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secActionBtn, { backgroundColor: '#FFEEEE' }]} onPress={removeSecretary}>
                    <Ionicons name="close" size={16} color="#E35D5D" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.addSecRow, styles.lastRow]}
                  onPress={() => { setSecDraft({ name: '', email: '', password: '' }); setSecModalVisible(true); }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.infoIcon, { backgroundColor: '#F0EEFF' }]}>
                    <Ionicons name="person-add-outline" size={17} color="#9B8DEF" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoValue}>Add Secretary Access</Text>
                    <Text style={styles.infoLabel}>Allow a secretary to manage your schedule</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9B8DEF" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* More links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More</Text>
            {([
              { icon: 'shield-checkmark-outline', color: '#5B8DEF', bg: '#EEF4FF', label: 'Privacy Policy',  modal: 'privacy' as InfoModal },
              { icon: 'document-text-outline',    color: '#7DBE8A', bg: '#E8F7E8', label: 'Terms of Service', modal: 'terms'   as InfoModal },
              { icon: 'help-circle-outline',      color: '#F09A3E', bg: '#FFF3E8', label: 'Help & Support',   modal: 'help'    as InfoModal },
            ]).map((item, i, arr) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.linkRow, i === arr.length - 1 && styles.lastRow]}
                onPress={() => setInfoModal(item.modal)}
                activeOpacity={0.7}
              >
                <View style={[styles.infoIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={17} color={item.color} />
                </View>
                <Text style={styles.linkLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color="#B0BAC6" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <View style={styles.logoutIcon}>
              <Ionicons name="log-out-outline" size={20} color="#E35D5D" />
            </View>
            <Text style={styles.logoutText}>Log Out</Text>
            <Ionicons name="chevron-forward" size={16} color="#E35D5D" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <Text style={styles.version}>RitaCare+ v1.0.0 · Vet Portal</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="close" size={20} color="#738295" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 20 }}>
              {([
                { label: 'Full Name',      key: 'fullName',       placeholder: 'Dr. First Last',          secure: false },
                { label: 'Email',          key: 'email',          placeholder: 'your@email.com',          secure: false },
                { label: 'Phone',          key: 'phone',          placeholder: '+216 ...',                secure: false },
                { label: 'Clinic Name',    key: 'clinicName',     placeholder: 'Your clinic',             secure: false },
                { label: 'Specialization', key: 'specialization', placeholder: 'e.g. Surgery, Dentistry', secure: false },
                { label: 'License Number', key: 'licenseNumber',  placeholder: 'License #',               secure: false },
              ] as { label: string; key: keyof VetProfile; placeholder: string; secure: boolean }[]).map(field => (
                <View key={field.key}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      value={editDraft[field.key]}
                      onChangeText={v => setEditDraft(prev => ({ ...prev, [field.key]: v }))}
                      placeholder={field.placeholder}
                      placeholderTextColor="#9AAABB"
                      style={styles.input}
                      secureTextEntry={field.secure}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={saveProfile} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Secretary Access Modal */}
      <Modal visible={secModalVisible} animationType="slide" transparent onRequestClose={() => setSecModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Secretary Access</Text>
                <Text style={styles.modalSubtitle}>The secretary can log in to manage your appointments and patients.</Text>
              </View>
              <TouchableOpacity onPress={() => setSecModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="close" size={20} color="#738295" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 20 }}>
              {([
                { label: 'Full Name', key: 'name',     placeholder: 'Secretary full name',  secure: false },
                { label: 'Email',     key: 'email',    placeholder: 'secretary@email.com',  secure: false },
                { label: 'Password',  key: 'password', placeholder: 'Set a login password', secure: true  },
              ] as { label: string; key: 'name' | 'email' | 'password'; placeholder: string; secure: boolean }[]).map(field => (
                <View key={field.key}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      value={secDraft[field.key]}
                      onChangeText={v => setSecDraft(prev => ({ ...prev, [field.key]: v }))}
                      placeholder={field.placeholder}
                      placeholderTextColor="#9AAABB"
                      style={styles.input}
                      secureTextEntry={field.secure}
                      autoCapitalize="none"
                      keyboardType={field.key === 'email' ? 'email-address' : 'default'}
                    />
                  </View>
                </View>
              ))}
              <View style={styles.secHint}>
                <Ionicons name="information-circle-outline" size={14} color="#9B8DEF" />
                <Text style={styles.secHintText}>The secretary will use the main Login screen with these credentials.</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#9B8DEF' }]} onPress={saveSecretary} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Save Secretary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy / Terms / Help Modal */}
      <Modal visible={infoModal !== null} animationType="slide" transparent onRequestClose={() => setInfoModal(null)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.infoModalCard]}>
            <View style={styles.modalHandle} />

            {activeInfo && (
              <>
                <View style={styles.infoModalHeader}>
                  <View style={[styles.infoModalIcon, { backgroundColor: activeInfo.bg }]}>
                    <Ionicons name={activeInfo.icon as any} size={22} color={activeInfo.color} />
                  </View>
                  <Text style={styles.modalTitle}>{activeInfo.title}</Text>
                  <TouchableOpacity onPress={() => setInfoModal(null)} style={styles.modalClose}>
                    <Ionicons name="close" size={20} color="#738295" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.infoScroll}>
                  {activeInfo.sections.map((sec, i) => (
                    <View key={i} style={styles.infoSection}>
                      <Text style={[styles.infoSectionHeading, { color: activeInfo.color }]}>{sec.heading}</Text>
                      <Text style={styles.infoSectionBody}>{sec.body}</Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: activeInfo.color }]} onPress={() => setInfoModal(null)} activeOpacity={0.85}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.saveBtnText}>Got it</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { flexGrow: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(235,242,255,0.6)',
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  secBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F0EEFF', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8,
    marginBottom: 12, borderWidth: 1, borderColor: '#DDD0FF',
  },
  secBannerText: { fontSize: 13, fontWeight: '700', color: '#7B5CC4' },

  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 18,
  },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#24364B' },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#D4EDDA',
  },
  editBtnText: { fontSize: 13, fontWeight: '700', color: '#7DBE8A' },

  avatarCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 28, paddingVertical: 24, paddingHorizontal: 20,
    alignItems: 'center', marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  avatarRing: {
    width: 98, height: 98, borderRadius: 49,
    borderWidth: 3, borderColor: '#7DBE8A',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 6, position: 'relative',
  },
  avatarPhoto: {
    width: 86, height: 86, borderRadius: 43,
  },
  avatarCircle: {
    width: 86, height: 86, borderRadius: 43,
    backgroundColor: '#7DBE8A',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#7DBE8A', shadowOpacity: 0.35, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  avatarInitials: { fontSize: 28, fontWeight: '800', color: '#fff' },
  cameraOverlay: {
    position: 'absolute', bottom: 2, right: 2,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#7DBE8A',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  photoHint: {
    fontSize: 11, color: '#9AAABB', fontWeight: '600', marginBottom: 10,
  },

  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#7DBE8A', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4,
    marginBottom: 10,
  },
  verifiedText:  { fontSize: 11, fontWeight: '800', color: '#fff' },
  nameText:      { fontSize: 20, fontWeight: '800', color: '#24364B', marginBottom: 6 },
  specialtyChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#E8F7E8', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, marginBottom: 5,
  },
  specialtyText: { fontSize: 12, fontWeight: '700', color: '#4A8A55' },
  clinicRow:     { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 16 },
  clinicText:    { fontSize: 12, color: '#9AAABB', fontWeight: '600' },
  statsRow: {
    flexDirection: 'row', borderTopWidth: 1,
    borderTopColor: '#EDF0F5', paddingTop: 16, width: '100%',
  },
  statItem:    { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: 20, fontWeight: '800', color: '#24364B' },
  statLabel:   { fontSize: 10, color: '#738295', fontWeight: '600', marginTop: 3 },
  statsDivider:{ width: 1, backgroundColor: '#EDF0F5' },

  section: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 4,
    marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: '#9AAABB',
    letterSpacing: 0.8, textTransform: 'uppercase',
    paddingTop: 14, paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8', gap: 12,
  },
  lastRow:     { borderBottomWidth: 0 },
  infoIcon:    { width: 36, height: 36, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1 },
  infoLabel:   { fontSize: 11, color: '#9AAABB', fontWeight: '600' },
  infoValue:   { fontSize: 14, fontWeight: '700', color: '#24364B', marginTop: 2 },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8', gap: 12,
  },
  toggleLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#24364B' },

  secActionBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center', alignItems: 'center',
  },
  addSecRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, gap: 12,
  },

  linkRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8', gap: 12,
  },
  linkLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#24364B' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22, padding: 16, marginBottom: 16,
    borderWidth: 1.5, borderColor: '#FFD5D5',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  logoutIcon: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: '#FFEEEE', justifyContent: 'center', alignItems: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#E35D5D' },
  version:    { textAlign: 'center', fontSize: 12, color: '#B0BAC6', fontWeight: '600' },

  /* Shared modal */
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 32,
    borderTopRightRadius: 32, paddingHorizontal: 20,
    paddingTop: 12, paddingBottom: 34, maxHeight: '85%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#D0D7E2', alignSelf: 'center', marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 16, gap: 10,
  },
  modalTitle:    { fontSize: 20, fontWeight: '800', color: '#24364B', flex: 1 },
  modalSubtitle: { fontSize: 12, color: '#738295', marginTop: 4, lineHeight: 17 },
  modalClose: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#F0F3F8', justifyContent: 'center', alignItems: 'center',
  },
  inputLabel:   { fontSize: 13, fontWeight: '700', color: '#4B6080', marginBottom: 6 },
  inputWrapper: {
    backgroundColor: '#F7F9FC', borderRadius: 14,
    borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 14, height: 50, justifyContent: 'center',
  },
  input: { fontSize: 14, color: '#24364B' },

  secHint: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#F5F0FF', borderRadius: 10,
    padding: 10,
  },
  secHintText: { flex: 1, fontSize: 12, color: '#7B5CC4', lineHeight: 17 },

  saveBtn: {
    backgroundColor: '#7DBE8A', borderRadius: 18, height: 54,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 8,
    shadowColor: '#7DBE8A', shadowOpacity: 0.35, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  /* Info modal (privacy / terms / help) */
  infoModalCard: { maxHeight: '90%' },
  infoModalHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 16,
  },
  infoModalIcon: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  infoScroll: { gap: 16, paddingBottom: 20 },
  infoSection: {
    backgroundColor: '#F7F9FC', borderRadius: 16,
    padding: 14,
  },
  infoSectionHeading: {
    fontSize: 13, fontWeight: '800', marginBottom: 6,
  },
  infoSectionBody: {
    fontSize: 13, color: '#4B6080', lineHeight: 20,
  },
});
