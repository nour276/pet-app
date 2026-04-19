import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Image,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddPetScreen() {
  const router = useRouter();

  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'Dog' | 'Cat'>('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [petImage, setPetImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow gallery access to choose a pet photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPetImage(result.assets[0].uri);
    }

    setPhotoModalVisible(false);
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow camera access to take a pet photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPetImage(result.assets[0].uri);
    }

    setPhotoModalVisible(false);
  };

  const selectPetType = (type: 'Dog' | 'Cat') => {
    setPetType(type);
    setTypeModalVisible(false);

    if (type === 'Dog' && breed === 'Tabby') {
      setBreed('');
    }

    if (type === 'Cat' && breed === 'Golden Retriever') {
      setBreed('');
    }
  };

  const handleSavePet = async () => {
    if (!petName.trim() || !breed.trim() || !age.trim() || !weight.trim()) {
      Alert.alert('Missing info', 'Please fill in all pet information.');
      return;
    }

    try {
      setLoading(true);

      const newPet = {
        id: Date.now().toString(),
        name: petName.trim(),
        type: petType,
        breed: breed.trim(),
        age: age.trim(),
        weight: weight.trim(),
        image: petImage || null,
      };

      const existingPets = await AsyncStorage.getItem('pets');
      const pets = existingPets ? JSON.parse(existingPets) : [];

      pets.push(newPet);

      await AsyncStorage.setItem('pets', JSON.stringify(pets));

      Alert.alert('Success', 'Pet added successfully');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('ADD PET ERROR:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#2B3B52" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Pet</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <View style={styles.photoCircle}>
              <View style={styles.smallPawOne} />
              <View style={styles.smallPawTwo} />

              {petImage ? (
                <Image source={{ uri: petImage }} style={styles.petPhoto} />
              ) : (
                <View style={styles.cameraCircle}>
                  <Ionicons name="camera" size={34} color="#fff" />
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={() => setPhotoModalVisible(true)}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Pet&apos;s Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="paw-outline" size={18} color="#7DA66D" />
                <TextInput
                  value={petName}
                  onChangeText={setPetName}
                  placeholder="Pet name"
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Pet&apos;s Type</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setTypeModalVisible(true)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={petType === 'Dog' ? 'dog-side' : 'cat'}
                  size={20}
                  color="#7DA66D"
                />
                <Text style={styles.selectText}>{petType}</Text>
                <Ionicons name="chevron-forward" size={18} color="#8A97A6" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Breed</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5
                  name={petType === 'Dog' ? 'dog' : 'cat'}
                  size={16}
                  color="#7DA66D"
                />
                <TextInput
                  value={breed}
                  onChangeText={setBreed}
                  placeholder={petType === 'Dog' ? 'Golden Retriever' : 'Tabby'}
                  placeholderTextColor="#8A97A6"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputBlock, styles.halfBlock]}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="calendar-outline" size={18} color="#7DA66D" />
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    placeholder="Age"
                    placeholderTextColor="#8A97A6"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={[styles.inputBlock, styles.halfBlock]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="weight-kilogram"
                    size={18}
                    color="#7DA66D"
                  />
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="Weight"
                    placeholderTextColor="#8A97A6"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.continueButton, loading && styles.disabledButton]}
              onPress={handleSavePet}
              disabled={loading}
            >
              <Text style={styles.continueButtonText}>
                {loading ? 'Saving...' : 'Save Pet'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={typeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTypeModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setTypeModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Pet Type</Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => selectPetType('Dog')}
            >
              <MaterialCommunityIcons name="dog-side" size={22} color="#7DA66D" />
              <Text style={styles.optionText}>Dog</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => selectPetType('Cat')}
            >
              <MaterialCommunityIcons name="cat" size={22} color="#7DA66D" />
              <Text style={styles.optionText}>Cat</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPhotoModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Pet Photo</Text>

            <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
              <Ionicons name="camera-outline" size={22} color="#7DA66D" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
              <Ionicons name="image-outline" size={22} color="#7DA66D" />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  backButton: {
    width: 34,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#24364B',
  },
  headerSpacer: {
    width: 34,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: 'rgba(242, 241, 247, 0.82)',
    borderRadius: 24,
    paddingTop: 7,
    paddingHorizontal: 16,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  photoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EEF5FB',
    borderWidth: 2,
    borderColor: '#D9E4F0',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  petPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  smallPawOne: {
    position: 'absolute',
    top: 25,
    left: 32,
    width: 18,
    height: 18,
    borderRadius: 9,
    zIndex: 1,
  },
  smallPawTwo: {
    position: 'absolute',
    top: 40,
    right: 28,
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 1,
  },
  cameraCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#8FAFD6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8FAFD6',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 22,
    gap: 6,
  },
  addPhotoText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  inputBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#33465C',
    marginBottom: 8,
  },
  inputWrapper: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#F7F8FB',
    borderWidth: 1,
    borderColor: '#D8DEE8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#24364B',
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: '#24364B',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfBlock: {
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#8FAFD6',
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#24364B',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F7F8FB',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#24364B',
  },
});