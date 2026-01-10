import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
  resetButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    overflow: 'hidden', // Ensures background clip works on text
  },
  content: {
    padding: 20,
    gap: 16,
  },
  budgetCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  budgetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  // The gray box container
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEEEA', // Light gray background from screenshot
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 80, 
  },
  budgetIcon: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B35', // Primary Orange
    marginRight: 10,
  },
  // The actual text input field
  budgetInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '800',
    color: '#333',
    height: '100%',
    padding: 0, // Removes default Android padding
  },
  budgetDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
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