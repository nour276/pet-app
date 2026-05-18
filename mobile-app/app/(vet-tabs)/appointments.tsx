import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Status = 'confirmed' | 'pending' | 'cancelled';

type Appointment = {
  id: string;
  pet: string;
  owner: string;
  type: string;
  time: string;
  date: string;
  status: Status;
  petType: string;
  notes?: string;
};

const INITIAL: Appointment[] = [
  { id: '1', pet: 'Max',     owner: 'Ali Trabelsi',    type: 'Checkup',     time: '09:00', date: 'Today',    status: 'confirmed', petType: 'Dog'  },
  { id: '2', pet: 'Luna',    owner: 'Sarra Mansouri',  type: 'Vaccination', time: '10:30', date: 'Today',    status: 'confirmed', petType: 'Cat'  },
  { id: '3', pet: 'Charlie', owner: 'Karim Ben Salah', type: 'Surgery',     time: '13:00', date: 'Today',    status: 'pending',   petType: 'Dog', notes: 'Post-op follow-up required' },
  { id: '4', pet: 'Bella',   owner: 'Nour Gharbi',     type: 'Dental',      time: '15:00', date: 'Today',    status: 'confirmed', petType: 'Cat'  },
  { id: '5', pet: 'Rocky',   owner: 'Houda Slim',      type: 'Checkup',     time: '09:30', date: 'Tomorrow', status: 'confirmed', petType: 'Dog'  },
];

const STATUS_CFG: Record<Status, { color: string; bg: string; label: string }> = {
  confirmed: { color: '#7DBE8A', bg: '#E8F7E8', label: 'Confirmed' },
  pending:   { color: '#F09A3E', bg: '#FFF3E8', label: 'Pending'   },
  cancelled: { color: '#E35D5D', bg: '#FFEEEE', label: 'Cancelled' },
};

const TYPE_CFG: Record<string, { color: string; bg: string; icon: string }> = {
  Checkup:     { color: '#5B8DEF', bg: '#EEF4FF', icon: 'stethoscope'              },
  Vaccination: { color: '#7DBE8A', bg: '#E8F7E8', icon: 'shield-checkmark-outline' },
  Surgery:     { color: '#E35D5D', bg: '#FFEEEE', icon: 'cut-outline'              },
  Dental:      { color: '#F09A3E', bg: '#FFF3E8', icon: 'medical-outline'          },
};

type Filter = 'All' | 'Today' | 'Tomorrow';

export default function AppointmentsScreen() {
  const [filter, setFilter]         = useState<Filter>('All');
  const [appointments, setAppoints] = useState<Appointment[]>(INITIAL);

  const shown = filter === 'All'
    ? appointments
    : appointments.filter(a => a.date === filter);

  const counts = {
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const updateStatus = (id: string, status: Status) => {
    setAppoints(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const confirmAppt = (id: string) => updateStatus(id, 'confirmed');
  const cancelAppt  = (id: string) => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel it', style: 'destructive', onPress: () => updateStatus(id, 'cancelled') },
    ]);
  };

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <View style={styles.overlay}>

        {/* Header */}
        <View style={styles.header}>
  <View>
    <Text style={styles.pageTitle}>Appointments</Text>
    <Text style={styles.pageSubtitle}>
      {appointments.length} total scheduled
    </Text>
  </View>
</View>

        {/* Status summary */}
        <View style={styles.summaryRow}>
          {(Object.keys(STATUS_CFG) as Status[]).map(s => (
            <View key={s} style={[styles.summaryCard, { borderTopColor: STATUS_CFG[s].color }]}>
              <Text style={[styles.summaryNum, { color: STATUS_CFG[s].color }]}>{counts[s]}</Text>
              <Text style={styles.summaryLabel}>{STATUS_CFG[s].label}</Text>
            </View>
          ))}
        </View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {(['All', 'Today', 'Tomorrow'] as Filter[]).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, filter === f && styles.chipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
              {f !== 'All' && (
                <View style={[styles.chipCount, filter === f && styles.chipCountActive]}>
                  <Text style={[styles.chipCountText, filter === f && styles.chipCountTextActive]}>
                    {appointments.filter(a => a.date === f).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {shown.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={52} color="#D0D7E2" />
              <Text style={styles.emptyText}>No appointments</Text>
            </View>
          ) : (
            shown.map(appt => {
              const tc = TYPE_CFG[appt.type] || TYPE_CFG.Checkup;
              const sc = STATUS_CFG[appt.status];
              return (
                <View key={appt.id} style={[styles.card, { borderLeftColor: tc.color }]}>
                  {/* Top row */}
                  <View style={styles.cardTop}>
                    <View style={[styles.typeIconBox, { backgroundColor: tc.bg }]}>
                      <Ionicons name={tc.icon as any} size={18} color={tc.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.petName}>{appt.pet}
                        <Text style={styles.petTypeLabel}> ({appt.petType})</Text>
                      </Text>
                      <Text style={styles.ownerText}>{appt.owner}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                      <View style={[styles.statusDot, { backgroundColor: sc.color }]} />
                      <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                    </View>
                  </View>

                  {/* Info row */}
                  <View style={styles.infoRow}>
                    <View style={styles.infoChip}>
                      <Ionicons name="time-outline" size={13} color="#738295" />
                      <Text style={styles.infoChipText}>{appt.time}</Text>
                    </View>
                    <View style={styles.infoChip}>
                      <Ionicons name="calendar-outline" size={13} color="#738295" />
                      <Text style={styles.infoChipText}>{appt.date}</Text>
                    </View>
                    <View style={[styles.infoChip, { backgroundColor: tc.bg }]}>
                      <Text style={[styles.infoChipText, { color: tc.color, fontWeight: '800' }]}>{appt.type}</Text>
                    </View>
                  </View>

                  {appt.notes && (
                    <View style={styles.notesRow}>
                      <Ionicons name="information-circle-outline" size={13} color="#F09A3E" />
                      <Text style={styles.notesText}>{appt.notes}</Text>
                    </View>
                  )}

                  {/* Action buttons — only when not cancelled */}
                  {appt.status !== 'cancelled' && (
                    <View style={styles.actionRow}>
                      {appt.status === 'pending' && (
                        <TouchableOpacity style={styles.confirmBtn} onPress={() => confirmAppt(appt.id)} activeOpacity={0.8}>
                          <Ionicons name="checkmark-circle-outline" size={15} color="#7DBE8A" />
                          <Text style={styles.confirmBtnText}>Confirm</Text>
                        </TouchableOpacity>
                      )}
                      {appt.status === 'confirmed' && (
                        <View style={styles.confirmedTag}>
                          <Ionicons name="checkmark-circle" size={14} color="#7DBE8A" />
                          <Text style={styles.confirmedTagText}>Confirmed</Text>
                        </View>
                      )}
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => cancelAppt(appt.id)} activeOpacity={0.8}>
                        <Ionicons name="close-circle-outline" size={15} color="#E35D5D" />
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.detailsBtn} onPress={() => Alert.alert(appt.pet, `Type: ${appt.type}\nOwner: ${appt.owner}\nTime: ${appt.time}`)} activeOpacity={0.8}>
                        <Ionicons name="document-text-outline" size={15} color="#5B8DEF" />
                        <Text style={styles.detailsBtnText}>Details</Text>
                      </TouchableOpacity>
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
    justifyContent: 'space-between', marginBottom: 14,
  },
  pageTitle:    { fontSize: 26, fontWeight: '800', color: '#3b3c3e' },
  pageSubtitle: { fontSize: 15, color: '#ffffff', fontWeight: '600', marginTop: 2 },
  addBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#7DBE8A', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#7DBE8A', shadowOpacity: 0.4, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  summaryCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16, paddingVertical: 12, alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  summaryNum:   { fontSize: 22, fontWeight: '800', color: '#24364B' },
  summaryLabel: { fontSize: 10, fontWeight: '700', color: '#9AAABB', marginTop: 2 },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1.5, borderColor: '#E2E8F0',
  },
  chipActive:          { backgroundColor: '#7DBE8A', borderColor: '#7DBE8A' },
  chipText:            { fontSize: 13, fontWeight: '700', color: '#738295' },
  chipTextActive:      { color: '#fff' },
  chipCount:           { backgroundColor: '#EDF0F5', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  chipCountActive:     { backgroundColor: 'rgba(255,255,255,0.3)' },
  chipCountText:       { fontSize: 11, fontWeight: '800', color: '#738295' },
  chipCountTextActive: { color: '#fff' },

  list: { gap: 12, paddingBottom: 20 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 20, padding: 14, borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },

  cardTop:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  typeIconBox: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  petName:     { fontSize: 15, fontWeight: '800', color: '#24364B' },
  petTypeLabel:{ fontSize: 13, fontWeight: '600', color: '#9AAABB' },
  ownerText:   { fontSize: 12, fontWeight: '600', color: '#738295', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  statusDot:   { width: 6, height: 6, borderRadius: 3 },
  statusText:  { fontSize: 11, fontWeight: '800' },

  infoRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  infoChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F0F3F8', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5,
  },
  infoChipText: { fontSize: 11, fontWeight: '700', color: '#738295' },

  notesRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF8EE', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7,
    marginBottom: 10,
  },
  notesText: { fontSize: 11, fontWeight: '600', color: '#C07020', flex: 1 },

  actionRow:       { flexDirection: 'row', gap: 8 },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#E8F7E8', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  confirmBtnText:  { fontSize: 12, fontWeight: '800', color: '#7DBE8A' },
  confirmedTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#E8F7E8', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  confirmedTagText:{ fontSize: 12, fontWeight: '800', color: '#7DBE8A' },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FFEEEE', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  cancelBtnText:   { fontSize: 12, fontWeight: '800', color: '#E35D5D' },
  detailsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#EEF4FF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    marginLeft: 'auto',
  },
  detailsBtnText:  { fontSize: 12, fontWeight: '800', color: '#5B8DEF' },

  empty: { alignItems: 'center', paddingTop: 70, gap: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#B0BAC6' },
});
