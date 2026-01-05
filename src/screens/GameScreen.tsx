import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Grid from '../components/Grid';
import Keyboard from '../components/Keyboard';
import { colors } from '../constants/colors';
import useWordle from '../hooks/useWordle';
import { useAuth } from '../context/AuthContext';
import { fetchUserStats, updateUserStats } from '../services/stats';
import { WordService } from '../services/WordService';
import Toast from '../components/Toast';

const GameScreen = () => {
    const { session } = useAuth();
    const userId = session?.user.id;
    const [solution, setSolution] = useState<string | null>(null);
    const [validWords, setValidWords] = useState<string[]>([]);
    const [loadingWords, setLoadingWords] = useState(true);
    const [hasPlayedToday, setHasPlayedToday] = useState(false);

    // UI State
    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);

    useEffect(() => {
        const loadGameData = async () => {
            setLoadingWords(true);
            const words = await WordService.fetchWords();
            setValidWords(words);

            const dailyWord = WordService.getDailyWord(words);
            setSolution(dailyWord);

            if (userId) {
                const stats = await fetchUserStats(userId);
                if (stats && stats.last_played_at) {
                    const lastPlayedDate = new Date(stats.last_played_at);
                    const epoch = new Date('2024-01-01T00:00:00.000Z').getTime();
                    const oneDay = 24 * 60 * 60 * 1000;
                    const lastPlayedIndex = Math.floor((lastPlayedDate.getTime() - epoch) / oneDay);
                    const todayIndex = WordService.getDaysSinceEpoch();

                    if (lastPlayedIndex === todayIndex) {
                        setHasPlayedToday(true);
                    }
                }
            }

            setLoadingWords(false);
        };
        loadGameData();
    }, [userId]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setToastVisible(true);
    };

    const { currentGuess, guesses, turn, isCorrect, usedKeys, handleKeyup } = useWordle(
        solution || '',
        validWords,
        showToast // Pass the callback
    );

    useEffect(() => {
        if (!solution || hasPlayedToday) return;

        if (isCorrect) {
            if (userId) {
                updateUserStats(userId, true, turn);
                setHasPlayedToday(true);
            }
            // Use Toast instead of Modal for win
            setTimeout(() => showToast('Victory! Great job!'), 1000);
        }
        if (turn > 5 && !isCorrect) {
            if (userId) {
                updateUserStats(userId, false, 6);
                setHasPlayedToday(true);
            }
            // Use Toast instead of Modal for loss
            setTimeout(() => showToast(`Game Over! The word was ${solution}`), 1000);
        }
    }, [isCorrect, turn, solution, userId, hasPlayedToday]);

    if (loadingWords || !solution) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.white} />
                <Text style={{ color: colors.white, marginTop: 20 }}>Loading Wordle...</Text>
            </View>
        );
    }

    // Logic to handle "Played Today" view.
    // Issue: If we just finished playing, we want to show the Toast over the grid, 
    // but this state 'hasPlayedToday' is set to true immediately.
    // If we switch to restricted view immediately, the Toast might be cut off or context lost.

    // However, for consistency with previous 'modal' version, we kept the restricted view
    // but just showed the modal on top.

    // If we want the Toast to show "Victory", we should probably stay on the Grid screen for a bit.
    // But the user requested "like the invalid word popup".

    // Let's modify the condition slightly: if Toast is visible, don't show the restricted view yet?
    // Or just overlay the Toast on the restricted view.

    if (hasPlayedToday) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.title}>Lettr</Text>
                <Text style={{ color: colors.white, fontSize: 20, marginTop: 40, textAlign: 'center' }}>
                    You have already played today.
                </Text>
                <Text style={{ color: colors.grey, fontSize: 16, marginTop: 10 }}>
                    Come back tomorrow for a new word!
                </Text>
                <Toast
                    message={toastMessage}
                    visible={toastVisible}
                    onHide={() => setToastVisible(false)}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Text style={styles.title}>Lettr</Text>
            </View>

            <View style={styles.gameContainer}>
                <Grid currentGuess={currentGuess} guesses={guesses} turn={turn} />
                <Keyboard onKeyPressed={handleKeyup} usedKeys={usedKeys} />
            </View>

            <Toast
                message={toastMessage}
                visible={toastVisible}
                onHide={() => setToastVisible(false)}
            />
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
