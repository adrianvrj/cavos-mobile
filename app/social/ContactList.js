import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import LoggedHeader from '../components/LoggedHeader';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener instalado react-native-vector-icons

const { width, height } = Dimensions.get('window');

const scale = size => width / 375 * size;
const verticalScale = size => height / 812 * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function ContactList() {
    return (
        <SafeAreaView style={styles.container}>
            <LoggedHeader />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContent}>
                    {/* Icon placeholder */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconPlaceholder}>
                            <Icon name="people-outline" size={48} color="#EAE5DC" />
                        </View>
                    </View>

                    <View style={styles.teaserCard}>
                        <Text style={styles.title}>Contacts Coming Soon</Text>
                        <Text style={styles.subtitle}>
                            Very soon you'll be able to add your friends from Cavos and send payments directly, instantly and securely.
                        </Text>
                        
                        {/* Feature list */}
                        <View style={styles.featureList}>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureBullet}>•</Text>
                                <Text style={styles.featureText}>Add friends instantly</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureBullet}>•</Text>
                                <Text style={styles.featureText}>Secure payments</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureBullet}>•</Text>
                                <Text style={styles.featureText}>Real-time transfers</Text>
                            </View>
                        </View>

                        <Text style={styles.hint}>
                            Stay tuned for updates!
                        </Text>
                    </View>

                    {/* Status indicator */}
                    <View style={styles.statusContainer}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Feature in development</Text>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: verticalScale(40),
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(40),
    },
    iconContainer: {
        marginBottom: verticalScale(30),
    },
    iconPlaceholder: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        backgroundColor: '#11110E',
        borderWidth: 2,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    iconText: {
        fontSize: moderateScale(36),
    },
    teaserCard: {
        backgroundColor: '#11110E',
        borderRadius: moderateScale(16),
        padding: moderateScale(32),
        alignItems: 'center',
        width: '100%',
        maxWidth: 380,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
    },
    title: {
        color: '#EAE5DC',
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        marginBottom: verticalScale(16),
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subtitle: {
        color: '#999',
        fontSize: moderateScale(16),
        textAlign: 'center',
        marginBottom: verticalScale(24),
        lineHeight: moderateScale(24),
        paddingHorizontal: moderateScale(10),
    },
    featureList: {
        width: '100%',
        marginBottom: verticalScale(24),
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
        paddingHorizontal: moderateScale(20),
    },
    featureBullet: {
        color: '#EAE5DC',
        fontSize: moderateScale(18),
        marginRight: moderateScale(12),
        fontWeight: 'bold',
    },
    featureText: {
        color: '#AAA',
        fontSize: moderateScale(15),
        flex: 1,
    },
    hint: {
        color: '#EAE5DC',
        fontSize: moderateScale(15),
        fontStyle: 'italic',
        textAlign: 'center',
        opacity: 0.8,
        borderTopWidth: 1,
        borderTopColor: '#222',
        paddingTop: verticalScale(16),
        width: '100%',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(32),
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
