import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import LoadingImage from '../components/LoadingImage';
import colors from '../theme/colors';
import typography from '../theme/typography';

const { width, height } = Dimensions.get('window');
const TIMER_DURATION = 10000;
const GAME_ACCENT = '#FF6B6B';
const PREFETCH_COUNT = 3;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function GamePlayScreen({ route, navigation }) {
  const { topic } = route.params;
  const [items] = useState(() => shuffle(topic.items));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadedIndices, setLoadedIndices] = useState(new Set());
  const revealedRef = useRef(false);
  const prefetchedRef = useRef(new Set());

  const timerWidth = useRef(new Animated.Value(1)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameScale = useRef(new Animated.Value(0.8)).current;
  const timerAnimation = useRef(null);
  const tickInterval = useRef(null);
  const tickSound = useRef(null);
  const revealSound = useRef(null);

  // Prefetch upcoming images
  const prefetchImages = useCallback((fromIndex, count) => {
    const end = Math.min(fromIndex + count, items.length);
    for (let i = fromIndex; i < end; i++) {
      const uri = items[i].image;
      if (!prefetchedRef.current.has(uri)) {
        prefetchedRef.current.add(uri);
        Image.prefetch(uri).catch(() => {});
      }
    }
  }, [items]);

  // Initial preload — wait for first batch before starting the game
  useEffect(() => {
    const end = Math.min(PREFETCH_COUNT, items.length);
    const promises = items.slice(0, end).map((item) => {
      prefetchedRef.current.add(item.image);
      return Image.prefetch(item.image).catch(() => {});
    });
    Promise.all(promises).then(() => setReady(true));
  }, [items]);

  // Prefetch next images as the player advances
  useEffect(() => {
    if (ready) {
      prefetchImages(currentIndex + 1, PREFETCH_COUNT);
    }
  }, [currentIndex, ready, prefetchImages]);

  // Stop timer & sounds when navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      stopTimer();
      tickSound.current?.stopAsync().catch(() => {});
    });
    return unsubscribe;
  }, [navigation, stopTimer]);

  // Load sounds
  useEffect(() => {
    let mounted = true;
    async function loadSounds() {
      try {
        const { sound: tick } = await Audio.Sound.createAsync(
          require('../../assets/sounds/tick.wav')
        );
        const { sound: reveal } = await Audio.Sound.createAsync(
          require('../../assets/sounds/reveal.wav')
        );
        if (mounted) {
          tickSound.current = tick;
          revealSound.current = reveal;
        }
      } catch (e) {
        // Sounds optional — game works without them
      }
    }
    loadSounds();
    return () => {
      mounted = false;
      tickSound.current?.unloadAsync();
      revealSound.current?.unloadAsync();
    };
  }, []);

  const stopTimer = useCallback(() => {
    if (timerAnimation.current) {
      timerAnimation.current.stop();
      timerAnimation.current = null;
    }
    if (tickInterval.current) {
      clearInterval(tickInterval.current);
      tickInterval.current = null;
    }
  }, []);

  const playTick = useCallback(async () => {
    try {
      if (tickSound.current) {
        await tickSound.current.setPositionAsync(0);
        await tickSound.current.playAsync();
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const doReveal = useCallback(async () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    stopTimer();

    try {
      if (revealSound.current) {
        await revealSound.current.setPositionAsync(0);
        await revealSound.current.playAsync();
      }
    } catch (e) {
      // ignore
    }

    Animated.parallel([
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(nameScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
    ]).start();
  }, [stopTimer, nameOpacity, nameScale]);

  const startRound = useCallback(() => {
    revealedRef.current = false;
    setRevealed(false);
    timerWidth.setValue(1);
    nameOpacity.setValue(0);
    nameScale.setValue(0.8);

    const anim = Animated.timing(timerWidth, {
      toValue: 0,
      duration: TIMER_DURATION,
      useNativeDriver: false,
    });
    timerAnimation.current = anim;
    anim.start(({ finished }) => {
      if (finished) {
        doReveal();
      }
    });

    // Play tick every second
    playTick();
    tickInterval.current = setInterval(playTick, 1000);
  }, [timerWidth, nameOpacity, nameScale, doReveal, playTick]);

  const imageLoaded = loadedIndices.has(currentIndex);

  useEffect(() => {
    if (!done && ready && imageLoaded) {
      startRound();
    }
    return stopTimer;
  }, [currentIndex, done, ready, imageLoaded, startRound, stopTimer]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      stopTimer();
      setDone(true);
    }
  }, [currentIndex, items.length, stopTimer]);

  if (!ready) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GAME_ACCENT} />
        <Text style={styles.loadingText}>Loading images…</Text>
      </View>
    );
  }

  if (done) {
    return (
      <View style={styles.doneContainer}>
        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={styles.doneTitle}>Well done!</Text>
        <Text style={styles.doneSubtitle}>
          You explored {items.length} {topic.title.toLowerCase()}
        </Text>
        <Pressable
          style={styles.doneButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.doneButtonText}>Play Again</Text>
        </Pressable>
      </View>
    );
  }

  const currentItem = items[currentIndex];
  const progress = `${currentIndex + 1} / ${items.length}`;

  return (
    <View style={styles.container}>
      {/* Timer bar */}
      <Animated.View
        style={[
          styles.timerBar,
          {
            width: timerWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />

      {/* Progress */}
      <Text style={styles.progress}>{progress}</Text>

      {/* Images — keep current + next few mounted to avoid reload flicker */}
      <View style={styles.imageContainer}>
        {items.map((item, i) => {
          if (i < currentIndex || i > currentIndex + PREFETCH_COUNT) return null;
          return (
            <View
              key={item.id}
              style={[
                StyleSheet.absoluteFill,
                { zIndex: i === currentIndex ? 1 : 0, opacity: i === currentIndex ? 1 : 0 },
              ]}
            >
              <LoadingImage
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
                onLoadEnd={() => setLoadedIndices((prev) => {
                  if (prev.has(i)) return prev;
                  const next = new Set(prev);
                  next.add(i);
                  return next;
                })}
              />
            </View>
          );
        })}
      </View>

      {/* Answer area — fixed height so image doesn't resize on reveal */}
      <View style={styles.answerArea}>
        <Animated.Text
          style={[
            styles.itemName,
            { opacity: nameOpacity, transform: [{ scale: nameScale }] },
          ]}
        >
          {currentItem.name}
        </Animated.Text>
        <Pressable
          style={styles.actionButton}
          onPress={revealed ? handleNext : doReveal}
        >
          <Text style={styles.actionButtonText}>
            {revealed
              ? currentIndex < items.length - 1
                ? 'Next'
                : 'Finish'
              : 'Reveal'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  timerBar: {
    height: 4,
    backgroundColor: GAME_ACCENT,
  },
  progress: {
    ...typography.caption,
    color: colors.secondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
  imageContainer: {
    flex: 1,
    width: width,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  answerArea: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    height: 140,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: GAME_ACCENT,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 30,
  },
  actionButtonText: {
    ...typography.h3,
    color: '#FFFFFF',
  },
  itemName: {
    ...typography.h2,
    color: colors.primary,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 16,
  },
  // Loading screen
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: 16,
  },
  // Done screen
  doneContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  doneEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  doneTitle: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: 8,
  },
  doneSubtitle: {
    ...typography.body,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: GAME_ACCENT,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 30,
  },
  doneButtonText: {
    ...typography.h3,
    color: '#FFFFFF',
  },
});
