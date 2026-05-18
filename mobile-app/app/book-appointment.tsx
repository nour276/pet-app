import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const VETS = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Practice', distance: '1.2 km', rating: 4.9, available: true },
  { id: '2', name: 'Dr. Amira Bannour', specialty: 'Surgery & Orthopedics', distance: '2.5 km', rating: 4.7, available: true },
  { id: '3', name: 'Dr. Mohamed Ali', specialty: 'Dermatology', distance: '3.1 km', rating: 4.5, available: false },
];

const TIME_SLOTS = [
  { time: '09:00', available: true },
  { time: '10:00', available: false },
  { time: '11:00', available: true },
  { time: '12:00', available: false },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: false },
  { time: '17:00', available: true },
];

const AVAILABLE_DAYS = new Set([1, 2, 5, 6, 8, 9, 12, 13, 14, 16, 19, 20, 22, 23, 26, 27, 29, 30]);
const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay(); }

export default function BookAppointmentScreen() {
  const today = new Date();
  const [selectedVetId, setSelectedVetId] = useState<string | null>(null);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const firstDay = useMemo(() => getFirstDay(year, month), [year, month]);

  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [firstDay, daysInMonth]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null); setSelectedTime(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null); setSelectedTime(null);
  };

  const isPast = (day: number) => {
    const d = new Date(year, month, day); d.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  };
  const isAvailable = (day: number) => !isPast(day) && AVAILABLE_DAYS.has(day);
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const selectedVet = VETS.find(v => v.id === selectedVetId);

  const handleConfirm = () => {
    if (!selectedVetId || !selectedDay || !selectedTime) {
      Alert.alert('Incomplete', 'Please select a vet, date, and time slot.');
      return;
    }
    Alert.alert(
      'Appointment Booked!',
      `${selectedVet?.name}\n${MONTHS[month]} ${selectedDay}, ${year} at ${selectedTime}`,
      [{ text: 'Great!', onPress: () => router.back() }]
    );
  };

  const canConfirm = !!selectedVetId && !!selectedDay && !!selectedTime;

  return (
    <ImageBackground source={require('../assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.overlay}>

          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#2B3B52" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Book Appointment</Text>
            <View style={{ width: 38 }} />
          </View>

          {/* Step 1 – Select vet */}
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
            <Text style={styles.stepTitle}>Choose a Veterinarian</Text>
          </View>

          {VETS.map(vet => (
            <TouchableOpacity
              key={vet.id}
              style={[
                styles.vetCard,
                selectedVetId === vet.id && styles.vetCardSelected,
                !vet.available && styles.vetCardUnavailable,
              ]}
              onPress={() => vet.available && setSelectedVetId(vet.id)}
              activeOpacity={vet.available ? 0.85 : 1}
            >
              <View style={[styles.vetAvatar, selectedVetId === vet.id && styles.vetAvatarSelected]}>
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={26}
                  color={selectedVetId === vet.id ? '#fff' : '#7DBE8A'}
                />
              </View>
              <View style={styles.vetInfo}>
                <Text style={styles.vetName}>{vet.name}</Text>
                <Text style={styles.vetSpecialty}>{vet.specialty}</Text>
                <View style={styles.vetMeta}>
                  <Ionicons name="location-outline" size={12} color="#9AAABB" />
                  <Text style={styles.vetMetaText}>{vet.distance}</Text>
                  <Ionicons name="star" size={12} color="#F6C453" />
                  <Text style={styles.vetMetaText}>{vet.rating}</Text>
                </View>
              </View>
              <View style={[styles.availBadge, !vet.available && styles.busyBadge]}>
                <Text style={[styles.availBadgeText, !vet.available && styles.busyBadgeText]}>
                  {vet.available ? 'Available' : 'Busy'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Step 2 – Calendar */}
          <View style={[styles.stepHeader, { marginTop: 8 }]}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
            <Text style={styles.stepTitle}>Select a Date</Text>
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                <Ionicons name="chevron-back" size={20} color="#4B6A8C" />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
              <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                <Ionicons name="chevron-forward" size={20} color="#4B6A8C" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              {WEEK_DAYS.map(d => <Text key={d} style={styles.weekLabel}>{d}</Text>)}
            </View>

            <View style={styles.calGrid}>
              {calendarCells.map((day, idx) => {
                if (!day) return <View key={`e-${idx}`} style={styles.cell} />;
                const avail = isAvailable(day);
                const sel = selectedDay === day;
                const tod = isToday(day);
                return (
                  <TouchableOpacity
                    key={`d-${day}`}
                    style={[
                      styles.cell,
                      sel && styles.cellSelected,
                      tod && !sel && styles.cellToday,
                    ]}
                    onPress={() => { if (avail) { setSelectedDay(day); setSelectedTime(null); } }}
                    disabled={!avail}
                    activeOpacity={avail ? 0.7 : 1}
                  >
                    <Text style={[
                      styles.cellText,
                      sel && styles.cellTextSelected,
                      !avail && styles.cellTextDisabled,
                      tod && !sel && styles.cellTextToday,
                    ]}>{day}</Text>
                    {avail && !sel && <View style={styles.availDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#5B8DEF' }]} />
                <Text style={styles.legendText}>Selected</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#67B56E' }]} />
                <Text style={styles.legendText}>Available</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#D8DEE8' }]} />
                <Text style={styles.legendText}>Unavailable</Text>
              </View>
            </View>
          </View>

          {/* Step 3 – Time slots */}
          {selectedDay && (
            <>
              <View style={[styles.stepHeader, { marginTop: 8 }]}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>3</Text></View>
                <Text style={styles.stepTitle}>Pick a Time Slot</Text>
              </View>
              <View style={styles.slotsCard}>
                <View style={styles.slotsGrid}>
                  {TIME_SLOTS.map(slot => (
                    <TouchableOpacity
                      key={slot.time}
                      style={[
                        styles.slot,
                        selectedTime === slot.time && styles.slotSelected,
                        !slot.available && styles.slotBooked,
                      ]}
                      onPress={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      activeOpacity={slot.available ? 0.8 : 1}
                    >
                      <Text style={[
                        styles.slotTime,
                        selectedTime === slot.time && styles.slotTimeSelected,
                        !slot.available && styles.slotTimeBooked,
                      ]}>{slot.time}</Text>
                      {!slot.available && <Text style={styles.bookedLabel}>Booked</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Step 4 – Note */}
          {selectedTime && (
            <>
              <View style={[styles.stepHeader, { marginTop: 8 }]}>
                <View style={styles.stepBadge}><Text style={styles.stepNum}>4</Text></View>
                <Text style={styles.stepTitle}>Reason for Visit <Text style={styles.optional}>(optional)</Text></Text>
              </View>
              <View style={styles.noteCard}>
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="E.g. annual checkup, vaccination, skin issue..."
                  placeholderTextColor="#9AAABB"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </>
          )}

          {/* Summary */}
          {canConfirm && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Appointment Summary</Text>
              <View style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: '#EEF4FF' }]}>
                  <Ionicons name="person" size={16} color="#5B8DEF" />
                </View>
                <Text style={styles.summaryText}>{selectedVet?.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: '#E8F7E8' }]}>
                  <Ionicons name="calendar" size={16} color="#67B56E" />
                </View>
                <Text style={styles.summaryText}>{MONTHS[month]} {selectedDay}, {year}</Text>
              </View>
              <View style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: '#FFF3E8' }]}>
                  <Ionicons name="time" size={16} color="#F09A3E" />
                </View>
                <Text style={styles.summaryText}>{selectedTime}</Text>
              </View>
            </View>
          )}

          {/* Confirm */}
          <TouchableOpacity
            style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <Text style={styles.confirmText}>Confirm Appointment</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.30)',
    paddingHorizontal: 16,
    paddingTop: 58,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#24364B' },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    marginTop: 4,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: { fontSize: 13, fontWeight: '800', color: '#fff' },
  stepTitle: { fontSize: 16, fontWeight: '800', color: '#24364B' },
  optional: { fontSize: 13, fontWeight: '500', color: '#9AAABB' },

  vetCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 12,
  },
  vetCardSelected: { borderColor: '#5B8DEF', backgroundColor: 'rgba(238,244,255,0.97)' },
  vetCardUnavailable: { opacity: 0.5 },
  vetAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EEF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  vetAvatarSelected: { backgroundColor: '#5B8DEF' },
  vetInfo: { flex: 1 },
  vetName: { fontSize: 15, fontWeight: '800', color: '#24364B' },
  vetSpecialty: { fontSize: 12, color: '#738295', fontWeight: '600', marginTop: 2 },
  vetMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  vetMetaText: { fontSize: 11, color: '#9AAABB', fontWeight: '600', marginRight: 6 },
  availBadge: {
    backgroundColor: '#E8F7E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexShrink: 0,
  },
  availBadgeText: { fontSize: 11, fontWeight: '700', color: '#67B56E' },
  busyBadge: { backgroundColor: '#FFE8E8' },
  busyBadgeText: { color: '#E35D5D' },

  calendarCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: { fontSize: 16, fontWeight: '800', color: '#24364B' },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#9AAABB' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: 4,
  },
  cellSelected: { backgroundColor: '#5B8DEF' },
  cellToday: { backgroundColor: 'rgba(91,141,239,0.12)' },
  cellText: { fontSize: 14, fontWeight: '600', color: '#24364B' },
  cellTextSelected: { color: '#fff', fontWeight: '800' },
  cellTextDisabled: { color: '#C8D0DA' },
  cellTextToday: { color: '#5B8DEF', fontWeight: '800' },
  availDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#67B56E',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF0F5',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, fontWeight: '600', color: '#738295' },

  slotsCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: {
    width: '22%',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F0F4FA',
    alignItems: 'center',
  },
  slotSelected: { backgroundColor: '#5B8DEF' },
  slotBooked: { backgroundColor: '#F7F8FB', borderWidth: 1, borderColor: '#E8DEE8' },
  slotTime: { fontSize: 14, fontWeight: '700', color: '#24364B' },
  slotTimeSelected: { color: '#fff' },
  slotTimeBooked: { color: '#C8D0DA' },
  bookedLabel: { fontSize: 9, color: '#C8D0DA', fontWeight: '600', marginTop: 2 },

  noteCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  noteInput: {
    fontSize: 14,
    color: '#24364B',
    minHeight: 70,
    textAlignVertical: 'top',
  },

  summaryCard: {
    backgroundColor: 'rgba(238,244,255,0.97)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(91,141,239,0.2)',
    gap: 10,
  },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: '#5B8DEF', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  summaryText: { fontSize: 14, fontWeight: '700', color: '#24364B' },

  confirmBtn: {
    backgroundColor: '#5B8DEF',
    borderRadius: 22,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#5B8DEF',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  confirmBtnDisabled: { backgroundColor: '#B0BAC6', shadowOpacity: 0 },
  confirmText: { fontSize: 17, fontWeight: '800', color: '#fff' },
});
