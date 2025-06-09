import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { supabase } from '../../../lib/supabaseClient';
import Header from '../../components/Header';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Lista de países con sus códigos
const callingCodes = [
  { country: 'Costa Rica', code: '506' },
  { country: 'United States', code: '1' },
  { country: 'Mexico', code: '52' },
  { country: 'Spain', code: '34' },
  { country: 'United Kingdom', code: '44' },
  { country: 'Germany', code: '49' },
  { country: 'Argentina', code: '54' },
  { country: 'Brazil', code: '55' },
  { country: 'India', code: '91' },
  { country: 'Panama', code: '507' },
  { country: 'Ecuador', code: '593' },
];

export default function PhoneLogin() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callingCode, setCallingCode] = useState({ country: 'Costa Rica', code: '506' });
  const [showModal, setShowModal] = useState(false);

  const [fontsLoaded] = Font.useFonts({
    'Satoshi-Variable': require('../../../assets/fonts/Satoshi-Variable.ttf'),
  });

  const [googleFontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
  });

  if (!fontsLoaded || !googleFontsLoaded) return null;

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

  const handleContinue = async () => {
    if (phoneNumber.length < 8) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number');
      return;
    }

    const fullPhone = `+${callingCode.code}${phoneNumber}`;

    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });

    if (error) {
      Alert.alert("Something went wrong", error.message);
    } else {
      navigation.replace('PhoneOTP', { phoneNumber: fullPhone });
    }
  };

  const renderCodeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.codeItem}
      onPress={() => {
        setCallingCode(item);
        setShowModal(false);
      }}
    >
      <Text style={styles.codeItemText}>
        {item.country} (+{item.code})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Enter Your Phone Number</Text>
          <Text style={styles.subtitle}>We'll send you a verification code</Text>
        </View>

        <View style={styles.phoneInputContainer}>
          <TouchableOpacity
            style={styles.countryCodeContainer}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.countryCodeText}>
              +{callingCode.code}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={15}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            phoneNumber.length < 1 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={phoneNumber.length < 1}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <Modal visible={showModal} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <FlatList
              data={callingCodes}
              keyExtractor={item => item.code}
              renderItem={renderCodeItem}
              contentContainerStyle={{ padding: 20 }}
            />
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.continueButtonText}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'android' ? verticalScale(20) : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: verticalScale(40),
  },
  title: {
    color: '#EAE5DC',
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    marginBottom: verticalScale(5),
  },
  subtitle: {
    color: '#888',
    fontSize: moderateScale(16),
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginBottom: verticalScale(30),
    borderWidth: 1,
    borderColor: '#333',
  },
  countryCodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333',
    paddingRight: moderateScale(15),
    marginRight: moderateScale(15),
  },
  countryCodeText: {
    color: '#EAE5DC',
    fontSize: moderateScale(16),
    fontFamily: 'JetBrainsMono_400Regular',
  },
  phoneInput: {
    flex: 1,
    color: '#EAE5DC',
    fontSize: moderateScale(16),
    fontFamily: 'JetBrainsMono_400Regular',
  },
  continueButton: {
    backgroundColor: '#EAE5DC',
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  codeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  codeItemText: {
    fontSize: 18,
    color: '#fff',
  },
  closeModal: {
    backgroundColor: '#EAE5DC',
    padding: 16,
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
});
