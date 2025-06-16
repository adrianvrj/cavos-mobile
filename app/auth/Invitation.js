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
import { supabase } from '../../lib/supabaseClient';

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

            // Check if the invitation code exists
            const { data: codeData, error: codeError } = await supabase
                .from('code')
                .select('*')
                .eq('invitation_code', invitationCode.toUpperCase())
                .single();

            if (codeError) {
                if (codeError.code === 'PGRST116') {
                    Alert.alert('Invalid Code', 'The invitation code is incorrect or expired.');
                } else {
                    throw codeError;
                }
                setIsLoading(false);
                return;
            }

            const { error: updateError } = await supabase
                .from('code')
                .update({ uses: codeData.uses + 1 })
                .eq('invitation_code', invitationCode.toUpperCase());

            if (updateError) {
                throw updateError;
            }

            setIsLoading(false);
            navigation.navigate('Pin');
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
                        placeholderTextColor="#888"
                        maxLength={6}
                        value={invitationCode}
                        onChangeText={(text) => setInvitationCode(text.toUpperCase())}
                        autoCapitalize="characters"
                        keyboardType="default"
                        selectionColor="#EAE5DC"
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
        backgroundColor: '#000000',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        color: '#EAE5DC',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#EAE5DC',
        borderRadius: 8,
        color: '#EAE5DC',
        fontSize: 18,
        paddingHorizontal: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#EAE5DC',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    submitButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
