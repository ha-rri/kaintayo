const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.18.141:5000/api/v1/';

export const endpoints = {
  places: {
    getAll: `${API_URL}places`,
    getById: (id: string) => `${API_URL}places/${id}`,
    create: `${API_URL}places`,
    update: (id: string) => `${API_URL}places/${id}`,
    delete: (id: string) => `${API_URL}places/${id}`,
  },
  meals: {
    getByPlace: (placeId: string) => `${API_URL}places/${placeId}/meals`,
  },
};

// Helper to map client zone to server zone
export const mapZoneToServer = (zone: string): string => {
  const zoneMap: Record<string, string> = {
    'All': '',
    'Inside Campus': 'inside',
    'Outside Campus': 'outside',
  };
  return zoneMap[zone] || '';
};

// Helper to map server zone to client zone
export const mapZoneToClient = (zone: string): string => {
  const zoneMap: Record<string, string> = {
    'inside': 'Inside Campus',
    'outside': 'Outside Campus',
  };
  return zoneMap[zone] || zone;
};