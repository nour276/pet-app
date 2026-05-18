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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type PetType = 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other';

interface Patient {
  id: number;
  pet: string;
  owner: string;
  type: PetType;
  breed: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  notes: string;
  lastVisit: string;
}

const INITIAL: Patient[] = [
  {
    id: 1,
    pet: 'Max',
    owner: 'Ali Trabelsi',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '3 years',
    gender: 'Male',
    phone: '+216 20 111 222',
    email: 'ali.t@email.com',
    notes: 'No known allergies. Friendly with other animals.',
    lastVisit: '12 May 2025',
  },
  {
    id: 2,
    pet: 'Luna',
    owner: 'Sarra Mansouri',
    type: 'Cat',
    breed: 'Siamese',
    age: '2 years',
    gender: 'Female',
    phone: '+216 21 333 444',
    email: 'sarra.m@email.com',
    notes: 'Shy around strangers. Prefers quiet environment.',
    lastVisit: '8 May 2025',
  },
  {
    id: 3,
    pet: 'Charlie',
    owner: 'Karim Ben Salah',
    type: 'Dog',
    breed: 'Labrador',
    age: '5 years',
    gender: 'Male',
    phone: '+216 22 555 666',
    email: 'karim.b@email.com',
    notes: 'Post-surgery follow-ups required monthly.',
    lastVisit: '2 May 2025',
  },
  {
    id: 4,
    pet: 'Bella',
    owner: 'Nour Gharbi',
    type: 'Cat',
    breed: 'Persian',
    age: '4 years',
    gender: 'Female',
    phone: '+216 23 777 888',
    email: 'nour.g@email.com',
    notes: 'First visit. New patient registration.',
    lastVisit: 'Not yet',
  },
  {
    id: 5,
    pet: 'Rocky',
    owner: 'Yassine Hamdi',
    type: 'Dog',
    breed: 'Bulldog',
    age: '6 years',
    gender: 'Male',
    phone: '+216 24 999 000',
    email: 'yassine.h@email.com',
    notes: 'Dental cleaning scheduled for this month.',
    lastVisit: '28 Apr 2025',
  },
];

const SPECIES_FILTERS = ['All', 'Dog', 'Cat', 'Other'] as const;

const PET_TYPES: PetType[] = ['Dog', 'Cat','Other'];
const GENDERS = ['Male', 'Female'];

const TYPE_ICON: Record<PetType, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  Dog:    'dog-side',
  Cat:    'cat',
  Bird:   'bird',
  Rabbit: 'rabbit',
  Other:  'paw-outline',
};

const TYPE_COLOR: Record<PetType, string> = {
  Dog:    '#5B8DEF',
  Cat:    '#9B8DEF',
  Bird:   '#F09A3E',
  Rabbit: '#7DBE8A',
  Other:  '#738295',
};

const TYPE_BG: Record<PetType, string> = {
  Dog:    '#EEF4FF',
  Cat:    '#F3F0FF',
  Bird:   '#FFF4E8',
  Rabbit: '#E8F7EE',
  Other:  '#F4F7FB',
};

const EMPTY_FORM = {
  pet:       '',
  owner:     '',
  phone:     '',
  email:     '',
  type:      'Dog' as PetType,
  breed:     '',
  age:       '',
  gender:    'Male',
  notes:     '',
};

export default function SecretaryPatients() {
  const [patients, setPatients]     = useState<Patient[]>(INITIAL);
  const [search, setSearch]         = useState('');
  const [speciesFilter, setSpecies] = useState<typeof SPECIES_FILTERS[number]>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [viewPatient, setViewPatient] = useState<Patient | null>(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [errors, setErrors]         = useState<Partial<typeof EMPTY_FORM>>({});

  const dogs   = patients.filter(p => p.type === 'Dog').length;
  const cats   = patients.filter(p => p.type === 'Cat').length;

  const visible = patients.filter(p => {
    const matchSpecies = speciesFilter === 'All' || p.type === speciesFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.pet.toLowerCase().includes(q) ||
      p.owner.toLowerCase().includes(q) ||
      p.breed.toLowerCase().includes(q) ||
      p.phone.includes(q);
    return matchSpecies && matchSearch;
  });

  function setField(key: keyof typeof EMPTY_FORM, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function handleAddSubmit() {
    const newErrors: Partial<typeof EMPTY_FORM> = {};
    if (!form.pet.trim())   newErrors.pet   = 'Pet name is required';
    if (!form.owner.trim()) newErrors.owner = 'Owner name is required';
    if (!form.breed.trim()) newErrors.breed = 'Breed is required';
    if (!form.age.trim())   newErrors.age   = 'Age is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newPatient: Patient = {
      id:        Date.now(),
      pet:       form.pet.trim(),
      owner:     form.owner.trim(),
      type:      form.type,
      breed:     form.breed.trim(),
      age:       form.age.trim(),
      gender:    form.gender,
      phone:     form.phone.trim() || '—',
      email:     form.email.trim() || '—',
      notes:     form.notes.trim(),
      lastVisit: 'Not yet',
    };

    setPatients(prev => [newPatient, ...prev]);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowAdd(false);
    Alert.alert('Patient Added', `${newPatient.pet} has been registered successfully.`);
  }

  function handleDeletePatient(p: Patient) {
    Alert.alert(
      'Remove Patient',
      `Remove ${p.pet} from the patient list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPatients(prev => prev.filter(x => x.id !== p.id));
            setViewPatient(null);
          },
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
            <Text style={styles.title}>Patients</Text>
            <Text style={styles.subtitle}>Patient records & profiles</Text>
          </View>
          <View style={styles.headerBadges}>
            <View style={[styles.miniStat, { backgroundColor: '#EEF4FF' }]}>
              <MaterialCommunityIcons name="dog-side" size={14} color="#5B8DEF" />
              <Text style={[styles.miniStatNum, { color: '#5B8DEF' }]}>{dogs}</Text>
            </View>
            <View style={[styles.miniStat, { backgroundColor: '#F3F0FF' }]}>
              <MaterialCommunityIcons name="cat" size={14} color="#9B8DEF" />
              <Text style={[styles.miniStatNum, { color: '#9B8DEF' }]}>{cats}</Text>
            </View>
            <View style={[styles.miniStat, { backgroundColor: '#E8F7EE' }]}>
              <Ionicons name="paw-outline" size={14} color="#7DBE8A" />
              <Text style={[styles.miniStatNum, { color: '#7DBE8A' }]}>{patients.length}</Text>
            </View>
          </View>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9AAABB" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by pet, owner, breed…"
            placeholderTextColor="#9AAABB"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9AAABB" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Species Filter ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {SPECIES_FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, speciesFilter === f && styles.filterTabActive]}
              onPress={() => setSpecies(f)}
              activeOpacity={0.75}
            >
              {f !== 'All' && (
                <MaterialCommunityIcons
                  name={TYPE_ICON[f as PetType]}
                  size={13}
                  color={speciesFilter === f ? '#fff' : '#738295'}
                />
              )}
              <Text style={[styles.filterTabText, speciesFilter === f && styles.filterTabTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Patient List ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {visible.length === 0 && (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="paw-outline" size={44} color="#C8D5E2" />
              <Text style={styles.emptyText}>No patients found</Text>
            </View>
          )}

          {visible.map(item => {
            const isExpanded = expandedId === item.id;
            const color = TYPE_COLOR[item.type];
            const bg    = TYPE_BG[item.type];

            return (
              <View key={item.id} style={styles.card}>
                <TouchableOpacity
                  style={styles.cardTop}
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.accentBar, { backgroundColor: color }]} />

                  <View style={[styles.iconBox, { backgroundColor: bg }]}>
                    <MaterialCommunityIcons
                      name={TYPE_ICON[item.type]}
                      size={26}
                      color={color}
                    />
                  </View>

                  <View style={styles.cardInfo}>
                    <View style={styles.cardNameRow}>
                      <Text style={styles.petName}>{item.pet}</Text>
                      <View style={[styles.genderBadge, { backgroundColor: bg }]}>
                        <Ionicons
                          name={item.gender === 'Male' ? 'male' : 'female'}
                          size={10}
                          color={color}
                        />
                        <Text style={[styles.genderText, { color }]}>{item.gender}</Text>
                      </View>
                    </View>
                    <Text style={styles.ownerName}>{item.owner}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaChip}>{item.type}</Text>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.metaChip}>{item.breed}</Text>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.metaChip}>{item.age}</Text>
                    </View>
                  </View>

                  <View style={styles.cardRight}>
                    <TouchableOpacity
                      style={[styles.viewBtn, { backgroundColor: bg }]}
                      onPress={() => setViewPatient(item)}
                    >
                      <Text style={[styles.viewBtnText, { color }]}>View</Text>
                    </TouchableOpacity>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={15}
                      color="#9AAABB"
                      style={{ marginTop: 6 }}
                    />
                  </View>
                </TouchableOpacity>

                {/* ── Expanded ── */}
                {isExpanded && (
                  <View style={styles.expanded}>
                    <View style={styles.divider} />

                    <View style={styles.expandedGrid}>
                      <View style={styles.expandedItem}>
                        <Text style={styles.expandedLabel}>Phone</Text>
                        <View style={styles.phoneChip}>
                          <Ionicons name="call-outline" size={12} color="#7DBE8A" />
                          <Text style={styles.phoneChipText}>{item.phone}</Text>
                        </View>
                      </View>
                      <View style={styles.expandedItem}>
                        <Text style={styles.expandedLabel}>Last Visit</Text>
                        <Text style={styles.expandedValue}>{item.lastVisit}</Text>
                      </View>
                    </View>

                    {item.email !== '—' && (
                      <View style={styles.emailRow}>
                        <Ionicons name="mail-outline" size={14} color="#9AAABB" />
                        <Text style={styles.emailText}>{item.email}</Text>
                      </View>
                    )}

                    {item.notes ? (
                      <View style={styles.notesBox}>
                        <Text style={styles.notesLabel}>Notes</Text>
                        <Text style={styles.notesText}>{item.notes}</Text>
                      </View>
                    ) : null}

                    <TouchableOpacity
                      style={styles.fullProfileBtn}
                      onPress={() => setViewPatient(item)}
                    >
                      <Ionicons name="document-text-outline" size={15} color="#5B8DEF" />
                      <Text style={styles.fullProfileBtnText}>Full Profile</Text>
                    </TouchableOpacity>
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

      {/* ── View Patient Modal ── */}
      <Modal
        visible={!!viewPatient}
        transparent
        animationType="slide"
        onRequestClose={() => setViewPatient(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {viewPatient && (() => {
              const color = TYPE_COLOR[viewPatient.type];
              const bg    = TYPE_BG[viewPatient.type];
              return (
                <>
                  <View style={styles.modalHandle} />

                  {/* header */}
                  <View style={styles.viewModalHeader}>
                    <View style={[styles.viewModalIconCircle, { backgroundColor: bg }]}>
                      <MaterialCommunityIcons
                        name={TYPE_ICON[viewPatient.type]}
                        size={32}
                        color={color}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.viewModalNameRow}>
                        <Text style={styles.viewModalPetName}>{viewPatient.pet}</Text>
                        <View style={[styles.genderBadge, { backgroundColor: bg }]}>
                          <Ionicons
                            name={viewPatient.gender === 'Male' ? 'male' : 'female'}
                            size={10}
                            color={color}
                          />
                          <Text style={[styles.genderText, { color }]}>{viewPatient.gender}</Text>
                        </View>
                      </View>
                      <Text style={styles.viewModalOwner}>{viewPatient.owner}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setViewPatient(null)}
                      style={styles.modalCloseX}
                    >
                      <Ionicons name="close" size={18} color="#738295" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalDivider} />

                  {/* info grid */}
                  <View style={styles.modalGrid}>
                    <View style={[styles.modalGridItem, { backgroundColor: bg }]}>
                      <MaterialCommunityIcons name={TYPE_ICON[viewPatient.type]} size={18} color={color} />
                      <Text style={styles.modalGridLabel}>Type</Text>
                      <Text style={[styles.modalGridValue, { color }]}>{viewPatient.type}</Text>
                    </View>
                    <View style={styles.modalGridItem}>
                      <Ionicons name="paw-outline" size={18} color="#F09A3E" />
                      <Text style={styles.modalGridLabel}>Breed</Text>
                      <Text style={styles.modalGridValue}>{viewPatient.breed}</Text>
                    </View>
                    <View style={styles.modalGridItem}>
                      <Ionicons name="time-outline" size={18} color="#7DBE8A" />
                      <Text style={styles.modalGridLabel}>Age</Text>
                      <Text style={styles.modalGridValue}>{viewPatient.age}</Text>
                    </View>
                    <View style={styles.modalGridItem}>
                      <Ionicons name="calendar-outline" size={18} color="#9B8DEF" />
                      <Text style={styles.modalGridLabel}>Last Visit</Text>
                      <Text style={styles.modalGridValue}>{viewPatient.lastVisit}</Text>
                    </View>
                  </View>

                  {/* contact */}
                  <View style={styles.contactCard}>
                    <Text style={styles.contactTitle}>Contact Info</Text>
                    <View style={styles.contactRow}>
                      <View style={styles.contactIconBox}>
                        <Ionicons name="call-outline" size={16} color="#7DBE8A" />
                      </View>
                      <Text style={styles.contactText}>{viewPatient.phone}</Text>
                    </View>
                    {viewPatient.email !== '—' && (
                      <View style={styles.contactRow}>
                        <View style={styles.contactIconBox}>
                          <Ionicons name="mail-outline" size={16} color="#5B8DEF" />
                        </View>
                        <Text style={styles.contactText}>{viewPatient.email}</Text>
                      </View>
                    )}
                  </View>

                  {viewPatient.notes ? (
                    <View style={styles.modalNotesBox}>
                      <Text style={styles.modalNotesLabel}>Clinical Notes</Text>
                      <Text style={styles.modalNotesText}>{viewPatient.notes}</Text>
                    </View>
                  ) : null}

                  {/* actions */}
                  <View style={styles.viewModalActions}>
                    <TouchableOpacity
                      style={[styles.viewModalActionBtn, { backgroundColor: '#FFEEEE', flex: 0.45 }]}
                      onPress={() => handleDeletePatient(viewPatient)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#E35D5D" />
                      <Text style={[styles.viewModalActionText, { color: '#E35D5D' }]}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.viewModalActionBtn, { backgroundColor: '#24364B', flex: 1 }]}
                      onPress={() => setViewPatient(null)}
                    >
                      <Text style={[styles.viewModalActionText, { color: '#fff' }]}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            })()}
          </View>
        </View>
      </Modal>

      {/* ── Add Patient Modal ── */}
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

              <View style={styles.addModalHeader}>
                <View style={styles.addModalIconCircle}>
                  <MaterialCommunityIcons name="paw-outline" size={22} color="#5B8DEF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addModalTitle}>New Patient</Text>
                  <Text style={styles.addModalSubtitle}>Register a new patient</Text>
                </View>
                <TouchableOpacity
                  onPress={() => { setShowAdd(false); setForm(EMPTY_FORM); setErrors({}); }}
                  style={styles.addModalCloseX}
                >
                  <Ionicons name="close" size={20} color="#738295" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>

                {/* Pet Name */}
                <Text style={styles.fieldLabel}>Pet Name <Text style={styles.required}>*</Text></Text>
                <View style={[styles.fieldBox, !!errors.pet && styles.fieldBoxError]}>
                  <MaterialCommunityIcons name="paw-outline" size={18} color={errors.pet ? '#E35D5D' : '#9AAABB'} />
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

                {/* Email */}
                <Text style={styles.fieldLabel}>Email</Text>
                <View style={styles.fieldBox}>
                  <Ionicons name="mail-outline" size={18} color="#9AAABB" />
                  <TextInput
                    value={form.email}
                    onChangeText={v => setField('email', v)}
                    placeholder="owner@email.com"
                    placeholderTextColor="#C8D5E2"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.fieldInput}
                  />
                </View>

                {/* Pet Type */}
                <Text style={styles.fieldLabel}>Pet Type</Text>
                <View style={styles.pillRow}>
                  {PET_TYPES.map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.pill,
                        form.type === t && { backgroundColor: TYPE_COLOR[t], borderColor: TYPE_COLOR[t] },
                      ]}
                      onPress={() => setField('type', t)}
                    >
                      <MaterialCommunityIcons
                        name={TYPE_ICON[t]}
                        size={13}
                        color={form.type === t ? '#fff' : '#738295'}
                      />
                      <Text style={[styles.pillText, form.type === t && styles.pillTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Gender */}
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.pillRow}>
                  {GENDERS.map(g => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.pill, form.gender === g && styles.pillActive]}
                      onPress={() => setField('gender', g)}
                    >
                      <Ionicons
                        name={g === 'Male' ? 'male' : 'female'}
                        size={13}
                        color={form.gender === g ? '#fff' : '#738295'}
                      />
                      <Text style={[styles.pillText, form.gender === g && styles.pillTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Breed */}
                <Text style={styles.fieldLabel}>Breed <Text style={styles.required}>*</Text></Text>
                <View style={[styles.fieldBox, !!errors.breed && styles.fieldBoxError]}>
                  <Ionicons name="search-outline" size={18} color={errors.breed ? '#E35D5D' : '#9AAABB'} />
                  <TextInput
                    value={form.breed}
                    onChangeText={v => setField('breed', v)}
                    placeholder="e.g. Golden Retriever"
                    placeholderTextColor="#C8D5E2"
                    style={styles.fieldInput}
                  />
                </View>
                {errors.breed ? <Text style={styles.errorText}>{errors.breed}</Text> : null}

                {/* Age */}
                <Text style={styles.fieldLabel}>Age <Text style={styles.required}>*</Text></Text>
                <View style={[styles.fieldBox, !!errors.age && styles.fieldBoxError]}>
                  <Ionicons name="time-outline" size={18} color={errors.age ? '#E35D5D' : '#9AAABB'} />
                  <TextInput
                    value={form.age}
                    onChangeText={v => setField('age', v)}
                    placeholder="e.g. 3 years"
                    placeholderTextColor="#C8D5E2"
                    style={styles.fieldInput}
                  />
                </View>
                {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

                {/* Notes */}
                <Text style={styles.fieldLabel}>Clinical Notes</Text>
                <View style={[styles.fieldBox, styles.notesFieldBox]}>
                  <TextInput
                    value={form.notes}
                    onChangeText={v => setField('notes', v)}
                    placeholder="Allergies, special needs, observations…"
                    placeholderTextColor="#C8D5E2"
                    multiline
                    numberOfLines={3}
                    style={[styles.fieldInput, styles.notesInput]}
                  />
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handleAddSubmit} activeOpacity={0.85}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.submitBtnText}>Register Patient</Text>
                </TouchableOpacity>

                <View style={{ height: 32 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  miniStatNum: {
    fontSize: 14,
    fontWeight: '800',
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

  /* filter */
  filterRow: {
    flexGrow: 0,
    marginBottom: 14,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
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
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardInfo: { flex: 1 },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  petName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#24364B',
  },
  genderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  genderText: {
    fontSize: 10,
    fontWeight: '800',
  },
  ownerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#738295',
    marginTop: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 5,
  },
  metaChip: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AAABB',
  },
  metaDot: {
    color: '#C8D5E2',
    fontWeight: '800',
    fontSize: 11,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  viewBtn: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },

  /* expanded */
  expanded: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginBottom: 14,
  },
  expandedGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  expandedItem: { flex: 1 },
  expandedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9AAABB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  expandedValue: {
    fontSize: 13,
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
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#738295',
  },
  notesBox: {
    backgroundColor: '#F8FAFD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
  fullProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EEF4FF',
    borderRadius: 14,
    paddingVertical: 10,
  },
  fullProfileBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B8DEF',
  },

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 96,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B8DEF',
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
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginBottom: 16,
  },

  /* view modal */
  viewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  viewModalIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewModalPetName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#24364B',
  },
  viewModalOwner: {
    fontSize: 13,
    fontWeight: '600',
    color: '#738295',
    marginTop: 3,
  },
  modalCloseX: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F4F7FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
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
  contactCard: {
    backgroundColor: '#F8FAFD',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 14,
  },
  contactTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9AAABB',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#24364B',
  },
  modalNotesBox: {
    backgroundColor: '#F8FAFD',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#9B8DEF',
    marginBottom: 18,
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
  viewModalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewModalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 52,
    borderRadius: 18,
  },
  viewModalActionText: {
    fontSize: 14,
    fontWeight: '800',
  },

  /* add modal */
  addModalCard: {
    maxHeight: '92%',
    paddingBottom: 0,
  },
  addModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  addModalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#EEF4FF',
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

  /* form */
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#738295',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 14,
  },
  required: { color: '#E35D5D' },
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
  submitBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#5B8DEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    shadowColor: '#5B8DEF',
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
