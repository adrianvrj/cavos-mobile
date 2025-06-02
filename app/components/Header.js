import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserStore } from '../../atoms/userId';
import { useWallet } from '../../atoms/wallet';
import { supabase } from '../../lib/supabaseClient';

export default function Header() {
    const navigation = useNavigation();
    const setUserId = useUserStore((state) => state.setUserId);
    const setWallet = useWallet((state) => state.setWallet);

    const goToLogin = () => {
        navigation.navigate('Login');
        setUserId(null);
        setWallet(null);
        supabase.auth.signOut();
        Alert.alert('Logout', 'You have been logged out successfully.');
    };

    return (
        <View style={styles.header}>
            <View style={styles.emptySpace}></View>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/cavos-logo.png')}
                    style={styles.logoStyle}
                />
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={goToLogin}>
                <Icon name="log-out-outline" size={24} color="#EAE5DC" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutButton: {
        padding: 10,
        marginRight: 10,
    },
    emptySpace: {
        width: 50, // Para equilibrar el header y mantener el logo centrado
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    logoStyle: {
        width: 37,
        height: 41,
    },
});
