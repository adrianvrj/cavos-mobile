import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import BottomMenu from './components/BottomMenu';
import Header from './components/Header';
import { useWallet } from '../atoms/wallet';
import { getWalletBalance } from '../lib/utils';
import axios from 'axios';
import { wallet_provider_api, WALLET_PROVIDER_TOKEN } from '../lib/constants';
import { supabase } from '../lib/supabaseClient';
import LoadingModal from './components/LoadingModal';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Send() {
    const navigation = useNavigation();
    const [amount, setAmount] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const wallet = useWallet((state) => state.wallet);
    const [isLoading, setIsLoading] = useState(false);

    Font.useFonts({
        'Satoshi-Variable': require('../assets/fonts/Satoshi-Variable.ttf'),
    });

    useFonts({
        JetBrainsMono_400Regular,
    });

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    useEffect(() => {
        async function getAccountInfo() {
            try {
                const newBalance = await getWalletBalance(wallet.address);
                setBalance(newBalance.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        }

        if (wallet) {
            getAccountInfo();
        }
    }, [wallet]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleChangeAmount = (text) => {
        const sanitized = text.replace(',', '.');
        setAmount(sanitized);
    };

    const validateStarknetAddress = (address) => {
        return address.startsWith('0x') && address.length === 66;
    };

    const handleSend = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        if (parseFloat(amount) > balance) {
            Alert.alert('Insufficient Balance', 'You don\'t have enough funds for this transfer');
            return;
        }

        if (!recipientAddress) {
            Alert.alert('Missing Address', 'Please enter a recipient address');
            return;
        }

        if (!validateStarknetAddress(recipientAddress)) {
            Alert.alert('Invalid Address', 'Please enter a valid Starknet wallet address');
            return;
        }

        Alert.alert(
            'Confirm Transfer',
            `Send $${amount} to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            const response = await axios.post(
                                wallet_provider_api + 'wallet/send',
                                {
                                    amount: amount,
                                    address: wallet.address,
                                    hashedPk: wallet.private_key,
                                    hashedPin: wallet.pin,
                                    receiverAddress: recipientAddress,
                                },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${WALLET_PROVIDER_TOKEN}`,
                                    },
                                }
                            );

                            if (!response.data.result) {
                                throw new Error('Transaction failed');
                            }

                            const txHash = response.data.result;

                            // Save transaction to database
                            const { error: txError } = await supabase
                                .from('transaction')
                                .insert([
                                    {
                                        uid: wallet.uid,
                                        type: "Send",
                                        amount: amount,
                                        tx_hash: txHash,
                                    },
                                ]);

                            if (txError) {
                                console.error('Insert error:', txError);
                                Alert.alert('Error saving transaction to database');
                                setIsLoading(false);
                                return;
                            }

                            setIsLoading(false);
                            Alert.alert('Success', `You've sent $${amount} to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}`);
                            // Reset fields
                            setAmount('');
                            setRecipientAddress('');
                            navigation.navigate('Dashboard');
                        } catch (error) {
                            console.error('Send error:', error);
                            setIsLoading(false);
                            Alert.alert('Transaction Failed', 'An error occurred while sending funds. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <LoadingModal />
            )}
            {/* Header with Back Button */}
            <Header showBackButton={true} onBackPress={handleBack} />

            {/* Main Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
                    <Text style={styles.balanceAmount}>{balance.toFixed(2)} USD</Text>
                </View>

                {/* Recipient Address Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>RECIPIENT STARKNET ADDRESS</Text>
                    <View style={styles.addressInputContainer}>
                        <TextInput
                            style={styles.addressInput}
                            placeholder="0x..."
                            placeholderTextColor="#555"
                            value={recipientAddress}
                            onChangeText={setRecipientAddress}
                            selectionColor="#FFFFE3"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </View>

                {/* Amount Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>AMOUNT TO SEND (USD)</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            placeholderTextColor="#555"
                            keyboardType="decimal-pad"
                            value={amount}
                            onChangeText={handleChangeAmount}
                            selectionColor="#FFFFE3"
                        />
                        <TouchableOpacity
                            style={styles.maxButton}
                            onPress={() => setAmount(balance.toString())}
                        >
                            <Text style={styles.maxButtonText}>MAX</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Transfer Summary */}
                {amount && !isNaN(amount) && parseFloat(amount) > 0 && recipientAddress && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Transfer Amount</Text>
                            <Text style={styles.summaryValue}>${parseFloat(amount).toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Recipient</Text>
                            <Text style={styles.summaryValue} numberOfLines={1} ellipsizeMode="middle">
                                {recipientAddress.substring(0, 6)}...{recipientAddress.substring(recipientAddress.length - 4)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Send Button */}
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!amount || isNaN(amount) || parseFloat(amount) <= 0 || !recipientAddress) &&
                        styles.disabledButton
                    ]}
                    onPress={handleSend}
                    disabled={!amount || isNaN(amount) || parseFloat(amount) <= 0 || !recipientAddress}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>

                {/* Disclaimer */}
                <Text style={styles.disclaimer}>
                    Double-check the recipient address before sending. Transactions cannot be reversed once confirmed.
                </Text>
            </ScrollView>

            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#11110E',
        paddingTop: Platform.OS === 'android' ? verticalScale(20) : 0,
    },
    scrollContent: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: verticalScale(100),
    },
    balanceCard: {
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        marginBottom: verticalScale(30),
        alignItems: 'center',
    },
    balanceLabel: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(8),
    },
    balanceAmount: {
        color: '#FFFFE3',
        fontSize: moderateScale(36),
        fontWeight: '100',
        fontFamily: 'JetBrainsMono_400Regular'
    },
    inputContainer: {
        marginBottom: verticalScale(20),
    },
    inputLabel: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(15),
    },
    addressInputContainer: {
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        borderWidth: 1,
        borderColor: '#333',
    },
    addressInput: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
        fontFamily: 'JetBrainsMono_400Regular',
        padding: 0,
    },
    amountInputContainer: {
        flexDirection: 'row',
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    currencySymbol: {
        color: '#FFFFE3',
        fontSize: moderateScale(24),
        marginRight: moderateScale(10),
    },
    amountInput: {
        flex: 1,
        color: '#FFFFE3',
        fontSize: moderateScale(24),
        fontFamily: 'JetBrainsMono_400Regular',
        padding: 0,
    },
    maxButton: {
        backgroundColor: '#333',
        borderRadius: moderateScale(6),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(6),
        marginLeft: moderateScale(10),
    },
    maxButtonText: {
        color: '#FFFFE3',
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    summaryCard: {
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        marginBottom: verticalScale(30),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(15),
    },
    summaryLabel: {
        color: '#555',
        fontSize: moderateScale(14),
    },
    summaryValue: {
        color: '#FFFFE3',
        fontSize: moderateScale(14),
        fontFamily: 'JetBrainsMono_400Regular',
        maxWidth: '60%',
    },
    sendButton: {
        backgroundColor: '#FFFFE3',
        padding: moderateScale(16),
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    sendButtonText: {
        color: '#11110E',
        fontSize: moderateScale(16),
    },
    disclaimer: {
        color: '#555',
        fontSize: moderateScale(12),
        textAlign: 'center',
        lineHeight: moderateScale(18),
    },
});
