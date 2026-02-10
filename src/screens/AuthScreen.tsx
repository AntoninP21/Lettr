import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { colors } from '../constants/colors';
import { supabase } from '../lib/supabase';

const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['email', 'profile'],
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Get this from Google Cloud Console
        });
    }, []);

    const signInWithEmail = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert('Error', error.message);
        setLoading(false);
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data?.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                });

                if (error) {
                    Alert.alert('Error', error.message);
                } else {
                    // Success is handled by AuthContext
                }
            } else {
                throw new Error('No ID token present!');
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                Alert.alert('Error', 'Google Play Services not available');
            } else {
                Alert.alert('Error', error.toString());
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const signUpWithEmail = async () => {
        if (!username || username.length < 3) {
            Alert.alert('Error', 'Username must be at least 3 characters long.');
            return;
        }

        setLoading(true);

        // Check if username is already taken
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            setLoading(false);
            Alert.alert('Username Taken', 'This username is already taken. Please choose another one.');
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                },
            },
        });

        if (error) {
            if (error.message.includes('User already registered') || error.message.includes('unique constraint')) {
                Alert.alert('Account Exists', 'This email is already registered. Please login instead.');
            } else {
                Alert.alert('Error', error.message);
            }
        } else {
            Alert.alert('Success', 'Check your email for the confirmation link!');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lettr</Text>
            <View style={styles.form}>
                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signInWithGoogle}
                    disabled={loading}
                    style={{ width: '100%', height: 48, marginBottom: 20 }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: colors.grey }} />
                    <Text style={{ color: colors.grey, marginHorizontal: 10 }}>OR</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: colors.grey }} />
                </View>

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
