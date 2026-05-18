import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Animated,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { VETS } from './vetData';

type Vet  = typeof VETS[number];
type Mode = 'vets' | 'pet';

const PET = {
  name:      'Rita',
  breed:     'Golden Retriever',
  latitude:  36.8190,
  longitude: 10.1658,
  lastSeen:  '2 min ago',
  battery:   90,
  address:   'Ave. Habib Bourguiba, Tunis',
  activity:  'Resting',
  accuracy:  'High accuracy',
  speed:     '0.0 km/h',
};

export default function VetMapScreen() {
  const [mode, setMode]           = useState<Mode>('vets');
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const mapRef      = useRef<MapView>(null);
  const cardAnim    = useRef(new Animated.Value(0)).current;
  const petCardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mode === 'pet') {
      // hide vet card if open
      Animated.timing(cardAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() =>
        setSelectedVet(null),
      );
      // fly to pet
      mapRef.current?.animateToRegion(
        { latitude: PET.latitude, longitude: PET.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 },
        600,
      );
      // slide up pet card
      Animated.spring(petCardAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 9 }).start();
    } else {
      Animated.timing(petCardAnim, { toValue: 0, duration: 160, useNativeDriver: true }).start();
    }
  }, [mode]);

  const selectVet = (vet: Vet) => {
    setMode('vets');
    setSelectedVet(vet);
    mapRef.current?.animateToRegion(
      { latitude: vet.latitude, longitude: vet.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      500,
    );
    Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 9 }).start();
  };

  const clearSelection = () => {
    Animated.timing(cardAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() =>
      setSelectedVet(null),
    );
  };

  const batteryColor = (b: number) => b > 50 ? '#67B56E' : b > 20 ? '#F09A3E' : '#E35D5D';

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={{ latitude: 35.8, longitude: 10.5, latitudeDelta: 5.0, longitudeDelta: 5.0 }}
        onPress={clearSelection}
      >
        {/* ── Vet markers ── */}
        {VETS.map(vet => (
          <Marker
            key={vet.id}
            coordinate={{ latitude: vet.latitude, longitude: vet.longitude }}
            onPress={() => selectVet(vet)}
          >
            <View style={[styles.pin, selectedVet?.id === vet.id && styles.pinSelected]}>
              <Ionicons name="medkit" size={16} color="#fff" />
            </View>
            <Callout tooltip onPress={() => selectVet(vet)}>
              <View style={styles.calloutBubble}>
                <Text style={styles.calloutName}>{vet.name}</Text>
                <Text style={styles.calloutSpecialty}>{vet.specialty}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* ── Pet marker ── */}
        <Marker
          key="pet"
          coordinate={{ latitude: PET.latitude, longitude: PET.longitude }}
          onPress={() => setMode('pet')}
        >
          <View style={styles.petPin}>
            <Ionicons name="paw" size={17} color="#fff" />
          </View>
          <Callout tooltip>
            <View style={styles.calloutBubble}>
              <Text style={styles.calloutName}>{PET.name}</Text>
              <Text style={[styles.calloutSpecialty, { color: '#67B56E' }]}>{PET.breed}</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>

      {/* ── Mode toggle header ── */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'vets' && styles.modeBtnVets]}
          onPress={() => setMode('vets')}
          activeOpacity={0.85}
        >
          <Ionicons name="medkit-outline" size={15} color={mode === 'vets' ? '#fff' : '#738295'} />
          <Text style={[styles.modeBtnText, mode === 'vets' && styles.modeBtnTextActive]}>
            Vets ({VETS.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'pet' && styles.modeBtnPet]}
          onPress={() => setMode('pet')}
          activeOpacity={0.85}
        >
          <Ionicons name="paw-outline" size={15} color={mode === 'pet' ? '#fff' : '#738295'} />
          <Text style={[styles.modeBtnText, mode === 'pet' && styles.modeBtnTextActive]}>
            {PET.name}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Vet list panel ── */}
      {mode === 'vets' && !selectedVet && (
        <View style={styles.listPanel}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {VETS.map(vet => (
              <TouchableOpacity
                key={vet.id}
                style={styles.miniCard}
                onPress={() => selectVet(vet)}
                activeOpacity={0.85}
              >
                <View style={styles.miniCardIcon}>
                  <Ionicons name="medkit-outline" size={20} color="#5B8DEF" />
                </View>
                <Text style={styles.miniCardName} numberOfLines={1}>{vet.name}</Text>
                <Text style={styles.miniCardSpecialty} numberOfLines={1}>{vet.specialty}</Text>
                <View style={styles.miniCardRow}>
                  <Ionicons name="location-outline" size={11} color="#F09A3E" />
                  <Text style={styles.miniCardAddr} numberOfLines={1}>
                    {vet.address.split(',')[1]?.trim() || vet.address}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Vet detail card ── */}
      {selectedVet && (
        <Animated.View style={[styles.detailCard, {
          transform: [{
            translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [280, 0] }),
          }],
        }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={clearSelection}>
            <Ionicons name="close" size={18} color="#738295" />
          </TouchableOpacity>

          <View style={styles.detailHeader}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="medkit" size={26} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailName}>{selectedVet.name}</Text>
              <Text style={styles.detailSpecialty}>{selectedVet.specialty}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={[styles.detailRowIcon, { backgroundColor: '#E8F7E8' }]}>
              <Ionicons name="call-outline" size={16} color="#67B56E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowLabel}>Phone</Text>
              <Text style={styles.detailRowValue}>{selectedVet.phone}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${selectedVet.phone}`)}>
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.detailRowIcon, { backgroundColor: '#FFF3E8' }]}>
              <Ionicons name="location-outline" size={16} color="#F09A3E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailRowLabel}>Address</Text>
              <Text style={styles.detailRowValue}>{selectedVet.address}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.directionsBtn}
            activeOpacity={0.85}
            onPress={() => Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${selectedVet.latitude},${selectedVet.longitude}`,
            )}
          >
            <Ionicons name="navigate-outline" size={18} color="#fff" />
            <Text style={styles.directionsBtnText}>Get Directions</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ── Pet tracking card ── */}
      <Animated.View style={[styles.petTrackCard, {
        transform: [{
          translateY: petCardAnim.interpolate({ inputRange: [0, 1], outputRange: [320, 0] }),
        }],
        // hide when mode !== pet so it doesn't block taps
        pointerEvents: mode === 'pet' ? 'auto' : 'none',
      }]}>
        {/* Live badge + last seen */}
        <View style={styles.petCardTopRow}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.petLastSeen}>Updated {PET.lastSeen}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setMode('vets')}>
            <Ionicons name="close" size={18} color="#738295" />
          </TouchableOpacity>
        </View>

        {/* Pet identity */}
        <View style={styles.petIdentityRow}>
          <View style={styles.petAvatar}>
            <Ionicons name="paw" size={22} color="#fff" />
          </View>
          <View>
            <Text style={styles.petCardName}>{PET.name}</Text>
            <Text style={styles.petCardBreed}>{PET.breed}</Text>
          </View>
        </View>

        {/* Address */}
        <View style={styles.petAddressRow}>
          <Ionicons name="location-outline" size={14} color="#F09A3E" />
          <Text style={styles.petAddressText}>{PET.address}</Text>
        </View>

        {/* Stats chips */}
        <View style={styles.petStatsRow}>
          <View style={[styles.petStatChip, { backgroundColor: '#E8F7E8' }]}>
            <Ionicons name="battery-half" size={14} color={batteryColor(PET.battery)} />
            <Text style={[styles.petStatText, { color: batteryColor(PET.battery) }]}>{PET.battery}% collar</Text>
          </View>
          <View style={[styles.petStatChip, { backgroundColor: '#EEF3FF' }]}>
            <Ionicons name="navigate-outline" size={14} color="#5B8DEF" />
            <Text style={[styles.petStatText, { color: '#5B8DEF' }]}>{PET.accuracy}</Text>
          </View>
          <View style={[styles.petStatChip, { backgroundColor: '#FFF5EA' }]}>
            <Ionicons name="walk-outline" size={14} color="#F09A3E" />
            <Text style={[styles.petStatText, { color: '#F09A3E' }]}>{PET.activity}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.directionsBtn, { backgroundColor: '#67B56E', shadowColor: '#67B56E' }]}
          activeOpacity={0.85}
          onPress={() => Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${PET.latitude},${PET.longitude}`,
          )}
        >
          <Ionicons name="navigate-outline" size={18} color="#fff" />
          <Text style={styles.directionsBtnText}>Navigate to {PET.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* ── Vet pin ── */
  pin: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#5B8DEF', shadowOpacity: 0.4, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 5,
  },
  pinSelected: { backgroundColor: '#F09A3E', transform: [{ scale: 1.15 }] },

  /* ── Pet pin ── */
  petPin: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#67B56E',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#67B56E', shadowOpacity: 0.5, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 7,
  },

  /* ── Callout ── */
  calloutBubble: {
    backgroundColor: '#fff', borderRadius: 12, padding: 10, width: 180,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  calloutName: { fontSize: 13, fontWeight: '800', color: '#24364B' },
  calloutSpecialty: { fontSize: 11, fontWeight: '600', color: '#5B8DEF', marginTop: 2 },

  /* ── Mode toggle header ── */
  headerRow: {
    position: 'absolute', top: 58, alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff', borderRadius: 24, padding: 5,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 }, elevation: 6,
    gap: 4,
  },
  modeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 18,
  },
  modeBtnVets: { backgroundColor: '#5B8DEF' },
  modeBtnPet:  { backgroundColor: '#67B56E' },
  modeBtnText: { fontSize: 13, fontWeight: '700', color: '#738295' },
  modeBtnTextActive: { color: '#fff' },

  /* ── Vet list panel ── */
  listPanel: { position: 'absolute', bottom: 30, left: 0, right: 0 },
  listContent: { paddingHorizontal: 16, gap: 12 },
  miniCard: {
    width: 160, backgroundColor: '#fff', borderRadius: 20, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  miniCardIcon: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#EEF4FF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  miniCardName: { fontSize: 13, fontWeight: '800', color: '#24364B', marginBottom: 2 },
  miniCardSpecialty: { fontSize: 11, fontWeight: '600', color: '#5B8DEF', marginBottom: 6 },
  miniCardRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniCardAddr: { fontSize: 11, color: '#738295', fontWeight: '500', flex: 1 },

  /* ── Shared card base ── */
  closeBtn: {
    position: 'absolute', top: 16, right: 16,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#F0F3F8', justifyContent: 'center', alignItems: 'center',
  },
  directionsBtn: {
    backgroundColor: '#5B8DEF', borderRadius: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 4,
    shadowColor: '#5B8DEF', shadowOpacity: 0.3, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  directionsBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  /* ── Vet detail card ── */
  detailCard: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    backgroundColor: '#fff', borderRadius: 28, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 }, elevation: 10,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  detailIconCircle: {
    width: 54, height: 54, borderRadius: 18, backgroundColor: '#5B8DEF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#5B8DEF', shadowOpacity: 0.35, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  detailName: { fontSize: 17, fontWeight: '800', color: '#24364B' },
  detailSpecialty: { fontSize: 13, fontWeight: '600', color: '#5B8DEF', marginTop: 3 },
  detailDivider: { height: 1, backgroundColor: '#F0F3F8', marginBottom: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  detailRowIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  detailRowLabel: { fontSize: 11, fontWeight: '600', color: '#9AAABB' },
  detailRowValue: { fontSize: 14, fontWeight: '700', color: '#24364B', marginTop: 1 },
  callBtn: { backgroundColor: '#E8F7E8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  callBtnText: { fontSize: 13, fontWeight: '800', color: '#67B56E' },

  /* ── Pet tracking card ── */
  petTrackCard: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    backgroundColor: '#fff', borderRadius: 28, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 }, elevation: 10,
  },
  petCardTopRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16,
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FFEEEE', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  liveDot: {
    width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#E35D5D',
  },
  liveText: { fontSize: 11, fontWeight: '800', color: '#E35D5D', letterSpacing: 1 },
  petLastSeen: { flex: 1, fontSize: 11, fontWeight: '600', color: '#9AAABB' },
  petIdentityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12,
  },
  petAvatar: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: '#67B56E',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#67B56E', shadowOpacity: 0.35, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  petCardName: { fontSize: 18, fontWeight: '800', color: '#24364B' },
  petCardBreed: { fontSize: 13, fontWeight: '600', color: '#738295', marginTop: 2 },
  petAddressRow: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: '#F4F7FB', borderRadius: 12, padding: 10, marginBottom: 14,
  },
  petAddressText: { fontSize: 13, fontWeight: '600', color: '#4B6A8C', flex: 1 },
  petStatsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  petStatChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 4,
  },
  petStatText: { fontSize: 10, fontWeight: '700' },
});
