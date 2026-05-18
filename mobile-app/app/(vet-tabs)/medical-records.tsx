import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const RECORDS = [
  {
    id: '1', pet: 'Max', type: 'Dog', breed: 'Golden Retriever', owner: 'Ali Trabelsi',
    records: [
      { date: '10 Apr 2025', type: 'Checkup',     vet: 'Dr. Amara', diagnosis: 'Healthy — annual wellness exam',             treatment: 'None required',                         prescription: 'Heartworm prevention (monthly)',            weight: '28 kg',  notes: 'Coat excellent. Dental cleaning recommended in 6 months.' },
      { date: '15 Jan 2025', type: 'Vaccination', vet: 'Dr. Amara', diagnosis: 'Routine vaccination',                        treatment: 'DHPP + Rabies booster',                 prescription: 'None',                                      weight: '27.5 kg', notes: 'Tolerated vaccines well. No adverse reactions.' },
    ],
  },
  {
    id: '2', pet: 'Luna', type: 'Cat', breed: 'Siamese', owner: 'Sarra Mansouri',
    records: [
      { date: '22 Apr 2025', type: 'Dental',      vet: 'Dr. Amara', diagnosis: 'Mild tartar buildup',                        treatment: 'Professional dental scaling',            prescription: 'Dental gel twice daily',                    weight: '4.2 kg', notes: 'Dry food recommended to reduce plaque buildup.' },
    ],
  },
  {
    id: '3', pet: 'Charlie', type: 'Dog', breed: 'Labrador', owner: 'Karim Ben Salah',
    records: [
      { date: '15 Mar 2025', type: 'Surgery',     vet: 'Dr. Amara', diagnosis: 'ACL tear — left hind limb',                  treatment: 'TPLO surgery performed',                prescription: 'Carprofen 75mg (14 days), restricted activity 8 weeks', weight: '32 kg', notes: 'Post-op recovery progressing. Follow-up in 2 weeks.' },
    ],
  },
  {
    id: '4', pet: 'Bella', type: 'Cat', breed: 'Persian', owner: 'Nour Gharbi',
    records: [
      { date: '1 May 2025', type: 'Checkup',      vet: 'Dr. Amara', diagnosis: 'Healthy — senior wellness check',            treatment: 'Blood panel drawn',                     prescription: 'Joint supplement (daily)',                   weight: '3.8 kg', notes: 'Blood work within normal range. Monitor kidney values annually.' },
    ],
  },
  {
    id: '5', pet: 'Rocky', type: 'Dog', breed: 'Bulldog', owner: 'Houda Slim',
    records: [
      { date: '28 Apr 2025', type: 'Emergency',   vet: 'Dr. Amara', diagnosis: 'Respiratory distress — brachycephalic syndrome', treatment: 'Oxygen therapy; soft palate resection scheduled', prescription: 'Prednisone 10mg (5 days), restricted exercise', weight: '24 kg', notes: 'CRITICAL: Avoid heat. Surgery consult booked.' },
    ],
  },
];

const TYPE_ICON: Record<string, string> = { Dog: 'dog-side', Cat: 'cat', Bird: 'bird', default: 'paw' };
const TYPE_COLOR: Record<string, { color: string; bg: string }> = {
  Dog:  { color: '#5B8DEF', bg: '#EEF4FF' },
  Cat:  { color: '#9B8DEF', bg: '#F0EEFF' },
  Bird: { color: '#F09A3E', bg: '#FFF3E8' },
};
const VISIT_COLOR: Record<string, { color: string; bg: string }> = {
  Checkup:     { color: '#5B8DEF', bg: '#EEF4FF' },
  Vaccination: { color: '#7DBE8A', bg: '#E8F7E8' },
  Surgery:     { color: '#E35D5D', bg: '#FFEEEE' },
  Dental:      { color: '#F09A3E', bg: '#FFF3E8' },
  Emergency:   { color: '#E35D5D', bg: '#FFEEEE' },
};

export default function MedicalRecordsScreen() {
  const [search,   setSearch]   = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = RECORDS.filter(r =>
    r.pet.toLowerCase().includes(search.toLowerCase())   ||
    r.owner.toLowerCase().includes(search.toLowerCase()) ||
    r.breed.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <View style={styles.overlay}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#24364B" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Medical Records</Text>
            <Text style={styles.pageSubtitle}>{RECORDS.length} patient files</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="document-text" size={16} color="#5B8DEF" />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color="#9AAABB" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search patient, owner or breed..."
            placeholderTextColor="#9AAABB"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9AAABB" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="file-search-outline" size={52} color="#D0D7E2" />
              <Text style={styles.emptyText}>No records found</Text>
            </View>
          ) : (
            filtered.map(patient => {
              const tc  = TYPE_COLOR[patient.type]  || { color: '#7DBE8A', bg: '#E8F7E8' };
              const ico = TYPE_ICON[patient.type]   || TYPE_ICON.default;
              const isExpanded  = expanded === patient.id;
              const latestRec   = patient.records[0];
              const vc          = VISIT_COLOR[latestRec.type] || VISIT_COLOR.Checkup;

              return (
                <View key={patient.id} style={styles.patientCard}>
                  <TouchableOpacity
                    style={styles.patientHeader}
                    activeOpacity={0.8}
                    onPress={() => setExpanded(isExpanded ? null : patient.id)}
                  >
                    <View style={[styles.petIconBox, { backgroundColor: tc.bg }]}>
                      <MaterialCommunityIcons name={ico as any} size={26} color={tc.color} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.petName}>
                        {patient.pet}
                        <Text style={styles.petBreed}> · {patient.breed}</Text>
                      </Text>
                      <Text style={styles.ownerText}>{patient.owner}</Text>
                      <View style={styles.lastVisitRow}>
                        <Ionicons name="calendar-outline" size={11} color="#9AAABB" />
                        <Text style={styles.lastVisitText}>{latestRec.date}</Text>
                        <View style={[styles.visitTypePill, { backgroundColor: vc.bg }]}>
                          <Text style={[styles.visitTypeText, { color: vc.color }]}>{latestRec.type}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.chevronWrap}>
                      <Text style={styles.recordCount}>
                        {patient.records.length} {patient.records.length === 1 ? 'visit' : 'visits'}
                      </Text>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color="#9AAABB" />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.recordsContainer}>
                      <View style={styles.recordsDivider} />
                      {patient.records.map((rec, i) => {
                        const rc       = VISIT_COLOR[rec.type] || VISIT_COLOR.Checkup;
                        const isLastRec = i === patient.records.length - 1;
                        return (
                          <View key={i} style={styles.recordItem}>
                            <View style={styles.timelineCol}>
                              <View style={[styles.timelineDot, { backgroundColor: rc.color }]} />
                              {!isLastRec && <View style={styles.timelineLine} />}
                            </View>

                            <View style={styles.recordContent}>
                              <View style={styles.recordTopRow}>
                                <View style={[styles.visitBadge, { backgroundColor: rc.bg }]}>
                                  <Text style={[styles.visitBadgeText, { color: rc.color }]}>{rec.type}</Text>
                                </View>
                                <Text style={styles.recDate}>{rec.date}</Text>
                                <View style={styles.weightPill}>
                                  <MaterialCommunityIcons name="scale" size={10} color="#9AAABB" />
                                  <Text style={styles.weightText}>{rec.weight}</Text>
                                </View>
                              </View>

                              <View style={styles.recRow}>
                                <View style={[styles.recIconBox, { backgroundColor: '#EEF4FF' }]}>
                                  <Ionicons name="medkit-outline" size={12} color="#5B8DEF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.recLabel}>Diagnosis</Text>
                                  <Text style={styles.recValue}>{rec.diagnosis}</Text>
                                </View>
                              </View>
                              <View style={styles.recRow}>
                                <View style={[styles.recIconBox, { backgroundColor: '#E8F7E8' }]}>
                                  <MaterialCommunityIcons name="needle" size={12} color="#7DBE8A" />
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.recLabel}>Treatment</Text>
                                  <Text style={styles.recValue}>{rec.treatment}</Text>
                                </View>
                              </View>
                              <View style={styles.recRow}>
                                <View style={[styles.recIconBox, { backgroundColor: '#FFF3E8' }]}>
                                  <Ionicons name="flask-outline" size={12} color="#F09A3E" />
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.recLabel}>Prescription</Text>
                                  <Text style={styles.recValue}>{rec.prescription}</Text>
                                </View>
                              </View>
                              {rec.notes && (
                                <View style={styles.notesBox}>
                                  <Ionicons name="information-circle-outline" size={13} color="#9AAABB" />
                                  <Text style={styles.notesText}>{rec.notes}</Text>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
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
    marginBottom: 14, gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#EDF0F5',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  pageTitle:    { fontSize: 24, fontWeight: '800', color: '#24364B' },
  pageSubtitle: { fontSize: 12, color: '#9AAABB', fontWeight: '600', marginTop: 2 },
  headerBadge: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center', alignItems: 'center',
  },

  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 16, paddingHorizontal: 14, height: 48,
    gap: 10, marginBottom: 14,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#24364B', fontWeight: '500' },

  list: { gap: 12, paddingBottom: 24 },

  patientCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
    overflow: 'hidden',
  },
  patientHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 12,
  },
  petIconBox: {
    width: 52, height: 52, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  petName:   { fontSize: 15, fontWeight: '800', color: '#24364B' },
  petBreed:  { fontSize: 13, fontWeight: '600', color: '#738295' },
  ownerText: { fontSize: 11, fontWeight: '600', color: '#9AAABB', marginTop: 2 },
  lastVisitRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  lastVisitText: { fontSize: 11, fontWeight: '600', color: '#9AAABB' },
  visitTypePill: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  visitTypeText: { fontSize: 10, fontWeight: '800' },
  chevronWrap:   { alignItems: 'center', gap: 4 },
  recordCount:   { fontSize: 10, fontWeight: '700', color: '#B0BAC6' },

  recordsDivider: { height: 1, backgroundColor: '#EDF0F5', marginHorizontal: 14 },
  recordsContainer: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 10 },

  recordItem: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  timelineCol: { alignItems: 'center', width: 14, paddingTop: 4 },
  timelineDot: { width: 10, height: 10, borderRadius: 5 },
  timelineLine: { flex: 1, width: 2, backgroundColor: '#EDF0F5', borderRadius: 1, marginTop: 4 },

  recordContent: { flex: 1, gap: 8 },
  recordTopRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  visitBadge:    { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 },
  visitBadgeText:{ fontSize: 11, fontWeight: '800' },
  recDate:       { fontSize: 11, fontWeight: '600', color: '#9AAABB', flex: 1 },
  weightPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#F7F9FC', borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  weightText: { fontSize: 10, fontWeight: '700', color: '#9AAABB' },

  recRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#F7F9FC', borderRadius: 12, padding: 10,
  },
  recIconBox: {
    width: 26, height: 26, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 1,
  },
  recLabel: { fontSize: 10, fontWeight: '700', color: '#9AAABB', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  recValue: { fontSize: 13, fontWeight: '600', color: '#24364B', lineHeight: 18 },

  notesBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: '#FFFDF0', borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: '#F5EDD0',
  },
  notesText: { flex: 1, fontSize: 12, fontWeight: '600', color: '#8A7A4A', lineHeight: 17 },

  empty:     { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#B0BAC6' },
});
