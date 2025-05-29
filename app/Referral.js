import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Platform,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts, JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { useUserStore } from '../atoms/userId';
import LoggedHeader from './components/LoggedHeader';
import LoadingModal from './components/LoadingModal';

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Referral() {
    const [userReferrals, setUserReferrals] = useState(0);
    const [totalPoolPrize, setTotalPoolPrize] = useState("TBD"); // Pool prize en USDC
    const [userRewards, setUserRewards] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [referralCode, setReferralCode] = useState(null);

    Font.useFonts({
        'Satoshi-Variable': require('../assets/fonts/Satoshi-Variable.ttf'),
    });

    useFonts({
        JetBrainsMono_400Regular,
    });

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: 'Satoshi-Variable' };

    const getReferralData = async () => {
        try {
            setIsLoading(true);
            setUserReferrals(0);
            setUserRewards(0);
        } catch (error) {
            console.error('Error fetching referral data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        getReferralData();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        getReferralData();
    };

    const handleInviteFriends = () => {
        // Lógica para compartir código de referido cuando esté disponible
        console.log('Invite friends functionality - Coming soon');
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <LoadingModal />}
            <LoggedHeader />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#EAE5DC"
                        colors={['#EAE5DC']}
                    />
                }
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.pageSubtitle}>
                        Earn rewards by inviting friends to Cavos
                    </Text>
                </View>

                {/* Pool Prize Card */}
                <View style={styles.poolCard}>
                    <View style={styles.poolHeader}>
                        <Text style={styles.poolLabel}>TOTAL POOL PRIZE</Text>
                        <View style={styles.prizeContainer}>
                            <Text style={styles.poolAmount}>{totalPoolPrize.toLocaleString()}</Text>
                        </View>
                    </View>
                    <Text style={styles.poolDescription}>
                        Rewards are distributed based on the number of successful referrals each user brings to the platform
                    </Text>
                </View>

                {/* User Stats Section */}
                <View style={styles.statsSection}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>YOUR REFERRALS</Text>
                        <Text style={styles.statNumber}>{userReferrals}</Text>
                        <Text style={styles.statSubtext}>Active friends</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>ESTIMATED REWARDS</Text>
                        <Text style={styles.statAmount}>{userRewards.toFixed(2)} USDC</Text>
                        <Text style={styles.statSubtext}>Pending distribution</Text>
                    </View>
                </View>

                {/* How it Works Section */}
                <View style={styles.howItWorksSection}>
                    <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
                    
                    <View style={styles.stepsList}>
                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Get your referral code</Text>
                                <Text style={styles.stepDescription}>
                                    Unique codes will be generated for each user soon
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Invite your friends</Text>
                                <Text style={styles.stepDescription}>
                                    Share your code with friends and family
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Earn rewards</Text>
                                <Text style={styles.stepDescription}>
                                    Get USDC rewards based on successful referrals
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Referral Code Section */}
                <View style={styles.referralCodeSection}>
                    <Text style={styles.sectionTitle}>YOUR REFERRAL CODE</Text>
                    
                    {referralCode ? (
                        <View style={styles.codeContainer}>
                            <Text style={styles.referralCodeText}>{referralCode}</Text>
                            <TouchableOpacity style={styles.copyButton}>
                                <Text style={styles.copyButtonText}>Copy</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.comingSoonCard}>
                            <Text style={styles.comingSoonTitle}>Coming Soon</Text>
                            <Text style={styles.comingSoonText}>
                                Referral codes will be generated for each user very soon. 
                                Stay tuned for updates!
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Button */}
                <View style={styles.actionSection}>
                    <TouchableOpacity 
                        style={[styles.inviteButton, !referralCode && styles.disabledButton]} 
                        onPress={handleInviteFriends}
                        disabled={!referralCode}
                    >
                        <Text style={[styles.inviteButtonText, !referralCode && styles.disabledButtonText]}>
                            {referralCode ? 'Invite Friends' : 'Coming Soon'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Status Indicator */}
                <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Feature in development</Text>
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
    scrollView: {
        flex: 1,
        paddingHorizontal: verticalScale(20),
    },
    scrollContent: {
        paddingBottom: verticalScale(120),
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
        marginTop: verticalScale(20),
    },
    pageTitle: {
        color: '#EAE5DC',
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: verticalScale(8),
    },
    pageSubtitle: {
        color: '#666',
        fontSize: moderateScale(16),
        textAlign: 'center',
    },
    poolCard: {
        backgroundColor: '#11110E',
        borderRadius: moderateScale(16),
        padding: moderateScale(24),
        marginBottom: verticalScale(30),
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
    },
    poolHeader: {
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    poolLabel: {
        color: '#666',
        fontSize: moderateScale(12),
        letterSpacing: 1,
        marginBottom: verticalScale(8),
    },
    prizeContainer: {
        backgroundColor: '#0A0A08',
        paddingHorizontal: moderateScale(20),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: '#1A1A1A',
    },
    poolAmount: {
        color: '#00C851',
        fontSize: moderateScale(32),
        fontWeight: 'bold',
        fontFamily: 'JetBrainsMono_400Regular',
    },
    poolDescription: {
        color: '#999',
        fontSize: moderateScale(14),
        textAlign: 'center',
        lineHeight: moderateScale(20),
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(30),
        gap: moderateScale(15),
    },
    statCard: {
        flex: 1,
        backgroundColor: '#11110E',
        borderRadius: moderateScale(12),
        padding: moderateScale(20),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#222',
    },
    statLabel: {
        color: '#666',
        fontSize: moderateScale(10),
        letterSpacing: 1,
        marginBottom: verticalScale(8),
    },
    statNumber: {
        color: '#EAE5DC',
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        fontFamily: 'JetBrainsMono_400Regular',
        marginBottom: verticalScale(4),
    },
    statAmount: {
        color: '#00C851',
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        fontFamily: 'JetBrainsMono_400Regular',
        marginBottom: verticalScale(4),
    },
    statSubtext: {
        color: '#666',
        fontSize: moderateScale(12),
    },
    howItWorksSection: {
        marginBottom: verticalScale(30),
    },
    sectionTitle: {
        color: '#666',
        fontSize: moderateScale(12),
        letterSpacing: 1,
        marginBottom: verticalScale(20),
    },
    stepsList: {
        gap: verticalScale(20),
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    stepNumber: {
        width: moderateScale(32),
        height: moderateScale(32),
        borderRadius: moderateScale(16),
        backgroundColor: '#11110E',
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(16),
    },
    stepNumberText: {
        color: '#EAE5DC',
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        color: '#EAE5DC',
        fontSize: moderateScale(16),
        fontWeight: '600',
        marginBottom: verticalScale(4),
    },
    stepDescription: {
        color: '#999',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
    },
    referralCodeSection: {
        marginBottom: verticalScale(30),
    },
    codeContainer: {
        flexDirection: 'row',
        backgroundColor: '#11110E',
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    referralCodeText: {
        flex: 1,
        color: '#EAE5DC',
        fontSize: moderateScale(18),
        fontFamily: 'JetBrainsMono_400Regular',
        letterSpacing: 2,
    },
    copyButton: {
        backgroundColor: '#EAE5DC',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(8),
    },
    copyButtonText: {
        color: '#000',
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    comingSoonCard: {
        backgroundColor: '#11110E',
        borderRadius: moderateScale(12),
        padding: moderateScale(20),
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    comingSoonTitle: {
        color: '#EAE5DC',
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        marginBottom: verticalScale(8),
    },
    comingSoonText: {
        color: '#999',
        fontSize: moderateScale(14),
        textAlign: 'center',
        lineHeight: moderateScale(20),
    },
    actionSection: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },
    inviteButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#EAE5DC',
        paddingHorizontal: moderateScale(40),
        paddingVertical: verticalScale(16),
        borderRadius: moderateScale(12),
        width: '100%',
        alignItems: 'center',
    },
    inviteButtonText: {
        color: '#EAE5DC',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    disabledButton: {
        borderColor: '#333',
    },
    disabledButtonText: {
        color: '#666',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A08',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderColor: '#1A1A1A',
    },
    statusDot: {
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: '#FFA500',
        marginRight: moderateScale(8),
    },
    statusText: {
        color: '#777',
        fontSize: moderateScale(13),
        fontWeight: '500',
    },
});
