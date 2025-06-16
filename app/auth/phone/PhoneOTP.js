import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Platform,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useUserStore } from '../../../atoms/userId';
import { supabase } from '../../../lib/supabaseClient';
import Header from '../../components/Header';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function PhoneOTP() {
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber, isReset } = route.params;
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [resendEnabled, setResendEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const otpInputRef = useRef(null);
    const setUserId = useUserStore((state) => state.setUserId);

    Font.useFonts({
        'Satoshi-Variable': require('../../../assets/fonts/Satoshi-Variable.ttf'),
    });

    useFonts({
        JetBrainsMono_400Regular,
    });

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    useEffect(() => {
        if (isReset) {
            Alert.alert('Reset Password', 'Please enter the verification code sent to your phone.');
            supabase.auth.signInWithOtp({
                phone: phoneNumber,
            });
        }
    }, []);

    useEffect(() => {
        if (timer > 0 && !resendEnabled) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setResendEnabled(true);
        }
    }, [timer, resendEnabled]);

    const hasWallet = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_wallet')
                .select('*')
                .eq('uid', userId)
                .single();
            return !!data;
        } catch (error) {
            Alert.alert('Error', 'An error occurred while checking wallet information.');
            return false;
        }
    };

    const handleVerify = async (code) => {
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: phoneNumber,
                token: code,
                type: 'sms',
            });

            if (error) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setError(error.message || 'OTP verification failed');
            } else {
                if (data?.user) {
                    setUserId(data.user.id);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } else {
                    setError("Something went wrong, please try again.");
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                }
                if (!error && data?.user) {
                    if (isReset) {
                        navigation.replace('Pin', { isReset: true });
                    } else {
                        if (!await hasWallet(data.user.id)) {
                            navigation.replace('Invitation');
                        } else {
                            navigation.replace('Pin');
                        }
                    }
                }
            }
        } catch (err) {
            setError('Unexpected error, please try again.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        setLoading(false);
    };

    const handleResend = async () => {
        if (!resendEnabled) return;
        setTimer(30);
        setResendEnabled(false);
        setOtp('');
        setError('');
        await supabase.auth.signInWithOtp({
            phone: phoneNumber,
        });
        Alert.alert('Code Sent', 'A new verification code has been sent to your phone');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <SafeAreaView style={styles.container}>
                <Header />

                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Enter Verification Code</Text>
                        <Text style={styles.subtitle}>
                            Sent to {phoneNumber}
                        </Text>
                    </View>

                    <View style={styles.otpContainer}>
                        <OTPInputView
                            ref={otpInputRef}
                            style={styles.otpInput}
                            pinCount={6}
                            code={otp}
                            onCodeChanged={code => {
                                setOtp(code);
                                setError('');
                            }}
                            onCodeFilled={code => {
                                handleVerify(code);
                            }}
                            autoFocusOnLoad
                            codeInputFieldStyle={styles.underlineStyleBase}
                            codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        />
                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}
                    </View>

                    <View style={styles.resendContainer}>
                        {resendEnabled ? (
                            <TouchableOpacity
                                onPress={handleResend}
                                accessibilityRole="button"
                                accessibilityLabel="Resend code"
                            >
                                <Text style={styles.resendText}>Resend Code</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.timerText}>
                                Resend code in 0:{timer < 10 ? `0${timer}` : timer}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.verifyButton,
                            (otp.length < 6 || loading) && styles.disabledButton
                        ]}
                        onPress={() => handleVerify(otp)}
                        disabled={otp.length < 6 || loading}
                        accessibilityRole="button"
                        accessibilityLabel="Verify code"
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.verifyButtonText}>Verify</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
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
        alignItems: 'center',
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
        textAlign: 'center',
    },
    otpContainer: {
        height: verticalScale(120),
        marginBottom: verticalScale(30),
        justifyContent: 'center',
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
        color: '#EAE5DC',
        fontSize: moderateScale(24),
        fontFamily: 'JetBrainsMono_400Regular',
    },
    underlineStyleHighLighted: {
        borderColor: '#EAE5DC',
    },
    errorText: {
        color: '#FF4444',
        fontSize: moderateScale(14),
        marginTop: 10,
        textAlign: 'center',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },
    resendText: {
        color: '#EAE5DC',
        fontSize: moderateScale(16),
        textDecorationLine: 'underline',
    },
    timerText: {
        color: '#888',
        fontSize: moderateScale(16),
    },
    verifyButton: {
        backgroundColor: '#EAE5DC',
        borderRadius: moderateScale(8),
        padding: moderateScale(16),
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    verifyButtonText: {
        color: '#000000',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});
