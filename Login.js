import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';

export default function Login() {

  const navigation = useNavigation();

  const [fontsLoaded] = Font.useFonts({
    'Satoshi-Variable': require('./assets/fonts/Satoshi-Variable.ttf'),
  });

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

  const goToPin = () => {
    navigation.navigate('Pin');
  };

  const goToPhoneLogin = () => {
    navigation.navigate('PhoneLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('./assets/cavos-logo.png')}
        />
        <Text style={styles.logoText}>CAVOS</Text>
      </View>

      <View style={styles.taglineContainer}>
        <Text style={styles.taglineText}>
          Invest stable coins{'\n'}
          on the cheapest{'\n'}
          and fastest chain.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={[styles.button, styles.googleButton]}>
          <Text style={styles.buttonText}>Continue with Google</Text>
          <Image
            source={require('./assets/google-icon.png')}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.appleButton]} onPress={goToPin}>
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
          <Image
            source={require('./assets/apple-icon.png')}
            style={styles.buttonIcon}
          />
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.button, styles.phoneButton]} onPress={goToPhoneLogin}>
          <Text style={styles.buttonText}>Continue with Phone Number</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11110E',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
  },
  logoIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  logoCircle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFE3',
    marginRight: 3,
  },
  circleLarge: {
    width: 25,
    height: 25,
    borderRadius: 15,
  },
  logoText: {
    color: '#FFFFE3',
    fontSize: 48,
    marginLeft: 15,
    fontWeight: '300'
  },
  taglineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglineText: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 36,
    fontWeight: '300',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 100
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    position: 'relative',
    marginHorizontal: 40
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#11110E',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFE3',
  },
  buttonIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 35,
  },
  googleButton: {
    backgroundColor: '#FFFFE3',
  },
  appleButton: {
    backgroundColor: '#1F1F21',
    // borderColor: '#FFFFE3',
    borderWidth: 1,
  },
  phoneButton: {
    backgroundColor: '#FFFFE3',
  },
});