import React from 'react';
import { View, Text, ImageBackground, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import typography from '../theme/typography';

export default function TopicCard({ topic, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <ImageBackground
        source={{ uri: topic.coverImage }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.gradient}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>{topic.title}</Text>
            <Text style={styles.subtitle}>{topic.subtitle}</Text>
            <Text style={styles.count}>{topic.items.length} items</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    height: 200,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 16,
  },
  gradient: {
    height: '100%',
    justifyContent: 'flex-end',
    borderRadius: 16,
    padding: 18,
  },
  textContainer: {
    gap: 2,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: 2,
  },
  count: {
    ...typography.small,
    color: colors.secondary,
    marginTop: 4,
    opacity: 0.7,
  },
});
