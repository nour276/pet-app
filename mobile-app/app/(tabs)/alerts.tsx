import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Alert = {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  type: 'warning' | 'danger' | 'success' | 'info';
  read: boolean;
  group: 'Today' | 'Yesterday' | 'Earlier';
};

const INITIAL_ALERTS: Alert[] = [
  { id: '1', title: 'Low Battery', message: "Rita's collar battery is below 20%. Please charge soon.", time: '5 min ago', icon: 'battery-low-outline', type: 'warning', read: false, group: 'Today' },
  { id: '2', title: 'Safe Zone Exit', message: 'Rita moved outside the defined safe zone near home.', time: '12 min ago', icon: 'alert-circle-outline', type: 'danger', read: false, group: 'Today' },
  { id: '3', title: 'Appointment Reminder', message: 'Dr. Sarah Johnson tomorrow at 10:00 AM.', time: '1 hour ago', icon: 'calendar-outline', type: 'info', read: false, group: 'Today' },
  { id: '4', title: 'Heart Rate Normal', message: "Rita's heart rate is stable at 85 bpm.", time: '3 hours ago', icon: 'heart-outline', type: 'success', read: true, group: 'Today' },
  { id: '5', title: 'Location Updated', message: 'New GPS location received successfully.', time: 'Yesterday 06:00 PM', icon: 'location-outline', type: 'info', read: true, group: 'Yesterday' },
  { id: '6', title: 'Vet Visit Complete', message: 'Annual check-up with Dr. Amira Bannour completed.', time: 'Yesterday 04:30 PM', icon: 'medical-outline', type: 'success', read: true, group: 'Yesterday' },
  { id: '7', title: 'High Temperature', message: "Rita's temperature reached 39.8°C. Monitor closely.", time: 'Mar 29 02:00 PM', icon: 'thermometer-outline', type: 'danger', read: true, group: 'Earlier' },
];

const FILTERS = ['All', 'Urgent', 'Health', 'Location'] as const;
type Filter = typeof FILTERS[number];

const typeColors: Record<string, string> = {
  warning: '#F09A3E', danger: '#E35D5D', success: '#67B56E', info: '#5B8DEF',
};
const typeBg: Record<string, string> = {
  warning: 'rgba(255,245,236,0.97)', danger: 'rgba(255,240,240,0.97)',
  success: 'rgba(241,250,241,0.97)', info: 'rgba(238,244,255,0.97)',
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const unreadCount = alerts.filter(a => !a.read).length;

  const filtered = alerts.filter(a => {
    if (activeFilter === 'Urgent') return a.type === 'danger' || a.type === 'warning';
    if (activeFilter === 'Health') return ['heart-outline', 'thermometer-outline', 'medical-outline'].includes(a.icon);
    if (activeFilter === 'Location') return ['location-outline', 'alert-circle-outline'].includes(a.icon);
    return true;
  });

  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  const markRead = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  const dismiss = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  const groups: Alert['group'][] = ['Today', 'Yesterday', 'Earlier'];

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.overlay}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Alerts</Text>
              {unreadCount > 0 && (
                <Text style={styles.subtitle}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
              )}
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
                <Text style={styles.markAllText}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Summary */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,240,240,0.97)' }]}>
              <MaterialCommunityIcons name="alert" size={24} color="#E35D5D" />
              <Text style={styles.summaryNumber}>{alerts.filter(a => a.type === 'danger').length}</Text>
              <Text style={styles.summaryLabel}>Urgent</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,245,236,0.97)' }]}>
              <Ionicons name="warning" size={24} color="#F09A3E" />
              <Text style={styles.summaryNumber}>{alerts.filter(a => a.type === 'warning').length}</Text>
              <Text style={styles.summaryLabel}>Warnings</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: 'rgba(241,250,241,0.97)' }]}>
              <Ionicons name="checkmark-circle" size={24} color="#67B56E" />
              <Text style={styles.summaryNumber}>{alerts.filter(a => a.type === 'success').length}</Text>
              <Text style={styles.summaryLabel}>Resolved</Text>
            </View>
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Grouped alerts */}
          {groups.map(group => {
            const groupItems = filtered.filter(a => a.group === group);
            if (!groupItems.length) return null;
            return (
              <View key={group}>
                <Text style={styles.groupLabel}>{group}</Text>
                {groupItems.map(alert => (
                  <TouchableOpacity
                    key={alert.id}
                    activeOpacity={0.88}
                    style={[styles.alertCard, { backgroundColor: typeBg[alert.type] }, !alert.read && styles.alertCardUnread]}
                    onPress={() => markRead(alert.id)}
                  >
                    <View style={[styles.iconWrapper, { backgroundColor: `${typeColors[alert.type]}18` }]}>
                      <Ionicons name={alert.icon as any} size={22} color={typeColors[alert.type]} />
                    </View>
                    <View style={styles.alertContent}>
                      <View style={styles.alertTitleRow}>
                        <Text style={styles.alertTitle}>{alert.title}</Text>
                        {!alert.read && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.alertMessage} numberOfLines={2}>{alert.message}</Text>
                      <Text style={styles.alertTime}>{alert.time}</Text>
                    </View>
                    <TouchableOpacity style={styles.dismissBtn} onPress={() => dismiss(alert.id)}>
                      <Ionicons name="close" size={16} color="#AAB5C2" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}

          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={48} color="#9AAABB" />
              <Text style={styles.emptyText}>No alerts in this category</Text>
            </View>
          )}

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  overlay: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: 'rgba(255,255,255,0.30)',
    paddingTop: 58,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#24364B' },
  subtitle: { fontSize: 13, color: '#738295', fontWeight: '600', marginTop: 2 },
  markAllBtn: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  markAllText: { fontSize: 12, fontWeight: '700', color: '#5B8DEF' },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryNumber: { fontSize: 22, fontWeight: '800', color: '#24364B' },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: '#738295' },
  filtersRow: { gap: 8, paddingBottom: 16, paddingRight: 4 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  filterChipActive: { backgroundColor: '#5B8DEF' },
  filterChipText: { fontSize: 13, fontWeight: '700', color: '#4B6A8C' },
  filterChipTextActive: { color: '#fff' },
  groupLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#738295',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  alertCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  alertCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#5B8DEF',
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  alertContent: { flex: 1 },
  alertTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  alertTitle: { fontSize: 15, fontWeight: '800', color: '#24364B' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#5B8DEF' },
  alertMessage: { fontSize: 13, color: '#5C6C7C', fontWeight: '500', lineHeight: 19 },
  alertTime: { fontSize: 11, color: '#9AAABB', fontWeight: '600', marginTop: 5 },
  dismissBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 15, color: '#9AAABB', fontWeight: '600' },
});
