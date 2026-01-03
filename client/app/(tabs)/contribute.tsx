import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function ContributeScreen() {
  const [storeName, setStoreName] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [campusLocation, setCampusLocation] = useState<'Inside Campus' | 'Outside Campus' | ''>('');
  const [showCampusDropdown, setShowCampusDropdown] = useState<boolean>(false);
  const [mealName, setMealName] = useState<string>('');
  const [regularPrice, setRegularPrice] = useState<string>('');
  const [halfOrderPrice, setHalfOrderPrice] = useState<string>('');
  const [isHalfOrder, setIsHalfOrder] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    console.log({
      storeName,
      landmark,
      campusLocation,
      mealName,
      regularPrice,
      halfOrderPrice: isHalfOrder ? halfOrderPrice : null,
      image: selectedImage,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>iShare Mo!</Text>
        <Text style={styles.headerSubtitle}>Found something new? Share it now!</Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Where are you?</Text>
          </View>

          {/* Store Name Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Store Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Streetside Lomi Haus"
              placeholderTextColor="#999"
              value={storeName}
              onChangeText={setStoreName}
            />
          </View>

          {/* Nearest Landmark Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nearest Landmark</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Near Gate 1"
              placeholderTextColor="#999"
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>

          {/* Inside or Outside Campus Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Inside or Outside</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowCampusDropdown(!showCampusDropdown)}
            >
              <Text style={[styles.dropdownText, !campusLocation && styles.placeholderText]}>
                {campusLocation || 'Select location'}
              </Text>
              <Ionicons 
                name={showCampusDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>

            {/* Dropdown Options */}
            {showCampusDropdown && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCampusLocation('Inside Campus');
                    setShowCampusDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>Inside Campus</Text>
                  {campusLocation === 'Inside Campus' && (
                    <Ionicons name="checkmark" size={20} color="#FF6B35" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCampusLocation('Outside Campus');
                    setShowCampusDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>Outside Campus</Text>
                  {campusLocation === 'Outside Campus' && (
                    <Ionicons name="checkmark" size={20} color="#FF6B35" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Meal Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="food" size={20} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Meal Details</Text>
          </View>

          {/* Image Upload */}
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={64} color="#999" />
                <Text style={styles.uploadText}>Tap to Upload Photo</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Meal Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Meal Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Pork Sisig"
              placeholderTextColor="#999"
              value={mealName}
              onChangeText={setMealName}
            />
          </View>

          {/* Price Fields */}
          <View style={styles.priceRow}>
            <View style={styles.priceField}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Regular Price</Text>
              </View>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>₱</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="- - -"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={regularPrice}
                  onChangeText={setRegularPrice}
                />
              </View>
            </View>

            <View style={styles.priceField}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Half Order</Text>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => setIsHalfOrder(!isHalfOrder)}
                >
                  {isHalfOrder && (
                    <Ionicons name="checkmark" size={16} color="#FF6B35" />
                  )}
                </TouchableOpacity>
              </View>
              <View style={[styles.priceInputContainer, !isHalfOrder && styles.disabledInput]}>
                <Text style={[styles.currencySymbol, !isHalfOrder && styles.disabledText]}>₱</Text>
                <TextInput
                  style={[styles.priceInput, !isHalfOrder && styles.disabledText]}
                  placeholder="- - -"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={halfOrderPrice}
                  onChangeText={setHalfOrderPrice}
                  editable={isHalfOrder}
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: '#fff',
    marginTop: -15,
    marginHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  imageUpload: {
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 15,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  priceField: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    height: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  disabledInput: {
    backgroundColor: '#fafafa',
    opacity: 0.6,
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 5,
  },
  disabledText: {
    color: '#999',
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});