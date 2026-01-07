import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Slider from '@react-native-community/slider';

// Mock Data with meals
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
    meals: [
      { id: 1, name: '4pc Teriyaki Chicken w/ Rice', price: 169, updatedBy: '@Hazel', updatedTime: '3d ago' },
      { id: 2, name: 'Spamsilog', price: 89, updatedBy: '@Alicia', updatedTime: '2d ago' },
      { id: 3, name: 'Sisigsilog', price: 89, updatedBy: '@Samuel', updatedTime: '2d ago' },
      { id: 4, name: 'Lomi Solo', price: 89, updatedBy: '@Harmel', updatedTime: '2d ago' },
    ],
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
    meals: [
      { id: 1, name: 'Chicken Adobo', price: 65, updatedBy: '@Maria', updatedTime: '1d ago' },
      { id: 2, name: 'Pork Sinigang', price: 70, updatedBy: '@John', updatedTime: '1d ago' },
      { id: 3, name: 'Lumpia Shanghai', price: 40, updatedBy: '@Anna', updatedTime: '2d ago' },
    ],
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
    meals: [
      { id: 1, name: 'Iced Caramel Latte', price: 120, updatedBy: '@Coffee', updatedTime: '1d ago' },
      { id: 2, name: 'Blueberry Muffin', price: 85, updatedBy: '@Baker', updatedTime: '2d ago' },
    ],
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
    meals: [
      { id: 1, name: 'Whopper Meal', price: 180, updatedBy: '@BK', updatedTime: '1d ago' },
      { id: 2, name: 'Chicken Fries', price: 120, updatedBy: '@BK', updatedTime: '1d ago' },
    ],
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
    meals: [
      { id: 1, name: 'Tapsilog', price: 95, updatedBy: '@Foodie', updatedTime: '1d ago' },
      { id: 2, name: 'Bangsilog', price: 90, updatedBy: '@Foodie', updatedTime: '1d ago' },
    ],
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
    meals: [
      { id: 1, name: 'Pancit Canton', price: 45, updatedBy: '@Student', updatedTime: '1d ago' },
      { id: 2, name: 'Palabok', price: 50, updatedBy: '@Student', updatedTime: '2d ago' },
    ],
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
    meals: [
      { id: 1, name: 'PM1 (Chicken Inasal)', price: 159, updatedBy: '@MI', updatedTime: '1d ago' },
      { id: 2, name: 'Halo-Halo', price: 69, updatedBy: '@MI', updatedTime: '1d ago' },
    ],
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
    meals: [
      { id: 1, name: 'Classic Milk Tea', price: 80, updatedBy: '@Tea', updatedTime: '1d ago' },
      { id: 2, name: 'Taro Milk Tea', price: 90, updatedBy: '@Tea', updatedTime: '1d ago' },
    ],
  },
];

export default function FoodScreen() {
  const [limit, setLimit] = useState(150);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter restaurants based on search, category, and price limit
  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    const categoryMatch = 
      activeCategory === 'All' || restaurant.category === activeCategory;
    
    const priceMatch = restaurant.minPrice <= limit;
    
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

  const openRestaurantModal = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRestaurant(null);
  };

  // Filter meals within price limit
  const getAffordableMeals = (meals: any[]) => {
    return meals.filter(meal => meal.price <= limit);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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
              <TouchableOpacity style={styles.card} onPress={() => openRestaurantModal(restaurant)}>
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

      {/* Restaurant Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedRestaurant && (
            <>
              {/* Restaurant Image Header */}
              <View style={styles.modalImageContainer}>
                <Image
                  source={{ uri: selectedRestaurant.image }}
                  style={styles.modalImage}
                />
                <TouchableOpacity style={styles.modalBackButton} onPress={closeModal}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalHeartButton}>
                  <Ionicons name="heart-outline" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Restaurant Info */}
              <ScrollView style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{selectedRestaurant.name}</Text>
                    <Text style={styles.modalLocation}>{selectedRestaurant.location}</Text>
                  </View>
                  <View style={styles.modalPriceBadge}>
                    <Text style={styles.modalPriceText}>
                      ₱{selectedRestaurant.minPrice} - ₱{selectedRestaurant.maxPrice}
                    </Text>
                  </View>
                </View>

                {/* Student Menu Section */}
                <View style={styles.menuSection}>
                  <Text style={styles.menuTitle}>Student Menu</Text>
                  
                  {getAffordableMeals(selectedRestaurant.meals).map((meal) => (
                    <View key={meal.id} style={styles.menuItem}>
                      <View style={styles.menuItemIcon} />
                      <View style={styles.menuItemContent}>
                        <Text style={styles.menuItemName}>{meal.name}</Text>
                        <Text style={styles.menuItemMeta}>
                          Updated {meal.updatedTime} by {meal.updatedBy}
                        </Text>
                        <Text style={styles.menuItemPrice}>₱{meal.price}</Text>
                      </View>
                    </View>
                  ))}

                  {getAffordableMeals(selectedRestaurant.meals).length === 0 && (
                    <View style={styles.noMealsContainer}>
                      <Text style={styles.noMealsText}>
                        No meals within your ₱{limit} budget
                      </Text>
                      <Text style={styles.noMealsSubtext}>
                        Try increasing your limit to see more options
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </Modal>
    </View>
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
    width: 360,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffffff',
    marginTop: -17,
    borderTopLeftRadius: 20,
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
    color: '#000000ff',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalImageContainer: {
    position: 'relative',
    height: 250,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeartButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  modalLocation: {
    fontSize: 14,
    color: '#666',
  },
  modalPriceBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalPriceText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 15,
  },
  menuItemIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemMeta: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  noMealsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noMealsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  noMealsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});