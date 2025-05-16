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
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { supabase } from '../../../lib/supabaseClient';
import Header from '../../components/Header';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function PhoneLogin() {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('1');

    const [fontsLoaded] = Font.useFonts({
        'Satoshi-Variable': require('../../../assets/fonts/Satoshi-Variable.ttf'),
    });

    const [googleFontsLoaded] = useFonts({
        JetBrainsMono_400Regular,
    });

    if (!fontsLoaded || !googleFontsLoaded) {
        return null;
    }

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    const handleContinue = async () => {
        if (phoneNumber.length < 8) {
            Alert.alert('Invalid Number', 'Please enter a valid phone number');
            return;
        }
        const { data, error } = await supabase.auth.signInWithOtp({
            phone: countryCode + phoneNumber,
        });
        if (error) Alert.alert("Something went wrong, please try again");
        else navigation.navigate('PhoneOTP', { phoneNumber: `${countryCode}${phoneNumber}` });;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button */}
            <Header/>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                {/* Title Section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Enter Your Phone Number</Text>
                    <Text style={styles.subtitle}>We'll send you a verification code</Text>
                </View>

                {/* Phone Input */}
                <View style={styles.phoneInputContainer}>
                    <View style={styles.countryCodeContainer}>
                        <TextInput
                            style={styles.countryCodeInput}
                            value={countryCode}
                            onChangeText={setCountryCode}
                            keyboardType="phone-pad"
                            maxLength={4}
                        />
                    </View>
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="Phone number"
                        placeholderTextColor="#555"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        maxLength={15}
                    />
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        phoneNumber.length < 1 && styles.disabledButton
                    ]}
                    onPress={handleContinue}
                    disabled={phoneNumber.length < 1}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#11110E',
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
        color: '#FFFFE3',
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        marginBottom: verticalScale(5),
    },
    subtitle: {
        color: '#555',
        fontSize: moderateScale(16),
    },
    phoneInputContainer: {
        flexDirection: 'row',
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(15),
        marginBottom: verticalScale(30),
        borderWidth: 1,
        borderColor: '#333',
    },
    countryCodeContainer: {
        borderRightWidth: 1,
        borderRightColor: '#333',
        paddingRight: moderateScale(15),
        marginRight: moderateScale(15),
    },
    countryCodeInput: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
        fontFamily: 'JetBrainsMono_400Regular',
        minWidth: moderateScale(40),
    },
    phoneInput: {
        flex: 1,
        color: '#FFFFE3',
        fontSize: moderateScale(16),
        fontFamily: 'JetBrainsMono_400Regular',
    },
    continueButton: {
        backgroundColor: '#FFFFE3',
        padding: moderateScale(16),
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    continueButtonText: {
        color: '#11110E',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    alternativeOptions: {
        alignItems: 'center',
    },
    orText: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(15),
    },
    emailOption: {
        padding: moderateScale(10),
    },
    emailOptionText: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
        textDecorationLine: 'underline',
    },
});