import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ZocialIcon from 'react-native-vector-icons/Zocial'; // Import Zion Icon library
import Dashboard from '../Dashboard';
import Investments from '../Investments';
import BitcoinAccount from '../BitcoinAccount';

const Tab = createBottomTabNavigator();

export default function BottomMenu() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#11110E', borderTopWidth: 0 },
        tabBarActiveTintColor: '#FFFFE3',
        tabBarInactiveTintColor: '#555',
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'BTC Account') {
            return <ZocialIcon name="bitcoin" size={size} color={color} />;
          } else {
            let iconName;
            if (route.name === 'Dashboard') {
              iconName = 'home-outline';
            } else if (route.name === 'Investments') {
              iconName = 'trending-up-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Investments" component={Investments} />
      <Tab.Screen name="BTC Account" component={BitcoinAccount} />
    </Tab.Navigator>
  );
}
