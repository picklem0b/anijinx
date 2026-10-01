import { Tabs } from 'expo-router'
import Icon from '@/components/Icon'
import { Platform } from 'react-native'
import { colors, fontSize } from '@/constants/theme'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primarySoft,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.surfaceAlpha,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: fontSize.xs, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? 'house.fill' : 'house'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'sparkles' : 'sparkle'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'square.grid.2x2.fill' : 'square.grid.2x2'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'books.vertical.fill' : 'books.vertical'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
