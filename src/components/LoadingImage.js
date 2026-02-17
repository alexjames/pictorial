import { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function LoadingImage({ source, style, onLoadEnd, ...props }) {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.wrapper, style]}>
      <Image
        source={source}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        onLoadEnd={() => {
          setLoading(false);
          onLoadEnd?.();
        }}
        {...props}
      />
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surfaceLight,
    overflow: 'hidden',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
