import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';
import { LetterStatus } from '../utils/wordle';

interface CellProps {
    value?: string;
    status?: LetterStatus;
    index?: number;
}

const getStatusColor = (status?: LetterStatus) => {
    switch (status) {
        case 'correct':
            return colors.green;
        case 'present':
            return colors.yellow;
        case 'absent':
            return colors.grey;
        default:
            return 'transparent';
    }
};

const Cell = ({ value, status, index = 0 }: CellProps) => {
    const animation = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    // Pop animation when value changes (typing)
    useEffect(() => {
        if (value && !status) {
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.1,
                    duration: 60,
                    useNativeDriver: false, // Color interpolation often requires false or specific handling, but here we just scale. Native is fine for scale.
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 60,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [value, status]);

    // Flip animation when status changes (revealing result)
    useEffect(() => {
        if (status) {
            const delay = index * 200;
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false, // We use false because we interpolate colors
                }),
            ]).start();
        }
    }, [status, index]);

    // Interpolate 0 -> 1 to 0deg -> 90deg -> 0deg
    const rotateX = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '90deg', '0deg'],
    });

    const backgroundColor = animation.interpolate({
        inputRange: [0, 0.5, 0.51, 1],
        outputRange: [
            'transparent',
            'transparent',
            getStatusColor(status),
            getStatusColor(status),
        ],
    });

    const borderColor = animation.interpolate({
        inputRange: [0, 0.5, 0.51, 1],
        outputRange: [
            value ? colors.darkGrey : colors.grey,
            value ? colors.darkGrey : colors.grey,
            'transparent',
            'transparent',
        ],
    });

    return (
        <Animated.View
            style={[
                styles.cell,
                {
                    transform: [{ rotateX }, { scale }],
                    backgroundColor: status ? backgroundColor : 'transparent',
                    borderColor: status ? borderColor : (value ? colors.darkGrey : colors.grey),
                },
            ]}
        >
            <Text style={styles.text}>{value}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cell: {
        width: 60,
        height: 60,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
    },
    text: {
        color: colors.white,
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default Cell;
