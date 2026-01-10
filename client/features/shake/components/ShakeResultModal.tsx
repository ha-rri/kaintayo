import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// Removed Ionicons import
import { Place } from '../types';

interface ShakeResultModalProps {
  visible: boolean;
  place: Place | null;
  onClose: () => void;
  onAccept: () => void;
}

const { width } = Dimensions.get('window');

export default function ShakeResultModal({ visible, place, onClose, onAccept }: ShakeResultModalProps) {
  if (!place) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        
        {/* 1. Header Section */}
        <View style={styles.header}>
          {/* ✅ UPDATED: Using the new image logo */}
          <Image 
            source={require('../../../assets/images/icons/shake-logo.png')} 
            style={styles.headerLogo}
          />
          <Text style={styles.headerTitle}>We Picked...</Text>
        </View>

        {/* ... (rest of the component remains the same) ... */}
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: place.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.detailsCard}>
              <View style={styles.textGroup}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeLandmark}>{place.location.landmark}</Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>
                  ₱{place.priceRange.min} - ₱{place.priceRange.max}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={onAccept}>
              <Text style={styles.primaryButtonText}>KainTayo!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Shake Again</Text>
            </TouchableOpacity>
            
            <Text style={styles.subtext}>Not Satisfied? Shake Again!</Text>
          </View>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  // ✅ ADDED: Style for the logo in the modal header
  headerLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
  },
  // ... (rest of the styles remain the same) ...
  content: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative',
    marginTop: -20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    position: 'absolute',
    bottom: -30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  textGroup: {
    flex: 1,
  },
  placeName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  placeLandmark: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  priceBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  actions: {
    marginTop: 80,
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '700',
  },
  subtext: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
    fontSize: 14,
  },
});