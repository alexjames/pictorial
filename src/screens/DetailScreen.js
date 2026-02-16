import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';

const { width } = Dimensions.get('window');

export default function DetailScreen({ route }) {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
