import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './Dashboard';
import Login from './Login';
import Investments from './Investments';
import Referral from './Referral';
import Pin from './Pin';
import Buy from './actions/Buy';
import Invest from './actions/Invest';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Pin" component={Pin} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Investments" component={Investments} />
        <Stack.Screen name="Referral" component={Referral} />
        <Stack.Screen name="Buy" component={Buy} />
        <Stack.Screen name="Invest" component={Invest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
