import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import BottomMenu from '../components/BottomMenu';
import Header from '../components/Header';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Invest() {
    const navigation = useNavigation();
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [selectedPool, setSelectedPool] = useState('Vesu Pool'); // Default selection

    const [fontsLoaded] = Font.useFonts({
        'Satoshi-Variable': require('../assets/fonts/Satoshi-Variable.ttf'),
    });

    const [googleFontsLoaded] = useFonts({
        JetBrainsMono_400Regular,
    });

    if (!fontsLoaded || !googleFontsLoaded) {
        return null;
    }

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    // Sample data - in a real app this would come from your backend
    const userBalance = 100.00;
    const investmentPools = [
    ];

    const handleBack = () => {
        navigation.goBack();
    };

    const handleInvest = () => {
        if (!investmentAmount || isNaN(investmentAmount) || parseFloat(investmentAmount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid investment amount');
            return;
        }

        if (parseFloat(investmentAmount) > userBalance) {
            Alert.alert('Insufficient Balance', 'You don\'t have enough funds for this investment');
            return;
        }

        // In a real app, this would call your investment API
        Alert.alert(
            'Confirm Investment',
            `Invest $${investmentAmount} in ${selectedPool}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Confirm', 
                    onPress: () => {
                        Alert.alert('Success', `You've invested $${investmentAmount} in ${selectedPool}`);
                        navigation.goBack();
                    } 
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
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
                    <Text style={styles.balanceAmount}>{userBalance.toFixed(2)} USD</Text>
                </View>

                {/* Investment Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>AMOUNT TO INVEST (USD)</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            placeholderTextColor="#555"
                            keyboardType="decimal-pad"
                            value={investmentAmount}
                            onChangeText={setInvestmentAmount}
                            selectionColor="#FFFFE3"
                        />
                        <TouchableOpacity 
                            style={styles.maxButton}
                            onPress={() => setInvestmentAmount(userBalance.toString())}
                        >
                            <Text style={styles.maxButtonText}>MAX</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Investment Summary */}
                {investmentAmount && !isNaN(investmentAmount) && parseFloat(investmentAmount) > 0 && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Investment Amount</Text>
                            <Text style={styles.summaryValue}>${parseFloat(investmentAmount).toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Estimated APY</Text>
                            <Text style={styles.summaryValue}>
                                {investmentPools.find(p => p.name === selectedPool)?.apy}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Invest Button */}
                <TouchableOpacity 
                    style={[
                        styles.investButton,
                        (!investmentAmount || isNaN(investmentAmount) || parseFloat(investmentAmount) <= 0) && 
                        styles.disabledButton
                    ]}
                    onPress={handleInvest}
                    disabled={!investmentAmount || isNaN(investmentAmount) || parseFloat(investmentAmount) <= 0}
                >
                    <Text style={styles.investButtonText}>Invest</Text>
                </TouchableOpacity>

                {/* Disclaimer */}
                <Text style={styles.disclaimer}>
                    Investments are subject to market risks. Past performance is not indicative of future results.
                </Text>
            </ScrollView>
            
            <BottomMenu/>
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
    titleContainer: {
        marginBottom: verticalScale(30),
    },
    title: {
        color: '#FFFFE3',
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        marginBottom: verticalScale(5),
    },
    subtitle: {
        color: '#555',
        fontSize: moderateScale(16),
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
        marginBottom: verticalScale(30),
    },
    inputLabel: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(15),
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
    sectionTitle: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(15),
    },
    poolsContainer: {
        marginBottom: verticalScale(30),
    },
    poolCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        marginBottom: verticalScale(15),
        borderWidth: 1,
        borderColor: '#333',
    },
    selectedPoolCard: {
        borderColor: '#4CAF50',
    },
    poolInfo: {
        flex: 1,
    },
    poolName: {
        color: '#FFFFE3',
        fontSize: moderateScale(18),
        marginBottom: verticalScale(5),
    },
    poolApy: {
        color: '#4CAF50',
        fontSize: moderateScale(14),
        fontFamily: 'JetBrainsMono_400Regular',
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
    },
    investButton: {
        backgroundColor: '#FFFFE3',
        padding: moderateScale(16),
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    investButtonText: {
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
