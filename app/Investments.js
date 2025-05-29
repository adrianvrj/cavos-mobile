import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import Header from './components/Header';
import { useWallet } from '../atoms/wallet';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { wallet_provider_api, WALLET_PROVIDER_TOKEN } from '../lib/constants';
import LoadingModal from './components/LoadingModal';
import { supabase } from '../lib/supabaseClient';
import LoggedHeader from './components/LoggedHeader';

export default function Investments() {
    const navigation = useNavigation();
    const wallet = useWallet((state) => state.wallet);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false); // Estado para el RefreshControl
    const [totalInvested, setTotalInvested] = useState(0);
    const [apy, setApy] = useState(0);
    const [poolId, setPoolId] = useState(0);

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

    const getAccountInfo = async () => {
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
            const apyResponse = await axios.post(
                wallet_provider_api + 'vesu/pool/apy',
                {
                    poolName: "Re7 USDC",
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${WALLET_PROVIDER_TOKEN}`,
                    },
                }
            );
            setApy(apyResponse.data.poolAPY);
            setTotalInvested(positionResponse.data.total_supplied);
            setPoolId(positionResponse.data.poolid);
        } catch (error) {
            console.error('Error fetching user positions', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false); // Finaliza el estado de refresco
        }
    };

    useEffect(() => {
        if (wallet) {
            getAccountInfo();
        }
    }, [wallet]);

    const handleRefresh = () => {
        setIsRefreshing(true); // Activa el estado de refresco
        getAccountInfo(); // Llama a la función para recargar la información
    };

    const handleClaimRewards = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                wallet_provider_api + 'vesu/positions/claim',
                {
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
            console.log('Claim response:', response.data);
            if (response.data.result == false) {
                Alert.alert("No rewards available", "Come back in a few days to claim your rewards");
            }
            else if (response.data.amount !== null && response.data.result !== null) {
                const { error: txError } = await supabase
                    .from('transaction')
                    .insert([
                        {
                            uid: wallet.uid,
                            type: "Claim",
                            amount: response.data.amount,
                            tx_hash: response.data.result,
                        },
                    ]);

                if (txError) {
                    console.error('Insert error:', txError);
                    Alert.alert('Error saving transaction to database');
                    setIsLoading(false);
                    return;
                }
                Alert.alert("Rewards Claimed!", `Total amount in USDC: ${response.data.amount}`)
            }
        } catch (error) {
            console.error('Error claiming rewards', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCloseInvestment = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                wallet_provider_api + 'vesu/positions/withdraw',
                {
                    address: wallet.address,
                    hashedPk: wallet.private_key,
                    hashedPin: wallet.pin,
                    poolId: poolId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${WALLET_PROVIDER_TOKEN}`,
                    },
                }
            );
            if (response.data.result == false) {
                Alert.alert("An error occurred", "Please try again later");
            }
            else if (response.data.amount !== null && response.data.result !== null) {
                const { error: txError } = await supabase
                    .from('transaction')
                    .insert([
                        {
                            uid: wallet.uid,
                            type: "Close Investment",
                            amount: response.data.amount,
                            tx_hash: response.data.result,
                        },
                    ]);

                if (txError) {
                    console.error('Insert error:', txError);
                    Alert.alert('Error saving transaction to database');
                    setIsLoading(false);
                    return;
                }
                Alert.alert("Investment Closed", `${response.data.amount} USDC has been sent to your account, investment data might take a few minutes to update`);
            }
        } catch (error) {
            Alert.alert("An error occurred", "Please try again later");
            console.error('Error closing investment', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <LoadingModal />
            )}

            <LoggedHeader />

            {/* ScrollView con RefreshControl */}
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh} // Llama a la función de refresco
                        tintColor="#EAE5DC" // Color del indicador en iOS
                        colors={['#EAE5DC']} // Colores del indicador en Android
                    />
                }
            >

                {/* Tarjeta de Resumen de Inversiones */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>INVESTMENT SUMMARY</Text>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <View style={styles.iconContainer}>
                                <Icon name="trending-up-outline" color="#EAE5DC" size={20} />
                            </View>
                            <Text style={styles.summaryLabel}>Total Invested</Text>
                            <Text style={styles.summaryValue}>${totalInvested.toFixed(2)} USDC</Text>
                        </View>

                        <View style={styles.summaryItem}>
                            <View style={styles.iconContainer}>
                                <Icon name="stats-chart-outline" color="#EAE5DC" size={20} />
                            </View>
                            <Text style={styles.summaryLabel}>Current APY</Text>
                            <Text style={styles.summaryValue}>{apy.toFixed(2)}%</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.claimButton} onPress={handleClaimRewards}>
                        <Text style={styles.claimButtonText}>Claim Rewards</Text>
                    </TouchableOpacity>
                </View>

                {/* Botones de Acción */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.newInvestButton} onPress={goToInvestment}>
                        <Text style={styles.newInvestButtonText}>Invest</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.newInvestButton} onPress={handleCloseInvestment}>
                        <Text style={styles.newInvestButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>

                {/* Espacio vacío para mejor diseño */}
                <View style={styles.emptySpace}></View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
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
        color: '#EAE5DC',
        fontSize: 16,
        fontFamily: 'JetBrainsMono_400Regular',
    },
    claimButton: {
        backgroundColor: '#EAE5DC',
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
        borderColor: '#EAE5DC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginHorizontal: 25,
    },
    newInvestButtonText: {
        color: '#EAE5DC',
        fontSize: 16,
        fontWeight: '500',
    },
});
