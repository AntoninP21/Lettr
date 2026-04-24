export const checkWord = (guess, target) => {
    if (!guess || !target || guess.length !== target.length) {
        throw new Error("Mots invalides");
    }
    const guessChars = guess.toUpperCase().split('');
    const targetChars = target.toUpperCase().split('');
    const status = Array(guess.length).fill('gris');
    const targetCharCounts = {};

    targetChars.forEach((char) => {
        targetCharCounts[char] = (targetCharCounts[char] || 0) + 1;
    });

    guessChars.forEach((char, index) => {
        if (char === targetChars[index]) {
            status[index] = 'vert';
            targetCharCounts[char]--;
        }
    });

    guessChars.forEach((char, index) => {
        if (status[index] !== 'vert') {
            if (targetCharCounts[char] > 0) {
                status[index] = 'jaune';
                targetCharCounts[char]--;
            }
        }
    });

    return status;
};
