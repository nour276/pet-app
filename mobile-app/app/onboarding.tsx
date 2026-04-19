import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function OnboardingScreen() {
  return (
    <ImageBackground
      source={require('../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => router.push('/login' as any)}
        >
          <Text style={styles.topButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Monitor your pet&apos;s health in real time.</Text>
              <View style={styles.fakeLine} />
              <View style={[styles.fakeLine, { width: 55 }]} />
            </View>
            <View style={styles.iconCircleOrange}>
              <MaterialIcons name="health-and-safety" size={26} color="#fff" />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Track your pet&apos;s location anywhere.</Text>
              <View style={styles.fakeLine} />
              <View style={[styles.fakeLine, { width: 55 }]} />
            </View>
            <View style={styles.iconCircleYellow}>
              <Ionicons name="location" size={24} color="#ffffff" />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Receive instant alerts & reminders</Text>
              <View style={styles.fakeLine} />
              <View style={[styles.fakeLine, { width: 55 }]} />
            </View>
            <View style={styles.iconCircleBlue}>
              <Ionicons name="notifications" size={24} color="#ffffff" />
            </View>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => router.replace('/choose-role' as any)}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 22,
    paddingTop: 70,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  topButton: {
    alignSelf: 'center',
    backgroundColor: '#F4F6FA',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  topButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8FAFD6',
  },
  cardsContainer: {
    gap: 25,
    marginTop: 26,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 25,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 20,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '700',
    color: '#23354D',
  },
  fakeLine: {
    height: 6,
    backgroundColor: '#D8E0EA',
    borderRadius: 4,
    marginTop: 10,
    width: 80,
  },
  iconCircleOrange: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F4A261',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleYellow: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F6C453',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleBlue: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomArea: {
    marginTop: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C7CED8',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#8FAFD6',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    fontSize: 24,
    color: '#8FAFD6',
    fontWeight: '700',
  },
});