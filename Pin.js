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
import BottomMenu from './components/BottomMenu';
import Header from './components/Header';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Pin() {
    const navigation = useNavigation();
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const [fontsLoaded] = Font.useFonts({
        'Satoshi-Variable': require('./assets/fonts/Satoshi-Variable.ttf'),
    });

    const [googleFontsLoaded] = useFonts({
        JetBrainsMono_400Regular,
    });

    if (!fontsLoaded || !googleFontsLoaded) {
        return null;
    }

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

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

    const goToDashboard = () => {
        navigation.navigate('Dashboard');
    };

    const validatePin = (pinP) => {
        if (pinP !== '123456') {
            setError(true);
            setAttempts(prev => {
                const newAttempts = prev + 1;
    
                if (newAttempts >= 3) {
                    Alert.alert('Too Many Attempts', 'Please try again later or reset your PIN.');
                }
    
                return newAttempts;
            });
            setPin('');
        } else {
            goToDashboard();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button */}
            <Header showBackButton={true}/>

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
