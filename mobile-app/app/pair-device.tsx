import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'scanning' | 'found' | 'connecting' | 'connected';

interface CollarDevice {
  id: string;
  name: string;
  signal: number;   // 1-4
  battery: number;  // percentage
  type: 'gps' | 'health';
}

const MOCK_DEVICES: CollarDevice[] = [
  { id: 'collar_01', name: 'PetTrack Collar A1',  signal: 4, battery: 87, type: 'gps' },
  { id: 'collar_02', name: 'SmartCollar BX2',     signal: 2, battery: 43, type: 'health' },
  { id: 'collar_03', name: 'PetTrack Collar C3',  signal: 3, battery: 61, type: 'gps' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SignalBars({ strength }: { strength: number }) {
  return (
    <View style={sc.row}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            sc.bar,
            { height: 6 + i * 4 },
            i <= strength ? sc.barFilled : sc.barEmpty,
          ]}
        />
      ))}
    </View>
  );
}

const sc = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 5, borderRadius: 2 },
  barFilled: { backgroundColor: '#4CAF7D' },
  barEmpty: { backgroundColor: '#D0D7E2' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PairDeviceScreen() {
  const [step, setStep]                   = useState<Step>('scanning');
  const [selected, setSelected]           = useState<CollarDevice | null>(null);
  const [connectStage, setConnectStage]   = useState(0);

  // Pulse animation for scanning rings
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (step !== 'scanning') return;
    const makeLoop = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1.6, duration: 900, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1,   duration: 900, useNativeDriver: true }),
        ])
      );
    const a1 = makeLoop(pulse1, 0);
    const a2 = makeLoop(pulse2, 300);
    const a3 = makeLoop(pulse3, 600);
    a1.start(); a2.start(); a3.start();
    const t = setTimeout(() => setStep('found'), 3000);
    return () => { a1.stop(); a2.stop(); a3.stop(); clearTimeout(t); };
  }, [step]);

  // Connect stages
  const STAGES = ['Authenticating…', 'Syncing configuration…', 'Activating GPS…', 'Ready!'];

  useEffect(() => {
    if (step !== 'connecting') return;
    setConnectStage(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    STAGES.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setConnectStage(i);
        if (i === STAGES.length - 1) setTimeout(() => setStep('connected'), 600);
      }, i * 900));
    });
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const handleConnect = async () => {
    if (!selected) return;
    setStep('connecting');
    try {
      await AsyncStorage.setItem('pairedCollar', JSON.stringify(selected));
    } catch { /* non-critical */ }
  };

  const handleFinish = () => router.replace('/(tabs)');
  const handleSkip   = () => router.replace('/(tabs)');

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ImageBackground
      source={require('../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color="#24364B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Connect Collar</Text>
          {step !== 'connected' ? (
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : <View style={{ width: 48 }} />}
        </View>

        {/* Step indicators */}
        <View style={styles.stepRow}>
          {(['scanning', 'found', 'connecting', 'connected'] as Step[]).map((s, i) => {
            const stepIdx   = ['scanning', 'found', 'connecting', 'connected'].indexOf(step);
            const isActive  = i === stepIdx;
            const isDone    = i < stepIdx;
            return (
              <View key={s} style={styles.stepItem}>
                <View style={[
                  styles.stepDot,
                  isDone   && styles.stepDotDone,
                  isActive && styles.stepDotActive,
                ]}>
                  {isDone
                    ? <Ionicons name="checkmark" size={10} color="#fff" />
                    : <Text style={[styles.stepNum, isActive && { color: '#fff' }]}>{i + 1}</Text>
                  }
                </View>
                {i < 3 && <View style={[styles.stepLine, isDone && styles.stepLineDone]} />}
              </View>
            );
          })}
        </View>

        {/* ── STEP: Scanning ── */}
        {step === 'scanning' && (
          <View style={styles.centerCard}>
            <View style={styles.pulseContainer}>
              <Animated.View style={[styles.ring, styles.ring3, { transform: [{ scale: pulse3 }] }]} />
              <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: pulse2 }] }]} />
              <Animated.View style={[styles.ring, styles.ring1, { transform: [{ scale: pulse1 }] }]} />
              <View style={styles.btCircle}>
                <MaterialCommunityIcons name="bluetooth" size={38} color="#fff" />
              </View>
            </View>
            <Text style={styles.stepTitle}>Searching for Collars</Text>
            <Text style={styles.stepSubtitle}>
              Make sure your collar is powered on and within 5 metres.
            </Text>
            <View style={styles.hintRow}>
              <Ionicons name="information-circle-outline" size={16} color="#7A8EA8" />
              <Text style={styles.hintText}>Hold the collar button for 3 s to enter pairing mode.</Text>
            </View>
          </View>
        )}

        {/* ── STEP: Devices Found ── */}
        {step === 'found' && (
          <View style={styles.card}>
            <View style={styles.foundHeader}>
              <Ionicons name="radio-outline" size={18} color="#5B8DEF" />
              <Text style={styles.foundTitle}>{MOCK_DEVICES.length} collars nearby</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {MOCK_DEVICES.map((device) => {
                const isSelected = selected?.id === device.id;
                return (
                  <TouchableOpacity
                    key={device.id}
                    style={[styles.deviceRow, isSelected && styles.deviceRowSelected]}
                    onPress={() => setSelected(device)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.deviceIcon, isSelected && styles.deviceIconSelected]}>
                      <MaterialCommunityIcons
                        name={device.type === 'gps' ? 'map-marker-radius' : 'heart-pulse'}
                        size={20}
                        color={isSelected ? '#fff' : '#5B8DEF'}
                      />
                    </View>
                    <View style={styles.deviceInfo}>
                      <Text style={[styles.deviceName, isSelected && styles.deviceNameSelected]}>
                        {device.name}
                      </Text>
                      <View style={styles.deviceMeta}>
                        <SignalBars strength={device.signal} />
                        <Text style={styles.deviceMetaText}>
                          {device.signal === 4 ? 'Strong' : device.signal === 3 ? 'Good' : 'Weak'}
                        </Text>
                        <View style={styles.dot} />
                        <Ionicons name="battery-half-outline" size={14} color="#7A8EA8" />
                        <Text style={styles.deviceMetaText}>{device.battery}%</Text>
                        <View style={styles.dot} />
                        <Text style={[styles.deviceType, device.type === 'gps' ? styles.typeGps : styles.typeHealth]}>
                          {device.type.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={22} color="#5B8DEF" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={[styles.primaryBtn, !selected && styles.primaryBtnDisabled]}
              onPress={handleConnect}
              disabled={!selected}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="bluetooth-connect" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>
                {selected ? `Connect to ${selected.name}` : 'Select a collar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rescanBtn} onPress={() => setStep('scanning')}>
              <Ionicons name="refresh-outline" size={16} color="#5B8DEF" />
              <Text style={styles.rescanText}>Rescan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP: Connecting ── */}
        {step === 'connecting' && (
          <View style={styles.centerCard}>
            <View style={styles.connectingCircle}>
              <ActivityIndicator size="large" color="#5B8DEF" />
            </View>
            <Text style={styles.stepTitle}>Connecting…</Text>
            <Text style={styles.stepSubtitle}>{selected?.name}</Text>

            <View style={styles.stageList}>
              {STAGES.map((label, i) => {
                const done    = i < connectStage;
                const active  = i === connectStage;
                return (
                  <View key={label} style={styles.stageRow}>
                    <View style={[styles.stageIcon,
                      done   && styles.stageIconDone,
                      active && styles.stageIconActive,
                    ]}>
                      {done
                        ? <Ionicons name="checkmark" size={12} color="#fff" />
                        : active
                          ? <ActivityIndicator size="small" color="#fff" />
                          : <View style={styles.stageDot} />
                      }
                    </View>
                    <Text style={[styles.stageLabel,
                      done   && styles.stageLabelDone,
                      active && styles.stageLabelActive,
                    ]}>
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ── STEP: Connected ── */}
        {step === 'connected' && selected && (
          <View style={styles.centerCard}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={48} color="#fff" />
            </View>
            <Text style={styles.stepTitle}>Collar Connected!</Text>
            <Text style={styles.stepSubtitle}>{selected.name}</Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons name="battery-half" size={22} color="#4CAF7D" />
                <Text style={styles.statValue}>{selected.battery}%</Text>
                <Text style={styles.statLabel}>Battery</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="wifi" size={22} color="#5B8DEF" />
                <Text style={styles.statValue}>
                  {selected.signal === 4 ? 'Strong' : selected.signal === 3 ? 'Good' : 'Weak'}
                </Text>
                <Text style={styles.statLabel}>Signal</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="map-marker-check" size={22} color="#E87A3D" />
                <Text style={styles.statValue}>Ready</Text>
                <Text style={styles.statLabel}>GPS</Text>
              </View>
            </View>

            <View style={styles.featureList}>
              {[
                { icon: 'map-marker-radius', label: 'Live GPS tracking active' },
                { icon: 'heart-pulse',        label: 'Health monitoring enabled' },
                { icon: 'bell-ring-outline',  label: 'Alerts & notifications on' },
              ].map((f) => (
                <View key={f.label} style={styles.featureRow}>
                  <View style={styles.featureIcon}>
                    <MaterialCommunityIcons name={f.icon as any} size={16} color="#4CAF7D" />
                  </View>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.85}>
              <Ionicons name="home-outline" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(225,235,252,0.55)',
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 30,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A2B3C' },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
  },
  skipText: { fontSize: 13, fontWeight: '700', color: '#7A8EA8' },

  // Step indicator
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D8E3F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: { backgroundColor: '#5B8DEF' },
  stepDotDone:   { backgroundColor: '#4CAF7D' },
  stepNum: { fontSize: 11, fontWeight: '700', color: '#9AAABB' },
  stepLine: { width: 36, height: 2, backgroundColor: '#D8E3F0', marginHorizontal: 4 },
  stepLineDone: { backgroundColor: '#4CAF7D' },

  // Shared card
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#5B8DEF',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  centerCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B8DEF',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  // Scanning pulse
  pulseContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
  },
  ring1: { width: 100, height: 100, borderColor: 'rgba(91,141,239,0.35)' },
  ring2: { width: 130, height: 130, borderColor: 'rgba(91,141,239,0.20)' },
  ring3: { width: 160, height: 160, borderColor: 'rgba(91,141,239,0.10)' },
  btCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B8DEF',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 7,
  },
  stepTitle: { fontSize: 22, fontWeight: '800', color: '#1A2B3C', marginBottom: 8, textAlign: 'center' },
  stepSubtitle: { fontSize: 14, color: '#556273', textAlign: 'center', lineHeight: 21, marginBottom: 20, paddingHorizontal: 8 },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#EEF4FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  hintText: { fontSize: 12, color: '#7A8EA8', fontWeight: '500', flex: 1 },

  // Found step
  foundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
  },
  foundTitle: { fontSize: 15, fontWeight: '800', color: '#1A2B3C' },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5ECF8',
    marginBottom: 10,
    backgroundColor: '#F7F9FC',
  },
  deviceRowSelected: {
    borderColor: '#5B8DEF',
    backgroundColor: '#EEF4FF',
  },
  deviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#E7EFFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceIconSelected: { backgroundColor: '#5B8DEF' },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 14, fontWeight: '700', color: '#1A2B3C', marginBottom: 4 },
  deviceNameSelected: { color: '#3A6FD0' },
  deviceMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  deviceMetaText: { fontSize: 11, color: '#7A8EA8', fontWeight: '500' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#C0CBDA' },
  deviceType: { fontSize: 10, fontWeight: '700', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 },
  typeGps:    { backgroundColor: '#EEF4FF', color: '#5B8DEF' },
  typeHealth: { backgroundColor: '#FFF0F8', color: '#E86FA0' },
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  rescanText: { fontSize: 13, color: '#5B8DEF', fontWeight: '600' },

  // Connecting step
  connectingCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#C8D8F8',
  },
  stageList: { width: '100%', gap: 12, marginTop: 8 },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stageIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5ECF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageIconActive: { backgroundColor: '#5B8DEF' },
  stageIconDone:   { backgroundColor: '#4CAF7D' },
  stageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#A8B5C4' },
  stageLabel: { fontSize: 14, color: '#9AAABB', fontWeight: '500' },
  stageLabelActive: { color: '#1A2B3C', fontWeight: '700' },
  stageLabelDone:   { color: '#4CAF7D', fontWeight: '600' },

  // Connected step
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4CAF7D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#4CAF7D',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F4F8FF',
    borderRadius: 18,
    padding: 16,
    width: '100%',
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 14, fontWeight: '800', color: '#1A2B3C' },
  statLabel: { fontSize: 11, color: '#7A8EA8', fontWeight: '500' },
  statDivider: { width: 1, height: 40, backgroundColor: '#E0E8F4' },
  featureList: { width: '100%', gap: 10, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#E8F7EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureLabel: { fontSize: 13, fontWeight: '600', color: '#2C3E50' },

  // Primary button
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#5B8DEF',
    borderRadius: 18,
    height: 54,
    width: '100%',
    shadowColor: '#5B8DEF',
    shadowOpacity: 0.38,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
    marginTop: 4,
  },
  primaryBtnDisabled: { backgroundColor: '#B0C4DE', shadowOpacity: 0 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
