import { useState } from 'react';
import { checkGuess, Guess, isWordInList, LetterStatus, MAX_CHALLENGES, UsedKeys, WORD_LENGTH } from '../utils/wordle';

const useWordle = (solution: string, validWords: string[], onMessage: (msg: string) => void) => {
    // solution is now passed in
    const [turn, setTurn] = useState<number>(0);
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [guesses, setGuesses] = useState<Guess[]>([]); // Formatted guesses
    const [history, setHistory] = useState<string[]>([]); // Raw string guesses
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [usedKeys, setUsedKeys] = useState<UsedKeys>({});

    const formatGuess = (): Guess => {
        const statusArray = checkGuess(currentGuess, solution);
        const guess: Guess = currentGuess.split('').map((letter, index) => {
            return { key: letter, status: statusArray[index] };
        });
        return guess;
    };

    const addNewGuess = (formattedGuess: Guess) => {
        if (currentGuess === solution) {
            setIsCorrect(true);
        }

        setGuesses((prevGuesses) => [...prevGuesses, formattedGuess]);
        setHistory((prevHistory) => [...prevHistory, currentGuess]);
        setTurn((prevTurn) => prevTurn + 1);

        setUsedKeys((prevUsedKeys) => {
            const newKeys = { ...prevUsedKeys };

            formattedGuess.forEach((l) => {
                const currentColor = newKeys[l.key];

                if (l.status === 'correct') {
                    newKeys[l.key] = 'correct';
                    return;
                }
                if (l.status === 'present' && currentColor !== 'correct') {
                    newKeys[l.key] = 'present';
                    return;
                }
                if (l.status === 'absent' && currentColor !== 'present' && currentColor !== 'correct') {
                    newKeys[l.key] = 'absent';
                    return;
                }
            });
            return newKeys;
        });

        setCurrentGuess('');
    };

    const handleKeyup = (key: string) => {
        if (key === 'ENTER') {
            // Only add guess if turn is less than 5
            if (turn > MAX_CHALLENGES) {
                return;
            }
            // Do not allow duplicate words
            if (history.includes(currentGuess)) {
                onMessage('You already tried that word.');
                return;
            }
            // Check word is 5 chars long
            if (currentGuess.length !== WORD_LENGTH) {
                onMessage('Word must be 5 chars long.');
                return;
            }
            // Check if word is in list
            if (!isWordInList(currentGuess, validWords)) {
                onMessage('Word not found in dictionary.');
                return;
            }

            const formatted = formatGuess();
            addNewGuess(formatted);
        }

        if (key === 'BACKSPACE') {
            setCurrentGuess((prev) => prev.slice(0, -1));
            return;
        }

        // Regex for letters only
        if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < WORD_LENGTH) {
                setCurrentGuess((prev) => prev + key.toUpperCase());
            }
        }
    };

    return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup, solution };
};

export default useWordle;
