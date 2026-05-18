import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TODAY_APPOINTMENTS = [
  { id: 1, pet: 'Max',     owner: 'Ali Trabelsi',    time: '09:00', type: 'Checkup',     status: 'Confirmed' },
  { id: 2, pet: 'Luna',    owner: 'Sarra Mansouri',  time: '10:30', type: 'Vaccination', status: 'Pending'   },
  { id: 3, pet: 'Charlie', owner: 'Karim Ben Salah', time: '13:00', type: 'Follow-up',   status: 'Confirmed' },
  { id: 4, pet: 'Bella',   owner: 'Nour Gharbi',     time: '15:30', type: 'Checkup',     status: 'Confirmed' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function apptDate(time: string) {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export default function SecretaryDashboard() {
  const router = useRouter();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const nextAppt = TODAY_APPOINTMENTS.find(a => apptDate(a.time) > now);
  const pending  = TODAY_APPOINTMENTS.filter(a => a.status === 'Pending').length;

  return (
    <ImageBackground
      source={require('@/assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >

          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.nameText}>Secretary</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={13} color="#9B8DEF" />
                <Text style={styles.dateText}>{formatDate()}</Text>
              </View>
            </View>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={26} color="#fff" />
            </View>
          </View>

          {/* ── Stats ── */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderTopColor: '#7DBE8A' }]}>
              <Ionicons name="calendar" size={20} color="#7DBE8A" />
              <Text style={[styles.statNum, { color: '#7DBE8A' }]}>{TODAY_APPOINTMENTS.length}</Text>
              <Text style={styles.statLbl}>Today</Text>
            </View>

            <View style={[styles.statCard, { borderTopColor: '#F09A3E' }]}>
              <Ionicons name="time" size={20} color="#F09A3E" />
              <Text style={[styles.statNum, { color: '#F09A3E' }]}>{pending}</Text>
              <Text style={styles.statLbl}>Pending</Text>
            </View>

            <View style={[styles.statCard, { borderTopColor: '#5B8DEF' }]}>
              <MaterialCommunityIcons name="paw" size={20} color="#5B8DEF" />
              <Text style={[styles.statNum, { color: '#5B8DEF' }]}>5</Text>
              <Text style={styles.statLbl}>Patients</Text>
            </View>

            <View style={[styles.statCard, { borderTopColor: '#9B8DEF' }]}>
              <Ionicons name="chatbubble" size={18} color="#9B8DEF" />
              <Text style={[styles.statNum, { color: '#9B8DEF' }]}>2</Text>
              <Text style={styles.statLbl}>Messages</Text>
            </View>
          </View>

          {/* ── Next Appointment ── */}
          {nextAppt ? (
            <View style={styles.nextCard}>
              <View style={styles.nextHeader}>
                <Ionicons name="arrow-forward-circle" size={16} color="#7DBE8A" />
                <Text style={styles.nextHeaderText}>Next Appointment</Text>
              </View>
              <View style={styles.nextBody}>
                <View style={styles.nextTimeBubble}>
                  <Text style={styles.nextTimeText}>{nextAppt.time}</Text>
                </View>
                <View style={styles.nextInfo}>
                  <Text style={styles.nextPet}>{nextAppt.pet}</Text>
                  <Text style={styles.nextOwner}>{nextAppt.owner}</Text>
                  <View style={styles.nextTypePill}>
                    <Text style={styles.nextTypeText}>{nextAppt.type}</Text>
                  </View>
                </View>
                <View style={[
                  styles.nextStatusBadge,
                  nextAppt.status === 'Pending' ? styles.pendingBg : styles.confirmedBg,
                ]}>
                  <Text style={[
                    styles.nextStatusText,
                    nextAppt.status === 'Pending' ? styles.pendingTxt : styles.confirmedTxt,
                  ]}>
                    {nextAppt.status}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.allDoneCard}>
              <Ionicons name="checkmark-circle" size={26} color="#7DBE8A" />
              <Text style={styles.allDoneText}>All appointments done for today!</Text>
            </View>
          )}

          {/* ── Today's Schedule ── */}
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <View style={styles.scheduleCard}>
            {TODAY_APPOINTMENTS.map((item, idx) => {
              const past = apptDate(item.time) < now;
              const isLast = idx === TODAY_APPOINTMENTS.length - 1;
              return (
                <View key={item.id} style={[styles.scheduleRow, isLast && { paddingBottom: 0 }]}>
                  {/* timeline */}
                  <View style={styles.timelineCol}>
                    <View style={[
                      styles.timelineDot,
                      { backgroundColor: past ? '#C8D5E2' : item.status === 'Pending' ? '#F09A3E' : '#7DBE8A' },
                    ]} />
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>

                  <View style={[styles.scheduleContent, isLast && { borderBottomWidth: 0 }]}>
                    <Text style={[styles.scheduleTime, past && styles.mutedText]}>{item.time}</Text>
                    <View style={styles.scheduleMain}>
                      <Text style={[styles.schedulePet, past && styles.mutedText]}>{item.pet}</Text>
                      <Text style={[styles.scheduleOwner, past && styles.mutedText]}>{item.owner}</Text>
                    </View>
                    <View style={[
                      styles.scheduleTypePill,
                      item.status === 'Pending' ? styles.pendingBg : styles.confirmedBg,
                    ]}>
                      <Text style={[
                        styles.scheduleTypeText,
                        item.status === 'Pending' ? styles.pendingTxt : styles.confirmedTxt,
                      ]}>
                        {item.type}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── Quick Actions ── */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionTile, { backgroundColor: '#E8F7EE' }]}
              onPress={() => router.push('/secretary/appointments' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBg, { backgroundColor: '#7DBE8A22' }]}>
                <Ionicons name="calendar-outline" size={26} color="#7DBE8A" />
              </View>
              <Text style={[styles.actionTileTitle, { color: '#3A8A52' }]}>Appointments</Text>
              <Text style={styles.actionTileDesc}>{TODAY_APPOINTMENTS.length} today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionTile, { backgroundColor: '#EEF4FF' }]}
              onPress={() => router.push('/secretary/patients' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBg, { backgroundColor: '#5B8DEF22' }]}>
                <MaterialCommunityIcons name="paw-outline" size={26} color="#5B8DEF" />
              </View>
              <Text style={[styles.actionTileTitle, { color: '#3A6FD8' }]}>Patients</Text>
              <Text style={styles.actionTileDesc}>5 registered</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionTile, { backgroundColor: '#F3F0FF' }]}
              onPress={() => router.push('/secretary/messages' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBg, { backgroundColor: '#9B8DEF22' }]}>
                <Ionicons name="chatbubble-outline" size={25} color="#9B8DEF" />
              </View>
              <Text style={[styles.actionTileTitle, { color: '#7A5DD8' }]}>Messages</Text>
              <Text style={styles.actionTileDesc}>2 unread</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionTile, { backgroundColor: '#FFF4E8' }]}
              onPress={() => router.push('/secretary/profile' as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBg, { backgroundColor: '#F09A3E22' }]}>
                <Ionicons name="person-circle-outline" size={27} color="#F09A3E" />
              </View>
              <Text style={[styles.actionTileTitle, { color: '#C77B25' }]}>Profile</Text>
              <Text style={styles.actionTileDesc}>My account</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(235,242,255,0.55)',
  },

  scroll: {
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 110,
    gap: 14,
  },

  /* header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  headerLeft: { gap: 2 },
  greeting: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  nameText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#24364B',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7DBE8A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7DBE8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  /* stats */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#7DBE8A',
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9AAABB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* next appointment */
  nextCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  nextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  nextHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7DBE8A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  nextBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  nextTimeBubble: {
    backgroundColor: '#7DBE8A',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextTimeText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
  nextInfo: { flex: 1, gap: 3 },
  nextPet: {
    fontSize: 17,
    fontWeight: '800',
    color: '#24364B',
  },
  nextOwner: {
    fontSize: 12,
    fontWeight: '600',
    color: '#738295',
  },
  nextTypePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF4FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  nextTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B8DEF',
  },
  nextStatusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  nextStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },

  allDoneCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  allDoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7DBE8A',
  },

  /* schedule */
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#738295',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: -4,
  },

  scheduleCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleRow: {
    flexDirection: 'row',
    paddingBottom: 14,
  },
  timelineCol: {
    alignItems: 'center',
    width: 20,
    marginRight: 14,
    paddingTop: 2,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E2EAF2',
    marginTop: 4,
  },
  scheduleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
    paddingBottom: 14,
  },
  scheduleTime: {
    fontSize: 13,
    fontWeight: '800',
    color: '#24364B',
    width: 42,
  },
  scheduleMain: { flex: 1 },
  schedulePet: {
    fontSize: 14,
    fontWeight: '800',
    color: '#24364B',
  },
  scheduleOwner: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9AAABB',
    marginTop: 1,
  },
  scheduleTypePill: {
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  scheduleTypeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  mutedText: {
    color: '#C8D5E2',
  },

  /* status shared */
  confirmedBg: { backgroundColor: '#E8F7EE' },
  pendingBg:   { backgroundColor: '#FFF3E8' },
  confirmedTxt: { color: '#7DBE8A' },
  pendingTxt:   { color: '#F09A3E' },

  /* quick actions */
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionTile: {
    width: '47.5%',
    borderRadius: 20,
    padding: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  actionTileTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  actionTileDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9AAABB',
  },
});
