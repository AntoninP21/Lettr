import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

interface GameResultModalProps {
    visible: boolean;
    isWin: boolean;
    solution: string;
    onClose: () => void;
}

const GameResultModal = ({ visible, isWin, solution, onClose }: GameResultModalProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{isWin ? 'VICTORY!' : 'GAME OVER'}</Text>

                    <Text style={styles.subtitle}>
                        {isWin ? 'You guessed the word!' : 'The word was:'}
                    </Text>

                    <Text style={styles.solution}>{solution}</Text>

                    <Text style={styles.timerText}>Next word tomorrow</Text>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: colors.darkGrey,
        padding: 30,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        maxWidth: 350,
        borderWidth: 1,
        borderColor: colors.grey,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 10,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 16,
        color: colors.lightGrey,
        marginBottom: 10,
    },
    solution: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 30,
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    timerText: {
        fontSize: 14,
        color: colors.lightGrey,
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default GameResultModal;
