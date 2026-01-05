import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { supabase } from '../lib/supabase';

const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const signInWithEmail = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert('Error', error.message);
        setLoading(false);
    };

    const signUpWithEmail = async () => {
        if (!username || username.length < 3) {
            Alert.alert('Error', 'Username must be at least 3 characters long.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                },
            },
        });

        if (error) Alert.alert('Error', error.message);
        else Alert.alert('Success', 'Check your email for the confirmation link!');
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>WORDLE</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Username (for Signup)"
                    placeholderTextColor={colors.darkGrey}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.darkGrey}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.darkGrey}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // Use secureTextEntry for passwords
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={signInWithEmail}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'LOADING...' : 'LOGIN'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={signUpWithEmail}
                    disabled={loading}
                >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>SIGN UP</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: colors.white,
        fontSize: 48,
        fontWeight: 'bold',
        letterSpacing: 7,
        marginBottom: 40,
    },
    form: {
        width: '100%',
        maxWidth: 300,
    },
    input: {
        backgroundColor: colors.grey,
        color: colors.white,
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    secondaryButtonText: {
        color: colors.primary,
    },
});

export default AuthScreen;
