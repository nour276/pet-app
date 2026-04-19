import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const patientsData = [
  {
    id: '1',
    name: 'Bella',
    type: 'Dog',
    age: '4 years',
    breed: 'Golden Retriever',
    owner: 'Sarah Ahmed',
    history: 'Routine check-up, temperature monitoring',
    status: 'Stable',
  },
  {
    id: '2',
    name: 'Max',
    type: 'Cat',
    age: '2 years',
    breed: 'Persian',
    owner: 'Youssef Ben Ali',
    history: 'Temperature alert follow-up, medication review',
    status: 'Urgent',
  },
  {
    id: '3',
    name: 'Luna',
    type: 'Dog',
    age: '3 years',
    breed: 'Husky',
    owner: 'Meriem Trabelsi',
    history: 'Vaccination record updated, healthy condition',
    status: 'Follow-up',
  },
  {
    id: '4',
    name: 'Milo',
    type: 'Cat',
    age: '1 year',
    breed: 'British Shorthair',
    owner: 'Amine Jlassi',
    history: 'Skin examination and diagnosis update',
    status: 'Stable',
  },
];

export default function PatientsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'All' | 'Urgent' | 'Stable' | 'Follow-up'
  >('All');

  const filteredPatients = useMemo(() => {
    return patientsData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.breed.toLowerCase().includes(search.toLowerCase()) ||
        item.owner.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        selectedFilter === 'All' ? true : item.status === selectedFilter;

      return matchSearch && matchFilter;
    });
  }, [search, selectedFilter]);

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
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.pageTitle}>Patients</Text>
              <Text style={styles.pageSubtitle}>View and manage all pets</Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/vet/add-case')}
            >
              <Ionicons name="add" size={22} color="#24364B" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#7B8EA3" />
            <TextInput
              placeholder="Search by pet, owner, type or breed"
              placeholderTextColor="#8FA0B3"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.filterRow}>
            {['All', 'Urgent', 'Stable', 'Follow-up'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.activeFilter,
                ]}
                onPress={() => setSelectedFilter(filter as any)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredPatients.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.patientCard}
              activeOpacity={0.9}
              onPress={() => router.push('/vet/(tabs)/chat')}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="paw" size={20} color="#7DBE8A" />
                </View>

                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{item.name}</Text>
                  <Text style={styles.patientDetails}>
                    {item.type} • {item.breed} • {item.age}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Urgent'
                      ? styles.urgentBadge
                      : item.status === 'Follow-up'
                      ? styles.followBadge
                      : styles.stableBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === 'Urgent'
                        ? styles.urgentText
                        : item.status === 'Follow-up'
                        ? styles.followText
                        : styles.stableText,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoBlock}>
                <Text style={styles.label}>Owner Info</Text>
                <Text style={styles.value}>{item.owner}</Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.label}>Medical History</Text>
                <Text style={styles.value}>{item.history}</Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  activeOpacity={0.85}
                  onPress={() => router.push('/vet/(tabs)/chat')}
                >
                  <MaterialCommunityIcons
                    name="clipboard-edit-outline"
                    size={16}
                    color="#7FA5C7"
                  />
                  <Text style={styles.secondaryButtonText}>Update Diagnosis</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  activeOpacity={0.85}
                  onPress={() => router.push('/vet/add-case')}
                >
                  <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Add New Case</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.35)' },
  scrollContent: { paddingHorizontal: 18, paddingTop: 60, paddingBottom: 30 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#24364B',
  },

  pageSubtitle: {
    fontSize: 14,
    color: '#EAEAEA',
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.56)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBox: {
    height: 50,
    borderRadius: 50,
    backgroundColor: 'rgba(242, 241, 247, 0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#24364B',
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  filterButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
  },

  activeFilter: {
    backgroundColor: '#FFFFFF',
  },

  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  activeFilterText: {
    color: '#24364B',
  },

  patientCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 30,
    padding: 16,
    marginBottom: 15,
    elevation: 4,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EEF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  patientInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#24364B',
  },

  patientDetails: {
    fontSize: 15,
    color: '#6B7C8F',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  urgentBadge: {
    backgroundColor: '#FDEDED',
  },

  followBadge: {
    backgroundColor: '#FFF6EA',
  },

  stableBadge: {
    backgroundColor: '#EEF8F0',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  urgentText: {
    color: '#D85B5B',
  },

  followText: {
    color: '#D08A3B',
  },

  stableText: {
    color: '#5F9B6B',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5ECF3',
    marginVertical: 13,
  },

  infoBlock: {
    marginBottom: 12,
  },

  label: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#7B8EA3',
  },

  value: {
    fontSize: 14,
    color: '#5F6E7D',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF4FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  secondaryButtonText: {
    color: '#6B8FB1',
    marginLeft: 6,
  },

  primaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#7DBE8A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    marginLeft: 6,
  },
});