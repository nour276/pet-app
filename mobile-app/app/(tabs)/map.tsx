import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

  const monastirRegion = {
    latitude: 35.7770,
    longitude: 10.8262,
    latitudeDelta: 0.055,
    longitudeDelta: 0.055,
  };

  const petLocation = {
    latitude: 35.7770,
    longitude: 10.8262,
  };

  const vets = [
    {
      id: '1',
      name: "Pet's hope",
      description: 'Monastir',
      latitude: 35.7825,
      longitude: 10.8195,
    },
    {
      id: '2',
      name: 'Dr Amira Bannour',
      description: 'Skanes, Monastir',
      latitude: 35.7615,
      longitude: 10.8115,
    },
    {
      id: '3',
      name: 'Clinique Vétérinaire La Falaise',
      description: 'Route de la Falaise, Monastir',
      latitude: 35.7905,
      longitude: 10.8405,
    },
    {
      id: '4',
      name: 'Vet Clinic Monastir',
      description: 'Nearby veterinarian',
      latitude: 35.7738,
      longitude: 10.8305,
    },
  ];

  const recenterMap = () => {
    mapRef.current?.animateToRegion(monastirRegion, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={monastirRegion}
      >
        <Marker
          coordinate={petLocation}
          title="Rita"
          description="Current pet location"
        >
          <View style={styles.petMarker}>
            <Ionicons name="paw" size={18} color="#fff" />
          </View>
        </Marker>

        {vets.map((vet) => (
          <Marker
            key={vet.id}
            coordinate={{
              latitude: vet.latitude,
              longitude: vet.longitude,
            }}
            title={vet.name}
            description={vet.description}
          >
            <View style={styles.vetMarker}>
              <MaterialCommunityIcons name="medical-bag" size={18} color="#fff" />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.topCard}>
        <Text style={styles.topTitle}>Pet Location</Text>
        <Text style={styles.topSubtitle}>Monastir • Rita is safe</Text>
      </View>

      <TouchableOpacity style={styles.centerButton} onPress={recenterMap}>
        <Ionicons name="locate" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Live Tracking</Text>
        <Text style={styles.infoText}>Pet: Rita</Text>
        <Text style={styles.infoText}>Status: Safe</Text>
        <Text style={styles.infoText}>Location: Monastir</Text>
        <Text style={styles.infoText}>Vets shown: {vets.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topCard: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 26,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  topTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#24364B',
    textAlign: 'center',
  },
  topSubtitle: {
    fontSize: 14,
    color: '#6B7A8C',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  infoCard: {
    position: 'absolute',
    left: 60,
    right: 60,
    bottom: 15,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 26,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#5C6C7C',
    fontWeight: '600',
    marginBottom: 6,
  },
  centerButton: {
    position: 'absolute',
    right: 18,
    bottom: 310,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  petMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#88BC55',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  vetMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F09A3E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});