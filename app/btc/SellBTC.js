import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../../atoms/wallet';
import { getBTCPrice } from '../../lib/utils';
import Header from '../components/Header';
import { supabase } from '../../lib/supabaseClient';
import { wallet_provider_api, WALLET_PROVIDER_TOKEN } from '../../lib/constants';
import LoadingModal from '../components/LoadingModal';
import axios from 'axios';

export default function SellBTC() {
    const [btcAmount, setBtcAmount] = useState('');
    const [btcBalance, setBtcBalance] = useState(0);
    const [btcRate, setBtcRate] = useState(0);
    const wallet = useWallet((state) => state.wallet);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);

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

    const handleSellBTC = async () => {
        const amount = parseFloat(btcAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount in BTC.');
            return;
        }

        if (amount > btcBalance) {
            Alert.alert('Insufficient Balance', 'You do not have enough BTC to sell.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(
                wallet_provider_api + 'wallet/swap',
                {
                    address: wallet.address,
                    hashedPk: wallet.private_key,
                    hashedPin: wallet.pin,
                    sellTokenAddress: '0x3Fe2b97C1Fd336E750087D68B9b867997Fd64a2661fF3ca5A7C771641e8e7AC',
                    buyTokenAddress: '0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
                    amount: Math.round(amount * 10 ** 8),
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

            const { error: txError } = await supabase
                .from('transaction')
                .insert([
                    {
                        uid: wallet.uid,
                        type: "Sell BTC",
                        amount: amount * btcRate,
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
            Alert.alert('Success', `You've sold ${amount.toFixed(6)} BTC for USDC.`);
            setBtcAmount('');
            navigation.navigate('BitcoinAccount');
        } catch (error) {
            console.error('Send error:', error);
            setIsLoading(false);
            Alert.alert('Transaction Failed', 'An error occurred while processing the transaction. Please try again.');
        }
    };

    const calculateUsdcAmount = () => {
        const amount = parseFloat(btcAmount);
        if (isNaN(amount) || amount <= 0) return 0;
        return amount * btcRate;
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <LoadingModal />
            )}
            <Header />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Balance Section */}
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
                    <Text style={styles.inputLabel}>AMOUNT TO SELL (BTC)</Text>
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

                {/* Expected USDC Section */}
                <View style={styles.expectedUsdcSection}>
                    <Text style={styles.expectedUsdcLabel}>EXPECTED USDC TO RECEIVE</Text>
                    <Text style={styles.expectedUsdcAmount}>
                        {calculateUsdcAmount().toFixed(2)} USDC
                    </Text>
                </View>

                {/* Sell Button */}
                <TouchableOpacity
                    style={[
                        styles.sellButton,
                        (!btcAmount || isNaN(btcAmount) || parseFloat(btcAmount) <= 0) &&
                        styles.disabledButton,
                    ]}
                    onPress={handleSellBTC}
                    disabled={!btcAmount || isNaN(btcAmount) || parseFloat(btcAmount) <= 0}
                >
                    <Text style={styles.sellButtonText}>Sell BTC</Text>
                </TouchableOpacity>

                {/* Disclaimer */}
                <Text style={styles.disclaimer}>
                    Cryptocurrency transactions are subject to market risks. Please trade responsibly.
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
        fontFamily: 'JetBrainsMono_400Regular',
        padding: 0,
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
    expectedUsdcSection: {
        marginBottom: 30,
        alignItems: 'center',
    },
    expectedUsdcLabel: {
        color: '#555',
        fontSize: 14,
        marginBottom: 8,
    },
    expectedUsdcAmount: {
        color: '#FFFFE3',
        fontSize: 24,
        fontWeight: '100',
        fontFamily: 'JetBrainsMono_400Regular',
    },
    sellButton: {
        backgroundColor: '#FFFFE3',
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    sellButtonText: {
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