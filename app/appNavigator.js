import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '../lib/supabaseClient';
// Screens
import Login from './auth/Login';
import Pin from './auth/Pin';
import Dashboard from './Dashboard';
import Investments from './Investments';
import BitcoinAccount from './BitcoinAccount';
import PhoneLogin from './auth/phone/PhoneLogin';
import PhoneOTP from './auth/phone/PhoneOTP';
import BuyBTC from './btc/BuyBTC';
import SellBTC from './btc/SellBTC';
import InvestBTC from './btc/InvestBTC';
import Providers from './Providers';
import BottomMenu from './components/BottomMenu';
import Buy from './Buy';
import Send from './Send';
import Invest from './Invest';
import Invitation from './auth/Invitation';
import Profile from './Profile';
import ContactList from './social/ContactList';
import Referral from './Referral';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  const hasWallet = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_wallet')
        .select('*')
        .eq('uid', userId)
        .single();
      if (error) {
        console.error('Error fetching wallet info:', error);
        Alert.alert('Error', 'Failed to fetch wallet information.');
      } else {
        if (data) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking wallet:', error);
      Alert.alert('Error', 'An error occurred while checking wallet information.');
      return false;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const userId = session.user.id;
        const hasUserWallet = await hasWallet(userId);
        if (hasUserWallet) {
          setInitialRoute('Pin');
        } else {
          setInitialRoute('Invitation');
        }
      } else {
        setInitialRoute('Login');
      }
    };

    checkSession();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#11110E' }}>
        <ActivityIndicator size="large" color="#EAE5DC" />
      </View>
    );
  }

  return (
    <Providers>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Investments" component={Investments} />
        <Stack.Screen name="BitcoinAccount" component={BitcoinAccount} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Pin" component={Pin} initialParams={false} />
        <Stack.Screen name="BottomMenu" component={BottomMenu} />
        <Stack.Screen name="BuyBTC" component={BuyBTC} />
        <Stack.Screen name="SellBTC" component={SellBTC} />
        <Stack.Screen name="InvestBTC" component={InvestBTC} />
        <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
        <Stack.Screen name="PhoneOTP" component={PhoneOTP} />
        <Stack.Screen name="Buy" component={Buy} />
        <Stack.Screen name="Send" component={Send} />
        <Stack.Screen name="Invest" component={Invest} />
        <Stack.Screen name="Invitation" component={Invitation} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ContactList" component={ContactList} />
        <Stack.Screen name="Referral" component={Referral} />
      </Stack.Navigator>
    </Providers>
  );
}
