import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS = [
  { id: '1', title: 'Appointment in 30 min',  body: 'Max — Checkup at 09:00 · Ali Trabelsi',               time: '08:30 AM',  icon: 'calendar'              as const, color: '#5B8DEF', bg: '#EEF4FF', unread: true  },
  { id: '2', title: 'Critical Status Alert',  body: 'Rocky needs attention — respiratory distress',         time: '08:15 AM',  icon: 'warning'               as const, color: '#E35D5D', bg: '#FFEEEE', unread: true  },
  { id: '3', title: 'New Booking Request',    body: 'Charlie — Surgery follow-up requested by Karim',       time: '07:50 AM',  icon: 'calendar-outline'      as const, color: '#F09A3E', bg: '#FFF3E8', unread: false },
  { id: '4', title: 'Vaccination Reminder',   body: 'Luna — Annual vaccination due in 3 days',              time: 'Yesterday', icon: 'shield-checkmark'      as const, color: '#7DBE8A', bg: '#E8F7E8', unread: false },
];

const APPOINTMENTS = [
  { id: '1', pet: 'Max',     owner: 'Ali Trabelsi',    type: 'Checkup',     time: '09:00', status: 'confirmed', petType: 'Dog'  },
  { id: '2', pet: 'Luna',    owner: 'Sarra Mansouri',  type: 'Vaccination', time: '10:30', status: 'confirmed', petType: 'Cat'  },
  { id: '3', pet: 'Charlie', owner: 'Karim Ben Salah', type: 'Surgery',     time: '13:00', status: 'pending',   petType: 'Dog'  },
  { id: '4', pet: 'Bella',   owner: 'Nour Gharbi',     type: 'Dental',      time: '15:00', status: 'confirmed', petType: 'Cat'  },
];

const STATUS_COLOR: Record<string, string> = {
  confirmed: '#7DBE8A',
  pending:   '#F09A3E',
  cancelled: '#E35D5D',
};

const TYPE_COLOR: Record<string, { color: string; bg: string; icon: string }> = {
  Checkup:     { color: '#5B8DEF', bg: '#EEF4FF', icon: 'stethoscope'              },
  Vaccination: { color: '#7DBE8A', bg: '#E8F7E8', icon: 'shield-checkmark-outline' },
  Surgery:     { color: '#E35D5D', bg: '#FFEEEE', icon: 'cut-outline'              },
  Dental:      { color: '#F09A3E', bg: '#FFF3E8', icon: 'medical-outline'          },
};

const PET_ICON: Record<string, string> = { Dog: 'dog-side', Cat: 'cat', Bird: 'bird', default: 'paw' };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function VetDashboard() {
  const [vetName,     setVetName]     = useState('Doctor');
  const [clinic,      setClinic]      = useState('');
  const [specialty,   setSpecialty]   = useState('');
  const [showNotifs,  setShowNotifs]  = useState(false);
  const [readIds,     setReadIds]     = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('vetProfile').then(raw => {
        if (raw) {
          const p = JSON.parse(raw);
          setVetName(p.fullName        || 'Doctor');
          setClinic(p.clinicName       || '');
          setSpecialty(p.specialization || '');
        }
      });
    }, [])
  );

  const firstName = vetName.replace(/^Dr\.?\s*/i, '').split(' ')[0];

  const initials = vetName
    .replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const stats = [
    { label: 'Today',    value: '4',  icon: 'calendar',        color: '#5B8DEF', bg: '#EEF4FF' },
    { label: 'Patients', value: '28', icon: 'paw',             color: '#7DBE8A', bg: '#E8F7E8' },
    { label: 'Pending',  value: '1',  icon: 'time',            color: '#F09A3E', bg: '#FFF3E8' },
    { label: 'Done',     value: '3',  icon: 'checkmark-circle',color: '#7DBE8A', bg: '#E8F7E8' },
  ];

  const quickActions = [
    { label: 'Patients',     icon: 'paw-outline',          color: '#7DBE8A', bg: '#E8F7E8', onPress: () => router.push('/(vet-tabs)/patients'     as any) },
    { label: 'Schedule',     icon: 'calendar-outline',     color: '#5B8DEF', bg: '#EEF4FF', onPress: () => router.push('/(vet-tabs)/appointments' as any) },
    { label: 'My Profile',   icon: 'person-outline',       color: '#9B8DEF', bg: '#F0EEFF', onPress: () => router.push('/(vet-tabs)/vet-profile'  as any) },
    { label: 'Medical Rec.', icon: 'document-text-outline',color: '#F09A3E', bg: '#FFF3E8', onPress: () => router.push('/(vet-tabs)/medical-records' as any) },
  ];

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.overlay}>

          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.vetName}>Dr. {firstName}</Text>
              <Text style={styles.dateLabel}>{todayLabel()}</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => setShowNotifs(true)}>
              <Ionicons name="notifications-outline" size={22} color="#24364B" />
              {NOTIFICATIONS.some(n => n.unread && !readIds.includes(n.id)) && (
                <View style={styles.notifDot} />
              )}
            </TouchableOpacity>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials || '👨‍⚕️'}</Text>
            </View>
          </View>

          {/* Clinic + specialty strip */}
          {(!!clinic || !!specialty) && (
            <View style={styles.infoStrip}>
              {!!clinic && (
                <View style={styles.stripItem}>
                  <Ionicons name="business-outline" size={13} color="#5B8DEF" />
                  <Text style={styles.stripText}>{clinic}</Text>
                </View>
              )}
              {!!clinic && !!specialty && <View style={styles.stripDivider} />}
              {!!specialty && (
                <View style={styles.stripItem}>
                  <MaterialCommunityIcons name="stethoscope" size={13} color="#7DBE8A" />
                  <Text style={styles.stripText}>{specialty}</Text>
                </View>
              )}
              <View style={styles.stripDivider} />
              <View style={styles.stripItem}>
                <Ionicons name="shield-checkmark" size={13} color="#7DBE8A" />
                <Text style={[styles.stripText, { color: '#7DBE8A' }]}>Verified</Text>
              </View>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            {stats.map(s => (
              <View key={s.label} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                  <Ionicons name={s.icon as any} size={20} color={s.color} />
                </View>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Quick actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map(a => (
                <TouchableOpacity key={a.label} style={styles.actionCard} onPress={a.onPress} activeOpacity={0.8}>
                  <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
                    <Ionicons name={a.icon as any} size={24} color={a.color} />
                  </View>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Today's appointments */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
              <TouchableOpacity
                style={styles.seeAllBtn}
                onPress={() => router.push('/(vet-tabs)/appointments' as any)}
              >
                <Text style={styles.seeAllText}>See all</Text>
                <Ionicons name="chevron-forward" size={13} color="#7DBE8A" />
              </TouchableOpacity>
            </View>

            {APPOINTMENTS.map((appt, idx) => {
              const tc = TYPE_COLOR[appt.type] || TYPE_COLOR.Checkup;
              const isLast = idx === APPOINTMENTS.length - 1;
              return (
                <View key={appt.id} style={[styles.apptRow, isLast && { borderBottomWidth: 0 }]}>
                  {/* Time column */}
                  <View style={styles.apptTimeCol}>
                    <Text style={styles.apptTime}>{appt.time}</Text>
                    {!isLast && <View style={styles.apptLine} />}
                  </View>

                  {/* Card */}
                  <View style={[styles.apptCard, { borderLeftColor: tc.color }]}>
                    <View style={styles.apptCardTop}>
                      <View style={[styles.apptTypeIcon, { backgroundColor: tc.bg }]}>
                        <Ionicons name={tc.icon as any} size={15} color={tc.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.apptPet}>{appt.pet}
                          <Text style={styles.apptType}> · {appt.type}</Text>
                        </Text>
                        <Text style={styles.apptOwner}>{appt.owner}</Text>
                      </View>
                      <View style={[styles.statusPill, { backgroundColor: STATUS_COLOR[appt.status] + '22' }]}>
                        <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[appt.status] }]} />
                        <Text style={[styles.statusText, { color: STATUS_COLOR[appt.status] }]}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

        </View>
      </ScrollView>

      {/* Notification Panel */}
      <Modal visible={showNotifs} transparent animationType="slide" onRequestClose={() => setShowNotifs(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowNotifs(false)} />
        <View style={styles.notifPanel}>
          <View style={styles.notifPanelHandle} />

          <View style={styles.notifPanelHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.notifPanelTitle}>Notifications</Text>
              <Text style={styles.notifPanelSub}>
                {NOTIFICATIONS.filter(n => n.unread && !readIds.includes(n.id)).length} unread
              </Text>
            </View>
            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={() => setReadIds(NOTIFICATIONS.map(n => n.id))}
            >
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowNotifs(false)}>
              <Ionicons name="close" size={20} color="#24364B" />
            </TouchableOpacity>
          </View>

          {NOTIFICATIONS.map((n) => {
            const isUnread = n.unread && !readIds.includes(n.id);
            return (
              <TouchableOpacity
                key={n.id}
                style={[styles.notifItem, isUnread && styles.notifItemUnread]}
                activeOpacity={0.8}
                onPress={() => setReadIds(prev => prev.includes(n.id) ? prev : [...prev, n.id])}
              >
                <View style={[styles.notifIcon, { backgroundColor: n.bg }]}>
                  <Ionicons name={n.icon} size={18} color={n.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.notifTitle, isUnread && { color: '#24364B' }]}>{n.title}</Text>
                  <Text style={styles.notifBody}>{n.body}</Text>
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
                {isUnread && <View style={[styles.unreadDot, { backgroundColor: n.color }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(235,242,255,0.6)',
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  greeting:  { fontSize: 14, color: '#ffffff', fontWeight: '600' },
  vetName:   { fontSize: 25, fontWeight: '800', color: '#24364B', lineHeight: 28 },
  dateLabel: { fontSize: 14, color: '#fcfcfc', fontWeight: '500', marginTop: 2 },
  notifBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#0d0d0d',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#E35D5D', borderWidth: 1.5, borderColor: '#fff',
  },
  avatarCircle: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: '#7DBE8A',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#7DBE8A', shadowOpacity: 0.4, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },
  avatarInitials: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // Info strip
  infoStrip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9,
    marginBottom: 16, gap: 40,
    borderWidth: 1, borderColor: '#000000',
  },
  stripItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  stripText: { fontSize: 11, fontWeight: '700', color: '#000000' },
  stripDivider: { width: 1, height: 14, backgroundColor: '#000000', marginHorizontal: 4 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 5,
    shadowColor: '#000000', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statIcon:  { width: 36, height: 36, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#000000' },

  // Section
  section: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  sectionRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle:{ fontSize: 11, fontWeight: '800', color: '#000000', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 },
  seeAllBtn:   { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText:  { fontSize: 13, fontWeight: '700', color: '#7DBE8A' },

  // Quick actions
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: {
    width: '47%', backgroundColor: '#F7F9FC', borderRadius: 18,
    padding: 16, alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: '#EDF0F5',
  },
  actionIcon:  { width: 48, height: 48, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 12, fontWeight: '800', color: '#4B5D70', textAlign: 'center' },

  // Appointment timeline
  apptRow: {
    flexDirection: 'row', gap: 12, paddingBottom: 12, marginBottom: 6,
    borderBottomWidth: 1, borderBottomColor: '#F0F3F8',
  },
  apptTimeCol:  { width: 48, alignItems: 'center', paddingTop: 2 },
  apptTime:     { fontSize: 12, fontWeight: '800', color: '#4B6080' },
  apptLine:     { flex: 1, width: 2, backgroundColor: '#EDF0F5', borderRadius: 1, marginTop: 6 },
  apptCard: {
    flex: 1, backgroundColor: '#F7F9FC', borderRadius: 14,
    padding: 12, borderLeftWidth: 3,
  },
  apptCardTop:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  apptTypeIcon: { width: 30, height: 30, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  apptPet:      { fontSize: 14, fontWeight: '800', color: '#24364B' },
  apptType:     { fontSize: 13, fontWeight: '600', color: '#738295' },
  apptOwner:    { fontSize: 11, fontWeight: '600', color: '#9AAABB', marginTop: 2 },
  statusPill:   { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, gap: 4 },
  statusDot:    { width: 5, height: 5, borderRadius: 3 },
  statusText:   { fontSize: 10, fontWeight: '800' },

  // Notification modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  notifPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: 32,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 }, elevation: 16,
  },
  notifPanelHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#DDE3EE',
    alignSelf: 'center', marginTop: 12, marginBottom: 8,
  },
  notifPanelHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F0F3F8',
    gap: 10,
  },
  notifPanelTitle: { fontSize: 17, fontWeight: '800', color: '#24364B' },
  notifPanelSub:   { fontSize: 12, fontWeight: '600', color: '#9AAABB', marginTop: 1 },
  markAllBtn: {
    backgroundColor: '#F0EEFF', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  markAllText: { fontSize: 12, fontWeight: '700', color: '#9B8DEF' },
  closeBtn: {
    width: 34, height: 34, borderRadius: 11,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center', alignItems: 'center',
  },
  notifItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14, gap: 14,
    borderBottomWidth: 1, borderBottomColor: '#F7F9FC',
  },
  notifItemUnread: { backgroundColor: '#FAFBFF' },
  notifIcon: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  notifTitle: { fontSize: 13, fontWeight: '700', color: '#738295', marginBottom: 2 },
  notifBody:  { fontSize: 12, fontWeight: '500', color: '#9AAABB', lineHeight: 17, marginBottom: 4 },
  notifTime:  { fontSize: 11, fontWeight: '600', color: '#B8C2CE' },
  unreadDot:  { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
});
