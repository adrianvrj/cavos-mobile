import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import Dashboard from '../Dashboard';
import Investments from '../Investments';
import BitcoinAccount from '../BitcoinAccount';
import ContactList from '../social/ContactList';
import Referral from '../Referral';

const Tab = createBottomTabNavigator();

export default function StyledBottomMenu() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#171717',
          borderTopWidth: 0,
          borderRadius: 35,
          marginHorizontal: 15,
          marginBottom: 35,
          height: 80,
          paddingBottom: 15,
          paddingTop: 20,
          paddingHorizontal: 10,
          position: 'absolute',
          elevation: 20,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#888888',
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconComponent;
          const iconSize = focused ? 26 : 24;
          
          if (route.name === 'Dashboard') {
            iconComponent = (
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Icon name="grid-outline" size={iconSize} color={color} />
              </View>
            );
          } else if (route.name === 'Bitcoin') {
            iconComponent = (
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <ZocialIcon name="bitcoin" size={iconSize} color={color} />
              </View>
            );
          } else if (route.name === 'Investments') {
            return (
              <View style={[styles.centralIconContainer, focused && styles.centralIconActive]}>
                <View style={styles.centralIconBackground}>
                  <Image 
                    source={require('../../assets/vesu-logo.png')}
                    style={styles.pngIcon}
                    resizeMode="contain"
                  />
                </View>
              </View>
            );
          } else if (route.name === 'Search') {
            iconComponent = (
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Icon name="search-outline" size={iconSize} color={color} />
              </View>
            );
          } else if (route.name === 'Referral') {
            iconComponent = (
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <MaterialCommunityIcons name="handshake-outline" size={iconSize} color={color} />
              </View>
            );
          }
          
          return iconComponent;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Bitcoin" component={BitcoinAccount} />
      <Tab.Screen name="Investments" component={Investments} />
      <Tab.Screen name="Search" component={ContactList} />
      <Tab.Screen name="Referral" component={Referral} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ scale: 1.05 }],
  },
  centralIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  centralIconBackground: {
    width: 55,
    height: 55,
    backgroundColor: '#3A3A3A',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A4A4A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  centralIconActive: {
    transform: [{ scale: 1.08 }],
  },
  pngIcon: {
    width: 35,
    height: 35,
    tintColor: '#FFFFFF',
  },
});
