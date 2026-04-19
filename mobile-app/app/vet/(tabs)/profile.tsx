import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out.');
    router.replace('/choose-role' as any);
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
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>
            Manage your clinic profile and settings
          </Text>

          <View style={styles.profileCard}>
            <Image
              source={require('../../../assets/images/yassine.jpg')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <Text style={styles.name}>Dr.Yassine Ktari</Text>
            <Text style={styles.role}>Veterinarian</Text>
          </View>

          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.85}
              onPress={() => router.push('/vet/edit-profile')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="create-outline" size={20} color="#7FA5C7" />
                <View>
                  <Text style={styles.menuText}>Edit Profile</Text>
                  <Text style={styles.menuSubText}>
                    Name, clinic and personal details
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8AA0B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="business-outline" size={20} color="#7DBE8A" />
                <View>
                  <Text style={styles.menuText}>Clinic</Text>
                  <Text style={styles.menuSubText}>RitaCare Veterinary Clinic</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="call-outline" size={20} color="#F2A65A" />
                <View>
                  <Text style={styles.menuText}>Phone</Text>
                  <Text style={styles.menuSubText}>+216 12 345 678</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="time-outline" size={20} color="#8B7FD6" />
                <View>
                  <Text style={styles.menuText}>Working Hours</Text>
                  <Text style={styles.menuSubText}>Mon - Fri, 08:00 - 17:00</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.switchRow}>
              <View style={styles.menuLeft}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#D08A3B"
                />
                <View>
                  <Text style={styles.menuText}>Notifications</Text>
                  <Text style={styles.menuSubText}>
                    Turn alerts and updates on or off
                  </Text>
                </View>
              </View>

              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D6DEE8', true: '#A9D7B1' }}
                thumbColor={notificationsEnabled ? '#7DBE8A' : '#FFFFFF'}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#EAEAEA',
    marginBottom: 18,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#6B7C8F',
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 4,
  },
  menuItem: {
    minHeight: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    minHeight: 66,
    justifyContent: 'center',
  },
  switchRow: {
    minHeight: 76,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#24364B',
    marginLeft: 12,
    marginBottom: 2,
  },
  menuSubText: {
    fontSize: 12.5,
    color: '#6B7C8F',
    marginLeft: 12,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5ECF3',
  },
  logoutButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#D85B5B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});