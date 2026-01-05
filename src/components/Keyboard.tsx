import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { colors } from '../constants/colors';
import { LetterStatus } from '../utils/wordle';

const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

interface KeyboardProps {
    onKeyPressed: (key: string) => void;
    usedKeys: { [key: string]: LetterStatus };
}

const Keyboard = ({ onKeyPressed, usedKeys }: KeyboardProps) => {
    const getKeyColor = (key: string) => {
        const status = usedKeys[key];
        switch (status) {
            case 'correct':
                return colors.green;
            case 'present':
                return colors.yellow;
            case 'absent':
                return colors.grey;
            default:
                return colors.lightGrey; // Default key color usually different from background
        }
    };

    const isSpecialKey = (key: string) => key === 'ENTER' || key === 'BACKSPACE';

    return (
        <View style={styles.keyboard}>
            {keys.map((row, i) => (
                <View key={i} style={styles.row}>
                    {row.map((key) => (
                        <TouchableOpacity
                            key={key}
                            onPress={() => onKeyPressed(key)}
                            style={[
                                styles.key,
                                isSpecialKey(key) && styles.specialKey,
                                { backgroundColor: getKeyColor(key) },
                            ]}
                        >
                            <Text style={styles.keyText}>
                                {key === 'BACKSPACE' ? '⌫' : key}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;
const keyWidth = (screenWidth - 40) / 10;

const styles = StyleSheet.create({
    keyboard: {
        marginTop: 'auto',
        marginBottom: 40,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    key: {
        width: keyWidth,
        height: 50,
        marginHorizontal: 2,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    specialKey: {
        width: keyWidth * 1.5,
    },
    keyText: {
        fontWeight: 'bold',
        fontSize: 12,
        color: colors.black,
    },
});

export default Keyboard;
