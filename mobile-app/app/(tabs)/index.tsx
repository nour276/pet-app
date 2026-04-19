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

export default function HomeScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const loadPets = async () => {
    try {
      const savedPets = await AsyncStorage.getItem('pets');

      if (savedPets) {
        const parsedPets: Pet[] = JSON.parse(savedPets);

        const petsWithDefaults = parsedPets.map((pet, index) => ({
          ...pet,
          battery: pet.battery ?? (index === 0 ? 90 : 76),
          connected: pet.connected ?? true,
          image: pet.image ?? null,
        }));

        setPets(petsWithDefaults);
      } else {
        const demoPets: Pet[] = [
          {
            id: '1',
            name: 'Rita',
            type: 'Dog',
            image: require('@/assets/images/doudou.jpeg'),
            battery: 90,
            connected: true,
          },
          {
            id: '2',
            name: 'louli',
            type: 'cat',
            image: require('@/assets/images/louli.jpeg'),
            battery: 72,
            connected: false,
          },
        ];

        setPets(demoPets);
      }
    } catch (error) {
      console.log('LOAD PETS ERROR:', error);

      const fallbackPets: Pet[] = [
        {
          id: '1',
          name: 'Rita',
          type: 'Dog',
          image: require('@/assets/images/rita.jpeg'),
          battery: 90,
          connected: true,
        },
      ];

      setPets(fallbackPets);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadPets();
    }, [])
  );

  useEffect(() => {
    if (pets.length > 0 && !selectedPetId) {
      setSelectedPetId(String(pets[0].id));
    }
  }, [pets, selectedPetId]);

  useEffect(() => {
    if (pets.length > 0 && selectedPetId) {
      const exists = pets.some((pet) => String(pet.id) === selectedPetId);
      if (!exists) {
        setSelectedPetId(String(pets[0].id));
      }
    }
  }, [pets, selectedPetId]);

  const selectedPet = useMemo(() => {
    if (pets.length === 0) return null;
    return pets.find((pet) => String(pet.id) === selectedPetId) || pets[0];
  }, [pets, selectedPetId]);

  const renderPetImage = (image: any, isMainImage = false) => {
    const imageStyle = isMainImage ? styles.petImage : styles.smallPetImage;

    if (!image) {
      return (
        <View style={[imageStyle, styles.imagePlaceholder]}>
          <Ionicons name="paw" size={isMainImage ? 42 : 20} color="#9AA9B8" />
        </View>
      );
    }

    return <Image source={image} style={imageStyle} resizeMode="cover" />;
  };

  return (
    <ImageBackground
      source={require('@/assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.overlay}>
          <Text style={styles.mainPetName}>
            {selectedPet ? selectedPet.name.toUpperCase() : 'MY PETS'}
          </Text>

          {selectedPet ? (
            <>
              <View style={styles.petCard}>
                {renderPetImage(selectedPet.image, true)}

                <View style={styles.statusRow}>
                  <View style={styles.statusItem}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: selectedPet.connected ? '#6DBB63' : '#D66A6A',
                        },
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {selectedPet.connected ? 'Connected' : 'Not connected'}
                    </Text>
                  </View>

                  <View style={styles.statusItem}>
                    <Ionicons
                      name="battery-half-outline"
                      size={18}
                      color={selectedPet.connected ? '#6DBB63' : '#92A0B0'}
                    />
                    <Text style={styles.statusText}>
                      Battery: {selectedPet.battery ?? 90}%
                    </Text>
                  </View>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.petSwitcherRow}
              >
                {pets.map((pet) => {
                  const isSelected = String(pet.id) === String(selectedPet.id);

                  return (
                    <TouchableOpacity
                      key={String(pet.id)}
                      style={[
                        styles.smallPetCard,
                        isSelected && styles.smallPetCardSelected,
                      ]}
                      onPress={() => setSelectedPetId(String(pet.id))}
                      activeOpacity={0.8}
                    >
                      {renderPetImage(pet.image, false)}
                      <Text style={styles.smallPetName}>{pet.name}</Text>
                      <Text style={styles.smallPetType}>{pet.type}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="paw-outline" size={44} color="#93A4B5" />
              <Text style={styles.emptyTitle}>No pets yet</Text>
              <Text style={styles.emptySubtitle}>Add your first pet to see it here</Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.greenCard]}>
              <Text style={styles.statTitle}>Heart Rate</Text>
              <View style={styles.statValueRow}>
                <Ionicons name="heart" size={22} color="#67B56E" />
                <Text style={[styles.statValue, { color: '#67B56E' }]}>85 bpm</Text>
              </View>
            </View>

            <View style={[styles.statCard, styles.orangeCard]}>
              <Text style={styles.statTitle}>Temperature</Text>
              <View style={styles.statValueRow}>
                <Ionicons name="flame" size={22} color="#F09A3E" />
                <Text style={[styles.statValue, { color: '#F09A3E' }]}>38.5°C</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionCard, styles.chatCard]}
              onPress={() => router.push('/chat-vet')}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubble-ellipses" size={24} color="#5B8DEF" />
              <Text style={[styles.actionCardText, { color: '#5B8DEF' }]}>
                Chat with Vet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.addCard]}
              onPress={() => router.push('/add-pet')}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={24} color="#88BC55" />
              <Text style={[styles.actionCardText, { color: '#88BC55' }]}>
                Add Pet
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.appointmentCard}>
            <View style={styles.appointmentLeft}>
              <MaterialCommunityIcons name="calendar-heart" size={24} color="#6F95C7" />
              <View>
                <Text style={styles.appointmentTitle}>Dr. Smith</Text>
                <Text style={styles.appointmentSubtitle}>May 10, 2025 - 10:00 AM</Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#92A0B0" />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 60,
  },
  mainPetName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#24364B',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 14,
  },
  petCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 28,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 14,
  },
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    backgroundColor: '#E8EEF5',
  },
  imagePlaceholder: {
    backgroundColor: '#E8EEF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 6,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 13,
    color: '#5C6C7C',
    fontWeight: '600',
  },
  petSwitcherRow: {
    paddingBottom: 18,
    paddingLeft: 2,
    paddingRight: 4,
  },
  smallPetCard: {
    width: 110,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  smallPetCardSelected: {
    borderWidth: 2,
    borderColor: '#88BC55',
  },
  smallPetImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    backgroundColor: '#E8EEF5',
  },
  smallPetName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#24364B',
    textAlign: 'center',
  },
  smallPetType: {
    fontSize: 12,
    color: '#738295',
    marginTop: 2,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '800',
    color: '#24364B',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#738295',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
  },
  greenCard: {
    backgroundColor: 'rgba(241,250,241,0.95)',
  },
  orangeCard: {
    backgroundColor: 'rgba(255,245,236,0.95)',
  },
  statTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5D70',
    marginBottom: 10,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  actionCard: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatCard: {
    backgroundColor: 'rgba(253,254,255,0.96)',
  },
  addCard: {
    backgroundColor: 'rgba(244,250,238,0.96)',
  },
  actionCardText: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#24364B',
  },
  viewAll: {
    color: '#6B8FDD',
    fontWeight: '700',
  },
  appointmentCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  appointmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4b3024',
  },
  appointmentSubtitle: {
    fontSize: 13,
    color: '#738295',
    marginTop: 2,
  },
});