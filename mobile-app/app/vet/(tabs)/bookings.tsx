import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialBookings = [
  {
    id: '1',
    time: '09:00',
    pet: 'Bella',
    owner: 'Sarah Ahmed',
    reason: 'Routine check-up',
    type: 'Pending',
  },
  {
    id: '2',
    time: '11:30',
    pet: 'Max',
    owner: 'Youssef Ben Ali',
    reason: 'Temperature alert follow-up',
    type: 'Urgent',
  },
  {
    id: '3',
    time: '14:00',
    pet: 'Luna',
    owner: 'Meriem Trabelsi',
    reason: 'Vaccination visit',
    type: 'Confirmed',
  },
];

export default function BookingsScreen() {
  const [selectedTab, setSelectedTab] = useState<'List' | 'Calendar'>('List');
  const [bookings, setBookings] = useState(initialBookings);

  const updateBookingType = (id: string, newType: string) => {
    setBookings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, type: newType } : item
      )
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.pageTitle}>Bookings</Text>
              <Text style={styles.pageSubtitle}>
                Manage visits and appointment requests
              </Text>
            </View>

            <TouchableOpacity style={styles.addButton} activeOpacity={0.85}>
              <Ionicons name="add" size={22} color="#24364B" />
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <TouchableOpacity
              style={[styles.switchButton, selectedTab === 'List' && styles.activeSwitch]}
              onPress={() => setSelectedTab('List')}
            >
              <Text
                style={[
                  styles.switchText,
                  selectedTab === 'List' && styles.activeSwitchText,
                ]}
              >
                List
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switchButton, selectedTab === 'Calendar' && styles.activeSwitch]}
              onPress={() => setSelectedTab('Calendar')}
            >
              <Text
                style={[
                  styles.switchText,
                  selectedTab === 'Calendar' && styles.activeSwitchText,
                ]}
              >
                Calendar
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateCard}>
            <Text style={styles.dateTitle}>Monday, April 13</Text>
            <Text style={styles.dateSubtitle}>4 bookings scheduled today</Text>
          </View>

          {selectedTab === 'Calendar' && (
            <View style={styles.calendarCard}>
              <View style={styles.daysRow}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <Text key={day} style={styles.dayText}>{day}</Text>
                ))}
              </View>

              <View style={styles.numbersRow}>
                {[13, 14, 15, 16, 17, 18, 19].map((num, index) => (
                  <View
                    key={num}
                    style={[styles.dayNumberCircle, index === 0 && styles.activeDayNumber]}
                  >
                    <Text
                      style={[
                        styles.dayNumberText,
                        index === 0 && styles.activeDayNumberText,
                      ]}
                    >
                      {num}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {bookings.map((item) => (
            <View key={item.id} style={styles.bookingCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>

                <View style={styles.infoContainer}>
                  <View style={styles.topLine}>
                    <Text style={styles.petName}>{item.pet}</Text>

                    <View
                      style={[
                        styles.tag,
                        item.type === 'Urgent'
                          ? styles.urgentTag
                          : item.type === 'Confirmed'
                          ? styles.confirmedTag
                          : item.type === 'Done'
                          ? styles.doneTag
                          : item.type === 'Cancelled'
                          ? styles.cancelledTag
                          : styles.pendingTag,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          item.type === 'Urgent'
                            ? styles.urgentTagText
                            : item.type === 'Confirmed'
                            ? styles.confirmedTagText
                            : item.type === 'Done'
                            ? styles.doneTagText
                            : item.type === 'Cancelled'
                            ? styles.cancelledTagText
                            : styles.pendingTagText,
                        ]}
                      >
                        {item.type}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.reasonText}>{item.reason}</Text>
                  <Text style={styles.ownerText}>Owner: {item.owner}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => updateBookingType(item.id, 'Confirmed')}
                >
                  <Ionicons name="checkmark-outline" size={16} color="#5F9B6B" />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => updateBookingType(item.id, 'Cancelled')}
                >
                  <Ionicons name="close-outline" size={16} color="#D85B5B" />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => updateBookingType(item.id, 'Done')}
                >
                  <Ionicons name="checkmark-done-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.doneButtonText}>Mark Done</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => updateBookingType(item.id, 'Cancelled')}
                >
                  <Ionicons name="close-circle-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.cancelButtonText}>Cancelled</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
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
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#EAEAEA',
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  switchButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginRight: 10,
  },
  activeSwitch: {
    backgroundColor: '#FFFFFF',
  },
  switchText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  activeSwitchText: {
    color: '#24364B',
  },
  dateCard: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  dateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#24364B',
    marginBottom: 4,
  },
  dateSubtitle: {
    fontSize: 13,
    color: '#6B7C8F',
  },
  calendarCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7B8EA3',
    width: 34,
    textAlign: 'center',
  },
  numbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayNumberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  activeDayNumber: {
    backgroundColor: '#7FA5C7',
  },
  dayNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#24364B',
  },
  activeDayNumberText: {
    color: '#FFFFFF',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 14,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
  },
  timeBox: {
    width: 64,
    height: 34,
    borderRadius: 16,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#335E87',
  },
  infoContainer: {
    flex: 1,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#24364B',
  },
  reasonText: {
    fontSize: 13,
    color: '#24364B',
    lineHeight: 19,
    marginBottom: 4,
  },
  ownerText: {
    fontSize: 13,
    color: '#7B8EA3',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pendingTag: {
    backgroundColor: '#EEF4FF',
  },
  urgentTag: {
    backgroundColor: '#FDEDED',
  },
  confirmedTag: {
    backgroundColor: '#EEF8F0',
  },
  doneTag: {
    backgroundColor: '#E8F7EA',
  },
  cancelledTag: {
    backgroundColor: '#FDEDED',
  },
  tagText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  pendingTagText: {
    color: '#6B8FB1',
  },
  urgentTagText: {
    color: '#D85B5B',
  },
  confirmedTagText: {
    color: '#5F9B6B',
  },
  doneTagText: {
    color: '#3B8C57',
  },
  cancelledTagText: {
    color: '#D85B5B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5ECF3',
    marginVertical: 13,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  acceptButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EEF8F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  acceptButtonText: {
    color: '#5F9B6B',
    fontWeight: '700',
    fontSize: 12.5,
    marginLeft: 6,
  },
  rejectButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FDEDED',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  rejectButtonText: {
    color: '#D85B5B',
    fontWeight: '700',
    fontSize: 12.5,
    marginLeft: 6,
  },
  doneButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#7DBE8A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12.5,
    marginLeft: 6,
  },
  cancelButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#D85B5B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12.5,
    marginLeft: 6,
  },
});