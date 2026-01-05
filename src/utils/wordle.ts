import { MAX_CHALLENGES, WORD_LENGTH, WORDS } from '../constants/words';

export type LetterStatus = 'correct' | 'present' | 'absent' | 'initial';

export type Guess = {
    key: string;
    status: LetterStatus;
}[];

export type UsedKeys = {
    [key: string]: LetterStatus;
};

export { MAX_CHALLENGES, WORD_LENGTH };

export const getWord = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    return WORDS[randomIndex];
};

export const isWordInList = (word: string) => {
    return WORDS.includes(word.toUpperCase());
};

export const checkGuess = (guess: string, solution: string): LetterStatus[] => {
    const guessChars = guess.toUpperCase().split('');
    const solutionChars = solution.toUpperCase().split('');
    const status: LetterStatus[] = Array(guess.length).fill('absent');
    const solutionCharCounts: { [key: string]: number } = {};

    // Count frequencies of solution characters
    solutionChars.forEach((char) => {
        solutionCharCounts[char] = (solutionCharCounts[char] || 0) + 1;
    });

    // First pass: find correct matches (green)
    guessChars.forEach((char, index) => {
        if (char === solutionChars[index]) {
            status[index] = 'correct';
            solutionCharCounts[char]--;
        }
    });

    // Second pass: find present matches (yellow)
    guessChars.forEach((char, index) => {
        if (status[index] !== 'correct') {
            if (solutionCharCounts[char] > 0) {
                status[index] = 'present';
                solutionCharCounts[char]--;
            }
        }
    });

    return status;
};
