import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Guess, MAX_CHALLENGES, WORD_LENGTH } from '../utils/wordle';
import Cell from './Cell';

interface GridProps {
    guesses: Guess[];
    currentGuess: string;
    turn: number;
}

const Grid = ({ guesses, currentGuess, turn }: GridProps) => {
    const empties =
        guesses.length < MAX_CHALLENGES - 1
            ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
            : [];

    return (
        <View style={styles.grid}>
            {guesses.map((guess, i) => (
                <View key={i} style={styles.row}>
                    {guess.map((cell, j) => (
                        <Cell key={j} value={cell.key} status={cell.status} index={j} />
                    ))}
                </View>
            ))}
            {guesses.length < MAX_CHALLENGES && (
                <View style={styles.row}>
                    {currentGuess.split('').map((letter, i) => (
                        <Cell key={i} value={letter} />
                    ))}
                    {[...Array(WORD_LENGTH - currentGuess.length)].map((_, i) => (
                        <Cell key={i} />
                    ))}
                </View>
            )}
            {empties.map((_, i) => (
                <View key={i} style={styles.row}>
                    {[...Array(WORD_LENGTH)].map((_, j) => (
                        <Cell key={j} />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default Grid;
