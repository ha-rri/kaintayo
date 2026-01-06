import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

// Mock existing stores (Replace with API call to MongoDB)
const existingStores = [
  { 
    id: 1, 
    name: 'Streetside Lomi Haus', 
    landmark: 'Near Gate 1', 
    campusLocation: 'Outside Campus',
    tags: ['Filipino', 'Noodles', 'Comfort Food']
  },
  { 
    id: 2, 
    name: 'Campus Canteen', 
    landmark: 'Main Building', 
    campusLocation: 'Inside Campus',
    tags: ['Filipino', 'Rice Meals', 'Affordable']
  },
  { 
    id: 3, 
    name: 'Coffee Bean Café', 
    landmark: 'Near Library', 
    campusLocation: 'Inside Campus',
    tags: ['Cafe', 'Coffee', 'Pastries']
  },
  { 
    id: 4, 
    name: 'Tapa King', 
    landmark: 'Near Parking', 
    campusLocation: 'Outside Campus',
    tags: ['Filipino', 'Breakfast', 'Rice Meals']
  },
];

// Predefined tags
const availableTags = [
  'Filipino', 'Chinese', 'Japanese', 'Korean', 'American', 'Italian',
  'Fast Food', 'Cafe', 'Coffee', 'Tea', 'Desserts', 'Pastries',
  'Rice Meals', 'Noodles', 'Pasta', 'Burgers', 'Pizza', 'Chicken',
  'Grilled', 'Fried', 'Healthy', 'Vegetarian', 'Breakfast',
  'Lunch', 'Dinner', 'Snacks', 'Drinks', 'Affordable', 'Budget Friendly',
  'Premium', 'Student Favorite', 'Quick Bite', 'Comfort Food'
];

export default function ContributeScreen() {
  const [storeName, setStoreName] = useState<string>('');
  const [storeSearchResults, setStoreSearchResults] = useState<any[]>([]);
  const [showStoreDropdown, setShowStoreDropdown] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [isNewStore, setIsNewStore] = useState<boolean>(false);
  
  const [landmark, setLandmark] = useState<string>('');
  const [campusLocation, setCampusLocation] = useState<'Inside Campus' | 'Outside Campus' | ''>('');
  const [showCampusDropdown, setShowCampusDropdown] = useState<boolean>(false);
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagsSection, setShowTagsSection] = useState<boolean>(false);
  
  const [mealName, setMealName] = useState<string>('');
  const [regularPrice, setRegularPrice] = useState<string>('');
  const [halfOrderPrice, setHalfOrderPrice] = useState<string>('');
  const [isHalfOrder, setIsHalfOrder] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Search for existing stores
  useEffect(() => {
    if (storeName.length > 0) {
      const results = existingStores.filter(store => 
        store.name.toLowerCase().includes(storeName.toLowerCase())
      );
      setStoreSearchResults(results);
      setShowStoreDropdown(true);
      
      // Check if it's a new store
      const exactMatch = existingStores.find(
        store => store.name.toLowerCase() === storeName.toLowerCase()
      );
      setIsNewStore(!exactMatch);
    } else {
      setStoreSearchResults([]);
      setShowStoreDropdown(false);
      setIsNewStore(false);
    }
  }, [storeName]);

  // Auto-fill when existing store is selected
  const selectExistingStore = (store: any) => {
    setSelectedStore(store);
    setStoreName(store.name);
    setLandmark(store.landmark);
    setCampusLocation(store.campusLocation);
    setSelectedTags(store.tags);
    setShowStoreDropdown(false);
    setIsNewStore(false);
    setShowTagsSection(false);
  };

  // Handle new store
  const handleNewStore = () => {
    setSelectedStore(null);
    setShowStoreDropdown(false);
    setIsNewStore(true);
    setShowTagsSection(true);
    // Keep the typed store name
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

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
      tags: selectedTags,
      isNewStore,
      mealName,
      regularPrice,
      halfOrderPrice: isHalfOrder ? halfOrderPrice : null,
      image: selectedImage,
    });
    // TODO: Send to MongoDB API
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

          {/* Store Name Input with Autocomplete */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Store Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Streetside Lomi Haus"
              placeholderTextColor="#999"
              value={storeName}
              onChangeText={setStoreName}
            />

            {/* Store Dropdown */}
            {showStoreDropdown && storeSearchResults.length > 0 && (
              <View style={styles.dropdownMenu}>
                {storeSearchResults.map((store) => (
                  <TouchableOpacity
                    key={store.id}
                    style={styles.dropdownItem}
                    onPress={() => selectExistingStore(store)}
                  >
                    <View>
                      <Text style={styles.dropdownItemText}>{store.name}</Text>
                      <Text style={styles.dropdownItemSubtext}>{store.landmark}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.dropdownItem, styles.newStoreItem]}
                  onPress={handleNewStore}
                >
                  <View style={styles.newStoreContent}>
                    <Ionicons name="add-circle" size={20} color="#FF6B35" />
                    <Text style={styles.newStoreText}>Add &quot;{storeName}&quot; as new store</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* New Store Badge */}
            {isNewStore && (
              <View style={styles.newStoreBadge}>
                <Ionicons name="add-circle" size={16} color="#FF6B35" />
                <Text style={styles.newStoreBadgeText}>New Store</Text>
              </View>
            )}

            {/* Existing Store Badge */}
            {selectedStore && (
              <View style={styles.existingStoreBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.existingStoreBadgeText}>Existing Store</Text>
              </View>
            )}
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
              editable={isNewStore || !selectedStore}
            />
          </View>

          {/* Inside or Outside Campus Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Inside or Outside</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowCampusDropdown(!showCampusDropdown)}
              disabled={selectedStore && !isNewStore}
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

          {/* Tags Section (Only for new stores or when editing) */}
          {(isNewStore || showTagsSection) && (
            <View style={styles.fieldContainer}>
              <View style={styles.tagsHeader}>
                <Text style={styles.label}>Tags (Select all that apply)</Text>
                <Text style={styles.tagsCount}>{selectedTags.length} selected</Text>
              </View>
              <View style={styles.tagsContainer}>
                {availableTags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tagChip,
                      selectedTags.includes(tag) && styles.tagChipSelected
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagChipText,
                      selectedTags.includes(tag) && styles.tagChipTextSelected
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Show tags for existing stores (read-only) */}
          {selectedStore && !isNewStore && selectedTags.length > 0 && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Store Tags</Text>
              <View style={styles.tagsContainer}>
                {selectedTags.map((tag, index) => (
                  <View key={index} style={styles.tagChipReadOnly}>
                    <Text style={styles.tagChipTextReadOnly}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
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
    position: 'relative',
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
    maxHeight: 200,
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
    fontWeight: '500',
  },
  dropdownItemSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  newStoreItem: {
    backgroundColor: '#fff5f0',
    borderBottomWidth: 0,
  },
  newStoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newStoreText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  newStoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff5f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  newStoreBadgeText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  existingStoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0f9f4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  existingStoreBadgeText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagsCount: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tagChipSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  tagChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tagChipTextSelected: {
    color: '#fff',
  },
  tagChipReadOnly: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  tagChipTextReadOnly: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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