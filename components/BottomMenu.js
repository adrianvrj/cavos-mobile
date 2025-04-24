import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, TrendingUp, UserPlus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomMenu() {
  const navigation = useNavigation();

  const navigateToHome = () => {
    navigation.navigate('Dashboard');
  };

  const navigateToInvestments = () => {
    navigation.navigate('Investments');
  };

  const navigateToReferral = () => {
    navigation.navigate('Referral');
  };

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem} onPress={navigateToInvestments}>
        <TrendingUp color="#FFFFE3" size={24} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={navigateToHome}>
        <Home color="#FFFFE3" size={24} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={navigateToReferral}>
        <UserPlus color="#FFFFE3" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    backgroundColor: '#11110E',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    justifyContent: 'space-around',
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: '#FFFFE3',
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Satoshi-Variable',
  },
});
