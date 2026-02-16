import { useState } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import typography from '../theme/typography';

export default function TopicCard({ topic, onPress }) {
  const [loading, setLoading] = useState(true);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: topic.coverImage }}
          style={StyleSheet.absoluteFill}
          onLoadEnd={() => setLoading(false)}
        />
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.secondary} />
          </View>
        )}
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
      </View>
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
  imageWrapper: {
    height: 200,
    backgroundColor: colors.surfaceLight,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
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
