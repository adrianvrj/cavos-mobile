import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import Header from '../../components/Header';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { supabase } from '../../lib/supabaseClient';
import { useAtom } from 'jotai';
import { userIdAtom } from '../../atoms/userId';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function PhoneOTP() {
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber } = route.params;
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [resendEnabled, setResendEnabled] = useState(false);
    const otpInputRef = useRef(null);
    const [, setUserId] = useAtom(userIdAtom);

    const [fontsLoaded] = Font.useFonts({
        'Satoshi-Variable': require('../../assets/fonts/Satoshi-Variable.ttf'),
    });

    const [googleFontsLoaded] = useFonts({
        JetBrainsMono_400Regular,
    });

    if (!fontsLoaded || !googleFontsLoaded) {
        return null;
    }

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    // useEffect(() => {
    //     if (timer > 0 && !resendEnabled) {
    //         const interval = setInterval(() => {
    //             setTimer(timer - 1);
    //         }, 1000);
    //         return () => clearInterval(interval);
    //     } else if (timer === 0) {
    //         setResendEnabled(true);
    //     }
    // }, [timer, resendEnabled]);

    const handleVerify = async (code) => {
        const { data, error } = await supabase.auth.verifyOtp({
            phone: phoneNumber,
            token: code,
            type: 'sms',
        });

        if (error) {
            Alert.alert('OTP verification failed:', error.message);
        } else {
            console.log('OTP verified, user signed in!');
            if (data?.user) {
                setUserId(data.user.id);
                console.log(data.user.id);
            } else {
                Alert.alert("Something went wrong, please try again.")
            }
            // Redirect to "Pin" or "Dashboard"
            navigation.navigate('Pin');
        }
    };

    const handleResend = () => {
        setTimer(30);
        setResendEnabled(false);
        setOtp('');
        if (otpInputRef.current) {
            otpInputRef.current.clear();
        }
        Alert.alert('Code Sent', 'A new verification code has been sent to your phone');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button */}
            <Header />

            {/* Content */}
            <View style={styles.content}>
                {/* Title Section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Enter Verification Code</Text>
                    <Text style={styles.subtitle}>
                        Sent to {phoneNumber}
                    </Text>
                </View>

                {/* OTP Input */}
                <View style={styles.otpContainer}>
                    <OTPInputView
                        ref={otpInputRef}
                        style={styles.otpInput}
                        pinCount={6}
                        code={otp}
                        onCodeChanged={code => {
                            setOtp(code);
                            if (code.length === 6) {
                                handleVerify(code);
                            }
                        }}
                        autoFocusOnLoad
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    // Remove onCodeFilled and handle it in onCodeChanged
                    />
                </View>

                {/* Timer/Resend */}
                <View style={styles.resendContainer}>
                    {resendEnabled ? (
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendText}>Resend Code</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.timerText}>
                            Resend code in 0:{timer < 10 ? `0${timer}` : timer}
                        </Text>
                    )}
                </View>

                {/* Verify Button - now using manual verification */}
                <TouchableOpacity
                    style={[
                        styles.verifyButton,
                        otp.length < 6 && styles.disabledButton
                    ]}
                    onPress={() => handleVerify(otp)}
                    disabled={otp.length < 6}
                >
                    <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
            </View>
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
        alignItems: 'center',
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
        textAlign: 'center',
    },
    otpContainer: {
        height: verticalScale(100),
        marginBottom: verticalScale(30),
    },
    otpInput: {
        width: '100%',
        height: '100%',
    },
    underlineStyleBase: {
        width: moderateScale(45),
        height: moderateScale(55),
        borderWidth: 1,
        borderColor: '#333',
        color: '#FFFFE3',
        fontSize: moderateScale(24),
        fontFamily: 'JetBrainsMono_400Regular',
    },
    underlineStyleHighLighted: {
        borderColor: '#FFFFE3',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },
    resendText: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
        textDecorationLine: 'underline',
    },
    timerText: {
        color: '#555',
        fontSize: moderateScale(16),
    },
    verifyButton: {
        backgroundColor: '#FFFFE3',
        borderRadius: moderateScale(10),
        padding: moderateScale(16),
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    verifyButtonText: {
        color: '#11110E',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});