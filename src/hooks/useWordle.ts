
import { useState } from 'react';
import { checkGuess, getWord, Guess, isWordInList, LetterStatus, MAX_CHALLENGES, UsedKeys, WORD_LENGTH } from '../utils/wordle';

const useWordle = () => {
    const [solution, setSolution] = useState<string>(getWord());
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
                console.log('you used all your guesses');
                return;
            }
            // Do not allow duplicate words
            if (history.includes(currentGuess)) {
                console.log('you already tried that word');
                return;
            }
            // Check word is 5 chars long
            if (currentGuess.length !== WORD_LENGTH) {
                console.log('word must be 5 chars long');
                return;
            }
            // Check if word is in list
            /* 
             Optional: For now, we only check length. 
             Uncomment below if strict checking is needed
            if (!isWordInList(currentGuess)) {
               console.log('not a valid word');
               return;
            }
            */

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
