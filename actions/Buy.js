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
import BottomMenu from '../components/BottomMenu';
import Header from '../components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { useWallet } from '../atoms/wallet';
import * as Clipboard from 'expo-clipboard';

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

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button */}
            <Header showBackButton={true} />

            {/* Main Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* Wallet Address Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>YOUR DEPOSIT ADDRESS</Text>

                    <View style={styles.addressContainer}>
                        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                            {walletAddress}
                        </Text>
                        <TouchableOpacity style={styles.copyButton} onPress={handleCopyAddress}>
                            <MaterialIcons name="content-copy" size={moderateScale(20)} color="#FFFFE3" />
                        </TouchableOpacity>
                    </View>
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
                            Do not send from exchanges that don't allow withdrawals to smart contracts
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
    sectionTitle: {
        color: '#FFFFE3',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        marginBottom: verticalScale(30),
    },
    cardTitle: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(15),
    },
    addressContainer: {
        flexDirection: 'row',
        backgroundColor: '#11110E',
        borderRadius: moderateScale(8),
        padding: moderateScale(15),
        marginBottom: verticalScale(20),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    addressText: {
        flex: 1,
        color: '#FFFFE3',
        fontSize: moderateScale(14),
        fontFamily: 'JetBrainsMono_400Regular',
    },
    copyButton: {
        padding: moderateScale(5),
        marginLeft: moderateScale(10),
    },
    notesContainer: {
        marginBottom: verticalScale(30),
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
        color: '#FFFFE3',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
    },
    networkInfo: {
        marginBottom: verticalScale(20),
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
        color: '#FFFFE3',
        fontSize: moderateScale(14),
    },
});