import { supabase } from '../lib/supabase';

/**
 * Envoie un feedback utilisateur ou un log système vers la table `user_feedbacks` dans Supabase.
 *
 * @param type - Le type de feedback (ex: 'bug_report', 'crash_log', 'feature_request').
 * @param payload - L'objet contenant les données du feedback (stocké en tant que JSONB dans la colonne `document`).
 * @returns {Promise<boolean>} Retourne `true` si l'insertion a réussi, sinon `false`.
 *
 * @example
 * // Exemple 1 : Signalement de bug
 * sendFeedback('bug_report', {
 *   message: 'Le bouton jouer ne fonctionne pas',
 *   os: 'iOS 16.4',
 *   appVersion: '1.2.0'
 * });
 *
 * @example
 * // Exemple 2 : Log de crash
 * sendFeedback('crash_log', {
 *   error: 'NullReferenceException',
 *   stackTrace: 'at Object.<anonymous> (App.js:42:15)',
 *   timestamp: new Date().toISOString()
 * });
 */
export const sendFeedback = async (type: string, payload: any): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('user_feedbacks')
            .insert([
                {
                    type: type,
                    document: payload,
                },
            ]);

        if (error) {
            console.error('Erreur lors de l\'insertion du feedback Supabase:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Erreur inattendue lors de l\'envoi du feedback:', err);
        return false;
    }
};
