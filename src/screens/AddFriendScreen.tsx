import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { colors } from '../constants/colors';
import { searchUsers, sendFriendRequest, getFriendRequests, acceptFriendRequest } from '../services/friends';
import { useAuth } from '../context/AuthContext';

const AddFriendScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const { session } = useAuth();

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        const data = await getFriendRequests();
        setRequests(data);
    };

    const handleSearch = async () => {
        if (searchTerm.length < 3) return;
        const results = await searchUsers(searchTerm);
        // Filter out self
        setSearchResults(results.filter((u: any) => u.id !== session?.user.id));
    };

    const handleAddFriend = async (friendId: string) => {
        try {
            await sendFriendRequest(friendId);
            Alert.alert('Success', 'Friend request sent!');
            setSearchResults([]); // Clear results or mark as sent
            setSearchTerm('');
        } catch (error: any) {
            Alert.alert('Error', 'Could not send request. You might already be friends or have a pending request.');
        }
    };

    const handleAccept = async (requestId: string) => {
        try {
            await acceptFriendRequest(requestId);
            Alert.alert('Success', 'Friend accepted!');
            loadRequests(); // Refresh list
        } catch (error) {
            Alert.alert('Error', 'Could not accept request.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ADD FRIENDS</Text>

            {/* SEARCH SECTION */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Find People</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Search by username..."
                    placeholderTextColor={colors.grey}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.buttonText}>SEARCH</Text>
                </TouchableOpacity>

                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.resultItem}>
                            <Text style={styles.username}>{item.username}</Text>
                            <TouchableOpacity onPress={() => handleAddFriend(item.id)}>
                                <Text style={styles.actionText}>ADD +</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>

            {/* REQUESTS SECTION */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Friend Requests</Text>
                {requests.length === 0 && <Text style={styles.emptyText}>No pending requests.</Text>}
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.resultItem}>
                            <Text style={styles.username}>{item.profiles.username}</Text>
                            <TouchableOpacity onPress={() => handleAccept(item.id)}>
                                <Text style={styles.acceptText}>ACCEPT</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        padding: 20,
        paddingTop: 60,
    },
    title: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        letterSpacing: 2,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: colors.darkGrey,
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#333',
        color: colors.white,
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    searchButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
    },
    username: {
        color: colors.white,
        fontSize: 16,
    },
    actionText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    acceptText: {
        color: colors.green,
        fontWeight: 'bold',
    },
    emptyText: {
        color: colors.grey,
        fontStyle: 'italic',
    }
});

export default AddFriendScreen;
