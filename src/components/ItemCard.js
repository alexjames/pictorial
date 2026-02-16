import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import LoadingImage from './LoadingImage';
import colors from '../theme/colors';
import typography from '../theme/typography';

const { width } = Dimensions.get('window');
const CARD_GAP = 10;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

export default function ItemCard({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <LoadingImage source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: CARD_GAP,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceLight,
  },
  textContainer: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  snippet: {
    ...typography.small,
    color: colors.secondary,
    marginTop: 3,
  },
});
