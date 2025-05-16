import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Invitation() {
    const [invitationCode, setInvitationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleSubmit = async () => {
        if (invitationCode.length !== 6) {
            Alert.alert('Invalid Code', 'The invitation code must be 6 characters long.');
            return;
        }

        try {
            setIsLoading(true);

            if (invitationCode === 'A48VRJ') {
                setIsLoading(false);
                navigation.navigate('Pin');
            } else {
                setIsLoading(false);
                Alert.alert('Invalid Code', 'The invitation code is incorrect or expired.');
            }
        } catch (error) {
            console.error('Error validating invitation code:', error);
            setIsLoading(false);
            Alert.alert('Error', 'An error occurred while validating the invitation code.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Enter Invitation Code</Text>
                    <Text style={styles.subtitle}>
                        Please enter the 6-character invitation code to access the app.
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Code"
                        placeholderTextColor="#555"
                        maxLength={6}
                        value={invitationCode}
                        onChangeText={setInvitationCode}
                        autoCapitalize="characters"
                        keyboardType="default"
                        selectionColor="#FFFFE3"
                    />

                    <TouchableOpacity
                        style={[styles.submitButton, invitationCode.length !== 6 && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={invitationCode.length !== 6 || isLoading}
                    >
                        <Text style={styles.submitButtonText}>
                            {isLoading ? 'Validating...' : 'Submit'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#11110E',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        color: '#FFFFE3',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#AAAAAA',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#FFFFE3',
        borderRadius: 8,
        color: '#FFFFE3',
        fontSize: 18,
        paddingHorizontal: 10,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'JetBrainsMono_400Regular',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#FFFFE3',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#555',
    },
    submitButtonText: {
        color: '#11110E',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
