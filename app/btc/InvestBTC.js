import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useWallet } from '../../atoms/wallet';
import { getBTCPrice } from '../../lib/utils';
import axios from 'axios';
import { wallet_provider_api, WALLET_PROVIDER_TOKEN } from '../../lib/constants';
import { supabase } from '../../lib/supabaseClient';
import LoadingModal from '../components/LoadingModal';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';

export default function InvestBTC() {
    const navigation = useNavigation();
    const [btcAmount, setBtcAmount] = useState('');
    const [btcBalance, setBtcBalance] = useState(0);
    const [btcRate, setBtcRate] = useState(0);
    const wallet = useWallet((state) => state.wallet);
    const [isLoading, setIsLoading] = useState(false);

    Font.useFonts({
        'Satoshi-Variable': require('../../assets/fonts/Satoshi-Variable.ttf'),
    });

    useFonts({
        JetBrainsMono_400Regular,
    });

    useEffect(() => {
        async function fetchBalance() {
            try {
                setIsLoading(true);
                const response = await axios.post(
                    wallet_provider_api + "wallet/btc/balance",
                    { address: wallet.address },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${WALLET_PROVIDER_TOKEN}`,
                        },
                    }
                );
                setBtcBalance(response.data.balance);
                await fetchBtcRate();
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching wallet balance:', error);
                Alert.alert('Error', 'Failed to fetch wallet balance.');
            }
        }

        async function fetchBtcRate() {
            try {
                const btcPrice = await getBTCPrice();
                setBtcRate(btcPrice.data);
            } catch (error) {
                console.error('Error fetching BTC rate:', error);
                Alert.alert('Error', 'Failed to fetch BTC rate.');
            }
        }

        if (wallet) {
            fetchBalance();
        }
    }, [wallet]);

    const handleChangeAmount = (text) => {
        const sanitized = text.replace(',', '.');
        setBtcAmount(sanitized);
    };

    const handleInvestBTC = async () => {
        const amount = parseFloat(btcAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount in BTC.');
            return;
        }

        if (amount > btcBalance) {
            Alert.alert('Insufficient Balance', 'You do not have enough BTC to invest.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(
                wallet_provider_api + 'vesu/positions/btc/create',
                {
                    amount: amount,
                    address: wallet.address,
                    hashedPk: wallet.private_key,
                    hashedPin: wallet.pin,
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
                        type: "Invest BTC",
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
            Alert.alert('Success', `You've invested ${amount.toFixed(6)} BTC.`);
            setBtcAmount('');
            navigation.navigate('Dashboard');
        } catch (error) {
            console.error('Error during investment:', error);
            setIsLoading(false);
            Alert.alert('Transaction Failed', 'An error occurred while processing the transaction. Please try again.');
        }
    };

    const calculateUsdValue = () => {
        const amount = parseFloat(btcAmount);
        if (isNaN(amount) || amount <= 0) return 0;
        return amount * btcRate;
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <LoadingModal />}
            <Header showBackButton={true} onBackPress={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* BTC Balance Section */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>AVAILABLE BTC BALANCE</Text>
                    <Text style={styles.balanceAmount}>{btcBalance.toFixed(6)} BTC</Text>
                </View>

                {/* Current BTC Price Section */}
                <View style={styles.btcPriceSection}>
                    <Text style={styles.btcPriceLabel}>CURRENT BTC PRICE</Text>
                    <Text style={styles.btcPriceAmount}>${btcRate.toFixed(2)} USD</Text>
                </View>

                {/* Input Section */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>AMOUNT TO INVEST (BTC)</Text>
                    <View style={styles.amountInputContainer}>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.000000"
                            placeholderTextColor="#555"
                            keyboardType="decimal-pad"
                            value={btcAmount}
                            onChangeText={handleChangeAmount}
                            selectionColor="#FFFFE3"
                        />
                        <TouchableOpacity
                            style={styles.maxButton}
                            onPress={() => setBtcAmount(btcBalance.toString())}
                        >
                            <Text style={styles.maxButtonText}>MAX</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Investment Summary */}
                {btcAmount && !isNaN(btcAmount) && parseFloat(btcAmount) > 0 && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Investment Amount</Text>
                            <Text style={styles.summaryValue}>{btcAmount} BTC</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Estimated Value (USD)</Text>
                            <Text style={styles.summaryValue}>
                                ${calculateUsdValue().toFixed(2)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Invest Button */}
                <TouchableOpacity
                    style={[
                        styles.investButton,
                        (!btcAmount || isNaN(btcAmount) || parseFloat(btcAmount) <= 0) &&
                        styles.disabledButton,
                    ]}
                    onPress={handleInvestBTC}
                    disabled={!btcAmount || isNaN(btcAmount) || parseFloat(btcAmount) <= 0}
                >
                    <Text style={styles.investButtonText}>Invest BTC</Text>
                </TouchableOpacity>

                {/* Disclaimer */}
                <Text style={styles.disclaimer}>
                    Investments are subject to market risks. Past performance is not indicative of future results.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#11110E',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    balanceCard: {
        backgroundColor: '#000',
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    balanceLabel: {
        color: '#555',
        fontSize: 14,
        marginBottom: 8,
    },
    balanceAmount: {
        color: '#FFFFE3',
        fontSize: 36,
        fontWeight: '100',
        fontFamily: 'JetBrainsMono_400Regular',
    },
    btcPriceSection: {
        marginBottom: 30,
        alignItems: 'center',
        fontFamily: 'JetBrainsMono_400Regular',
    },
    btcPriceLabel: {
        color: '#555',
        fontSize: 14,
        marginBottom: 8,
    },
    btcPriceAmount: {
        color: '#FFFFE3',
        fontSize: 24,
        fontWeight: '100',
        fontFamily: 'JetBrainsMono_400Regular',
    },
    inputContainer: {
        marginBottom: 30,
    },
    inputLabel: {
        color: '#555',
        fontSize: 14,
        marginBottom: 15,
    },
    amountInputContainer: {
        flexDirection: 'row',
        backgroundColor: '#000',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    amountInput: {
        flex: 1,
        color: '#FFFFE3',
        fontSize: 24,
        padding: 0,
        fontFamily: 'JetBrainsMono_400Regular',
    },
    maxButton: {
        backgroundColor: '#333',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginLeft: 10,
    },
    maxButtonText: {
        color: '#FFFFE3',
        fontSize: 14,
        fontWeight: 'bold',
    },
    summaryCard: {
        backgroundColor: '#000',
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    summaryLabel: {
        color: '#555',
        fontSize: 14,
    },
    summaryValue: {
        color: '#FFFFE3',
        fontSize: 14,
        fontFamily: 'JetBrainsMono_400Regular',
    },
    investButton: {
        backgroundColor: '#FFFFE3',
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    investButtonText: {
        color: '#11110E',
        fontSize: 16,
    },
    disclaimer: {
        color: '#555',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});