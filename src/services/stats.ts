import { supabase } from '../lib/supabase';

export interface UserStats {
    games_played: number;
    games_won: number;
    current_streak: number;
    max_streak: number;
    distribution: number[];
    last_played_at?: string;
}

export const fetchUserStats = async (userId: string): Promise<UserStats | null> => {
    const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
    return data;
};

export const updateUserStats = async (userId: string, won: boolean, guessCount: number) => {
    const currentStats = await fetchUserStats(userId);
    if (!currentStats) return;

    const newStats: any = {
        games_played: currentStats.games_played + 1,
        games_won: currentStats.games_won + (won ? 1 : 0),
        current_streak: won ? currentStats.current_streak + 1 : 0,
        max_streak: won
            ? Math.max(currentStats.max_streak, currentStats.current_streak + 1)
            : currentStats.max_streak,
        last_played_at: new Date().toISOString(),
    };

    if (won && guessCount >= 1 && guessCount <= 6) {
        const distribution = [...currentStats.distribution];
        // Distribution is array 0-index for guess count 1-6 but often mapped.
        // Let's assume index 0 = 1 guess, index 5 = 6 guesses.
        distribution[guessCount - 1] = (distribution[guessCount - 1] || 0) + 1;
        newStats.distribution = distribution;
    }

    const { error } = await supabase
        .from('user_stats')
        .update(newStats)
        .eq('user_id', userId);

    if (error) console.error('Error updating stats:', error);
};

export const fetchLeaderboard = async () => {
    const { data, error } = await supabase
        .from('user_stats')
        .select(`
      games_won,
      max_streak,
      profiles (username, avatar_url)
    `)
        .order('games_won', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
    return data;
};

export const fetchFriendsLeaderboard = async () => {
    // 1. Get my friends IDs
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('user_id, friend_id')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

    if (friendsError) {
        console.error('Error fetching friends for leaderboard:', friendsError);
        return [];
    }

    const friendIds = friendsData.map((f: any) =>
        f.user_id === user.id ? f.friend_id : f.user_id
    );
    // Include myself
    friendIds.push(user.id);

    // 2. Fetch stats for these IDs
    const { data, error } = await supabase
        .from('user_stats')
        .select(`
            games_won,
            max_streak,
            profiles (username, avatar_url)
        `)
        .in('user_id', friendIds)
        .order('games_won', { ascending: false });

    if (error) {
        console.error('Error fetching friends leaderboard:', error);
        return [];
    }
    return data;
};
