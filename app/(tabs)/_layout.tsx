import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 80,
          paddingBottom: Platform.OS === 'ios' ? 25 : 15,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#eee',
          backgroundColor: '#fff',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 5,
          paddingBottom: Platform.OS === 'ios' ? 5 : 0,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: '지도',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="map" size={28} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="volunteer"
        options={{
          title: '봉사활동',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="heart" size={28} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: '커뮤니티',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="people" size={28} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="person" size={28} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
} 