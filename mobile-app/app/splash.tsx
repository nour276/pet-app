import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';


export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      return router.replace('../onboarding');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
             source={require('../assets/images/sky.jpg')}
             style={styles.container}
             resizeMode="cover"
           >
      <View style={styles.overlay}>
        <Image
          source={require('../assets/images/rita.jpeg')}
          style={styles.logo}
          resizeMode="cover"
        />

        <Text style={styles.title}>RitaCare+</Text>
        <Text style={styles.subtitle}>
          Smart Pet Health & Safety Monitoring
        </Text>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  logo: {
  width: 140,
  height: 140,
  borderRadius: 170, // perfect circle
  marginBottom: 50,
},



  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#22406b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    color: '#3F4C5A',
    lineHeight: 30,
    maxWidth: 280,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 55,
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C9CFD8',
  },
  activeDot: {
    backgroundColor: '#8FAFD6',
    width: 22,
  },
});