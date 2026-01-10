import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // --- Header Section ---
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  resetButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },

  // --- Main Content ---
  content: {
    padding: 20,
    gap: 16,
  },

  // --- Budget Card (UPDATED) ---
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  // The Grey Input Box
  budgetInputContainer: {
    backgroundColor: '#F0EFEB', 
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetCurrency: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B35',
    marginRight: 10,
  },
  budgetInput: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    flex: 1, 
    padding: 0,
  },

  // --- Zone & Match Row ---
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  
  // --- Zone Selector ---
  zoneCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  zoneButtons: {
    gap: 8,
  },
  zoneButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  zoneButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  zoneButtonText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  zoneButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // --- Match Counter ---
  matchCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  matchCount: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 4,
  },
  matchSubtext: {
    fontSize: 11,
    color: '#999',
  },

  // --- Shake Button Area ---
  shakeContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  shakeButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  shakeButtonDisabled: {
    backgroundColor: '#ccc',
    shadowColor: '#000',
  },
  shakeText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // --- Result Popup ---
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 12,
  },
  placeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeLocation: {
    fontSize: 14,
    color: '#666',
  },
});