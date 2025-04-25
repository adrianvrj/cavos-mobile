import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Screens
import Dashboard from './Dashboard';
import Login from './Login';
import Investments from './Investments';
import Referral from './Referral';
import Pin from './Pin';
import Buy from './actions/Buy';
import Invest from './actions/Invest';
import { supabase } from './lib/supabaseClient';
import PhoneLogin from './auth/phone/PhoneLogin';
import PhoneOTP from './auth/phone/PhoneOTP';
import Providers from './Providers';

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
        <Stack.Screen name="Pin" component={Pin} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Investments" component={Investments} />
        <Stack.Screen name="Referral" component={Referral} />
        <Stack.Screen name="Buy" component={Buy} />
        <Stack.Screen name="Invest" component={Invest} />
        <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
        <Stack.Screen name="PhoneOTP" component={PhoneOTP} />
      </Stack.Navigator>
    </Providers>
  );
}
