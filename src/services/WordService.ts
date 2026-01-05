import { WORDS } from "../constants/words";

const WORDS_URL = 'https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt';

// Fallback to local list if fetch fails
let cachedWords: string[] = [...WORDS];

export const WordService = {
    fetchWords: async (): Promise<string[]> => {
        try {
            const response = await fetch(WORDS_URL);
            if (!response.ok) throw new Error('Failed to fetch words');
            const text = await response.text();
            // Split by newline and filter for valid 5-letter words
            const words = text.split('\n')
                .map(w => w.trim().toUpperCase())
                .filter(w => w.length === 5 && /^[A-Z]{5}$/.test(w));

            if (words.length > 0) {
                cachedWords = words;
            }
            return cachedWords;
        } catch (error) {
            console.error('Error fetching words:', error);
            return cachedWords;
        }
    },

    getDaysSinceEpoch: (): number => {
        const epoch = new Date('2024-01-01T00:00:00.000Z').getTime();
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.floor((now - epoch) / oneDay);
    },

    getDailyWord: (words: string[]): string => {
        if (!words || words.length === 0) return 'REACT'; // absolute fallback

        const daysSinceEpoch = WordService.getDaysSinceEpoch();

        // Deterministic index
        const index = daysSinceEpoch % words.length;

        // Handle negative modulo just in case of clock weirdness
        const safeIndex = (index + words.length) % words.length;

        return words[safeIndex];
    }
};
