import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Grid from '../components/Grid';
import Keyboard from '../components/Keyboard';
import { colors } from '../constants/colors';
import useWordle from '../hooks/useWordle';
import { useAuth } from '../context/AuthContext';
import { updateUserStats } from '../services/stats';

const GameScreen = () => {
    const { currentGuess, guesses, turn, isCorrect, usedKeys, handleKeyup, solution } = useWordle();
    const { session } = useAuth();
    const userId = session?.user.id;

    useEffect(() => {
        if (isCorrect) {
            if (userId) {
                // Turn is 0-indexed count of submitted guesses?
                // useWordle logic: turn increments AFTER guess.
                // So if I win on first guess, turn is 1.
                updateUserStats(userId, true, turn);
            }
            setTimeout(() => Alert.alert('You won!', 'Great job!'), 500);
        }
        if (turn > 5 && !isCorrect) {
            if (userId) updateUserStats(userId, false, 6);
            setTimeout(() => Alert.alert('Game Over', `The word was ${solution}`), 500);
        }
    }, [isCorrect, turn, solution, userId]); // added userId dependency

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Text style={styles.title}>WORDLE</Text>
            </View>

            <View style={styles.gameContainer}>
                <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} />
                <Keyboard onKeyPressed={handleKeyup} usedKeys={usedKeys} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },
    header: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        color: colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 4,
    },
    gameContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default GameScreen;
