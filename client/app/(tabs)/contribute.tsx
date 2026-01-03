import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function ContributeScreen() {
  const [location, setLocation] = useState<string>('');
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
      location,
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
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search or Add a New Place"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
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

          {/* Price Fields - FIXED ALIGNMENT */}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
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
    height: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
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