import { checkWord } from '../src/utils/wordValidation';

describe('checkWord', () => {
    it('retourne tout vert si le mot est correct', () => {
        const result = checkWord('POMME', 'POMME');
        expect(result).toEqual(['vert', 'vert', 'vert', 'vert', 'vert']);
    });

    it('retourne gris pour les lettres absentes et jaune pour les mal placées', () => {
        const result = checkWord('PORTE', 'POMME');
        // P: vert, O: vert, R: gris, T: gris, E: vert
        expect(result).toEqual(['vert', 'vert', 'gris', 'gris', 'vert']);
    });

    it('gère correctement les lettres en double', () => {
        const result = checkWord('MAMAN', 'POMME');
        // Target: P O M M E
        // M: jaune (match avec un M de POMME)
        // A: gris
        // M: vert (match position 3 de POMME)
        // A: gris
        // N: gris
        expect(result).toEqual(['jaune', 'gris', 'vert', 'gris', 'gris']);
    });
});
