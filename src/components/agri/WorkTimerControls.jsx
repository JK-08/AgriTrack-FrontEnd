import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppText from '../ui/appcomponents/AppText';
import { formatDuration } from '../../utils/agriHelpers';

export default function WorkTimerControls({ seconds, status, onStart, onPause, onResume, onStop, disabled }) {
  const { COLORS, SHADOWS } = useTheme();
  const running = status === 'RUNNING';
  const paused  = status === 'PAUSED';
  const idle    = !status || status === 'IDLE';

  const Btn = ({ icon, color, onPress, label, big }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={{ alignItems: 'center', opacity: disabled ? 0.5 : 1 }}
    >
      <View style={[
        styles.btn,
        big && styles.btnBig,
        { backgroundColor: color, ...SHADOWS.md },
      ]}>
        <Ionicons name={icon} size={big ? 34 : 24} color={COLORS.white} />
      </View>
      <AppText variant="caption" style={{ marginTop: 6 }}>{label}</AppText>
    </TouchableOpacity>
  );

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={[styles.dial, { borderColor: running ? COLORS.success : paused ? COLORS.warning : COLORS.border }]}>
        <AppText variant="h1" style={{ fontVariant: ['tabular-nums'] }}>{formatDuration(seconds)}</AppText>
        <AppText variant="caption" color={COLORS.textSecondary}>
          {running ? 'Running' : paused ? 'Paused' : 'Ready'}
        </AppText>
      </View>

      <View style={styles.row}>
        {idle && <Btn icon="play" color={COLORS.success} onPress={onStart} label="Start" big />}
        {running && (
          <>
            <Btn icon="pause" color={COLORS.warning} onPress={onPause} label="Pause" />
            <Btn icon="stop" color={COLORS.error} onPress={onStop} label="Stop" big />
          </>
        )}
        {paused && (
          <>
            <Btn icon="play" color={COLORS.success} onPress={onResume} label="Resume" />
            <Btn icon="stop" color={COLORS.error} onPress={onStop} label="Stop" big />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dial:   { width: 200, height: 200, borderRadius: 100, borderWidth: 6, alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  row:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, marginTop: 8 },
  btn:    { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  btnBig: { width: 76, height: 76, borderRadius: 26 },
});
