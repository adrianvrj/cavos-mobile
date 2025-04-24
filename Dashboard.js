import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import BottomMenu from './components/BottomMenu';
import Header from './components/Header';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Dashboard() {
    const navigation = useNavigation();

    const [fontsLoaded] = Font.useFonts({
        'Satoshi-Variable': require('./assets/fonts/Satoshi-Variable.ttf'),
    });

    const [googleFontsLoaded] = useFonts({
        JetBrainsMono_400Regular,
    });

    if (!fontsLoaded || !googleFontsLoaded) {
        return null; // or a loading spinner
    }

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    const goToBuy = () => {
        navigation.navigate('Buy');
    };

    const goToInvestment = () => {
        navigation.navigate('Invest');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Logout and Logo */}
            <Header/>

            {/* Card Preview */}
            <View style={styles.cardContainer}>
                <Text style={styles.cardText}>Coming soon...</Text>
                <Image
                    source={require('./assets/visa-logo.png')}
                    style={styles.visaLogo}
                    resizeMode="contain"
                />
            </View>

            {/* Balance Section */}
            <View style={styles.balanceSection}>
                <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
                <Text style={styles.balanceAmount}>100.00 USD</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.buyButton} onPress={goToBuy}>
                    <Text style={styles.buyButtonText}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.investButton} onPress={goToInvestment}>
                    <Text style={styles.investButtonText}>Invest</Text>
                </TouchableOpacity>
            </View>

            {/* Transactions Section */}
            <View style={styles.transactionsSection}>
                <Text style={styles.transactionsTitle}>TRANSACTIONS</Text>

                <ScrollView 
                  style={styles.transactionsList}
                  contentContainerStyle={styles.transactionsContent}
                  showsVerticalScrollIndicator={false}
                >
                    {/* Transaction 1 */}
                    <View style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                            <Text style={styles.transactionType}>Invest</Text>
                            <Text style={styles.transactionDetail}>Vesu Pool</Text>
                        </View>
                        <View style={styles.transactionRight}>
                            <Text style={styles.transactionAmountNegative}>-100.00 USDC</Text>
                            <Text style={styles.transactionDate}>30-09-2025 10:00am</Text>
                        </View>
                    </View>

                    {/* Transaction 2 */}
                    <View style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                            <Text style={styles.transactionType}>Deposit</Text>
                            <Text style={styles.transactionDetail}>0x9f...0976</Text>
                        </View>
                        <View style={styles.transactionRight}>
                            <Text style={styles.transactionAmountPositive}>+200.00 USDC</Text>
                            <Text style={styles.transactionDate}>30-09-2025 10:00am</Text>
                        </View>
                    </View>

                    {/* Transaction 3 */}
                    <View style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                            <Text style={styles.transactionType}>Account Creation</Text>
                            <Text style={styles.transactionDetail}>0x12...9878</Text>
                        </View>
                        <View style={styles.transactionRight}>
                            <Text style={styles.transactionAmountNegative}>-10.00 USDC</Text>
                            <Text style={styles.transactionDate}>30-09-2025 10:00am</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <BottomMenu/>
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
        marginTop: moderateScale(20)
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
        marginHorizontal: width * 0.1,
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
        marginLeft: moderateScale(10),
    },
    investButtonText: {
        color: '#11110E',
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
        paddingBottom: verticalScale(80), // Space for bottom menu
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
});
