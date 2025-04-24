import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Home, TrendingUp, Settings, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
    const navigation = useNavigation();

    const goToLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.header}>
            <View style={styles.emptySpace}></View>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/cavos-logo.png')}
                    style={styles.logoStyle}
                />
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={goToLogin}>
                <LogOut color="#FFFFE3"></LogOut>
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
    logoutText: {
        color: '#FFFFE3',
        fontSize: 14,
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
