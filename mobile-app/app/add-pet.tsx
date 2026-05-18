import { useState, useMemo } from 'react';
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
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Pet Types ────────────────────────────────────────────────────────────────

const PET_TYPES = ['Dog', 'Cat','Other'] as const;
type PetType = typeof PET_TYPES[number];

type IconSpec = { lib: 'mci' | 'fa5' | 'ion'; name: string };
const TYPE_ICONS: Record<PetType, IconSpec> = {
  Dog:     { lib: 'mci', name: 'dog-side' },
  Cat:     { lib: 'mci', name: 'cat' },
  Other:   { lib: 'ion', name: 'paw-outline' },
};

function PetTypeIcon({ type, size, color }: { type: PetType; size: number; color: string }) {
  const icon = TYPE_ICONS[type];
  if (icon.lib === 'mci') return <MaterialCommunityIcons name={icon.name as any} size={size} color={color} />;
  if (icon.lib === 'fa5') return <FontAwesome5 name={icon.name as any} size={size} color={color} />;
  return <Ionicons name={icon.name as any} size={size} color={color} />;
}

// ─── Breed Suggestions ────────────────────────────────────────────────────────

const BREED_SUGGESTIONS: Record<PetType, string[]> = {
  Dog:     ['Golden Retriever', 'Labrador', 'Poodle', 'Bulldog', 'Beagle', 'Husky', 'Chihuahua', 'German Shepherd'],
  Cat:     ['Persian', 'Maine Coon', 'Siamese', 'British Shorthair', 'Bengal', 'Ragdoll', 'Abyssinian'],
  Other:   ['Mixed Breed', 'Unknown'],
};

// ─── Colors ───────────────────────────────────────────────────────────────────

const COLOR_OPTIONS: { label: string; hex: string }[] = [
  { label: 'Brown',   hex: '#8B5E3C' },
  { label: 'Black',   hex: '#2C2C2C' },
  { label: 'White',   hex: '#F0EDE8' },
  { label: 'Golden',  hex: '#D4A843' },
  { label: 'Gray',    hex: '#9CA3AF' },
  { label: 'Orange',  hex: '#E87A3D' },
  { label: 'Cream',   hex: '#F5DEB3' },
  { label: 'Mixed',   hex: '#ccd8d3' },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AddPetScreen() {
  const router = useRouter();

  const [petName, setPetName]           = useState('');
  const [petType, setPetType]           = useState<PetType>('Dog');
  const [breed, setBreed]               = useState('');
  const [showBreedSuggestions, setShowBreedSuggestions] = useState(false);
  const [age, setAge]                   = useState('');
  const [weight, setWeight]             = useState('');
  const [gender, setGender]             = useState<'Male' | 'Female'>('Male');
  const [color, setColor]               = useState('');
  const [vaccinated, setVaccinated]     = useState(false);
  const [lastVetVisit, setLastVetVisit] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [neutered, setNeutered]         = useState(false);
  const [petImage, setPetImage]         = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);

  const [typeModalVisible, setTypeModalVisible]   = useState(false);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Progress: count filled required fields out of 4
  const progress = useMemo(() => {
    let filled = 0;
    if (petName.trim()) filled++;
    if (breed.trim()) filled++;
    if (age.trim()) filled++;
    if (weight.trim()) filled++;
    return filled / 4;
  }, [petName, breed, age, weight]);

  // ── Photo Handlers ───────────────────────────────────────────────────────

  const openGallery = async () => {
    setPhotoModalVisible(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Needed', 'Please allow gallery access to choose a pet photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets.length > 0) setPetImage(result.assets[0].uri);
  };

  const openCamera = async () => {
    setPhotoModalVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Needed', 'Please allow camera access to take a pet photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets.length > 0) setPetImage(result.assets[0].uri);
  };

  // ── Validation & Save ────────────────────────────────────────────────────

  const validate = () => {
    const e: Record<string, string> = {};
    if (!petName.trim())  e.petName = 'Pet name is required.';
    if (!breed.trim())    e.breed   = 'Breed is required.';
    if (!age.trim())      e.age     = 'Age is required.';
    else if (isNaN(Number(age)) || Number(age) < 0) e.age = 'Enter a valid age.';
    if (!weight.trim())   e.weight  = 'Weight is required.';
    else if (isNaN(Number(weight)) || Number(weight) <= 0) e.weight = 'Enter a valid weight.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSavePet = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const newPet = {
        id: Date.now().toString(),
        name: petName.trim(),
        type: petType,
        breed: breed.trim(),
        age: age.trim(),
        weight: weight.trim(),
        gender,
        color: color || 'Unknown',
        vaccinated,
        lastVetVisit: lastVetVisit.trim(),
        medicalNotes: medicalNotes.trim(),
        neutered,
        image: petImage || null,
      };
      const existing = await AsyncStorage.getItem('pets');
      const pets = existing ? JSON.parse(existing) : [];
      pets.push(newPet);
      await AsyncStorage.setItem('pets', JSON.stringify(pets));
      router.replace('/pair-device' as any);
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Breed filter for suggestions ─────────────────────────────────────────

  const filteredBreeds = useMemo(() => {
    const suggestions = BREED_SUGGESTIONS[petType];
    if (!breed.trim()) return suggestions;
    return suggestions.filter((b) => b.toLowerCase().includes(breed.toLowerCase()));
  }, [breed, petType]);

  const clearError = (field: string) =>
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });

  return (
    <ImageBackground
      source={require('../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color="#24364B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Pet</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
          <Text style={styles.progressLabel}>
            {progress === 1 ? 'Required fields complete ✓' : `${Math.round(progress * 100)}% of required fields filled`}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Photo ── */}
          <View style={styles.photoSection}>
            <TouchableOpacity
              style={styles.photoCircle}
              onPress={() => setPhotoModalVisible(true)}
              activeOpacity={0.85}
            >
              {petImage ? (
                <Image source={{ uri: petImage }} style={styles.petPhoto} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera" size={32} color="#5B8DEF" />
                  <Text style={styles.photoPlaceholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={() => setPhotoModalVisible(true)}
            >
              <Ionicons name={petImage ? 'create-outline' : 'camera-outline'} size={14} color="#5B8DEF" />
              <Text style={styles.changePhotoText}>{petImage ? 'Change Photo' : 'Upload Photo'}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Basic Information ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderIcon}>
                <Ionicons name="paw" size={15} color="#5B8DEF" />
              </View>
              <Text style={styles.cardTitle}>Basic Information</Text>
            </View>

            {/* Pet Name */}
            <Text style={styles.label}>Pet's Name <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputRow, errors.petName ? styles.inputRowError : null]}>
              <Ionicons name="paw-outline" size={18} color={errors.petName ? '#E05B5B' : '#5B8DEF'} />
              <TextInput
                value={petName}
                onChangeText={(t) => { setPetName(t); clearError('petName'); }}
                placeholder="e.g. Buddy"
                placeholderTextColor="#A8B5C4"
                style={styles.input}
                returnKeyType="next"
              />
              {petName.trim() ? <Ionicons name="checkmark-circle" size={18} color="#4CAF7D" /> : null}
            </View>
            {errors.petName ? <Text style={styles.errorText}>{errors.petName}</Text> : null}

            {/* Pet Type */}
            <Text style={styles.label}>Pet Type <Text style={styles.required}>*</Text></Text>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setTypeModalVisible(true)}
              activeOpacity={0.8}
            >
              <PetTypeIcon type={petType} size={18} color="#5B8DEF" />
              <Text style={[styles.input, { color: '#24364B' }]}>{petType}</Text>
              <Ionicons name="chevron-down" size={16} color="#A8B5C4" />
            </TouchableOpacity>

            {/* Breed */}
            <Text style={styles.label}>Breed <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputRow, errors.breed ? styles.inputRowError : null]}>
              <Ionicons name="search-outline" size={18} color={errors.breed ? '#E05B5B' : '#5B8DEF'} />
              <TextInput
                value={breed}
                onChangeText={(t) => { setBreed(t); clearError('breed'); setShowBreedSuggestions(true); }}
                onFocus={() => setShowBreedSuggestions(true)}
                onBlur={() => setTimeout(() => setShowBreedSuggestions(false), 200)}
                placeholder={`e.g. ${BREED_SUGGESTIONS[petType][0]}`}
                placeholderTextColor="#A8B5C4"
                style={styles.input}
                returnKeyType="next"
              />
              {breed.trim() ? (
                <TouchableOpacity onPress={() => { setBreed(''); clearError('breed'); }}>
                  <Ionicons name="close-circle" size={18} color="#A8B5C4" />
                </TouchableOpacity>
              ) : null}
            </View>
            {errors.breed ? <Text style={styles.errorText}>{errors.breed}</Text> : null}
            {showBreedSuggestions && filteredBreeds.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.breedChipScroll}
                keyboardShouldPersistTaps="handled"
              >
                {filteredBreeds.map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={[styles.breedChip, breed === b && styles.breedChipActive]}
                    onPress={() => { setBreed(b); clearError('breed'); setShowBreedSuggestions(false); }}
                  >
                    <Text style={[styles.breedChipText, breed === b && styles.breedChipTextActive]}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Age & Weight */}
            <View style={styles.twoCol}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Age <Text style={styles.required}>*</Text></Text>
                <View style={[styles.inputRow, errors.age ? styles.inputRowError : null]}>
                  <Ionicons name="calendar-outline" size={18} color={errors.age ? '#E05B5B' : '#5B8DEF'} />
                  <TextInput
                    value={age}
                    onChangeText={(t) => { setAge(t); clearError('age'); }}
                    placeholder="Years"
                    placeholderTextColor="#A8B5C4"
                    style={styles.input}
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                  />
                </View>
                {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Weight (kg) <Text style={styles.required}>*</Text></Text>
                <View style={[styles.inputRow, errors.weight ? styles.inputRowError : null]}>
                  <MaterialCommunityIcons name="weight-kilogram" size={18} color={errors.weight ? '#E05B5B' : '#5B8DEF'} />
                  <TextInput
                    value={weight}
                    onChangeText={(t) => { setWeight(t); clearError('weight'); }}
                    placeholder="kg"
                    placeholderTextColor="#A8B5C4"
                    style={styles.input}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </View>
                {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}
              </View>
            </View>

            {/* Gender */}
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'Male' && styles.genderBtnMale]}
                onPress={() => setGender('Male')}
                activeOpacity={0.8}
              >
                <Ionicons name="male" size={17} color={gender === 'Male' ? '#fff' : '#5B8DEF'} />
                <Text style={[styles.genderText, gender === 'Male' && styles.genderTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'Female' && styles.genderBtnFemale]}
                onPress={() => setGender('Female')}
                activeOpacity={0.8}
              >
                <Ionicons name="female" size={17} color={gender === 'Female' ? '#fff' : '#E86FA0'} />
                <Text style={[styles.genderText, gender === 'Female' ? styles.genderTextActive : { color: '#E86FA0' }]}>Female</Text>
              </TouchableOpacity>
            </View>

            {/* Color */}
            <Text style={styles.label}>Fur / Skin Color</Text>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setColorModalVisible(true)}
              activeOpacity={0.8}
            >
              {color ? (
                <View style={[styles.colorDot, { backgroundColor: COLOR_OPTIONS.find((c) => c.label === color)?.hex ?? '#ccc' }]} />
              ) : (
                <Ionicons name="color-palette-outline" size={18} color="#5B8DEF" />
              )}
              <Text style={[styles.input, { color: color ? '#24364B' : '#A8B5C4' }]}>
                {color || 'Select color'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#A8B5C4" />
            </TouchableOpacity>
          </View>

          {/* ── Medical Information ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: '#E8F7EE' }]}>
                <Ionicons name="medkit" size={15} color="#4CAF7D" />
              </View>
              <Text style={[styles.cardTitle, { color: '#4CAF7D' }]}>Medical Information</Text>
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIcon, { backgroundColor: '#E8F7E8' }]}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#4CAF7D" />
                </View>
                <View>
                  <Text style={styles.toggleLabel}>Vaccinated</Text>
                  <Text style={styles.toggleSub}>Up to date on vaccines</Text>
                </View>
              </View>
              <Switch
                value={vaccinated}
                onValueChange={setVaccinated}
                trackColor={{ false: '#D0D7E2', true: '#4CAF7D' }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.toggleRow, { borderBottomWidth: 0, marginBottom: 8 }]}>
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIcon, { backgroundColor: '#EEF4FF' }]}>
                  <Ionicons name="cut-outline" size={16} color="#5B8DEF" />
                </View>
                <View>
                  <Text style={styles.toggleLabel}>Spayed / Neutered</Text>
                  <Text style={styles.toggleSub}>Sterilization procedure done</Text>
                </View>
              </View>
              <Switch
                value={neutered}
                onValueChange={setNeutered}
                trackColor={{ false: '#D0D7E2', true: '#5B8DEF' }}
                thumbColor="#fff"
              />
            </View>

            <Text style={styles.label}>Last Vet Visit</Text>
            <View style={styles.inputRow}>
              <Ionicons name="calendar-outline" size={18} color="#4CAF7D" />
              <TextInput
                value={lastVetVisit}
                onChangeText={setLastVetVisit}
                placeholder="e.g. March 2025"
                placeholderTextColor="#A8B5C4"
                style={styles.input}
                returnKeyType="next"
              />
            </View>

            <Text style={styles.label}>Medical Notes</Text>
            <View style={[styles.inputRow, { alignItems: 'flex-start', paddingTop: 12, minHeight: 100 }]}>
              <Ionicons name="document-text-outline" size={18} color="#4CAF7D" style={{ marginTop: 2 }} />
              <TextInput
                value={medicalNotes}
                onChangeText={setMedicalNotes}
                placeholder="Allergies, conditions, current medications..."
                placeholderTextColor="#A8B5C4"
                style={[styles.input, { textAlignVertical: 'top' }]}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* ── Save Button ── */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSavePet}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.saveBtnText}>Save Pet Profile</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ── Pet Type Modal ── */}
      <Modal visible={typeModalVisible} transparent animationType="slide" onRequestClose={() => setTypeModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setTypeModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Pet Type</Text>
            <View style={styles.typeGrid}>
              {PET_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeCard, petType === type && styles.typeCardActive]}
                  onPress={() => { setPetType(type); setBreed(''); setErrors((e) => ({ ...e })); setTypeModalVisible(false); }}
                  activeOpacity={0.8}
                >
                  <PetTypeIcon type={type} size={26} color={petType === type ? '#fff' : '#5B8DEF'} />
                  <Text style={[styles.typeCardText, petType === type && { color: '#fff' }]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Color Modal ── */}
      <Modal visible={colorModalVisible} transparent animationType="slide" onRequestClose={() => setColorModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setColorModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Color</Text>
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map((c) => (
                <TouchableOpacity
                  key={c.label}
                  style={[styles.colorItem, color === c.label && styles.colorItemActive]}
                  onPress={() => { setColor(c.label); setColorModalVisible(false); }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.colorSwatch, { backgroundColor: c.hex }, color === c.label && styles.colorSwatchActive]} />
                  <Text style={[styles.colorLabel, color === c.label && { color: '#5B8DEF', fontWeight: '700' }]}>{c.label}</Text>
                  {color === c.label && <Ionicons name="checkmark-circle" size={14} color="#5B8DEF" />}
                </TouchableOpacity>
              ))}
            </View>
            {color ? (
              <TouchableOpacity style={styles.clearColorBtn} onPress={() => { setColor(''); setColorModalVisible(false); }}>
                <Text style={styles.clearColorText}>Clear Selection</Text>
              </TouchableOpacity>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Photo Modal ── */}
      <Modal visible={photoModalVisible} transparent animationType="slide" onRequestClose={() => setPhotoModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPhotoModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Pet Photo</Text>

            <TouchableOpacity style={styles.optionRow} onPress={openCamera} activeOpacity={0.8}>
              <View style={[styles.optionIcon, { backgroundColor: '#EEF4FF' }]}>
                <Ionicons name="camera-outline" size={20} color="#5B8DEF" />
              </View>
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionTitle}>Take a Photo</Text>
                <Text style={styles.optionSub}>Use your camera</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A8B5C4" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow} onPress={openGallery} activeOpacity={0.8}>
              <View style={[styles.optionIcon, { backgroundColor: '#E8F7E8' }]}>
                <Ionicons name="image-outline" size={20} color="#4CAF7D" />
              </View>
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionTitle}>Choose from Gallery</Text>
                <Text style={styles.optionSub}>Pick from your photos</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A8B5C4" />
            </TouchableOpacity>

            {petImage ? (
              <TouchableOpacity
                style={[styles.optionRow, { borderBottomWidth: 0 }]}
                onPress={() => { setPetImage(null); setPhotoModalVisible(false); }}
                activeOpacity={0.8}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#FFF0F0' }]}>
                  <Ionicons name="trash-outline" size={20} color="#E05B5B" />
                </View>
                <View style={styles.optionTextBlock}>
                  <Text style={[styles.optionTitle, { color: '#E05B5B' }]}>Remove Photo</Text>
                  <Text style={styles.optionSub}>Go back to default</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#A8B5C4" />
              </TouchableOpacity>
            ) : <View style={{ height: 8 }} />}
          </Pressable>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(230,238,252,0.5)',
    paddingTop: 56,
    paddingHorizontal: 16,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#1A2B3C' },

  // Progress
  progressWrap: { marginBottom: 16 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DCE6F5',
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B8DEF',
    borderRadius: 3,
  },
  progressLabel: { fontSize: 11, color: '#7A8EA8', fontWeight: '500', textAlign: 'right' },

  scrollContent: { paddingBottom: 40 },

  // Photo
  photoSection: { alignItems: 'center', marginBottom: 18 },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF4FF',
    borderWidth: 2.5,
    borderColor: '#5B8DEF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  petPhoto: { width: 120, height: 120, borderRadius: 60 },
  photoPlaceholder: { alignItems: 'center', gap: 5 },
  photoPlaceholderText: { fontSize: 12, fontWeight: '700', color: '#5B8DEF' },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 9,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(91,141,239,0.1)',
    borderRadius: 20,
  },
  changePhotoText: { fontSize: 12, color: '#5B8DEF', fontWeight: '600' },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#5B8DEF',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
  },
  cardHeaderIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#5B8DEF', letterSpacing: 0.2 },

  // Inputs
  label: { fontSize: 12, fontWeight: '700', color: '#4B5D70', marginBottom: 7, marginTop: 2 },
  required: { color: '#E05B5B' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 13,
    minHeight: 50,
    gap: 10,
    marginBottom: 4,
  },
  inputRowError: { borderColor: '#E05B5B', backgroundColor: '#FFF8F8' },
  input: { flex: 1, fontSize: 15, color: '#1A2B3C', fontWeight: '500' },
  errorText: { fontSize: 11, color: '#E05B5B', marginBottom: 10, marginLeft: 4 },
  twoCol: { flexDirection: 'row' },

  // Breed chips
  breedChipScroll: { marginBottom: 10, marginTop: 2 },
  breedChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EEF4FF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C8D8F8',
  },
  breedChipActive: { backgroundColor: '#5B8DEF', borderColor: '#4A7ADE' },
  breedChipText: { fontSize: 12, fontWeight: '600', color: '#5B8DEF' },
  breedChipTextActive: { color: '#fff' },

  // Gender
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#5B8DEF',
  },
  genderBtnMale: { backgroundColor: '#5B8DEF' },
  genderBtnFemale: { backgroundColor: '#E86FA0', borderColor: '#E86FA0' },
  genderText: { fontSize: 15, fontWeight: '700', color: '#5B8DEF' },
  genderTextActive: { color: '#fff' },

  // Color dot (inline)
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },

  // Toggles
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLabel: { fontSize: 14, fontWeight: '700', color: '#1A2B3C' },
  toggleSub: { fontSize: 11, color: '#9AAABB', fontWeight: '500', marginTop: 1 },

  // Save / Cancel
  saveBtn: {
    backgroundColor: '#5B8DEF',
    borderRadius: 20,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#5B8DEF',
    shadowOpacity: 0.38,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
    marginTop: 6,
    marginBottom: 12,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  cancelBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelBtnText: { fontSize: 14, color: '#8A97A6', fontWeight: '600' },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 44,
  },
  modalHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#D0D7E2',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1A2B3C', marginBottom: 18, textAlign: 'center' },

  // Type grid
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  typeCard: {
    width: 88,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardActive: { backgroundColor: '#5B8DEF', borderColor: '#3A6FD0' },
  typeCardText: { fontSize: 11, fontWeight: '700', color: '#5B8DEF' },

  // Color grid
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 12,
  },
  colorItem: {
    alignItems: 'center',
    gap: 5,
    width: 68,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F7F9FC',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  colorItemActive: { borderColor: '#5B8DEF', backgroundColor: '#EEF4FF' },
  colorSwatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  colorSwatchActive: { borderColor: '#5B8DEF', borderWidth: 2.5 },
  colorLabel: { fontSize: 10, fontWeight: '600', color: '#4B5D70' },
  clearColorBtn: { alignItems: 'center', paddingTop: 4 },
  clearColorText: { fontSize: 13, color: '#E05B5B', fontWeight: '600' },

  // Photo options
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextBlock: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '700', color: '#1A2B3C' },
  optionSub: { fontSize: 12, color: '#9AAABB', marginTop: 1 },
});
