import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ChooseRoleScreen() {
  const router = useRouter();

  const handleOwnerPress = () => {
    router.push('/login' as any);
  };

  const handleVetPress = () => {
    router.push('/vet-login' as any);
  };

  return (
    <ImageBackground
      source={require('../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" />

          <View style={styles.topSection}>
            <Image
              source={require('../assets/images/rita.jpeg')}
              style={styles.logo}
              resizeMode="cover"
            />

            <Text style={styles.title}>Who are you?</Text>
            <Text style={styles.subtitle}>
              Choose your role to continue in RitaCare+
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.card}
              onPress={handleOwnerPress}
            >
              <View style={styles.iconBox}>
                <Ionicons name="paw" size={28} color="#6FA8DC" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Pet Owner</Text>
                <Text style={styles.cardDescription}>
                  Manage your pets, book appointments, track health, and receive
                  reminders.
                </Text>
              </View>

              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={22} color="#8AA0B8" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.card}
              onPress={handleVetPress}
            >
              <View style={[styles.iconBox, styles.vetIconBox]}>
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={28}
                  color="#7DBE8A"
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Veterinarian</Text>
                <Text style={styles.cardDescription}>
                  Access patients, manage appointments, follow health data, and
                  monitor alerts.
                </Text>
              </View>

              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={22} color="#8AA0B8" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.bottomText}>
              Your experience will be personalized based on your role.
            </Text>
          </View>
        </SafeAreaView>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#e4e6e8bd',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 18,
  },
  cardsContainer: {
    gap: 18,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'rgba(249, 246, 246, 0.47)',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 81, 110, 0.8)',
    minHeight: 125,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  vetIconBox: {
    backgroundColor: '#EEF8F0',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13.5,
    color: '#030506',
    lineHeight: 20,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bottomText: {
    fontSize: 13,
    color: '#E0EAF3',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
});