import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopicCard from '../components/TopicCard';
import topics from '../data/topics';
import colors from '../theme/colors';
import typography from '../theme/typography';

const gameTopics = topics.filter((t) => t.id !== 'cognitive-biases');

export default function GamesHomeScreen({ navigation }) {
  return (
    <FlatList
      data={gameTopics}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pick a topic</Text>
          <Text style={styles.headerSubtitle}>Guess the name from the picture</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('GamePlay', { topic: item })}
          style={styles.cardWrapper}
        >
          <TopicCard topic={item} onPress={() => navigation.navigate('GamePlay', { topic: item })} />
          <View style={styles.playBadge}>
            <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.9)" />
          </View>
        </Pressable>
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: 4,
    marginBottom: 12,
  },
  cardWrapper: {
    position: 'relative',
  },
  playBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
