import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
    Platform,
    Alert,
    Linking,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { getWalletBalance } from '../lib/utils';
import { useWallet } from '../atoms/wallet';
import { useUserStore } from '../atoms/userId';
import { supabase } from '../lib/supabaseClient';
import Header from './components/Header';
import LoadingModal from './components/LoadingModal';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Dashboard() {
    const [balance, setBalance] = useState(0.000);
    const [transaction, setTransactions] = useState([]);
    const wallet = useWallet((state) => state.wallet);
    const userId = useUserStore((state) => state.userId);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false); // State for RefreshControl

    Font.useFonts({
        'Satoshi-Variable': require('../assets/fonts/Satoshi-Variable.ttf'),
    });

    useFonts({
        JetBrainsMono_400Regular,
    });

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    const getAccountInfo = async () => {
        try {
            setIsLoading(true);
            const newBalance = await getWalletBalance(wallet.address);
            setBalance(newBalance.balance);
            const { data, error } = await supabase
                .from('transaction')
                .select('*')
                .eq('uid', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase read error:', error);
                Alert.alert('Error reading from database');
                return;
            }

            setTransactions(data);
        } catch (error) {
            console.error('Error fetching balance and transactions:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false); // Stop the refresh indicator
        }
    };

    useEffect(() => {
        if (wallet) {
            getAccountInfo();
        }
    }, [wallet]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        getAccountInfo();
    };

    const goToBuy = () => {
        navigation.navigate('Buy');
    };

    const goToInvestment = () => {
        navigation.navigate('Invest');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Loading Modal */}
            {isLoading && <LoadingModal />}

            <Header />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh} // Trigger refresh on pull
                        tintColor="#FFFFE3" // iOS indicator color
                        colors={['#FFFFE3']} // Android indicator colors
                    />
                }
            >
                <View style={styles.cardContainer}>
                    <Text style={styles.cardText}>Coming soon...</Text>
                    <Image
                        source={require('../assets/visa-logo.png')}
                        style={styles.visaLogo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.balanceSection}>
                    <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
                    <Text style={styles.balanceAmount}>{balance.toFixed(2)} USD</Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.buyButton} onPress={goToBuy}>
                        <Text style={styles.buyButtonText}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendButton} onPress={() => navigation.navigate('Send')}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.investButton} onPress={goToInvestment}>
                        <Text style={styles.investButtonText}>Invest</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.transactionsSection}>
                    <Text style={styles.transactionsTitle}>TRANSACTIONS</Text>

                    <ScrollView
                        style={styles.transactionsList}
                        contentContainerStyle={styles.transactionsContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {transaction.map((tx, index) => (
                            <View key={index} style={styles.transactionItem}>
                                <View style={styles.transactionLeft}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            const url = tx.type === 'Account Creation'
                                                ? `https://voyager.online/contract/${wallet.address}`
                                                : `https://voyager.online/tx/${tx.tx_hash}`;
                                            Linking.openURL(url).catch((err) =>
                                                console.error('Failed to open URL:', err)
                                            );
                                        }}
                                    >
                                        <Text style={styles.transactionType}>{tx.type}</Text>
                                        <Text style={styles.transactionDetail}>
                                            {tx.type === 'Account Creation'
                                                ? tx.uid.slice(0, 4) + '...' + tx.uid.slice(-4)
                                                : tx.tx_hash.slice(0, 4) + '...' + tx.tx_hash.slice(-4)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.transactionRight}>
                                    <Text
                                        style={
                                            tx.type === 'Deposit' || tx.type === 'Sell BTC' || tx.type === 'Close Investment'
                                                ? styles.transactionAmountPositive
                                                : styles.transactionAmountNegative
                                        }
                                    >
                                        {tx.type === 'Deposit' || tx.type === 'Sell BTC' || tx.type === 'Close Investment' ? '+' : '-'}
                                        {tx.amount.toFixed(2)} USD
                                    </Text>
                                    <Text style={styles.transactionDate}>
                                        {new Date(tx.created_at).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#11110E',
        paddingHorizontal: moderateScale(20),
        paddingTop: Platform.OS === 'android' ? verticalScale(20) : 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(80),
    },
    cardContainer: {
        backgroundColor: '#000',
        height: verticalScale(120),
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(30),
        position: 'relative',
        overflow: 'hidden',
        marginHorizontal: width * 0.20,
        marginTop: moderateScale(20),
        borderWidth: 1,
        borderColor: 'FFFFE3',
    },
    cardText: {
        color: '#FFFFE3',
        fontSize: moderateScale(18),
    },
    visaLogo: {
        position: 'absolute',
        width: moderateScale(30),
        height: moderateScale(10),
        right: moderateScale(20),
        bottom: moderateScale(20),
    },
    balanceSection: {
        marginBottom: verticalScale(30),
        alignSelf: 'center',
    },
    balanceLabel: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(8),
        alignSelf: 'center'
    },
    balanceAmount: {
        color: '#FFFFE3',
        fontSize: moderateScale(36),
        fontWeight: '100',
        alignSelf: 'center',
        fontFamily: 'JetBrainsMono_400Regular'
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(40),
        marginHorizontal: width * 0.05, // Ajustado para acomodar tres botones
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
    investButton: {
        flex: 1,
        paddingVertical: verticalScale(12),
        backgroundColor: '#FFFFE3',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: moderateScale(10),
    },
    investButtonText: {
        color: '#11110E',
        fontSize: moderateScale(16),
    },
    sendButton: {
        flex: 1,
        paddingVertical: verticalScale(12),
        borderWidth: 1,
        borderColor: '#FFFFE3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonText: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
    },
    transactionsSection: {
        flex: 1,
        marginHorizontal: moderateScale(20),
        marginBottom: verticalScale(10),
    },
    transactionsTitle: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(15),
    },
    transactionsList: {
        flex: 1,
    },
    transactionsContent: {
        paddingBottom: verticalScale(80),
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(15),
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    transactionLeft: {
        flex: 1,
    },
    transactionRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    transactionType: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
        fontWeight: '500',
        marginBottom: verticalScale(5),
    },
    transactionDetail: {
        color: '#555',
        fontSize: moderateScale(14),
        fontFamily: 'JetBrainsMono_400Regular'
    },
    transactionAmountPositive: {
        color: '#4CAF50',
        fontSize: moderateScale(16),
        fontWeight: '500',
        marginBottom: verticalScale(5),
        fontFamily: 'JetBrainsMono_400Regular'
    },
    transactionAmountNegative: {
        color: '#F44336',
        fontSize: moderateScale(16),
        fontWeight: '500',
        marginBottom: verticalScale(5),
        fontFamily: 'JetBrainsMono_400Regular'
    },
    transactionDate: {
        color: '#555',
        fontSize: moderateScale(14),
        fontFamily: 'JetBrainsMono_400Regular'
    },
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 999,
    },
    loadingContainer: {
        backgroundColor: '#11110E',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#FFFFE3',
        marginTop: 10,
        fontSize: 16,
    },
});
