import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ItemCard from '../components/ItemCard';
import colors from '../theme/colors';

export default function TopicScreen({ route, navigation }) {
  const { topic } = route.params;

  return (
    <FlatList
      data={topic.items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <ItemCard
          item={item}
          onPress={() => navigation.navigate('Detail', { items: topic.items, initialIndex: topic.items.indexOf(item) })}
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
  row: {
    justifyContent: 'space-between',
  },
});
