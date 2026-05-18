import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { VETS } from './vetData';

export default function VetMap() {
  return (
    <View>
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 36.0,
            longitude: 10.5,
            latitudeDelta: 4.5,
            longitudeDelta: 4.5,
          }}
        >
          {VETS.map(vet => (
            <Marker
              key={vet.id}
              coordinate={{ latitude: vet.latitude, longitude: vet.longitude }}
              pinColor="#5B8DEF"
            >
              <Callout tooltip={false}>
                <View style={styles.callout}>
                  <Text style={styles.calloutName}>{vet.name}</Text>
                  <Text style={styles.calloutSpecialty}>{vet.specialty}</Text>
                  <View style={styles.calloutRow}>
                    <Ionicons name="call-outline" size={13} color="#67B56E" />
                    <Text style={styles.calloutDetail}>{vet.phone}</Text>
                  </View>
                  <View style={styles.calloutRow}>
                    <Ionicons name="location-outline" size={13} color="#F09A3E" />
                    <Text style={styles.calloutDetail}>{vet.address}</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
      <Text style={styles.mapHint}>Tap a pin to see vet details</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 6,
    height: 260,
  },
  map: { width: '100%', height: '100%' },
  mapHint: {
    fontSize: 12,
    color: '#9AAABB',
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 10,
  },
  callout: {
    width: 220,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  calloutName: { fontSize: 15, fontWeight: '800', color: '#24364B', marginBottom: 2 },
  calloutSpecialty: { fontSize: 12, fontWeight: '600', color: '#5B8DEF', marginBottom: 8 },
  calloutRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 4 },
  calloutDetail: { fontSize: 12, color: '#4B5D70', fontWeight: '600', flex: 1, flexWrap: 'wrap' },
});
