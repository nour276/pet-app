import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PairDeviceScreen() {
  const [selectedDevice, setSelectedDevice] = useState('RitaCollar_01');

  return (
    <ImageBackground
          source={require('../assets/images/sky.jpg')}
          style={styles.container}
          resizeMode="cover"
        >
            
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#2B3B52" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pair Device</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.card}>
          <View style={styles.scanCard}>
            <View style={styles.scanCircleOuter}>
              <View style={styles.scanWaveOne} />
              <View style={styles.scanWaveTwo} />
              <View style={styles.scanCircleInner}>
                <MaterialCommunityIcons name="bluetooth" size={34} color="#fff" />
              </View>
            </View>

            <Text style={styles.scanText}>BLE4 Scan...</Text>
          </View>

          <TouchableOpacity style={styles.deviceRow} onPress={() => setSelectedDevice('RitaCollar_01')}>
            <View style={styles.deviceLeft}>
              <View style={styles.deviceIconBox}>
                <MaterialCommunityIcons name="dog-side" size={22} color="#4D79C7" />
              </View>
              <Text style={styles.deviceName}>{selectedDevice}</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#7F8C9B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  backButton: {
    width: 34,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#24364B',
  },
  headerSpacer: {
    width: 34,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  scanCard: {
    backgroundColor: '#F7F8FB',
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E1E7F0',
  },
  scanCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  scanWaveOne: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: '#C7DBF7',
  },
  scanWaveTwo: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#D9E8FB',
  },
  scanCircleInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#24364B',
  },
  deviceRow: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#F7F8FB',
    borderWidth: 1,
    borderColor: '#D8DEE8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  deviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deviceIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E7F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#24364B',
  },
  connectButton: {
    backgroundColor: '#88BC55',
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});