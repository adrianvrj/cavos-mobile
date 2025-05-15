import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '../lib/supabaseClient';
// Screens
import Login from './auth/Login';
import Pin from './auth/Pin';
import Dashboard from './Dashboard';
import Investments from './Investments';
import Referral from './auth/Referral';
import PhoneLogin from './auth/phone/PhoneLogin';
import PhoneOTP from './auth/phone/PhoneOTP';
import Buy from './Buy';
import Invest from './Invest';
import Send from './Send';
import Providers from './Providers';
import BitcoinAccount from './BitcoinAccount';
import BuyBTC from './btc/BuyBTC';
import SellBTC from './btc/SellBTC';
import InvestBTC from './btc/InvestBTC';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setInitialRoute('Pin');
      } else {
        setInitialRoute('Login');
      }
    };

    checkSession();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#11110E' }}>
        <ActivityIndicator size="large" color="#FFFFE3" />
      </View>
    );
  }

  return (
    <Providers>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Pin" component={Pin} initialParams={false} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Investments" component={Investments} />
        <Stack.Screen name="Referral" component={Referral} />
        <Stack.Screen name="Buy" component={Buy} />
        <Stack.Screen name="Invest" component={Invest} />
        <Stack.Screen name="Send" component={Send} />
        <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
        <Stack.Screen name="PhoneOTP" component={PhoneOTP} />
        <Stack.Screen name="BitcoinAccount" component={BitcoinAccount} />
        <Stack.Screen name="BuyBTC" component={BuyBTC} />
        <Stack.Screen name="SellBTC" component={SellBTC} />
        <Stack.Screen name="InvestBTC" component={InvestBTC} />
      </Stack.Navigator>
    </Providers>
  );
}
