import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }: any) => {
    const { signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { error } = await supabase.rpc('delete_user');
                            if (error) throw error;

                            await AsyncStorage.clear();
                            await signOut();
                        } catch (error) {
                            console.error('Error deleting account:', error);
                            Alert.alert("Error", "Failed to delete account. Please try again.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lettr</Text>
            <Text style={styles.subtitle}>a wordle clone</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Game')}
            >
                <Text style={styles.buttonText}>PLAY</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.navigate('Leaderboard')}
            >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>LEADERBOARD</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.logoutButton]}
                onPress={handleLogout}
            >
                <Text style={[styles.buttonText, styles.logoutButtonText]}>LOGOUT</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDeleteAccount}
            >
                <Text style={[styles.buttonText, styles.deleteButtonText]}>DELETE ACCOUNT</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: colors.white,
        fontSize: 48,
        fontWeight: 'bold',
        letterSpacing: 7,
        marginBottom: 10,
    },
    subtitle: {
        color: colors.darkGrey,
        fontSize: 20,
        letterSpacing: 2,
        marginBottom: 60,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        elevation: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    secondaryButtonText: {
        color: colors.primary,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: 'transparent',
    },
    logoutButtonText: {
        color: colors.grey,
        fontSize: 14,
        letterSpacing: 1,
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    deleteButtonText: {
        color: '#FF4444',
        fontSize: 14,
        letterSpacing: 1,
    },
});

export default HomeScreen;
