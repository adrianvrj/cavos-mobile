import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import Header from './components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from './lib/supabaseClient';
import { wallet_provider_api, WALLET_PROVIDER_TOKEN } from './lib/constants';
import axios from 'axios';
import { decryptPin, decryptSecretWithPin, encryptPin } from './lib/utils';
import { useWallet, walletAtom } from './atoms/wallet';
import { useUserStore } from './atoms/userId';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Pin() {
    const navigation = useNavigation();
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const userId = useUserStore((state) => state.userId);
    const setWallet = useWallet((state) => state.setWallet);
    const [isNewUser, setIsNewUser] = useState(false);
    const [userData, setUserData] = useState(null);

    const [fontsLoaded] = Font.useFonts({
        'Satoshi-Variable': require('./assets/fonts/Satoshi-Variable.ttf'),
    });

    const [googleFontsLoaded] = useFonts({
        JetBrainsMono_400Regular,
    });

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    useEffect(() => {
        async function getAccountInfo() {
            try {
                const { data, error } = await supabase
                    .from('user_wallet')
                    .select('*')
                    .eq('uid', userId);

                if (error) {
                    console.error('Supabase read error:', error);
                    Alert.alert('Error reading from database');
                    return;
                }

                if (data.length === 0) {
                    setIsNewUser(true);
                    Alert.alert("Setup a PIN to create your account");
                }
                else {
                    setUserData(data[0]);
                }
            } catch (error) {
                console.error('Error al obtener el balance:', error);
            }
        }

        if (userId) {
            getAccountInfo();
        }
    }, [userId]);

    const handleNumberPress = (number) => {
        if (pin.length < 6) {
            setPin(pin + number);
            setError(false);
        }
        if (pin.length + 1 >= 6) {
            validatePin(pin + number);
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const handleForgotPin = () => {
        Alert.alert(
            'Forgot PIN',
            'Would you like to reset your PIN? This will require email verification.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset PIN',
                    onPress: () => navigation.navigate('ResetPin')
                }
            ]
        );
    };

    const createWallet = async (pinP) => {
        try {
            const response = await axios.post(
                wallet_provider_api,
                { pin: pinP },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${WALLET_PROVIDER_TOKEN}`,
                    },
                }
            );
            return response.data;
        } catch (err) {
            Alert.alert("Error generating wallet: " + err);
        }
    };


    const validatePin = async (pinP) => {
        const hashedPin = encryptPin(pinP);
        try {
            if (isNewUser) {
                const wallet_details = await createWallet(hashedPin);

                if (!wallet_details || !wallet_details.address) {
                    Alert.alert('Wallet creation failed. Please try again.');
                    return;
                }

                const { error: insertError } = await supabase
                    .from('user_wallet')
                    .insert([
                        {
                            uid: userId,
                            address: wallet_details.address,
                            public_key: wallet_details.public_key,
                            private_key: wallet_details.private_key,
                            pin: hashedPin,
                        },
                    ]);

                if (insertError) {
                    console.error('Insert error:', insertError);
                    Alert.alert('Error saving wallet to database');
                    return;
                }

                const { error: txError } = await supabase
                    .from('transaction')
                    .insert([
                        {
                            uid: userId,
                            type: "Account Creation",
                            amount: 0.0,
                        },
                    ]);

                if (txError) {
                    console.error('Insert error:', txError);
                    Alert.alert('Error saving transaction to database');
                    return;
                }

                setWallet({
                    uid: userId,
                    address: wallet_details.address,
                    public_key: wallet_details.public_key,
                    private_key: wallet_details.private_key,
                    pin: hashedPin,
                });

                Alert.alert("Account setup successful!", "", [
                    {
                        text: "Continue",
                        onPress: () => navigation.navigate('Dashboard')
                    }
                ]);
            } else {
                if (decryptPin(userData.pin) !== pinP) {
                    Alert.alert("Wrong pin!");
                }
                else {
                    setWallet(userData);
                    navigation.navigate('Dashboard');
                }
            }
        } catch (err) {
            console.error('Unexpected error in validatePin:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button */}
            <Header showBackButton={true} />

            {/* PIN Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Input Your PIN</Text>

                {error && (
                    <Text style={styles.errorText}>Authentication Failed</Text>
                )}

                {/* PIN Dots */}
                <View style={styles.pinContainer}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <View
                            key={i}
                            style={[
                                styles.pinDot,
                                i < pin.length && styles.pinDotFilled,
                                error && styles.pinDotError
                            ]}
                        />
                    ))}
                </View>

                {/* Number Pad */}
                <View style={styles.numberPad}>
                    <View style={styles.numberRow}>
                        {[1, 2, 3].map((num) => (
                            <TouchableOpacity
                                key={num}
                                style={styles.numberButton}
                                onPress={() => handleNumberPress(num.toString())}
                            >
                                <Text style={styles.numberText}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.numberRow}>
                        {[4, 5, 6].map((num) => (
                            <TouchableOpacity
                                key={num}
                                style={styles.numberButton}
                                onPress={() => handleNumberPress(num.toString())}
                            >
                                <Text style={styles.numberText}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.numberRow}>
                        {[7, 8, 9].map((num) => (
                            <TouchableOpacity
                                key={num}
                                style={styles.numberButton}
                                onPress={() => handleNumberPress(num.toString())}
                            >
                                <Text style={styles.numberText}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.numberRow}>
                        <TouchableOpacity style={styles.emptyButton} disabled>
                            <MaterialIcons name="fingerprint" size={moderateScale(24)} color="#555" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.numberButton}
                            onPress={() => handleNumberPress('0')}
                        >
                            <Text style={styles.numberText}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={handleDelete}
                        >
                            <MaterialIcons name="backspace" size={moderateScale(24)} color="#FFFFE3" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Forgot PIN */}
                <TouchableOpacity
                    style={styles.forgotPinButton}
                    onPress={handleForgotPin}
                >
                    <Text style={styles.forgotPinText}>Forgot your PIN?</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
    },
    title: {
        color: '#FFFFE3',
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        marginBottom: verticalScale(10),
    },
    errorText: {
        color: '#F44336',
        fontSize: moderateScale(16),
        marginBottom: verticalScale(30),
    },
    pinContainer: {
        flexDirection: 'row',
        marginBottom: verticalScale(50),
    },
    pinDot: {
        width: moderateScale(16),
        height: moderateScale(16),
        borderRadius: moderateScale(8),
        borderWidth: 1,
        borderColor: '#555',
        marginHorizontal: moderateScale(10),
    },
    pinDotFilled: {
        backgroundColor: '#FFFFE3',
        borderColor: '#FFFFE3',
    },
    pinDotError: {
        borderColor: '#F44336',
    },
    numberPad: {
        width: '100%',
        maxWidth: moderateScale(300),
    },
    numberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(20),
    },
    numberButton: {
        width: moderateScale(70),
        height: moderateScale(70),
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    emptyButton: {
        width: moderateScale(70),
        height: moderateScale(70),
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        color: '#FFFFE3',
        fontSize: moderateScale(24),
    },
    forgotPinButton: {
        marginTop: verticalScale(30),
    },
    forgotPinText: {
        color: '#555',
        fontSize: moderateScale(14),
    },
});
