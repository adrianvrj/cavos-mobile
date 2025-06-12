import React, { useState, useRef } from 'react';
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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { supabase } from '../../../lib/supabaseClient';
import Header from '../../components/Header';
import * as Haptics from 'expo-haptics';
import { callingCodes } from '../../../lib/constants';

const { width, height } = Dimensions.get('window');
const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function PhoneLogin() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callingCode, setCallingCode] = useState({ country: 'Costa Rica', code: '506' });
  const [showModal, setShowModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [error, setError] = useState('');
  const phoneInputRef = useRef(null);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (phoneNumber.length < 8) {
      setError('Enter at least 8 digits');
      return;
    }
    setError('');
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
        setTimeout(() => phoneInputRef.current?.focus(), 300);
      }}
      accessibilityRole="button"
      accessibilityLabel={`Select ${item.country} code`}
    >
      <Text style={styles.codeItemText}>
        {item.country} (+{item.code})
      </Text>
    </TouchableOpacity>
  );

  const filteredCodes = Array.isArray(callingCodes)
  ? callingCodes.filter(
      c =>
        typeof c.country === 'string' &&
        c.country.toLowerCase().includes(countrySearch.toLowerCase())
    )
  : [];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              accessibilityRole="button"
              accessibilityLabel="Select country code"
            >
              <Text style={styles.countryCodeText}>
                +{callingCode.code}
              </Text>
            </TouchableOpacity>
            <TextInput
              ref={phoneInputRef}
              style={styles.phoneInput}
              placeholder="Your phone number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={text => {
                setPhoneNumber(text.replace(/[^0-9]/g, ''));
                if (error) setError('');
              }}
              maxLength={15}
              returnKeyType="done"
              autoFocus
              accessibilityLabel="Phone number input"
            />
          </View>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.continueButton,
              phoneNumber.length < 8 && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={phoneNumber.length < 8}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <Text style={[
              styles.continueButtonText,
              phoneNumber.length < 8 && { color: '#888' }
            ]}>Continue</Text>
          </TouchableOpacity>

          <Modal
            visible={showModal}
            animationType="slide"
            transparent
            onRequestClose={() => setShowModal(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <SafeAreaView style={styles.modalContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country"
                placeholderTextColor="#888"
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoFocus
                accessibilityLabel="Search country"
              />
              <FlatList
                data={filteredCodes}
                keyExtractor={item => item.code}
                renderItem={renderCodeItem}
                contentContainerStyle={{ padding: 20 }}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
                    No countries found
                  </Text>
                }
              />
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => setShowModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Close country code modal"
              >
                <Text style={styles.continueButtonText}>Close</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Modal>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  countryCodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333',
    paddingRight: moderateScale(15),
    marginRight: moderateScale(15),
    minWidth: 50,
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
  errorText: {
    color: '#FF4444',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(10),
    marginLeft: moderateScale(5),
  },
  continueButton: {
    backgroundColor: '#EAE5DC',
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(10),
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#000',
    maxHeight: '80%',
    // width: '90%',
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    // Centra el contenido si es necesario
    justifyContent: 'flex-start',
    // alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    margin: 20,
    fontSize: 16,
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
