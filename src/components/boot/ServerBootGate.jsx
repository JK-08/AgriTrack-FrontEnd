import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import AppText from '../ui/appcomponents/AppText';
import AppButton from '../ui/appcomponents/AppButton';
import AppLoader from '../ui/appcomponents/AppLoader';
import { healthService } from '../../api/services';

const TOTAL_BUDGET_MS = 90000;
const RETRY_INTERVAL_MS = 5000;
// Grace window: the health check runs silently in the background for this
// long before the "Starting AgriTrack Server" screen is allowed to appear.
// If the server answers within this window (the common case — warm
// instance), the user never sees a boot screen at all.
const SILENT_GRACE_MS = 3000;

const PROGRESS_MESSAGES = [
  'Checking server...',
  'Starting services...',
  'Almost ready...',
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ServerBootGate({ children }) {
  const { COLORS, SIZES } = useTheme();

  const [phase, setPhase] = useState('checking');
  const [progressIndex, setProgressIndex] = useState(0);
  const [attemptGeneration, setAttemptGeneration] = useState(0);
  // Purely a display flag — does not affect polling/retry/timeout logic at
  // all. Starts false so the first (silent) attempts render nothing; flips
  // true once the grace window elapses without a successful response.
  const [showBootUI, setShowBootUI] = useState(false);

  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setPhase('checking');
    setProgressIndex(0);
    setShowBootUI(false);

    const startedAt = Date.now();

    const graceTimer = setTimeout(() => {
      if (!cancelledRef.current) setShowBootUI(true);
    }, SILENT_GRACE_MS);

    (async function poll() {
      let attempt = 0;
      while (!cancelledRef.current) {
        try {
          await healthService.check();
          if (!cancelledRef.current) setPhase('ready');
          return;
        } catch (e) {
        }

        if (cancelledRef.current) return;

        if (Date.now() - startedAt >= TOTAL_BUDGET_MS) {
          setPhase('failed');
          setShowBootUI(true);
          return;
        }

        attempt += 1;
        setProgressIndex(Math.min(attempt, PROGRESS_MESSAGES.length - 1));
        await sleep(RETRY_INTERVAL_MS);
      }
    })();

    return () => {
      cancelledRef.current = true;
      clearTimeout(graceTimer);
    };
  }, [attemptGeneration]);

  const handleRetry = useCallback(() => {
    setAttemptGeneration((g) => g + 1);
  }, []);

  const handleExit = useCallback(() => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    }
  }, []);

  if (phase === 'ready') {
    return children;
  }

  // Still within the silent grace window (or the health check simply
  // resolved before the timer fired) — render nothing rather than the
  // boot screen. Retrying/timeout tracking above is unaffected.
  if (!showBootUI) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <View style={styles.content}>
        {phase === 'checking' ? (
          <>
            <AppText variant="h3" align="center" style={{ marginBottom: SIZES.margin.sm }}>
              Starting AgriTrack Server
            </AppText>
            <AppText variant="bodySmall" align="center" color={COLORS.textSecondary} style={styles.subtitle}>
              The server is waking up.{'\n'}
              This usually takes less than one minute.{'\n'}
              Please keep the app open.
            </AppText>

            <View style={styles.loaderWrap}>
              <AppLoader visible mode="inline" size="lg" message={PROGRESS_MESSAGES[progressIndex]} />
            </View>
          </>
        ) : (
          <>
            <AppText variant="h3" align="center" style={{ marginBottom: SIZES.margin.sm }}>
              Unable to connect to the server
            </AppText>
            <AppText variant="bodySmall" align="center" color={COLORS.textSecondary} style={styles.subtitle}>
              Please check your internet connection or try again.
            </AppText>

            <View style={styles.actions}>
              <AppButton label="Retry" variant="primary" onPress={handleRetry} style={{ marginBottom: SIZES.margin.sm }} />
              {Platform.OS === 'android' && (
                <AppButton label="Exit" variant="outline" onPress={handleExit} />
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  subtitle: { marginBottom: 32, lineHeight: 20 },
  loaderWrap: { marginTop: 8, alignItems: 'center' },
  actions: { width: '100%', maxWidth: 320, marginTop: 8 },
});
