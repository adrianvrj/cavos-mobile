import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { useWallet } from '../atoms/wallet';
import Header from './components/Header';
import axios from 'axios';
import { wallet_provider_api, WALLET_PROVIDER_TOKEN } from '../lib/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingModal from './components/LoadingModal';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function BitcoinAccount() {
    const [btcBalance, setBtcBalance] = useState(0.000);
    const [investedBtc, setInvestedBtc] = useState(0.000);
    const [apy, setApy] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const wallet = useWallet((state) => state.wallet);
    const navigation = useNavigation();

    Font.useFonts({
        'Satoshi-Variable': require('../assets/fonts/Satoshi-Variable.ttf'),
    });

    useFonts({
        JetBrainsMono_400Regular,
    });

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    useEffect(() => {
        async function fetchBitcoinData() {
            try {
                setIsLoading(true);
                const balanceResponse = await axios.post(
                    wallet_provider_api + "wallet/btc/balance",
                    { address: wallet.address },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${WALLET_PROVIDER_TOKEN}`,
                        },
                    }
                );
                setBtcBalance(balanceResponse.data.balance);

                const investmentResponse = await axios.post(
                    wallet_provider_api + 'vesu/positions',
                    {
                        address: wallet.address,
                        pool: "Genesis",
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${WALLET_PROVIDER_TOKEN}`,
                        },
                    }
                );
                setInvestedBtc(investmentResponse.data.earnPositions[0].total_supplied);
                setApy(investmentResponse.data.earnPositions[0].poolApy);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching BTC data:', err);
                Alert.alert('Error', 'Failed to fetch BTC data.');
            }
        }

        if (wallet) {
            fetchBitcoinData();
        }
    }, [wallet]);

    const goToBuy = () => {
        navigation.navigate('BuyBTC');
    };

    const goToSell = () => {
        navigation.navigate('SellBTC');
    };

    const goToInvest = () => {
        navigation.navigate('InvestBTC');
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <LoadingModal />
            )}
            <Header />

            {/* Main Content */}
            <View style={styles.content}>
                {/* Bitcoin Balance Section */}
                <View style={styles.balanceSection}>
                    <Text style={styles.balanceLabel}>YOUR BTC BALANCE</Text>
                    <Text style={styles.balanceAmount}>{btcBalance.toFixed(6)} BTC</Text>
                </View>

                {/* Investment Summary Section */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>INVESTMENT SUMMARY</Text>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <View style={styles.iconContainer}>
                                <Icon name="trending-up-outline" color="#FFFFE3" size={20} />
                            </View>
                            <Text style={styles.summaryLabel}>Total Invested</Text>
                            <Text style={styles.summaryValue}>{investedBtc.toFixed(6)} BTC</Text>
                        </View>

                        <View style={styles.summaryItem}>
                            <View style={styles.iconContainer}>
                                <Icon name="stats-chart-outline" color="#FFFFE3" size={20} />
                            </View>
                            <Text style={styles.summaryLabel}>Current APY</Text>
                            <Text style={styles.summaryValue}>{apy.toFixed(2)}%</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.buyButton} onPress={goToBuy}>
                        <Text style={styles.buyButtonText}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sellButton} onPress={goToSell}>
                        <Text style={styles.sellButtonText}>Sell</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.investButton} onPress={goToInvest}>
                        <Text style={styles.investButtonText}>Invest</Text>
                    </TouchableOpacity>
                </View>
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
    },
    balanceSection: {
        marginBottom: verticalScale(30),
        alignSelf: 'center',
    },
    balanceLabel: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(8),
        alignSelf: 'center',
    },
    balanceAmount: {
        color: '#FFFFE3',
        fontSize: moderateScale(36),
        fontWeight: '100',
        alignSelf: 'center',
        fontFamily: 'JetBrainsMono_400Regular',
    },
    summaryCard: {
        backgroundColor: '#1A1A17',
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
    },
    summaryTitle: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: 20,
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        backgroundColor: '#2A2A27',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        color: '#999',
        fontSize: moderateScale(12),
        marginBottom: 4,
    },
    summaryValue: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
        fontFamily: 'JetBrainsMono_400Regular',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(40),
        marginHorizontal: width * 0.05,
    },
    buyButton: {
        flex: 1,
        paddingVertical: verticalScale(12),
        borderWidth: 1,
        borderColor: '#FFFFE3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: moderateScale(10),
    },
    buyButtonText: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
    },
    sellButton: {
        flex: 1,
        paddingVertical: verticalScale(12),
        borderWidth: 1,
        borderColor: '#FFFFE3',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: moderateScale(10),
    },
    sellButtonText: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
    },
    investButton: {
        flex: 1,
        paddingVertical: verticalScale(12),
        backgroundColor: '#FFFFE3',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: moderateScale(10),
    },
    investButtonText: {
        color: '#11110E',
        fontSize: moderateScale(16),
    },
});