import { useRef, useCallback } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, Dimensions } from 'react-native';
import LoadingImage from '../components/LoadingImage';
import colors from '../theme/colors';
import typography from '../theme/typography';

const { width } = Dimensions.get('window');

function DetailPage({ item }) {
  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <LoadingImage source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </ScrollView>
  );
}

export default function DetailScreen({ route, navigation }) {
  const { items, initialIndex } = route.params;
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const currentItem = viewableItems[0].item;
      navigation.setOptions({ title: currentItem.name });
    }
  }, [navigation]);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={items}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      getItemLayout={(_, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      renderItem={({ item }) => <DetailPage item={item} />}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    width: width,
    flex: 1,
  },
  image: {
    width: width,
    aspectRatio: 4 / 3,
    backgroundColor: colors.surfaceLight,
  },
  content: {
    padding: 20,
  },
  name: {
    ...typography.h2,
    color: colors.primary,
    fontSize: 24,
    marginBottom: 12,
  },
  description: {
    ...typography.body,
    color: colors.secondary,
    lineHeight: 26,
  },
});
