import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoggedHeader() {
    const navigation = useNavigation();

    const goToProfile = () => {
        navigation.navigate('Profile'); // Ajusta el nombre de la ruta según tu navegación
    };

    const goToCardWaitlist = () => {
        navigation.navigate('CardWaitlist');
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={goToProfile} style={styles.logoContainer}>
                <Image
                    source={require('../../assets/cavos-logo.png')}
                    style={styles.logoStyle}
                />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={goToCardWaitlist} style={styles.cardIconContainer}>
                <Ionicons name="card" size={24} color="#EAE5DC" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    logoContainer: {
        backgroundColor: '#1B1B1B', // Gris oscuro como en la imagen
        borderRadius: 8,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 9,
    },
    logoStyle: {
        width: 24,
        height: 30,
    },
    cardIconContainer: {
        borderRadius: 8,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
