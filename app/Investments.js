import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import BottomMenu from './components/BottomMenu';
import Header from './components/Header';
import { useWallet } from '../atoms/wallet';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { wallet_provider_api, WALLET_PROVIDER_TOKEN } from '../lib/constants';
import LoadingModal from './components/LoadingModal';

export default function Investments() {
    const navigation = useNavigation();
    const wallet = useWallet((state) => state.wallet);
    const [isLoading, setIsLoading] = useState(false);
    const [totalInvested, setTotalInvested] = useState(0);
    const [apy, setApy] = useState(0);

    Font.useFonts({
        'Satoshi-Variable': require('../assets/fonts/Satoshi-Variable.ttf'),
    });

    useFonts({
        JetBrainsMono_400Regular,
    });

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    const goToInvestment = () => {
        navigation.navigate('Invest');
    };

    useEffect(() => {
        async function getAccountInfo() {
            try {
                setIsLoading(true);
                const positionResponse = await axios.post(
                    wallet_provider_api + 'vesu/positions',
                    {
                        address: wallet.address,
                        pool: "Re7 USDC",
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${WALLET_PROVIDER_TOKEN}`,
                        },
                    }
                );
                setApy(positionResponse.data.earnPositions[0].poolApy);
                setTotalInvested(positionResponse.data.earnPositions[0].total_supplied);
            } catch (error) {
                console.error('Error fetching user positions', error);
            } finally {
                setIsLoading(false);
            }
        }

        if (wallet) {
            getAccountInfo();
        }
    }, [wallet]);

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <LoadingModal />
            )}

            {/* Header with Logout and Logo */}
            <Header />

            {/* Investment Summary Card */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>INVESTMENT SUMMARY</Text>

                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <View style={styles.iconContainer}>
                            <Icon name="trending-up-outline" color="#FFFFE3" size={20} />
                        </View>
                        <Text style={styles.summaryLabel}>Total Invested</Text>
                        <Text style={styles.summaryValue}>${totalInvested.toFixed(2)} USDC</Text>
                    </View>

                    {/* <View style={styles.summaryItem}>
                        <View style={styles.iconContainer}>
                            <Icon name="cash-outline" color="#FFFFE3" size={20} />
                        </View>
                        <Text style={styles.summaryLabel}>Rewards</Text>
                        <Text style={styles.summaryValue}>25.50 USDC</Text>
                    </View> */}

                    <View style={styles.summaryItem}>
                        <View style={styles.iconContainer}>
                            <Icon name="stats-chart-outline" color="#FFFFE3" size={20} />
                        </View>
                        <Text style={styles.summaryLabel}>Current APY</Text>
                        <Text style={styles.summaryValue}>{apy.toFixed(2)}%</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.claimButton}>
                    <Text style={styles.claimButtonText}>Claim Rewards</Text>
                </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.newInvestButton} onPress={goToInvestment}>
                    <Text style={styles.newInvestButtonText}>Invest</Text>
                </TouchableOpacity>
            </View>

            {/* Empty Space for Better Layout */}
            <View style={styles.emptySpace}></View>

            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#11110E',
        padding: 20,
    },
    emptySpace: {
        width: 50,
        flex: 1,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    logoStyle: {
        width: 37,
        height: 41,
    },
    summaryCard: {
        backgroundColor: '#1A1A17',
        borderRadius: 10,
        padding: 20,
        marginVertical: 30,
        marginHorizontal: 25,
    },
    summaryTitle: {
        color: '#555',
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
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
        fontSize: 12,
        marginBottom: 4,
    },
    summaryValue: {
        color: '#FFFFE3',
        fontSize: 16,
        fontFamily: 'JetBrainsMono_400Regular',
    },
    claimButton: {
        backgroundColor: '#FFFFE3',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    claimButtonText: {
        color: '#11110E',
        fontSize: 16,
        fontWeight: '500',
    },
    actionButtons: {
        marginVertical: 20,
    },
    newInvestButton: {
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#FFFFE3',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginHorizontal: 25,
    },
    newInvestButtonText: {
        color: '#FFFFE3',
        fontSize: 16,
        fontWeight: '500',
    },
});
