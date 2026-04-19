import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const alertsData = [
  {
    id: '1',
    title: 'Low Battery',
    message: "Rita's collar battery is below 20%.",
    time: '5 min ago',
    icon: 'battery-low-outline',
    type: 'warning',
  },
  {
    id: '2',
    title: 'Safe Zone Exit',
    message: 'Rita moved outside the safe zone.',
    time: '12 min ago',
    icon: 'alert-circle-outline',
    type: 'danger',
  },
  {
    id: '3',
    title: 'Heart Rate Update',
    message: 'Heart rate is normal and stable.',
    time: '30 min ago',
    icon: 'heart-outline',
    type: 'success',
  },
  {
    id: '4',
    title: 'Location Updated',
    message: 'New location received successfully.',
    time: '1 hour ago',
    icon: 'location-outline',
    type: 'info',
  },
];

export default function AlertsScreen() {
  const getCardStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return styles.warningCard;
      case 'danger':
        return styles.dangerCard;
      case 'success':
        return styles.successCard;
      default:
        return styles.infoCard;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning':
        return '#F09A3E';
      case 'danger':
        return '#E35D5D';
      case 'success':
        return '#67B56E';
      default:
        return '#5B8DEF';
    }
  };

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
            <Text style={styles.title}>Alerts</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={22} color="#4B6A8C" />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.summaryDanger]}>
              <MaterialCommunityIcons name="alert" size={24} color="#E35D5D" />
              <Text style={styles.summaryNumber}>2</Text>
              <Text style={styles.summaryLabel}>Urgent</Text>
            </View>

            <View style={[styles.summaryCard, styles.summaryInfo]}>
              <Ionicons name="notifications-outline" size={24} color="#5B8DEF" />
              <Text style={styles.summaryNumber}>4</Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent Alerts</Text>

          {alertsData.map((alert) => (
            <TouchableOpacity
              key={alert.id}
              activeOpacity={0.85}
              style={[styles.alertCard, getCardStyle(alert.type)]}
            >
              <View style={styles.alertLeft}>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={alert.icon as any}
                    size={24}
                    color={getIconColor(alert.type)}
                  />
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#92A0B0" />
            </TouchableOpacity>
          ))}

          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>Notifications</Text>
            <Text style={styles.bottomText}>
              You will receive alerts for battery, location, health, and safe zone activity.
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
  summaryDanger: {
    backgroundColor: 'rgba(255,240,240,0.95)',
  },
  summaryInfo: {
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
  alertCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningCard: {
    backgroundColor: 'rgba(255,245,236,0.95)',
  },
  dangerCard: {
    backgroundColor: 'rgba(255,240,240,0.95)',
  },
  successCard: {
    backgroundColor: 'rgba(241,250,241,0.95)',
  },
  infoCard: {
    backgroundColor: 'rgba(238,244,255,0.95)',
  },
  alertLeft: {
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
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 13,
    color: '#5C6C7C',
    fontWeight: '500',
    marginBottom: 5,
  },
  alertTime: {
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