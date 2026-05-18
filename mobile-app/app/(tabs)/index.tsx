import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Pet = {
  id: number | string;
  name: string;
  type: string;
  breed?: string;
  age?: number | string;
  weight?: number | string;
  image?: any;
  battery?: number;
  connected?: boolean;
};

const HEALTH_STATS = [
  { icon: 'heart',      lib: 'ion', color: '#E35D5D', bg: '#FFF0F0', value: '85',  unit: 'bpm', label: 'Heart Rate',    trend: 'Normal',  trendOk: true  },
  { icon: 'thermometer',lib: 'ion', color: '#F09A3E', bg: '#FFF5EA', value: '38.5',unit: '°C',  label: 'Temperature',   trend: 'Normal',  trendOk: true  },
  { icon: 'shoe-print', lib: 'mci', color: '#5B8DEF', bg: '#EEF3FF', value: '3.2', unit: 'km',  label: "Today's Walk",  trend: '+0.4 km', trendOk: true  },
  { icon: 'moon',       lib: 'ion', color: '#8B7CF6', bg: '#F0EEFF', value: '7h',  unit: '45m', label: 'Sleep',         trend: 'Good',    trendOk: true  },
] as const;

const RECENT_ACTIVITY = [
  { icon: 'walk',            lib: 'mci', color: '#5B8DEF', bg: '#EEF3FF', title: 'Morning Walk',  detail: '3.2 km · 45 min',       time: 'Today'   },
  { icon: 'medical-outline', lib: 'ion', color: '#7DBE8A', bg: '#EEF7EE', title: 'Vet Checkup',   detail: 'Dr. Sarah · All good',   time: 'Apr 20'  },
  { icon: 'nutrition-outline',lib:'ion', color: '#F09A3E', bg: '#FFF5EA', title: 'Medication',     detail: 'Antiparasitic · Given',  time: 'Apr 15'  },
] as const;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const [pets, setPets]               = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const loadPets = async () => {
    try {
      const saved = await AsyncStorage.getItem('pets');
      if (saved) {
        const parsed: Pet[] = JSON.parse(saved);
        setPets(parsed.map((pet, i) => ({
          ...pet,
          battery:   pet.battery   ?? (i === 0 ? 90 : 76),
          connected: pet.connected ?? true,
          image:     pet.image     ?? null,
        })));
      } else {
        setPets([
          { id: '1', name: 'Rita',  type: 'Dog', breed: 'Golden Retriever', age: '3', image: require('@/assets/images/doudou.jpeg'), battery: 90, connected: true  },
          { id: '2', name: 'Louli', type: 'Cat', breed: 'Persian',          age: '2', image: require('@/assets/images/louli.jpeg'),  battery: 72, connected: false },
        ]);
      }
    } catch {
      setPets([{ id: '1', name: 'Rita', type: 'Dog', image: require('@/assets/images/rita.jpeg'), battery: 90, connected: true }]);
    }
  };

  useEffect(() => { loadPets(); }, []);
  useFocusEffect(React.useCallback(() => { loadPets(); }, []));

  useEffect(() => {
    if (pets.length > 0 && !selectedPetId) setSelectedPetId(String(pets[0].id));
  }, [pets, selectedPetId]);

  useEffect(() => {
    if (pets.length > 0 && selectedPetId) {
      if (!pets.some(p => String(p.id) === selectedPetId))
        setSelectedPetId(String(pets[0].id));
    }
  }, [pets, selectedPetId]);

  const selectedPet = useMemo(() =>
    pets.length ? (pets.find(p => String(p.id) === selectedPetId) ?? pets[0]) : null,
  [pets, selectedPetId]);

  const batteryColor = (b: number) => b > 50 ? '#67B56E' : b > 20 ? '#F09A3E' : '#E35D5D';

  function renderThumb(image: any, size: number) {
    const style = { width: size, height: size, borderRadius: 16, backgroundColor: '#E8EEF5' };
    if (!image) return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="paw" size={20} color="#9AA9B8" />
      </View>
    );
    return <Image source={image} style={style} resizeMode="cover" />;
  }

  function renderMainImage(image: any) {
    const style = { width: '100%' as const, height: 210, borderRadius: 20, backgroundColor: '#E8EEF5' };
    if (!image) return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="paw" size={48} color="#9AA9B8" />
      </View>
    );
    return <Image source={image} style={style} resizeMode="cover" />;
  }

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.overlay}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerName}>Nour Ayoub</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/alerts')}>
                <Ionicons name="notifications" size={20} color="#5B8DEF" />
                <View style={styles.notifBadge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/profile')}>
                <Ionicons name="person-outline" size={20} color="#24364B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Vaccination reminder ── */}
          <TouchableOpacity
            style={styles.reminderBanner}
            activeOpacity={0.85}
            onPress={() => router.push('/book-appointment' as any)}
          >
            <View style={styles.reminderIconBox}>
              <Ionicons name="medkit-outline" size={18} color="#F09A3E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reminderTitle}>Vaccination Reminder</Text>
              <Text style={styles.reminderBody}>
                {selectedPet?.name ?? 'Your pet'}'s Rabies vaccine is due in 3 days
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#F09A3E" />
          </TouchableOpacity>

          {/* ── Pet selector ── */}
          {pets.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.petSwitcherRow}
            >
              {pets.map(pet => {
                const sel = String(pet.id) === String(selectedPet?.id);
                return (
                  <TouchableOpacity
                    key={String(pet.id)}
                    style={[styles.smallPetCard, sel && styles.smallPetCardSelected]}
                    onPress={() => setSelectedPetId(String(pet.id))}
                    activeOpacity={0.8}
                  >
                    {renderThumb(pet.image, 52)}
                    <Text style={[styles.smallPetName, sel && styles.smallPetNameSelected]}>{pet.name}</Text>
                    <Text style={styles.smallPetType}>{pet.type}</Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity style={styles.addPetChip} onPress={() => router.push('/add-pet')} activeOpacity={0.8}>
                <Ionicons name="add" size={22} color="#88BC55" />
                <Text style={styles.addPetChipText}>Add Pet</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* ── Main pet card ── */}
          {selectedPet ? (
            <View style={styles.petCard}>
              <View style={styles.petImageWrapper}>
                {renderMainImage(selectedPet.image)}
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: selectedPet.connected ? '#6DBB63' : '#D66A6A' },
                ]}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusBadgeText}>
                    {selectedPet.connected ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>

              <View style={styles.petCardBody}>
                <View style={styles.petInfoRow}>
                  <View>
                    <Text style={styles.petName}>{selectedPet.name}</Text>
                    <Text style={styles.petBreed}>
                      {selectedPet.breed ?? selectedPet.type}
                      {selectedPet.age ? `  ·  ${selectedPet.age} yrs` : ''}
                    </Text>
                  </View>
                  {selectedPet.weight ? (
                    <View style={styles.weightChip}>
                      <MaterialCommunityIcons name="weight" size={13} color="#8B7CF6" />
                      <Text style={styles.weightText}>{selectedPet.weight} kg</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.batteryRow}>
                  <Ionicons name="battery-half" size={15} color={batteryColor(selectedPet.battery ?? 90)} />
                  <View style={styles.batteryBar}>
                    <View style={[styles.batteryFill, {
                      width: `${selectedPet.battery ?? 90}%` as any,
                      backgroundColor: batteryColor(selectedPet.battery ?? 90),
                    }]} />
                  </View>
                  <Text style={[styles.batteryPct, { color: batteryColor(selectedPet.battery ?? 90) }]}>
                    {selectedPet.battery ?? 90}%
                  </Text>
                  <Text style={styles.batteryLabel}>Collar</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="paw-outline" size={44} color="#93A4B5" />
              <Text style={styles.emptyTitle}>No pets yet</Text>
              <Text style={styles.emptySubtitle}>Add your first pet to monitor its health</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/add-pet')}>
                <Text style={styles.emptyButtonText}>Add Pet</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Quick actions ── */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/chat-vet')} activeOpacity={0.85}>
              <View style={[styles.actionIcon, { backgroundColor: '#D6E6FF' }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#5B8DEF" />
              </View>
              <Text style={styles.actionLabel}>Chat Vet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/book-appointment' as any)} activeOpacity={0.85}>
              <View style={[styles.actionIcon, { backgroundColor: '#D4F4D4' }]}>
                <MaterialCommunityIcons name="calendar-plus" size={20} color="#67B56E" />
              </View>
              <Text style={styles.actionLabel}>Book Appt</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/map')} activeOpacity={0.85}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFE8CC' }]}>
                <Ionicons name="location" size={20} color="#F09A3E" />
              </View>
              <Text style={styles.actionLabel}>Track Pet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/history')} activeOpacity={0.85}>
              <View style={[styles.actionIcon, { backgroundColor: '#EEE8FF' }]}>
                <Ionicons name="document-text-outline" size={20} color="#8B7CF6" />
              </View>
              <Text style={styles.actionLabel}>Records</Text>
            </TouchableOpacity>
          </View>

          {/* ── Health vitals ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Vitals</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.viewAll}>View History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            {HEALTH_STATS.map(s => (
              <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
                <View style={[styles.statIconBox, { backgroundColor: s.color + '25' }]}>
                  {s.lib === 'ion'
                    ? <Ionicons name={s.icon as any} size={18} color={s.color} />
                    : <MaterialCommunityIcons name={s.icon as any} size={18} color={s.color} />}
                </View>
                <View style={styles.statValueRow}>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.statUnit}>{s.unit}</Text>
                </View>
                <Text style={styles.statLabel}>{s.label}</Text>
                <View style={[styles.trendBadge, {
                  backgroundColor: s.trendOk ? '#7DBE8A22' : '#E35D5D22',
                }]}>
                  <Text style={[styles.trendText, { color: s.trendOk ? '#7DBE8A' : '#E35D5D' }]}>
                    {s.trend}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Upcoming appointment ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Next Appointment</Text>
            <TouchableOpacity onPress={() => router.push('/book-appointment' as any)}>
              <Text style={styles.viewAll}>Book New</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.appointmentCard}
            activeOpacity={0.85}
            onPress={() => router.push('/book-appointment' as any)}
          >
            <View style={styles.apptDateBox}>
              <Text style={styles.apptDateDay}>10</Text>
              <Text style={styles.apptDateMonth}>MAY</Text>
            </View>
            <View style={styles.apptInfo}>
              <Text style={styles.apptDoctor}>Dr. Sarah Johnson</Text>
              <Text style={styles.apptSpecialty}>General Practice · Checkup</Text>
              <View style={styles.apptMeta}>
                <Ionicons name="time-outline" size={12} color="#5B8DEF" />
                <Text style={styles.apptTime}>10:00 AM</Text>
                <View style={styles.apptPetChip}>
                  <Ionicons name="paw-outline" size={10} color="#9AAABB" />
                  <Text style={styles.apptPetText}>{selectedPet?.name ?? 'Pet'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.apptStatus}>
              <Text style={styles.apptStatusText}>Confirmed</Text>
            </View>
          </TouchableOpacity>

          {/* ── Recent activity ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          <View style={styles.activityCard}>
            {RECENT_ACTIVITY.map((a, i) => (
              <View key={i}>
                {i > 0 && <View style={styles.activityDivider} />}
                <View style={styles.activityRow}>
                  <View style={[styles.activityIconBox, { backgroundColor: a.bg }]}>
                    {a.lib === 'ion'
                      ? <Ionicons name={a.icon as any} size={17} color={a.color} />
                      : <MaterialCommunityIcons name={a.icon as any} size={17} color={a.color} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityTitle}>{a.title}</Text>
                    <Text style={styles.activityDetail}>{a.detail}</Text>
                  </View>
                  <Text style={styles.activityTime}>{a.time}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Health tip ── */}
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipIconBox}>
                <Ionicons name="bulb-outline" size={18} color="#7DBE8A" />
              </View>
              <Text style={styles.tipTitle}>Health Tip of the Day</Text>
            </View>
            <Text style={styles.tipText}>
              Regular brushing keeps your pet's coat healthy and reduces shedding by up to 90%. Aim for 3–4 times a week for best results.
            </Text>
          </View>

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  overlay: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: 'rgba(235,242,255,0.45)',
    paddingHorizontal: 16,
    paddingTop: 58,
    paddingBottom: 30,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C6C7C',
  },
  headerName: {
    fontSize: 27,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E35D5D',
    borderWidth: 1.5,
    borderColor: '#fff',
  },

  /* ── Vaccination reminder ── */
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF5E8',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDDEB5',
  },
  reminderIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFE8C0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F09A3E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reminderBody: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B4C1E',
    marginTop: 2,
  },

  /* ── Pet switcher ── */
  petSwitcherRow: {
    paddingBottom: 14,
    paddingLeft: 2,
    paddingRight: 4,
    gap: 10,
  },
  smallPetCard: {
    width: 90,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  smallPetCardSelected: {
    borderColor: '#5B8DEF',
    backgroundColor: '#fff',
  },
  smallPetName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#24364B',
    marginTop: 6,
    textAlign: 'center',
  },
  smallPetNameSelected: { color: '#5B8DEF' },
  smallPetType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#738295',
    marginTop: 1,
    textAlign: 'center',
  },
  addPetChip: {
    width: 90,
    backgroundColor: 'rgba(240,248,232,0.92)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D4ECC0',
    borderStyle: 'dashed',
    gap: 4,
  },
  addPetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#88BC55',
  },

  /* ── Main pet card ── */
  petCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 26,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  petImageWrapper: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  petCardBody: {
    paddingHorizontal: 4,
    paddingTop: 12,
  },
  petInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  petName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#24364B',
  },
  petBreed: {
    fontSize: 13,
    fontWeight: '600',
    color: '#738295',
    marginTop: 2,
  },
  weightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  weightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B7CF6',
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  batteryBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#EEF1F5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  batteryFill: { height: 6, borderRadius: 3 },
  batteryPct: {
    fontSize: 12,
    fontWeight: '800',
    minWidth: 34,
    textAlign: 'right',
  },
  batteryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9AAABB',
  },

  /* ── Empty state ── */
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#24364B', marginTop: 10 },
  emptySubtitle: { fontSize: 14, color: '#738295', marginTop: 6, textAlign: 'center' },
  emptyButton: {
    marginTop: 14,
    backgroundColor: '#88BC55',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  /* ── Quick actions ── */
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5D70',
    textAlign: 'center',
  },

  /* ── Section header ── */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#24364B',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B8DEF',
  },

  /* ── Health stats ── */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#738295',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B99A8',
    marginTop: 3,
  },
  trendBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 8,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '800',
  },

  /* ── Appointment card ── */
  appointmentCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  apptDateBox: {
    width: 54,
    height: 60,
    backgroundColor: '#5B8DEF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apptDateDay: { fontSize: 22, fontWeight: '800', color: '#fff' },
  apptDateMonth: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 1 },
  apptInfo: { flex: 1 },
  apptDoctor: { fontSize: 15, fontWeight: '800', color: '#24364B' },
  apptSpecialty: { fontSize: 12, fontWeight: '600', color: '#738295', marginTop: 2 },
  apptMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  apptTime: { fontSize: 12, fontWeight: '700', color: '#5B8DEF' },
  apptPetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F4F7FB',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  apptPetText: { fontSize: 10, fontWeight: '700', color: '#9AAABB' },
  apptStatus: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  apptStatusText: { fontSize: 11, fontWeight: '700', color: '#4CAF50' },

  /* ── Recent activity ── */
  activityCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  activityIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#24364B',
    marginBottom: 2,
  },
  activityDetail: {
    fontSize: 12,
    fontWeight: '600',
    color: '#738295',
  },
  activityTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9AAABB',
    textAlign: 'right',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginLeft: 50,
  },

  /* ── Health tip ── */
  tipCard: {
    backgroundColor: 'rgba(232,247,232,0.97)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C5E8C5',
    marginBottom: 8,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tipIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2A6B35',
  },
  tipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3A5A3E',
    lineHeight: 20,
  },
});
