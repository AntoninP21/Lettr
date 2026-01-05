import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { fetchLeaderboard, fetchFriendsLeaderboard } from '../services/stats';

const LeaderboardScreen = (props: any) => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [filter, setFilter] = useState<'global' | 'friends'>('global');

    useEffect(() => {
        loadLeaderboard();
    }, [filter]);

    const loadLeaderboard = async () => {
        const data = filter === 'global'
            ? await fetchLeaderboard()
            : await fetchFriendsLeaderboard();
        setLeaderboard(data);
    };

    const renderItem = ({ item, index }: any) => (
        <View style={styles.item}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.username}>
                {item.profiles?.username || 'Anonymous'}
            </Text>
            <View style={styles.stats}>
                <Text style={styles.statText}>🏆 {item.games_won}</Text>
                <Text style={styles.statText}>🔥 {item.max_streak}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>LEADERBOARD</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => (props.navigation as any).navigate('AddFriend')}
                >
                    <Text style={styles.addButtonText}>+ FRIENDS</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.headerRow}>
                <Text style={styles.headerText}>Rank</Text>
                <Text style={styles.headerText}>Player</Text>
                <Text style={styles.headerText}>Wins / Best Streak</Text>
            </View>
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'global' && styles.activeFilter]}
                    onPress={() => setFilter('global')}
                >
                    <Text style={[styles.filterText, filter === 'global' && styles.activeFilterText]}>GLOBAL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'friends' && styles.activeFilter]}
                    onPress={() => setFilter('friends')}
                >
                    <Text style={[styles.filterText, filter === 'friends' && styles.activeFilterText]}>FRIENDS</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={leaderboard}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        flex: 1,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: colors.primary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.darkGrey,
        paddingBottom: 10,
    },
    headerText: {
        color: colors.darkGrey,
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: colors.darkGrey,
        borderRadius: 8,
        padding: 2,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeFilter: {
        backgroundColor: colors.primary,
    },
    filterText: {
        color: colors.grey,
        fontWeight: 'bold',
        fontSize: 14,
    },
    activeFilterText: {
        color: colors.white,
    },
    list: {
        paddingBottom: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
    },
    rank: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 18,
        width: 30,
        textAlign: 'center',
    },
    username: {
        color: colors.white,
        fontSize: 16,
        flex: 1,
        marginLeft: 10,
    },
    stats: {
        flexDirection: 'row',
        width: 100,
        justifyContent: 'space-between',
    },
    statText: {
        color: colors.lightGrey,
    },
});

export default LeaderboardScreen;
