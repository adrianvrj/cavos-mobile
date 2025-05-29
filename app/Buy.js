import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import Header from './components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { useWallet } from '../atoms/wallet';
import * as Clipboard from 'expo-clipboard';
import LoggedHeader from './components/LoggedHeader';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Buy() {
    const wallet = useWallet((state) => state.wallet);

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

    const walletAddress = wallet.address.startsWith('0x')
        ? '0x' + wallet.address.slice(2).padStart(64, '0')
        : '0x' + wallet.address.padStart(64, '0');
    const supportedNetworks = ["Starknet"];
    const minimumDeposit = "100.00 USDC";

    const handleCopyAddress = () => {
        Clipboard.setStringAsync(walletAddress);
        Alert.alert('Copied!', 'Wallet address copied to clipboard.');
    };

    const handleBankTransfer = () => {
        Alert.alert('Coming soon', 'Bank transfer is a feature in development.');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.bankButton} onPress={handleBankTransfer}>
                        <Text style={styles.bankButtonText}>Bank Transfer</Text>
                    </TouchableOpacity>
                </View>

                {/* Texto "Or" entre Bank Transfer y Deposit Address */}
                <View style={styles.orContainer}>
                    <Text style={styles.orText}>Or</Text>
                </View>

                {/* Wallet Address Card */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>YOUR DEPOSIT ADDRESS</Text>
                        <View style={styles.addressContainer}>
                            <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                                {walletAddress}
                            </Text>
                            <TouchableOpacity style={styles.copyButton} onPress={handleCopyAddress}>
                                <MaterialIcons name="content-copy" size={moderateScale(20)} color="#EAE5DC" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Texto para invitar a scrollear */}
                <View style={styles.scrollHintContainer}>
                    <Text style={styles.scrollHintText}>
                        Only send USDC or USDT from supported networks.
                    </Text>
                </View>

                {/* Important Notes */}
                <View style={styles.notesContainer}>
                    <Text style={styles.sectionTitle}>IMPORTANT</Text>

                    <View style={styles.noteItem}>
                        <View style={styles.noteIcon}>
                            <MaterialIcons name="warning" size={moderateScale(20)} color="#F44336" />
                        </View>
                        <Text style={styles.noteText}>
                            Only send from supported networks: {supportedNetworks.join(', ')}
                        </Text>
                    </View>

                    <View style={styles.noteItem}>
                        <View style={styles.noteIcon}>
                            <MaterialIcons name="warning" size={moderateScale(20)} color="#F44336" />
                        </View>
                        <Text style={styles.noteText}>
                            Supported assets: USDC, USDT.
                        </Text>
                    </View>

                    <View style={styles.noteItem}>
                        <View style={styles.noteIcon}>
                            <MaterialIcons name="warning" size={moderateScale(20)} color="#F44336" />
                        </View>
                        <Text style={styles.noteText}>
                            Do not send from exchanges that don't allow withdrawals to smart contracts.
                        </Text>
                    </View>
                </View>

                {/* Network Info */}
                <View style={styles.networkInfo}>
                    <Text style={styles.sectionTitle}>SUPPORTED NETWORKS</Text>
                    <View style={styles.networkContainer}>
                        {supportedNetworks.map((network, index) => (
                            <View key={index} style={styles.networkBadge}>
                                <Text style={styles.networkText}>{network}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: moderateScale(20),
        paddingTop: Platform.OS === 'android' ? verticalScale(20) : 0,
    },
    scrollContent: {
        paddingBottom: verticalScale(120),
        paddingTop: verticalScale(10),
        marginTop: verticalScale(60),
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(40),
        marginTop: verticalScale(20),
    },
    card: {
        backgroundColor: '#11110E',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        width: '100%',
        maxWidth: 420,
        borderWidth: 1,
        borderColor: '#222',
    },
    cardTitle: {
        color: '#666',
        fontSize: moderateScale(12),
        marginBottom: verticalScale(8),
        letterSpacing: 1,
    },
    addressContainer: {
        flexDirection: 'row',
        backgroundColor: '#000',
        borderRadius: moderateScale(8),
        padding: moderateScale(15),
        marginBottom: verticalScale(10),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    addressText: {
        flex: 1,
        color: '#EAE5DC',
        fontSize: moderateScale(14),
        fontFamily: 'JetBrainsMono_400Regular',
    },
    copyButton: {
        padding: moderateScale(5),
        marginLeft: moderateScale(10),
    },
    balanceSection: {
        marginBottom: verticalScale(40),
        alignItems: 'center',
    },
    balanceLabel: {
        color: '#666',
        fontSize: moderateScale(12),
        marginBottom: verticalScale(8),
        letterSpacing: 1,
    },
    balanceAmount: {
        color: '#EAE5DC',
        fontSize: moderateScale(32),
        fontWeight: '300',
        fontFamily: 'JetBrainsMono_400Regular'
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: verticalScale(30),
        paddingHorizontal: width * 0.05,
        gap: moderateScale(20),
    },
    buyButton: {
        flex: 1,
        paddingVertical: verticalScale(16),
        borderWidth: 1,
        borderColor: '#EAE5DC',
        borderRadius: moderateScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#11110E',
    },
    buyButtonText: {
        color: '#EAE5DC',
        fontSize: moderateScale(16),
        fontWeight: '500',
    },
    bankButton: {
        flex: 1,
        paddingVertical: verticalScale(16),
        borderWidth: 1,
        borderColor: '#EAE5DC',
        borderRadius: moderateScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    bankButtonText: {
        color: '#EAE5DC',
        fontSize: moderateScale(16),
        fontWeight: '500',
    },
    scrollHintContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
        paddingHorizontal: moderateScale(10),
    },
    scrollHintText: {
        color: '#666',
        fontSize: moderateScale(14),
        fontStyle: 'italic',
        textAlign: 'center',
    },
    notesContainer: {
        marginBottom: verticalScale(30),
        paddingHorizontal: moderateScale(10),
    },
    sectionTitle: {
        color: '#EAE5DC',
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: moderateScale(14),
        letterSpacing: 1,
    },
    noteItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: verticalScale(15),
    },
    noteIcon: {
        marginRight: moderateScale(10),
        marginTop: moderateScale(2),
    },
    noteText: {
        flex: 1,
        color: '#EAE5DC',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
    },
    networkInfo: {
        marginBottom: verticalScale(20),
        paddingHorizontal: moderateScale(10),
    },
    networkContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    networkBadge: {
        backgroundColor: '#000',
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(8),
        marginRight: moderateScale(10),
        marginBottom: moderateScale(10),
        borderWidth: 1,
        borderColor: '#333',
    },
    networkText: {
        color: '#EAE5DC',
        fontSize: moderateScale(14),
    },
    orContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    orText: {
        color: '#666',
        fontSize: moderateScale(16),
        fontWeight: '400',
        letterSpacing: 1,
    },
});
