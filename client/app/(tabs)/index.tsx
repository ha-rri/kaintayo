import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Slider from '@react-native-community/slider';

// Mock Data
const mockRestaurants = [
  {
    id: 1,
    name: 'Streetside Lomi Haus',
    location: 'Near Gate 1',
    category: 'Outside Campus',
    minPrice: 25,
    maxPrice: 150,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    tags: ['Filipino', 'Noodles', 'Comfort Food'],
  },
  {
    id: 2,
    name: 'Campus Canteen',
    location: 'Main Building',
    category: 'Inside Campus',
    minPrice: 30,
    maxPrice: 80,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    tags: ['Filipino', 'Rice Meals', 'Affordable'],
  },
  {
    id: 3,
    name: 'Coffee Bean Café',
    location: 'Near Library',
    category: 'Inside Campus',
    minPrice: 50,
    maxPrice: 200,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    tags: ['Cafe', 'Coffee', 'Pastries'],
  },
  {
    id: 4,
    name: 'Burger King Express',
    location: 'Gate 2 Area',
    category: 'Outside Campus',
    minPrice: 80,
    maxPrice: 250,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    tags: ['Fast Food', 'Burgers', 'American'],
  },
  {
    id: 5,
    name: 'Tapa King',
    location: 'Near Parking',
    category: 'Outside Campus',
    minPrice: 60,
    maxPrice: 180,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    tags: ['Filipino', 'Breakfast', 'Rice Meals'],
  },
  {
    id: 6,
    name: 'Student Hub Cafeteria',
    location: 'Student Center',
    category: 'Inside Campus',
    minPrice: 25,
    maxPrice: 100,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    tags: ['Snacks', 'Drinks', 'Budget Friendly'],
  },
  {
    id: 7,
    name: 'Mang Inasal',
    location: 'Main Road',
    category: 'Outside Campus',
    minPrice: 100,
    maxPrice: 300,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
    tags: ['Filipino', 'Grilled', 'Chicken'],
  },
  {
    id: 8,
    name: 'Milk Tea House',
    location: 'Gate 3',
    category: 'Outside Campus',
    minPrice: 60,
    maxPrice: 150,
    image: 'https://images.unsplash.com/photo-1525385444071-b092b93ca120?w=400',
    tags: ['Drinks', 'Milk Tea', 'Refreshments'],
  },
];

export default function FoodScreen() {
  const [limit, setLimit] = useState(150);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter restaurants based on search, category, and price limit
  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    // Category filter
    const categoryMatch = 
      activeCategory === 'All' || restaurant.category === activeCategory;
    
    // Price filter - show if minimum price is within limit
    const priceMatch = restaurant.minPrice <= limit;
    
    // Search filter
    const searchMatch = 
      searchQuery === '' ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && priceMatch && searchMatch;
  });

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#fff" />
            <Text style={styles.locationText}>Cavite State University</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for cafés, restaurants, and launderettes"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Price Limit Slider */}
      <View style={styles.limitSection}>
        <Text style={styles.limitLabel}>My Limit:</Text>
        <View style={styles.limitContainer}>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={300}
              step={10}
              value={limit}
              onValueChange={setLimit}
              minimumTrackTintColor="#FF6B35"
              maximumTrackTintColor="#e0e0e0"
              thumbTintColor="#FF6B35"
            />
          </View>
          <View style={styles.limitBadge}>
            <Text style={styles.limitText}>₱{limit}</Text>
          </View>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        <TouchableOpacity
          style={[styles.categoryTab, activeCategory === 'All' && styles.categoryTabActive]}
          onPress={() => setActiveCategory('All')}
        >
          <Text style={[styles.categoryText, activeCategory === 'All' && styles.categoryTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryTab, activeCategory === 'Inside Campus' && styles.categoryTabActive]}
          onPress={() => setActiveCategory('Inside Campus')}
        >
          <Text style={[styles.categoryText, activeCategory === 'Inside Campus' && styles.categoryTextActive]}>
            Inside Campus
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryTab, activeCategory === 'Outside Campus' && styles.categoryTabActive]}
          onPress={() => setActiveCategory('Outside Campus')}
        >
          <Text style={[styles.categoryText, activeCategory === 'Outside Campus' && styles.categoryTextActive]}>
            Outside Campus
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={styles.resultsText}>
          {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'place' : 'places'} found
        </Text>
      </View>

      {/* Restaurant Cards */}
      {filteredRestaurants.length > 0 ? (
        filteredRestaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.cardContainer}>
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: restaurant.image }}
                style={styles.cardImage}
              />
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>
                  ₱{restaurant.minPrice} - ₱{restaurant.maxPrice}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>{restaurant.category}</Text>
                </View>
                <Text style={styles.cardTitle}>{restaurant.name}</Text>
                <Text style={styles.cardLocation}>{restaurant.location}</Text>
                <View style={styles.tagsContainer}>
                  {restaurant.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        /* Empty State */
        <View style={styles.emptyState}>
          <Ionicons name="sad-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No places found!</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 
              `Try searching for something else or increase your limit.` :
              `Increase your limit to discover more places!`
            }
          </Text>
        </View>
      )}
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
  paddingBottom: 35, // Increased from 20 to 30 for more space
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  limitSection: {
  paddingHorizontal: 20,
  paddingVertical: 20,
  backgroundColor: '#fff',
  marginTop: -19, // Negative margin to overlap
  borderTopLeftRadius: 20, // Only round the top corners
  borderTopRightRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
  },
  limitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  limitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  sliderContainer: {
    flex: 1,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  limitBadge: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  limitText: {
    color: '#FF6B35',
    fontWeight: '700',
    fontSize: 14,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  categoryTabActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  resultsCount: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  cardContent: {
    padding: 15,
  },
  categoryChip: {
    backgroundColor: '#FF6B35',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryChipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});