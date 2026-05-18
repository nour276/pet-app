import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VETS } from './vetData';

type Vet = typeof VETS[number];

export default function VetMapScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (id: string) => setExpanded(prev => (prev === id ? null : id));

  return (
    <ImageBackground
      source={require('@/assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Ionicons name="location" size={22} color="#5B8DEF" />
          <Text style={styles.headerTitle}>Nearby Vets</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{VETS.length}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Tap a card to see details</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {VETS.map((vet: Vet) => {
            const open = expanded === vet.id;
            return (
              <TouchableOpacity
                key={vet.id}
                style={[styles.card, open && styles.cardOpen]}
                onPress={() => toggle(vet.id)}
                activeOpacity={0.88}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, open && styles.iconCircleOpen]}>
                    <Ionicons name="medkit" size={22} color={open ? '#fff' : '#5B8DEF'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vetName}>{vet.name}</Text>
                    <Text style={styles.vetSpecialty}>{vet.specialty}</Text>
                  </View>
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#B0BAC6" />
                </View>

                {open && (
                  <View style={styles.details}>
                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                      <View style={[styles.detailIcon, { backgroundColor: '#E8F7E8' }]}>
                        <Ionicons name="call-outline" size={15} color="#67B56E" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.detailLabel}>Phone</Text>
                        <Text style={styles.detailValue}>{vet.phone}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.callBtn}
                        onPress={() => Linking.openURL(`tel:${vet.phone}`)}
                      >
                        <Ionicons name="call" size={14} color="#fff" />
                        <Text style={styles.callBtnText}>Call</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={[styles.detailIcon, { backgroundColor: '#FFF3E8' }]}>
                        <Ionicons name="location-outline" size={15} color="#F09A3E" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.detailLabel}>Address</Text>
                        <Text style={styles.detailValue}>{vet.address}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.directionsBtn}
                      onPress={() =>
                        Linking.openURL(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vet.address)}`,
                        )
                      }
                      activeOpacity={0.85}
                    >
                      <Ionicons name="navigate-outline" size={16} color="#fff" />
                      <Text style={styles.directionsBtnText}>Open in Maps</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1, backgroundColor: 'rgba(240,245,255,0.55)',
    paddingTop: 58, paddingHorizontal: 16, paddingBottom: 20,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#24364B', flex: 1 },
  headerBadge: {
    backgroundColor: '#5B8DEF', borderRadius: 12, width: 28, height: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  headerBadgeText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#738295', fontWeight: '600', marginBottom: 18 },
  list: { gap: 12, paddingBottom: 20 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 22, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  cardOpen: { borderColor: '#5B8DEF', shadowOpacity: 0.12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 46, height: 46, borderRadius: 15, backgroundColor: '#EEF4FF',
    justifyContent: 'center', alignItems: 'center',
  },
  iconCircleOpen: { backgroundColor: '#5B8DEF' },
  vetName: { fontSize: 15, fontWeight: '800', color: '#24364B' },
  vetSpecialty: { fontSize: 12, fontWeight: '600', color: '#5B8DEF', marginTop: 2 },
  details: { marginTop: 12 },
  divider: { height: 1, backgroundColor: '#F0F3F8', marginBottom: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  detailIcon: { width: 34, height: 34, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  detailLabel: { fontSize: 11, fontWeight: '600', color: '#9AAABB' },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#24364B', marginTop: 1 },
  callBtn: {
    backgroundColor: '#67B56E', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  callBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  directionsBtn: {
    backgroundColor: '#5B8DEF', borderRadius: 14, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 2,
    shadowColor: '#5B8DEF', shadowOpacity: 0.25, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  directionsBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
