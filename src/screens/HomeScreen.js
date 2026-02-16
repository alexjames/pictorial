import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import TopicCard from '../components/TopicCard';
import topics from '../data/topics';
import colors from '../theme/colors';

export default function HomeScreen({ navigation }) {
  return (
    <FlatList
      data={topics}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TopicCard
          topic={item}
          onPress={() => navigation.navigate('Topic', { topic: item })}
        />
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
});
