import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Slider from '@react-native-community/slider';

export default function FoodScreen() {
  const [limit, setLimit] = useState(150);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Price Limit Slider - FIXED FOR PERFORMANCE! */}
      <View style={styles.limitSection}>
        <Text style={styles.limitLabel}>My Limit:</Text>
        <View style={styles.limitContainer}>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={500}
              step={5}
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

      {/* Category Tabs - FIXED OVERFLOW! */}
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

      {/* Search Results Info */}
      {searchQuery.length > 0 && (
        <View style={styles.searchInfo}>
          <Text style={styles.searchInfoText}>
            Searching for: "{searchQuery}"
          </Text>
        </View>
      )}

      {/* Food Place Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' }}
            style={styles.cardImage}
          />
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>₱25 - ₱150</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>Categories</Text>
            </View>
            <Text style={styles.cardTitle}>Streetside Lomi Haus</Text>
            <Text style={styles.cardLocation}>Near Gate 1</Text>
          </View>
        </View>
      </View>

      {/* Empty State */}
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Don't got what you're looking for?</Text>
        <Text style={styles.emptySubtitle}>Increase your limit to discover more places!</Text>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  searchInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff5e6',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  searchInfoText: {
    fontSize: 14,
    color: '#666',
  },
  limitSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginTop: -10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  cardContainer: {
    paddingHorizontal: 20,
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
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
});