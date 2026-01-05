import { supabase } from '../lib/supabase';

export interface FriendRequest {
    id: string;
    user_id: string;
    friend_id: string;
    status: 'pending' | 'accepted';
    profiles: {
        username: string;
        avatar_url: string;
    };
}

export const searchUsers = async (searchTerm: string) => {
    const { data, error } = await supabase.rpc('search_users', {
        search_term: searchTerm,
    });

    if (error) {
        console.error('Error searching users:', error);
        return [];
    }
    return data;
};

export const sendFriendRequest = async (friendId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('friends')
        .insert({
            user_id: user.id,
            friend_id: friendId,
            status: 'pending', // Default is pending, but good to be explicit
        });

    if (error) throw error;
};

export const getFriendRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Pending requests where I am the friend_id (recipient)
    const { data, error } = await supabase
        .from('friends')
        .select(`
            id,
            user_id,
            friend_id,
            status,
            profiles:user_id (username, avatar_url) 
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');
    // Note: The 'profiles:user_id' alias fetches the sender's profile

    if (error) {
        console.error('Error fetching friend requests:', error);
        return [];
    }
    return data;
};

export const acceptFriendRequest = async (requestId: string) => {
    const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId);

    if (error) throw error;
};

export const getFriends = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get all accepted friendships where I am either user_id or friend_id
    const { data, error } = await supabase
        .from('friends')
        .select(`
            id,
            user_id,
            friend_id,
            status,
            sender:user_id(username, avatar_url),
            receiver:friend_id(username, avatar_url)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

    if (error) {
        console.error('Error fetching friends:', error);
        return [];
    }

    // Normalize data to return just the friend's profile
    return data.map((item: any) => {
        if (item.user_id === user.id) return { ...item.receiver, id: item.friend_id };
        return { ...item.sender, id: item.user_id };
    });
};
