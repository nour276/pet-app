import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type PatientStatus = 'healthy' | 'follow-up' | 'critical';

type Patient = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  owner: string;
  lastVisit: string;
  status: PatientStatus;
  weight?: string;
};

const PATIENTS: Patient[] = [
  { id: '1', name: 'Max',     type: 'Dog',  breed: 'Golden Retriever', age: '3', owner: 'Ali Trabelsi',    lastVisit: '10 Apr 2025', status: 'healthy',   weight: '28 kg' },
  { id: '2', name: 'Luna',    type: 'Cat',  breed: 'Siamese',          age: '2', owner: 'Sarra Mansouri',  lastVisit: '22 Apr 2025', status: 'healthy',   weight: '4.2 kg' },
  { id: '3', name: 'Charlie', type: 'Dog',  breed: 'Labrador',         age: '5', owner: 'Karim Ben Salah', lastVisit: '15 Mar 2025', status: 'follow-up', weight: '32 kg' },
  { id: '4', name: 'Bella',   type: 'Cat',  breed: 'Persian',          age: '4', owner: 'Nour Gharbi',     lastVisit: '1 May 2025',  status: 'healthy',   weight: '3.8 kg' },
  { id: '5', name: 'Rocky',   type: 'Dog',  breed: 'Bulldog',          age: '6', owner: 'Houda Slim',      lastVisit: '28 Apr 2025', status: 'critical',  weight: '24 kg' },
];

const STATUS_CFG: Record<PatientStatus, { color: string; bg: string; label: string; icon: string }> = {
  healthy:    { color: '#7DBE8A', bg: '#E8F7E8', label: 'Healthy',    icon: 'checkmark-circle' },
  'follow-up':{ color: '#F09A3E', bg: '#FFF3E8', label: 'Follow-up',  icon: 'time'             },
  critical:   { color: '#E35D5D', bg: '#FFEEEE', label: 'Critical',   icon: 'warning'          },
};

const TYPE_ICON: Record<string, string> = { Dog: 'dog-side', Cat: 'cat', Bird: 'bird', Rabbit: 'rabbit', default: 'paw' };
const TYPE_COLOR: Record<string, { color: string; bg: string }> = {
  Dog:    { color: '#5B8DEF', bg: '#EEF4FF' },
  Cat:    { color: '#9B8DEF', bg: '#F0EEFF' },
  Bird:   { color: '#F09A3E', bg: '#FFF3E8' },
  Rabbit: { color: '#7DBE8A', bg: '#E8F7E8' },
};

type FilterStatus = 'All' | PatientStatus;

export default function PatientsScreen() {
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');

  const filtered = PATIENTS.filter(p => {
    const matchSearch = (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.owner.toLowerCase().includes(search.toLowerCase()) ||
      p.breed.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts: Record<FilterStatus, number> = {
    All:         PATIENTS.length,
    healthy:     PATIENTS.filter(p => p.status === 'healthy').length,
    'follow-up': PATIENTS.filter(p => p.status === 'follow-up').length,
    critical:    PATIENTS.filter(p => p.status === 'critical').length,
  };

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <View style={styles.overlay}>

        {/* Header */}
       <View style={styles.header}>
  <View>
    <Text style={styles.pageTitle}>Patients</Text>
    <Text style={styles.pageSubtitle}>
      {PATIENTS.length} registered patients
    </Text>
  </View>
</View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          {([
            { key: 'healthy',    label: 'Healthy',    color: '#7DBE8A' },
            { key: 'follow-up',  label: 'Follow-up',  color: '#F09A3E' },
            { key: 'critical',   label: 'Critical',   color: '#E35D5D' },
          ] as { key: FilterStatus; label: string; color: string }[]).map((s, i, arr) => (
            <React.Fragment key={s.key}>
              <View style={styles.statsItem}>
                <Text style={[styles.statsNum, { color: s.color }]}>{counts[s.key]}</Text>
                <Text style={styles.statsLabel}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statsDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color="#9AAABB" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search name, breed, or owner..."
            placeholderTextColor="#9AAABB"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9AAABB" />
            </TouchableOpacity>
          )}
        </View>

        {/* Status filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
          {(['All', 'healthy', 'follow-up', 'critical'] as FilterStatus[]).map(f => {
            const isActive = filterStatus === f;
            const cfg = f !== 'All' ? STATUS_CFG[f as PatientStatus] : null;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.chip, isActive && { backgroundColor: cfg?.color ?? '#24364B', borderColor: cfg?.color ?? '#24364B' }]}
                onPress={() => setFilterStatus(f)}
                activeOpacity={0.8}
              >
                {cfg && <Ionicons name={cfg.icon as any} size={12} color={isActive ? '#fff' : cfg.color} />}
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {f === 'All' ? 'All' : STATUS_CFG[f as PatientStatus].label} ({counts[f]})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="paw-off" size={52} color="#D0D7E2" />
              <Text style={styles.emptyText}>No patients found</Text>
            </View>
          ) : (
            filtered.map(patient => {
              const sc  = STATUS_CFG[patient.status];
              const tc  = TYPE_COLOR[patient.type] || { color: '#7DBE8A', bg: '#E8F7E8' };
              const ico = TYPE_ICON[patient.type]  || TYPE_ICON.default;
              return (
                <TouchableOpacity
                  key={patient.id}
                  style={[styles.card, { borderLeftColor: sc.color }]}
                  activeOpacity={0.88}
                  onPress={() =>
                    Alert.alert(
                      `${patient.name} — ${patient.breed}`,
                      `Type: ${patient.type}\nAge: ${patient.age} years\nWeight: ${patient.weight || '—'}\nOwner: ${patient.owner}\nLast visit: ${patient.lastVisit}\nStatus: ${sc.label}`,
                    )
                  }
                >
                  {/* Animal icon */}
                  <View style={[styles.petIconBox, { backgroundColor: tc.bg }]}>
                    <MaterialCommunityIcons name={ico as any} size={26} color={tc.color} />
                  </View>

                  {/* Info */}
                  <View style={styles.cardInfo}>
                    <View style={styles.cardTop}>
                      <Text style={styles.petName}>{patient.name}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                        <Ionicons name={sc.icon as any} size={11} color={sc.color} />
                        <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                      </View>
                    </View>

                    <Text style={styles.breedText}>{patient.breed} · {patient.type} · {patient.age}y</Text>

                    <View style={styles.cardMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="person-outline" size={11} color="#9AAABB" />
                        <Text style={styles.metaText}>{patient.owner}</Text>
                      </View>
                      <View style={styles.metaDot} />
                      <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={11} color="#9AAABB" />
                        <Text style={styles.metaText}>{patient.lastVisit}</Text>
                      </View>
                      {patient.weight && (
                        <>
                          <View style={styles.metaDot} />
                          <View style={styles.metaItem}>
                            <MaterialCommunityIcons name="scale" size={11} color="#9AAABB" />
                            <Text style={styles.metaText}>{patient.weight}</Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={16} color="#D0D7E2" />
                </TouchableOpacity>
              );
            })
          )}
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  pageTitle:    { fontSize: 26, fontWeight: '800', color: '#24364B' },
  pageSubtitle: { fontSize: 12, color: '#9AAABB', fontWeight: '600', marginTop: 2 },
  addBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#7DBE8A', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#7DBE8A', shadowOpacity: 0.4, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },

  statsStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 18,
    paddingVertical: 14, marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statsItem:   { alignItems: 'center', flex: 1 },
  statsNum:    { fontSize: 22, fontWeight: '800' },
  statsLabel:  { fontSize: 10, fontWeight: '700', color: '#9AAABB', marginTop: 2 },
  statsDivider:{ width: 1, height: 30, backgroundColor: '#EDF0F5' },

  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16, paddingHorizontal: 14, height: 48,
    gap: 10, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#24364B', fontWeight: '500' },

  filterScroll: { flexGrow: 0, marginBottom: 14 },
  filterRow:    { gap: 8, paddingRight: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1.5, borderColor: '#E2E8F0',
  },
  chipText:       { fontSize: 12, fontWeight: '700', color: '#738295' },
  chipTextActive: { color: '#fff' },

  list: { gap: 10, paddingBottom: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 20, padding: 14, gap: 12,
    borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  petIconBox: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardInfo:   { flex: 1 },
  cardTop:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  petName:    { fontSize: 15, fontWeight: '800', color: '#24364B' },
  statusBadge:{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '800' },
  breedText:  { fontSize: 12, fontWeight: '600', color: '#738295', marginBottom: 6 },
  cardMeta:   { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  metaItem:   { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText:   { fontSize: 11, fontWeight: '600', color: '#9AAABB' },
  metaDot:    { width: 3, height: 3, borderRadius: 2, backgroundColor: '#D0D7E2' },

  empty:     { alignItems: 'center', paddingTop: 70, gap: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#B0BAC6' },
});
