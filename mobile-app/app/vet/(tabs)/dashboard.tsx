import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function VetDashboardScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.name}>Dr. Yassine Ktari</Text>
              <Text style={styles.subtitle}>Here’s your clinic overview today</Text>
            </View>

            <TouchableOpacity onPress={() => router.push('/vet/(tabs)/profile')}>
              <Image
                source={require('../../../assets/images/yassine.jpg')}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/bookings')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#EEF4FF' }]}>
                <Ionicons name="calendar-outline" size={22} color="#7FA5C7" />
              </View>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Today’s Appointments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/bookings')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FDEDED' }]}>
                <Ionicons name="warning-outline" size={22} color="#D85B5B" />
              </View>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Emergency Cases</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/patients')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#EEF8F0' }]}>
                <Ionicons name="paw-outline" size={22} color="#7DBE8A" />
              </View>
              <Text style={styles.statNumber}>124</Text>
              <Text style={styles.statLabel}>Total Patients</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/chat')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FFF6EA' }]}>
                <Ionicons name="notifications-outline" size={22} color="#D08A3B" />
              </View>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Notifications</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Today’s Appointments</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.appointmentItem}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/bookings')}
            >
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>09:00</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>Bella</Text>
                <Text style={styles.itemSubtitle}>Routine check-up • Owner: Sarah</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8AA0B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.appointmentItem}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/bookings')}
            >
              <View style={[styles.timeBadge, { backgroundColor: '#EEF8F0' }]}>
                <Text style={[styles.timeText, { color: '#5F9B6B' }]}>11:30</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>Max</Text>
                <Text style={styles.itemSubtitle}>Temperature alert • Owner: Youssef</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8AA0B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.appointmentItem}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/bookings')}
            >
              <View style={[styles.timeBadge, { backgroundColor: '#FFF6EA' }]}>
                <Text style={[styles.timeText, { color: '#D08A3B' }]}>14:00</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>Luna</Text>
                <Text style={styles.itemSubtitle}>Vaccination visit • Owner: Meriem</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8AA0B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Emergency Cases</Text>
          <View style={styles.sectionCard}>
            <View style={styles.emergencyRow}>
              <View style={styles.emergencyLeft}>
                <View style={styles.emergencyIcon}>
                  <Ionicons name="alert-circle-outline" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.itemTitle}>Bella</Text>
                  <Text style={styles.itemSubtitle}>High temperature detected</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => router.push('/vet/(tabs)/patients')}
              >
                <Text style={styles.smallButtonText}>Open</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.emergencyRow}>
              <View style={styles.emergencyLeft}>
                <View style={styles.emergencyIcon}>
                  <Ionicons name="alert-circle-outline" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.itemTitle}>Max</Text>
                  <Text style={styles.itemSubtitle}>Left the safe zone</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => router.push('/vet/(tabs)/patients')}
              >
                <Text style={styles.smallButtonText}>Open</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent Patients</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.simpleRow}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/patients')}
            >
              <Ionicons name="paw" size={18} color="#7DBE8A" />
              <Text style={styles.simpleText}>Bella — last updated 2 hours ago</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.simpleRow}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/patients')}
            >
              <Ionicons name="paw" size={18} color="#7DBE8A" />
              <Text style={styles.simpleText}>Luna — vaccination completed</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.simpleRow}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/bookings')}
            >
              <Ionicons name="notifications-outline" size={18} color="#D08A3B" />
              <Text style={styles.simpleText}>New booking from Sarah for Bella</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.simpleRow}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/patients')}
            >
              <Ionicons name="warning-outline" size={18} color="#D85B5B" />
              <Text style={styles.simpleText}>Urgent alert received for Max</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.simpleRow}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/chat')}
            >
              <Ionicons name="chatbubble-outline" size={18} color="#7FA5C7" />
              <Text style={styles.simpleText}>New message from Meriem about Luna</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/patients')}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: '#EEF8F0' }]}>
                <Ionicons name="add-circle-outline" size={24} color="#7DBE8A" />
              </View>
              <Text style={styles.actionTitle}>Add Case</Text>
              <Text style={styles.actionSubtitle}>Create a new patient file</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/bookings')}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: '#EEF4FF' }]}>
                <Ionicons name="calendar-outline" size={24} color="#7FA5C7" />
              </View>
              <Text style={styles.actionTitle}>New Booking</Text>
              <Text style={styles.actionSubtitle}>Manage appointments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/chat')}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: '#FFF6EA' }]}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#D08A3B" />
              </View>
              <Text style={styles.actionTitle}>Open Chat</Text>
              <Text style={styles.actionSubtitle}>Answer pet owner questions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/(tabs)/patients')}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: '#F3EEFF' }]}>
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={24}
                  color="#8B7FD6"
                />
              </View>
              <Text style={styles.actionTitle}>Patients</Text>
              <Text style={styles.actionSubtitle}>View all pet records</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.35)' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 65, paddingBottom: 90 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: { flex: 1, paddingRight: 12 },
  greeting: { fontSize: 14, color: '#3a679a', marginBottom: 4 },
  name: { fontSize: 25, fontWeight: '700', color: '#24364B', marginBottom: 8 },
  subtitle: { fontSize: 17, color: '#fbfdff' },
  profileImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#020514',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  statCard: {
  width: '45%',
  backgroundColor: 'rgba(255,255,255,0.92)',
  borderRadius: 20,
  padding: 8,
  margin: 4,
  alignItems: 'center',   
  justifyContent: 'center', 

  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
},
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#24364B', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#6B7C8F', fontWeight: '600' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color:'#24364B',
    marginBottom: 14,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  appointmentItem: { flexDirection: 'row', alignItems: 'center' },
  timeBadge: {
    width: 68,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timeText: { fontSize: 14, fontWeight: '700', color: '#6B8FB1' },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#24364B', marginBottom: 3 },
  itemSubtitle: { fontSize: 13, color: '#6B7C8F', lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#E5ECF3', marginVertical: 14 },
  emergencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  emergencyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F28C8C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  smallButton: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  smallButtonText: { color: '#6B8FB1', fontWeight: '700', fontSize: 12 },
  simpleRow: { flexDirection: 'row', alignItems: 'center' },
  simpleText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 13.5,
    color: '#5F6E7D',
    lineHeight: 19,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: { fontSize: 16, fontWeight: '700', color: '#24364B', marginBottom: 6 },
  actionSubtitle: { fontSize: 12.5, lineHeight: 18, color: '#6B7C8F' },
});