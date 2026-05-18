import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Appointment {
  id: number;
  pet: string;
  owner: string;
  phone: string;
  time: string;
  date: string;
  type: string;
  notes: string;
  status: Status;
}

const INITIAL: Appointment[] = [
  {
    id: 1,
    pet: 'Max',
    owner: 'Ali Trabelsi',
    phone: '+216 20 111 222',
    time: '09:00',
    date: 'Today',
    type: 'Checkup',
    notes: 'Annual health check. No known allergies.',
    status: 'Confirmed',
  },
  {
    id: 2,
    pet: 'Luna',
    owner: 'Sarra Mansouri',
    phone: '+216 21 333 444',
    time: '10:30',
    date: 'Today',
    type: 'Vaccination',
    notes: 'Rabies booster due. Owner may be late.',
    status: 'Pending',
  },
  {
    id: 3,
    pet: 'Charlie',
    owner: 'Karim Ben Salah',
    phone: '+216 22 555 666',
    time: '13:00',
    date: 'Today',
    type: 'Follow-up',
    notes: 'Post-surgery check on left leg.',
    status: 'Confirmed',
  },
  {
    id: 4,
    pet: 'Bella',
    owner: 'Nour Gharbi',
    phone: '+216 23 777 888',
    time: '15:30',
    date: 'Today',
    type: 'Checkup',
    notes: 'First visit. New patient.',
    status: 'Pending',
  },
  {
    id: 5,
    pet: 'Rocky',
    owner: 'Yassine Hamdi',
    phone: '+216 24 999 000',
    time: '11:00',
    date: 'Tomorrow',
    type: 'Dental',
    notes: 'Teeth cleaning procedure scheduled.',
    status: 'Confirmed',
  },
];

const FILTERS    = ['All', 'Confirmed', 'Pending', 'Cancelled'] as const;
const VISIT_TYPES = ['Checkup', 'Vaccination', 'Follow-up', 'Dental', 'Surgery', 'Emergency'];
const DATE_OPTIONS = ['Today', 'Tomorrow', 'This Week'];

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Checkup:     'stethoscope-outline' as any,
  Vaccination: 'medical-outline',
  'Follow-up': 'refresh-circle-outline',
  Dental:      'sparkles-outline',
  Surgery:     'cut-outline',
  Emergency:   'alert-circle-outline',
};

const STATUS_COLOR: Record<Status, string> = {
  Confirmed: '#7DBE8A',
  Pending:   '#F09A3E',
  Cancelled: '#E35D5D',
};

const STATUS_BG: Record<Status, string> = {
  Confirmed: '#E8F7EE',
  Pending:   '#FFF3E8',
  Cancelled: '#FFEEEE',
};

const EMPTY_FORM = {
  pet:   '',
  owner: '',
  phone: '',
  time:  '',
  date:  'Today',
  type:  'Checkup',
  notes: '',
};

export default function SecretaryAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL);
  const [filter, setFilter]             = useState<typeof FILTERS[number]>('All');
  const [search, setSearch]             = useState('');
  const [expandedId, setExpandedId]     = useState<number | null>(null);
  const [detailAppt, setDetailAppt]     = useState<Appointment | null>(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [errors, setErrors]             = useState<Partial<typeof EMPTY_FORM>>({});

  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const pending   = appointments.filter(a => a.status === 'Pending').length;

  const visible = appointments.filter(a => {
    const matchFilter = filter === 'All' || a.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.pet.toLowerCase().includes(q) ||
      a.owner.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  function setField(key: keyof typeof EMPTY_FORM, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validateTime(t: string) {
    return /^([01]?\d|2[0-3]):[0-5]\d$/.test(t.trim());
  }

  function handleAddSubmit() {
    const newErrors: Partial<typeof EMPTY_FORM> = {};
    if (!form.pet.trim())   newErrors.pet   = 'Pet name is required';
    if (!form.owner.trim()) newErrors.owner = 'Owner name is required';
    if (!form.time.trim())  newErrors.time  = 'Time is required';
    else if (!validateTime(form.time)) newErrors.time = 'Use HH:MM format (e.g. 14:30)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newAppt: Appointment = {
      id:     Date.now(),
      pet:    form.pet.trim(),
      owner:  form.owner.trim(),
      phone:  form.phone.trim() || '—',
      time:   form.time.trim(),
      date:   form.date,
      type:   form.type,
      notes:  form.notes.trim(),
      status: 'Pending',
    };

    setAppointments(prev => [newAppt, ...prev]);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowAdd(false);
    Alert.alert('Appointment Added', `${newAppt.pet}'s appointment has been scheduled for ${newAppt.time} (${newAppt.date}).`);
  }

  function changeStatus(id: number, status: Status) {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
  }

  function handleConfirm(item: Appointment) {
    if (item.status === 'Confirmed') return;
    Alert.alert(
      'Confirm Appointment',
      `Confirm ${item.pet}'s appointment at ${item.time}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => changeStatus(item.id, 'Confirmed') },
      ]
    );
  }

  function handleCancel(item: Appointment) {
    if (item.status === 'Cancelled') return;
    Alert.alert(
      'Cancel Appointment',
      `Cancel ${item.pet}'s appointment at ${item.time}?`,
      [
        { text: 'Back', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => changeStatus(item.id, 'Cancelled'),
        },
      ]
    );
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
            <Text style={styles.title}>Appointments</Text>
            <Text style={styles.subtitle}>Manage the clinic schedule</Text>
          </View>
          <View style={styles.headerBadges}>
            <View style={[styles.miniStat, { backgroundColor: '#E8F7EE' }]}>
              <Text style={[styles.miniStatNum, { color: '#7DBE8A' }]}>{confirmed}</Text>
              <Text style={styles.miniStatLbl}>Done</Text>
            </View>
            <View style={[styles.miniStat, { backgroundColor: '#FFF3E8' }]}>
              <Text style={[styles.miniStatNum, { color: '#F09A3E' }]}>{pending}</Text>
              <Text style={styles.miniStatLbl}>Wait</Text>
            </View>
          </View>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9AAABB" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by pet, owner, or type…"
            placeholderTextColor="#9AAABB"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9AAABB" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Filter Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── List ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {visible.length === 0 && (
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-outline" size={40} color="#C8D5E2" />
              <Text style={styles.emptyText}>No appointments found</Text>
            </View>
          )}

          {visible.map(item => {
            const isExpanded  = expandedId === item.id;
            const statusColor = STATUS_COLOR[item.status];
            const statusBg    = STATUS_BG[item.status];

            return (
              <View key={item.id} style={styles.card}>
                <TouchableOpacity
                  style={styles.cardTop}
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.accentBar, { backgroundColor: statusColor }]} />

                  <View style={styles.cardIconBox}>
                    <Ionicons
                      name={TYPE_ICON[item.type] ?? 'medical-outline'}
                      size={22}
                      color={statusColor}
                    />
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.petName}>{item.pet}</Text>
                    <Text style={styles.ownerName}>{item.owner}</Text>
                    <View style={styles.cardMeta}>
                      <Ionicons name="time-outline" size={13} color="#9AAABB" />
                      <Text style={styles.metaText}>{item.time}</Text>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.metaText}>{item.date}</Text>
                    </View>
                  </View>

                  <View style={styles.cardRight}>
                    <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {item.status}
                      </Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#9AAABB"
                      style={{ marginTop: 6 }}
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.expandedSection}>
                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Visit Type</Text>
                        <Text style={styles.detailValue}>{item.type}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Phone</Text>
                        <View style={styles.phoneChip}>
                          <Ionicons name="call-outline" size={12} color="#7DBE8A" />
                          <Text style={styles.phoneChipText}>{item.phone}</Text>
                        </View>
                      </View>
                    </View>

                    {item.notes ? (
                      <View style={styles.notesBox}>
                        <Text style={styles.notesLabel}>Notes</Text>
                        <Text style={styles.notesText}>{item.notes}</Text>
                      </View>
                    ) : null}

                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          { backgroundColor: item.status === 'Confirmed' ? '#E8F7EE' : '#7DBE8A' },
                        ]}
                        onPress={() => handleConfirm(item)}
                        disabled={item.status === 'Confirmed'}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={16}
                          color={item.status === 'Confirmed' ? '#7DBE8A' : '#fff'}
                        />
                        <Text style={[
                          styles.actionBtnText,
                          { color: item.status === 'Confirmed' ? '#7DBE8A' : '#fff' },
                        ]}>
                          {item.status === 'Confirmed' ? 'Confirmed' : 'Confirm'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          {
                            backgroundColor: item.status === 'Cancelled' ? '#FFEEEE' : '#fff',
                            borderWidth: 1,
                            borderColor: '#E35D5D',
                          },
                        ]}
                        onPress={() => handleCancel(item)}
                        disabled={item.status === 'Cancelled'}
                      >
                        <Ionicons name="close-circle-outline" size={16} color="#E35D5D" />
                        <Text style={[styles.actionBtnText, { color: '#E35D5D' }]}>
                          {item.status === 'Cancelled' ? 'Cancelled' : 'Cancel'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#EEF4FF' }]}
                        onPress={() => setDetailAppt(item)}
                      >
                        <Ionicons name="document-text-outline" size={16} color="#5B8DEF" />
                        <Text style={[styles.actionBtnText, { color: '#5B8DEF' }]}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAdd(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* ── Detail Modal ── */}
      <Modal
        visible={!!detailAppt}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailAppt(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {detailAppt && (
              <>
                <View style={styles.modalHandle} />

                <View style={styles.modalHeaderRow}>
                  <View style={[styles.modalIconCircle, { backgroundColor: STATUS_BG[detailAppt.status] }]}>
                    <Ionicons
                      name={TYPE_ICON[detailAppt.type] ?? 'medical-outline'}
                      size={26}
                      color={STATUS_COLOR[detailAppt.status]}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalPetName}>{detailAppt.pet}</Text>
                    <Text style={styles.modalOwnerName}>{detailAppt.owner}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[detailAppt.status] }]}>
                    <Text style={[styles.statusText, { color: STATUS_COLOR[detailAppt.status] }]}>
                      {detailAppt.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalDivider} />

                <View style={styles.modalGrid}>
                  <View style={styles.modalGridItem}>
                    <Ionicons name="time-outline" size={18} color="#7DBE8A" />
                    <Text style={styles.modalGridLabel}>Time</Text>
                    <Text style={styles.modalGridValue}>{detailAppt.time}</Text>
                  </View>
                  <View style={styles.modalGridItem}>
                    <Ionicons name="calendar-outline" size={18} color="#5B8DEF" />
                    <Text style={styles.modalGridLabel}>Date</Text>
                    <Text style={styles.modalGridValue}>{detailAppt.date}</Text>
                  </View>
                  <View style={styles.modalGridItem}>
                    <Ionicons name="medical-outline" size={18} color="#F09A3E" />
                    <Text style={styles.modalGridLabel}>Type</Text>
                    <Text style={styles.modalGridValue}>{detailAppt.type}</Text>
                  </View>
                  <View style={styles.modalGridItem}>
                    <Ionicons name="call-outline" size={18} color="#9B8DEF" />
                    <Text style={styles.modalGridLabel}>Phone</Text>
                    <Text style={styles.modalGridValue}>{detailAppt.phone}</Text>
                  </View>
                </View>

                {detailAppt.notes ? (
                  <View style={styles.modalNotesBox}>
                    <Text style={styles.modalNotesLabel}>Notes</Text>
                    <Text style={styles.modalNotesText}>{detailAppt.notes}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setDetailAppt(null)}
                >
                  <Text style={styles.modalCloseBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Add Appointment Modal ── */}
      <Modal
        visible={showAdd}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowAdd(false); setForm(EMPTY_FORM); setErrors({}); }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, styles.addModalCard]}>
              <View style={styles.modalHandle} />

              {/* modal title */}
              <View style={styles.addModalHeader}>
                <View style={styles.addModalIconCircle}>
                  <Ionicons name="calendar-outline" size={22} color="#7DBE8A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addModalTitle}>New Appointment</Text>
                  <Text style={styles.addModalSubtitle}>Fill in the details below</Text>
                </View>
                <TouchableOpacity
                  onPress={() => { setShowAdd(false); setForm(EMPTY_FORM); setErrors({}); }}
                  style={styles.addModalCloseX}
                >
                  <Ionicons name="close" size={20} color="#738295" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.addFormScroll}>

                {/* Pet Name */}
                <Text style={styles.fieldLabel}>Pet Name <Text style={styles.required}>*</Text></Text>
                <View style={[styles.fieldBox, !!errors.pet && styles.fieldBoxError]}>
                  <Ionicons name="paw-outline" size={18} color={errors.pet ? '#E35D5D' : '#9AAABB'} />
                  <TextInput
                    value={form.pet}
                    onChangeText={v => setField('pet', v)}
                    placeholder="e.g. Max"
                    placeholderTextColor="#C8D5E2"
                    style={styles.fieldInput}
                  />
                </View>
                {errors.pet ? <Text style={styles.errorText}>{errors.pet}</Text> : null}

                {/* Owner Name */}
                <Text style={styles.fieldLabel}>Owner Name <Text style={styles.required}>*</Text></Text>
                <View style={[styles.fieldBox, !!errors.owner && styles.fieldBoxError]}>
                  <Ionicons name="person-outline" size={18} color={errors.owner ? '#E35D5D' : '#9AAABB'} />
                  <TextInput
                    value={form.owner}
                    onChangeText={v => setField('owner', v)}
                    placeholder="e.g. Ali Trabelsi"
                    placeholderTextColor="#C8D5E2"
                    style={styles.fieldInput}
                  />
                </View>
                {errors.owner ? <Text style={styles.errorText}>{errors.owner}</Text> : null}

                {/* Phone */}
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <View style={styles.fieldBox}>
                  <Ionicons name="call-outline" size={18} color="#9AAABB" />
                  <TextInput
                    value={form.phone}
                    onChangeText={v => setField('phone', v)}
                    placeholder="+216 XX XXX XXX"
                    placeholderTextColor="#C8D5E2"
                    keyboardType="phone-pad"
                    style={styles.fieldInput}
                  />
                </View>

                {/* Date */}
                <Text style={styles.fieldLabel}>Date</Text>
                <View style={styles.pillRow}>
                  {DATE_OPTIONS.map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.pill, form.date === d && styles.pillActive]}
                      onPress={() => setField('date', d)}
                    >
                      <Text style={[styles.pillText, form.date === d && styles.pillTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Time */}
                <Text style={styles.fieldLabel}>Time <Text style={styles.required}>*</Text></Text>
                <View style={[styles.fieldBox, !!errors.time && styles.fieldBoxError]}>
                  <Ionicons name="time-outline" size={18} color={errors.time ? '#E35D5D' : '#9AAABB'} />
                  <TextInput
                    value={form.time}
                    onChangeText={v => setField('time', v)}
                    placeholder="HH:MM  (e.g. 14:30)"
                    placeholderTextColor="#C8D5E2"
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                    style={styles.fieldInput}
                  />
                </View>
                {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}

                {/* Visit Type */}
                <Text style={styles.fieldLabel}>Visit Type</Text>
                <View style={styles.pillRow}>
                  {VISIT_TYPES.map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.pill, form.type === t && styles.pillActive]}
                      onPress={() => setField('type', t)}
                    >
                      <Ionicons
                        name={TYPE_ICON[t] ?? 'medical-outline'}
                        size={13}
                        color={form.type === t ? '#fff' : '#738295'}
                      />
                      <Text style={[styles.pillText, form.type === t && styles.pillTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Notes */}
                <Text style={styles.fieldLabel}>Notes</Text>
                <View style={[styles.fieldBox, styles.notesFieldBox]}>
                  <TextInput
                    value={form.notes}
                    onChangeText={v => setField('notes', v)}
                    placeholder="Any additional information…"
                    placeholderTextColor="#C8D5E2"
                    multiline
                    numberOfLines={3}
                    style={[styles.fieldInput, styles.notesInput]}
                  />
                </View>

                {/* Submit */}
                <TouchableOpacity style={styles.submitBtn} onPress={handleAddSubmit} activeOpacity={0.85}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.submitBtnText}>Add Appointment</Text>
                </TouchableOpacity>

                <View style={{ height: 24 }} />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(235,242,255,0.55)',
    paddingTop: 58,
  },

  /* header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 14,
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
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  miniStat: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 44,
  },
  miniStatNum: {
    fontSize: 17,
    fontWeight: '800',
  },
  miniStatLbl: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9AAABB',
    textTransform: 'uppercase',
  },

  /* search */
  searchBox: {
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#24364B',
  },

  /* filter tabs */
  filterRow: {
    flexGrow: 0,
    marginBottom: 14,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: '#24364B',
    borderColor: '#24364B',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#738295',
  },
  filterTabTextActive: {
    color: '#fff',
  },

  /* list */
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 12,
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C8D5E2',
  },

  /* card */
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  cardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F4F7FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardInfo: { flex: 1 },
  petName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#24364B',
  },
  ownerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#738295',
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AAABB',
  },
  metaDot: {
    fontSize: 11,
    color: '#C8D5E2',
    fontWeight: '800',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },

  /* expanded */
  expandedSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: { flex: 1 },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9AAABB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#24364B',
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F7EE',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  phoneChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7DBE8A',
  },
  notesBox: {
    backgroundColor: '#F8FAFD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#9B8DEF',
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9AAABB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#738295',
    lineHeight: 19,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 14,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 96,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#7DBE8A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7DBE8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },

  /* shared modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },

  /* detail modal */
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  modalIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPetName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#24364B',
  },
  modalOwnerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#738295',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginBottom: 18,
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  modalGridItem: {
    width: '47%',
    backgroundColor: '#F8FAFD',
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  modalGridLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9AAABB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  modalGridValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#24364B',
  },
  modalNotesBox: {
    backgroundColor: '#F8FAFD',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#9B8DEF',
    marginBottom: 20,
  },
  modalNotesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9AAABB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalNotesText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#738295',
    lineHeight: 20,
  },
  modalCloseBtn: {
    height: 52,
    borderRadius: 18,
    backgroundColor: '#24364B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  /* add modal */
  addModalCard: {
    maxHeight: '90%',
    paddingBottom: 0,
  },
  addModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  addModalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#E8F7EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#24364B',
  },
  addModalSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9AAABB',
    marginTop: 1,
  },
  addModalCloseX: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F4F7FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFormScroll: {
    paddingBottom: 12,
  },

  /* form fields */
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#738295',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 14,
  },
  required: {
    color: '#E35D5D',
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFD',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fieldBoxError: {
    borderColor: '#E35D5D',
    backgroundColor: '#FFF5F5',
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#24364B',
  },
  notesFieldBox: {
    height: 90,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  notesInput: {
    textAlignVertical: 'top',
    height: 66,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E35D5D',
    marginTop: 4,
    marginLeft: 4,
  },

  /* pills */
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4F7FB',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: '#24364B',
    borderColor: '#24364B',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#738295',
  },
  pillTextActive: {
    color: '#fff',
  },

  /* submit */
  submitBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#7DBE8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    shadowColor: '#7DBE8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
