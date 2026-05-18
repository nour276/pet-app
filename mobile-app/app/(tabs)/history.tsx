import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

type Day    = 'today' | 'yesterday' | 'older';
type Period = 'all' | 'today' | 'week' | 'month';

type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: string;
  iconLib: 'ionicons' | 'mci';
  color: string;
  bg: string;
  category: 'health' | 'location' | 'vet' | 'activity';
  value?: string;
  day: Day;
};

const HISTORY: ActivityItem[] = [
  { id: '1', title: 'Morning Walk',        subtitle: 'Rita walked 3.2 km in 45 min',              time: 'Today • 08:30 AM',      icon: 'paw',          iconLib: 'ionicons', color: '#67B56E', bg: 'rgba(241,250,241,0.97)', category: 'activity', value: '3.2 km',  day: 'today'     },
  { id: '2', title: 'Heart Rate Check',    subtitle: 'Stable at 85 bpm — normal range',            time: 'Today • 07:00 AM',      icon: 'heart',        iconLib: 'ionicons', color: '#E35D5D', bg: 'rgba(255,240,240,0.97)', category: 'health',   value: '85 bpm',  day: 'today'     },
  { id: '3', title: 'Vet Visit',           subtitle: 'Annual check-up with Dr. Sarah Johnson',     time: 'Yesterday • 10:00 AM',  icon: 'stethoscope',  iconLib: 'mci',      color: '#5B8DEF', bg: 'rgba(238,244,255,0.97)', category: 'vet',      value: 'Completed',day: 'yesterday' },
  { id: '4', title: 'Safe Zone Exit',      subtitle: 'Rita left the home area briefly',            time: 'Yesterday • 01:10 PM',  icon: 'alert-circle', iconLib: 'ionicons', color: '#F09A3E', bg: 'rgba(255,245,236,0.97)', category: 'location', value: '200 m',   day: 'yesterday' },
  { id: '5', title: 'Sleep Tracking',      subtitle: '7h 45min of quality rest recorded',          time: 'Mar 29 • 11:00 PM',     icon: 'moon',         iconLib: 'ionicons', color: '#8B7CF6', bg: 'rgba(243,240,255,0.97)', category: 'activity', value: '7h 45m',  day: 'older'     },
  { id: '6', title: 'Temperature Reading', subtitle: 'Body temp normal at 38.5°C',                 time: 'Mar 29 • 09:00 AM',     icon: 'thermometer',  iconLib: 'ionicons', color: '#F09A3E', bg: 'rgba(255,245,236,0.97)', category: 'health',   value: '38.5°C',  day: 'older'     },
  { id: '7', title: 'Location Update',     subtitle: 'GPS synced — Monastir area',                 time: 'Mar 28 • 06:30 PM',     icon: 'location',     iconLib: 'ionicons', color: '#5B8DEF', bg: 'rgba(238,244,255,0.97)', category: 'location', value: 'Monastir',day: 'older'     },
  { id: '8', title: 'Vaccination',         subtitle: 'Annual rabies shot administered',             time: 'Mar 25 • 03:00 PM',     icon: 'needle',       iconLib: 'mci',      color: '#67B56E', bg: 'rgba(241,250,241,0.97)', category: 'vet',      value: 'Done',    day: 'older'     },
];

const CHART_DATA: Record<Period, { bars: number[], labels: string[], total: string, highlight: number }> = {
  today: { bars: [0.2, 0.8, 0.5, 1.2, 0.3, 0.2], labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM'], total: '3.2 km today',        highlight: 3 },
  week:  { bars: [2.1, 3.5, 1.8, 4.2, 3.2, 2.8, 0], labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],       total: '21.6 km this week',  highlight: 4 },
  month: { bars: [18.4, 22.1, 19.8, 21.6],           labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],          total: '81.9 km this month', highlight: 3 },
  all:   { bars: [65, 82, 78, 90, 81],                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],         total: '396 km total',       highlight: 4 },
};

const SUMMARY_DATA: Record<Period, { distance: string, distLabel: string, sleep: string }> = {
  today: { distance: '3.2 km',  distLabel: 'Today',     sleep: '7h 45m' },
  week:  { distance: '21.6 km', distLabel: 'This Week', sleep: '52h'    },
  month: { distance: '81.9 km', distLabel: 'Month',     sleep: '210h'   },
  all:   { distance: '396 km',  distLabel: 'Total',     sleep: '—'      },
};

const FILTERS = ['All', 'Health', 'Activity', 'Vet', 'Location'] as const;
type Filter = typeof FILTERS[number];

const PERIOD_LABELS: Record<Period, string> = {
  all:   'All Time',
  today: 'Today',
  week:  'This Week',
  month: 'This Month',
};

function ActivityIcon({ item }: { item: ActivityItem }) {
  if (item.iconLib === 'mci')
    return <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />;
  return <Ionicons name={item.icon as any} size={22} color={item.color} />;
}

function ActivityIconLarge({ item }: { item: ActivityItem }) {
  if (item.iconLib === 'mci')
    return <MaterialCommunityIcons name={item.icon as any} size={32} color={item.color} />;
  return <Ionicons name={item.icon as any} size={32} color={item.color} />;
}

const CATEGORY_LABEL: Record<ActivityItem['category'], string> = {
  health:   'Health',
  location: 'Location',
  vet:      'Veterinary',
  activity: 'Activity',
};

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [period,       setPeriod]       = useState<Period>('all');
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);

  const filtered = HISTORY.filter(item => {
    const matchFilter =
      activeFilter === 'All' || item.category === activeFilter.toLowerCase();
    const matchPeriod =
      period === 'all'   ? true :
      period === 'today' ? item.day === 'today' :
      period === 'week'  ? item.day !== 'older' :
      true;
    return matchFilter && matchPeriod;
  });

  function handleCalendarFilter() {
    Alert.alert('Filter by Period', 'Select a time range', [
      { text: 'Today',      onPress: () => setPeriod('today') },
      { text: 'This Week',  onPress: () => setPeriod('week')  },
      { text: 'This Month', onPress: () => setPeriod('month') },
      { text: 'All Time',   onPress: () => setPeriod('all')   },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function handleModalAction(item: ActivityItem) {
    setSelectedItem(null);
    switch (item.category) {
      case 'vet':
        router.push('/book-appointment' as any);
        break;
      case 'location':
        router.push('/(tabs)/map');
        break;
      case 'health':
        Alert.alert('Health Trend', 'Full health history graphs coming soon.');
        break;
      case 'activity':
        Alert.alert('Activity Shared', 'Activity summary copied to clipboard.');
        break;
    }
  }

  const actionLabel: Record<ActivityItem['category'], string> = {
    vet:      'Book Next Appointment',
    location: 'View on Map',
    health:   'View Health Trends',
    activity: 'Share Activity',
  };

  const actionColor: Record<ActivityItem['category'], string> = {
    vet:      '#5B8DEF',
    location: '#F09A3E',
    health:   '#E35D5D',
    activity: '#67B56E',
  };

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.overlay}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Activity</Text>
              {period !== 'all' && (
                <Text style={styles.periodLabel}>{PERIOD_LABELS[period]}</Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.iconBtn, period !== 'all' && styles.iconBtnActive]}
              onPress={handleCalendarFilter}
              activeOpacity={0.8}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={period !== 'all' ? '#5B8DEF' : '#4B6A8C'}
              />
              {period !== 'all' && <View style={styles.filterActiveDot} />}
            </TouchableOpacity>
          </View>

          {/* ── Chart ── */}
          {(() => {
            const chart = CHART_DATA[period];
            const maxBar = Math.max(...chart.bars);
            return (
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>
                    {period === 'today' ? 'Today\'s Distance' :
                     period === 'week'  ? 'Weekly Distance'  :
                     period === 'month' ? 'Monthly Distance' :
                     'All-Time Distance'}
                  </Text>
                  <Text style={styles.chartTotal}>{chart.total}</Text>
                </View>
                <View style={styles.chartBars}>
                  {chart.bars.map((val, i) => (
                    <View key={i} style={styles.barWrapper}>
                      <View style={styles.barContainer}>
                        <View style={[
                          styles.bar,
                          {
                            height: `${(val / maxBar) * 100}%` as any,
                            backgroundColor: i === chart.highlight ? '#5B8DEF' : '#C4D8F8',
                          },
                        ]} />
                      </View>
                      <Text style={[styles.barLabel, i === chart.highlight && styles.barLabelActive]}>
                        {chart.labels[i]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })()}

          {/* ── Summary row ── */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: 'rgba(241,250,241,0.97)' }]}>
              <Ionicons name="paw" size={20} color="#67B56E" />
              <Text style={styles.summaryValue}>{SUMMARY_DATA[period].distance}</Text>
              <Text style={styles.summaryLabel}>{SUMMARY_DATA[period].distLabel}</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: 'rgba(238,244,255,0.97)' }]}>
              <Ionicons name="time-outline" size={20} color="#5B8DEF" />
              <Text style={styles.summaryValue}>{filtered.length}</Text>
              <Text style={styles.summaryLabel}>Events</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: 'rgba(243,240,255,0.97)' }]}>
              <Ionicons name="moon-outline" size={20} color="#8B7CF6" />
              <Text style={styles.summaryValue}>{SUMMARY_DATA[period].sleep}</Text>
              <Text style={styles.summaryLabel}>Sleep</Text>
            </View>
          </View>

          {/* ── Filters ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>
            Recent Activity
            {filtered.length !== HISTORY.length && (
              <Text style={styles.sectionCount}> ({filtered.length})</Text>
            )}
          </Text>

          {filtered.length === 0 && (
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-outline" size={44} color="#C8D5E2" />
              <Text style={styles.emptyText}>No activity found</Text>
              <TouchableOpacity onPress={() => { setPeriod('all'); setActiveFilter('All'); }}>
                <Text style={styles.emptyAction}>Clear filters</Text>
              </TouchableOpacity>
            </View>
          )}

          {filtered.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={[styles.historyCard, { backgroundColor: item.bg }]}
              onPress={() => setSelectedItem(item)}
            >
              <View style={styles.timelineLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: `${item.color}18` }]}>
                  <ActivityIcon item={item} />
                </View>
                {index < filtered.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  {item.value && (
                    <View style={[styles.valueBadge, { backgroundColor: `${item.color}18` }]}>
                      <Text style={[styles.valueText, { color: item.color }]}>{item.value}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.historySubtitle}>{item.subtitle}</Text>
                <Text style={styles.historyTime}>{item.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#C8D5E2" style={styles.cardChevron} />
            </TouchableOpacity>
          ))}

        </View>
      </ScrollView>

      {/* ── Activity detail modal ── */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedItem(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedItem(null)}
        />
        {selectedItem && (
          <View style={styles.modalCard}>
            {/* Close button */}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedItem(null)}>
              <Ionicons name="close" size={18} color="#738295" />
            </TouchableOpacity>

            {/* Icon */}
            <View style={[styles.modalIconCircle, { backgroundColor: `${selectedItem.color}18` }]}>
              <ActivityIconLarge item={selectedItem} />
            </View>

            {/* Title + time */}
            <Text style={styles.modalTitle}>{selectedItem.title}</Text>
            <Text style={styles.modalTime}>{selectedItem.time}</Text>

            <View style={styles.modalDivider} />

            {/* Description */}
            <Text style={styles.modalSubtitle}>{selectedItem.subtitle}</Text>

            <View style={styles.modalDivider} />

            {/* Details grid */}
            <View style={styles.modalDetailsRow}>
              <View style={styles.modalDetailItem}>
                <Text style={styles.modalDetailLabel}>Category</Text>
                <Text style={styles.modalDetailValue}>{CATEGORY_LABEL[selectedItem.category]}</Text>
              </View>
              {selectedItem.value && (
                <View style={styles.modalDetailItem}>
                  <Text style={styles.modalDetailLabel}>Recorded Value</Text>
                  <View style={[styles.valueBadge, { backgroundColor: `${selectedItem.color}18`, alignSelf: 'flex-start' }]}>
                    <Text style={[styles.valueText, { color: selectedItem.color, fontSize: 13 }]}>
                      {selectedItem.value}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Action button */}
            <TouchableOpacity
              style={[styles.modalActionBtn, { backgroundColor: actionColor[selectedItem.category] }]}
              onPress={() => handleModalAction(selectedItem)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalActionText}>{actionLabel[selectedItem.category]}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
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

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#24364B' },
  periodLabel: { fontSize: 13, fontWeight: '700', color: '#5B8DEF', marginTop: 2 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconBtnActive: {
    backgroundColor: '#EBF2FF',
    borderWidth: 1.5,
    borderColor: '#5B8DEF',
  },
  filterActiveDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#5B8DEF',
    borderWidth: 1.5,
    borderColor: '#fff',
  },

  /* ── Chart ── */
  chartCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chartTitle: { fontSize: 15, fontWeight: '800', color: '#24364B' },
  chartTotal: { fontSize: 12, color: '#5B8DEF', fontWeight: '700' },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 6,
  },
  barWrapper: { flex: 1, alignItems: 'center', gap: 6 },
  barContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#F0F4FA',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: { width: '100%', borderRadius: 8 },
  barLabel: { fontSize: 11, fontWeight: '700', color: '#9AAABB' },
  barLabelActive: { color: '#5B8DEF' },

  /* ── Summary row ── */
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryValue: { fontSize: 18, fontWeight: '800', color: '#24364B' },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: '#738295' },

  /* ── Filters ── */
  filtersRow: {
    gap: 8,
    paddingBottom: 14,
    paddingRight: 16,
    alignItems: 'center',
  },
  filterChip: {
    height: 40,
    minWidth: 80,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: { backgroundColor: '#5B8DEF' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#4B6A8C' },
  filterTextActive: { color: '#fff' },

  /* ── Section title ── */
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#24364B', marginBottom: 12 },
  sectionCount: { fontSize: 15, fontWeight: '700', color: '#9AAABB' },

  /* ── Empty state ── */
  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 15, fontWeight: '700', color: '#9AAABB' },
  emptyAction: { fontSize: 14, fontWeight: '700', color: '#5B8DEF' },

  /* ── History card ── */
  historyCard: {
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'visible',
  },
  timelineLeft: {
    alignItems: 'center',
    paddingTop: 14,
    paddingLeft: 14,
    paddingBottom: 0,
    width: 60,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5EAF0',
    marginTop: 6,
    marginBottom: -10,
    minHeight: 16,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTitle: { fontSize: 15, fontWeight: '800', color: '#24364B', flex: 1 },
  valueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 6,
    flexShrink: 0,
  },
  valueText: { fontSize: 11, fontWeight: '800' },
  historySubtitle: { fontSize: 13, color: '#5C6C7C', fontWeight: '500', lineHeight: 18 },
  historyTime: { fontSize: 11, color: '#9AAABB', fontWeight: '600', marginTop: 5 },
  cardChevron: { alignSelf: 'center', marginRight: 14 },

  /* ── Detail Modal ── */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 12,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F3F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#24364B',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9AAABB',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F4F8',
    marginVertical: 14,
  },
  modalSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5D70',
    lineHeight: 22,
    textAlign: 'center',
  },
  modalDetailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  modalDetailItem: { flex: 1 },
  modalDetailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AAABB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalDetailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#24364B',
  },
  modalActionBtn: {
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  modalActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
});
