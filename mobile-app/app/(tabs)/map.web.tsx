import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function MapScreenWeb() {
  return (
    <View style={styles.container}>
      <View style={styles.fakeMap}>
        <View style={styles.topCard}>
          <Text style={styles.topTitle}>Pet Location</Text>
          <Text style={styles.topSubtitle}>Monastir • Rita is safe</Text>
        </View>

        <View style={[styles.marker, { top: '45%', left: '48%', backgroundColor: '#88BC55' }]}>
          <Ionicons name="paw" size={18} color="#fff" />
        </View>

        <View style={[styles.marker, { top: '30%', left: '35%', backgroundColor: '#F09A3E' }]}>
          <MaterialCommunityIcons name="medical-bag" size={18} color="#fff" />
        </View>

        <View style={[styles.marker, { top: '55%', left: '30%', backgroundColor: '#F09A3E' }]}>
          <MaterialCommunityIcons name="medical-bag" size={18} color="#fff" />
        </View>

        <View style={[styles.marker, { top: '35%', left: '65%', backgroundColor: '#F09A3E' }]}>
          <MaterialCommunityIcons name="medical-bag" size={18} color="#fff" />
        </View>

        <View style={[styles.marker, { top: '60%', left: '62%', backgroundColor: '#F09A3E' }]}>
          <MaterialCommunityIcons name="medical-bag" size={18} color="#fff" />
        </View>

        <View style={styles.centerButton}>
          <Ionicons name="locate" size={22} color="#fff" />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Live Tracking</Text>
          <Text style={styles.infoText}>Pet: Rita</Text>
          <Text style={styles.infoText}>Status: Safe</Text>
          <Text style={styles.infoText}>Location: Monastir</Text>
          <Text style={styles.infoText}>Vets shown: 4</Text>
          <Text style={styles.webText}>Interactive map works on mobile only</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2F8',
  },
  fakeMap: {
    flex: 1,
    backgroundColor: '#DCEAF5',
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
    zIndex: 2,
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
  marker: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1,
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
  webText: {
    marginTop: 8,
    fontSize: 14,
    color: '#5B8DEF',
    fontWeight: '700',
  },
});