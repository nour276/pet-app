import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const historyData = [
  {
    id: '1',
    title: 'Morning Walk',
    subtitle: 'Rita walked 2.4 km',
    time: 'Today • 08:30 AM',
    icon: 'paw',
    color: '#67B56E',
    bg: 'rgba(241,250,241,0.95)',
  },
  {
    id: '2',
    title: 'Vet Check',
    subtitle: 'Routine check completed',
    time: 'Yesterday • 04:00 PM',
    icon: 'medical',
    color: '#5B8DEF',
    bg: 'rgba(238,244,255,0.95)',
  },
  {
    id: '3',
    title: 'Safe Zone Alert',
    subtitle: 'Rita left home area',
    time: 'Yesterday • 01:10 PM',
    icon: 'alert-circle',
    color: '#E35D5D',
    bg: 'rgba(255,240,240,0.95)',
  },
  {
    id: '4',
    title: 'Sleep Tracking',
    subtitle: '7h 45min rest recorded',
    time: 'Mar 29 • 11:00 PM',
    icon: 'moon',
    color: '#8B7CF6',
    bg: 'rgba(243,240,255,0.95)',
  },
];

export default function HistoryScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.title}>History</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={22} color="#4B6A8C" />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.summaryGreen]}>
              <Ionicons name="paw" size={24} color="#67B56E" />
              <Text style={styles.summaryNumber}>2.4 km</Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </View>

            <View style={[styles.summaryCard, styles.summaryBlue]}>
              <Ionicons name="time-outline" size={24} color="#5B8DEF" />
              <Text style={styles.summaryNumber}>4</Text>
              <Text style={styles.summaryLabel}>Events</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {historyData.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={[styles.historyCard, { backgroundColor: item.bg }]}
            >
              <View style={styles.historyLeft}>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historySubtitle}>{item.subtitle}</Text>
                  <Text style={styles.historyTime}>{item.time}</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#92A0B0" />
            </TouchableOpacity>
          ))}

          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>Weekly Summary</Text>
            <Text style={styles.bottomText}>
              Buddy stayed active this week with regular walks, safe tracking, and stable health updates.
            </Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  overlay: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingTop: 55,
    paddingBottom: 30,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#24364B',
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  summaryGreen: {
    backgroundColor: 'rgba(241,250,241,0.95)',
  },
  summaryBlue: {
    backgroundColor: 'rgba(238,244,255,0.95)',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#24364B',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#738295',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 12,
  },
  historyCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 4,
  },
  historySubtitle: {
    fontSize: 13,
    color: '#5C6C7C',
    fontWeight: '500',
    marginBottom: 5,
  },
  historyTime: {
    fontSize: 12,
    color: '#8B99A8',
    fontWeight: '600',
  },
  bottomCard: {
    marginTop: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 18,
  },
  bottomTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 8,
  },
  bottomText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5C6C7C',
    fontWeight: '500',
  },
});