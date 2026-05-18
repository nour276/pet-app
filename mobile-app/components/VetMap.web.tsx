import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VETS } from './vetData';

export default function VetMap() {
  return (
    <View style={styles.listWrapper}>
      {VETS.map((vet, i) => (
        <View key={vet.id} style={[styles.vetCard, i === VETS.length - 1 && { marginBottom: 0 }]}>
          <View style={styles.vetHeader}>
            <View style={styles.vetIconCircle}>
              <Ionicons name="medkit-outline" size={18} color="#5B8DEF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vetName}>{vet.name}</Text>
              <Text style={styles.vetSpecialty}>{vet.specialty}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.detailRow} onPress={() => Linking.openURL(`tel:${vet.phone}`)}>
            <Ionicons name="call-outline" size={14} color="#67B56E" />
            <Text style={[styles.detailText, { color: '#67B56E' }]}>{vet.phone}</Text>
          </TouchableOpacity>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={14} color="#F09A3E" />
            <Text style={styles.detailText}>{vet.address}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listWrapper: { paddingVertical: 8, paddingBottom: 10 },
  vetCard: {
    backgroundColor: '#F7F9FC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EDF0F5',
  },
  vetHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  vetIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vetName: { fontSize: 14, fontWeight: '800', color: '#24364B' },
  vetSpecialty: { fontSize: 11, fontWeight: '600', color: '#5B8DEF', marginTop: 1 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  detailText: { fontSize: 12, fontWeight: '600', color: '#4B5D70', flex: 1, flexWrap: 'wrap' },
});
