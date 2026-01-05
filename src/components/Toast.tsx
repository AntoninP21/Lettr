import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

interface ToastProps {
    message: string;
    visible: boolean;
    onHide: () => void;
}

const Toast = ({ message, visible, onHide }: ToastProps) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onHide();
            });
        }
    }, [visible, opacity, onHide]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        backgroundColor: colors.primary, // Or white/grey depending on theme
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        zIndex: 100,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default Toast;
