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
  Linking,
  Share
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomMenu from '../components/BottomMenu';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Referral() {
    const navigation = useNavigation();

    const [fontsLoaded] = Font.useFonts({
        'Satoshi-Variable': require('../../assets/fonts/Satoshi-Variable.ttf'),
    });

    const [googleFontsLoaded] = useFonts({
        JetBrainsMono_400Regular,
    });

    if (!fontsLoaded || !googleFontsLoaded) {
        return null;
    }

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    // Sample referral data
    const referralLink = "https://yourapp.com/invite/abc123";
    const totalReferrals = 5;
    const referralBonus = "$25.00";

    const handleCopyLink = () => {
        // Implement copy to clipboard functionality
        alert('Referral link copied to clipboard!');
    };

    const handleShareLink = async () => {
        try {
            await Share.share({
                message: `Join me using my referral link: ${referralLink}`,
                title: 'Referral Invite'
            });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button and Logo */}
            <Header />

            {/* Referral Content */}
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Referral Banner */}
                <View style={styles.referralBanner}>
                    <Text style={styles.bannerTitle}>Invite Friends</Text>
                    <Text style={styles.bannerSubtitle}>Earn future rewards based on your total referrals.</Text>
                </View>

                {/* Referral Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{totalReferrals}</Text>
                        <Text style={styles.statLabel}>Total Referrals</Text>
                    </View>
                </View>

                {/* Referral Link Section */}
                <View style={styles.linkSection}>
                    <Text style={styles.sectionTitle}>YOUR REFERRAL LINK</Text>
                    <View style={styles.linkContainer}>
                        <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="middle">
                            {referralLink}
                        </Text>
                        <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
                            <MaterialIcons name="content-copy" size={moderateScale(20)} color="#FFFFE3" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.shareButton} onPress={handleShareLink}>
                        <Text style={styles.shareButtonText}>Share Link</Text>
                    </TouchableOpacity>
                </View>

                {/* How It Works Section */}
                <View style={styles.howItWorks}>
                    <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <Text style={styles.stepText}>Share your referral link with friends</Text>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <Text style={styles.stepText}>They sign up and make their first deposit</Text>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <Text style={styles.stepText}>You stack your referrals and will get future rewards.</Text>
                    </View>
                </View>
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
    referralBanner: {
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        marginBottom: verticalScale(30),
        alignItems: 'center',
    },
    bannerTitle: {
        color: '#FFFFE3',
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        marginBottom: verticalScale(5),
    },
    bannerSubtitle: {
        color: '#FFFFE3',
        fontSize: moderateScale(16),
        textAlign: 'center',
    },
    statsContainer: {
        marginBottom: verticalScale(30),
        alignItems: 'center',
    },
    statCard: {
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        width: width * 0.43,
        alignItems: 'center',
    },
    statNumber: {
        color: '#FFFFE3',
        fontSize: moderateScale(28),
        fontFamily: 'JetBrainsMono_400Regular',
        marginBottom: verticalScale(5),
    },
    statLabel: {
        color: '#555',
        fontSize: moderateScale(14),
    },
    linkSection: {
        marginBottom: verticalScale(30),
    },
    sectionTitle: {
        color: '#555',
        fontSize: moderateScale(14),
        marginBottom: verticalScale(15),
    },
    linkContainer: {
        flexDirection: 'row',
        backgroundColor: '#000',
        borderRadius: moderateScale(10),
        padding: moderateScale(15),
        marginBottom: verticalScale(15),
        alignItems: 'center',
    },
    linkText: {
        flex: 1,
        color: '#FFFFE3',
        fontSize: moderateScale(14),
        fontFamily: 'JetBrainsMono_400Regular',
    },
    copyButton: {
        padding: moderateScale(5),
        marginLeft: moderateScale(10),
    },
    shareButton: {
        backgroundColor: '#FFFFE3',
        padding: moderateScale(16),
        alignItems: 'center',
    },
    shareButtonText: {
        color: '#11110E',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    howItWorks: {
        marginBottom: verticalScale(20),
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(15),
    },
    stepNumber: {
        backgroundColor: '#FFFFE3',
        width: moderateScale(30),
        height: moderateScale(30),
        borderRadius: moderateScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(15),
    },
    stepNumberText: {
        color: '#11110E',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    stepText: {
        flex: 1,
        color: '#FFFFE3',
        fontSize: moderateScale(16),
    },
});
