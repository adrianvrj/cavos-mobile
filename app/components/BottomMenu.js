import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa la librería de íconos
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
        <Icon name="wallet-outline" size={24} color="#FFFFE3" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={navigateToHome}>
        <Icon name="home-outline" size={24} color="#FFFFE3" />
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.menuItem} onPress={navigateToReferral}>
        <Icon name="people-outline" size={24} color="#FFFFE3" />
      </TouchableOpacity> */}
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
