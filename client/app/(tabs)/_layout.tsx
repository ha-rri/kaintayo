// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B35', // Orange color for active tab
        tabBarInactiveTintColor: '#999', // Gray for inactive tabs
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Food',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/icons/food.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#FF6B35' : '#999',
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="shake"
        options={{
          title: 'Shake',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/icons/shake.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#FF6B35' : '#999',
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="contribute"
        options={{
          title: 'Contribute',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/icons/contribute.png')}
              style={{
                width: 28,
                height: 28,
                tintColor: focused ? '#FF6B35' : '#999',
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/icons/profile.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#FF6B35' : '#999',
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}