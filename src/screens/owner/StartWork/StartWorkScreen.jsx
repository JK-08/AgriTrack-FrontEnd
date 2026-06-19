import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { Picker } from '@react-native-picker/picker';
import WorkTimerControls from '../../../components/agri/WorkTimerControls';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { customerService, rateService, tractorService, workService } from '../../../api/services';

export default function StartWorkScreen({ navigation, route }) {
  const { COLORS, SHADOWS, SIZES } = useTheme();
  const toast = useToast();
  const { ownerId } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [rates, setRates] = useState([]);
  const [tractors, setTractors] = useState([]);
  const [customerId, setCustomerId] = useState(route?.params?.customer?.customerId ?? '');
  const [rateId, setRateId] = useState('');
  const [tractorId, setTractorId] = useState('');

  const [work, setWork] = useState(null);      // active work record from backend
  const [status, setStatus] = useState('IDLE');
  const [seconds, setSeconds] = useState(0);
  const tickRef = useRef(null);

  const loadLists = useCallback(async () => {
    if (!ownerId) return;
    try {
      const [c, r, t] = await Promise.all([
        customerService.byOwner(ownerId),
        rateService.active(ownerId),
        tractorService.byOwner(ownerId),
      ]);
      setCustomers(Array.isArray(c) ? c : []);
      setRates(Array.isArray(r) ? r : []);
      setTractors(Array.isArray(t) ? t : []);
      if (Array.isArray(r) && r.length && !rateId) setRateId(r[0].rateId);
    } catch (e) {}
  }, [ownerId]);

  useFocusEffect(useCallback(() => { loadLists(); }, [loadLists]));

  // local ticking while RUNNING
  useEffect(() => {
    if (status === 'RUNNING') {
      tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (tickRef.current) {
      clearInterval(tickRef.current); tickRef.current = null;
    }
    return () => tickRef.current && clearInterval(tickRef.current);
  }, [status]);

  const onStart = async () => {
    if (!customerId) { toast?.error?.('Select a customer'); return; }
    if (!rateId) { toast?.error?.('Select a rate / service'); return; }
    try {
      const rate = rates.find((x) => x.rateId === rateId);
      const res = await workService.start({
        ownerId, customerId, rateId, tractorId: tractorId || null,
        serviceType: rate?.serviceType || 'Service',
      });
      setWork(res); setStatus('RUNNING'); setSeconds(0);
      toast?.success?.('Timer started');
    } catch (e) { toast?.error?.(e?.message || 'Could not start'); }
  };

  const onPause = async () => {
    try { await workService.pause(work.workId); setStatus('PAUSED'); } catch (e) { toast?.error?.('Pause failed'); }
  };
  const onResume = async () => {
    try { await workService.resume(work.workId); setStatus('RUNNING'); } catch (e) { toast?.error?.('Resume failed'); }
  };
  const onStop = async () => {
    try {
      const res = await workService.stop(work.workId);
      setStatus('IDLE'); setSeconds(0); setWork(null);
      navigation.navigate('WorkSummary', { work: res });
    } catch (e) { toast?.error?.('Stop failed'); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Start Work" subtitle="Track tractor work live" variant="primary" />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard padding="md">
          <AppText variant="label">Customer</AppText>
          <View style={[styles.picker, { borderColor: COLORS.border }]}>
            <Picker enabled={status === 'IDLE'} selectedValue={customerId} onValueChange={setCustomerId}>
              <Picker.Item label="Select customer..." value="" />
              {customers.map((c) => <Picker.Item key={c.customerId} label={c.name} value={c.customerId} />)}
            </Picker>
          </View>

          <AppText variant="label" style={{ marginTop: 10 }}>Service / Rate</AppText>
          <View style={[styles.picker, { borderColor: COLORS.border }]}>
            <Picker enabled={status === 'IDLE'} selectedValue={rateId} onValueChange={setRateId}>
              <Picker.Item label="Select service..." value="" />
              {rates.map((r) => (
                <Picker.Item key={r.rateId}
                  label={`${r.serviceType} ${r.pricePerHour ? '· ₹' + r.pricePerHour + '/hr' : r.pricePerMinute ? '· ₹' + r.pricePerMinute + '/min' : ''}`}
                  value={r.rateId} />
              ))}
            </Picker>
          </View>

          <AppText variant="label" style={{ marginTop: 10 }}>Machine (optional)</AppText>
          <View style={[styles.picker, { borderColor: COLORS.border }]}>
            <Picker enabled={status === 'IDLE'} selectedValue={tractorId} onValueChange={setTractorId}>
              <Picker.Item label="None" value="" />
              {tractors.map((t) => <Picker.Item key={t.tractorId} label={t.model || t.machineType || `Tractor ${t.tractorId}`} value={t.tractorId} />)}
            </Picker>
          </View>
        </AppCard>

        <View style={{ marginTop: 24 }}>
          <WorkTimerControls
            seconds={seconds} status={status}
            onStart={onStart} onPause={onPause} onResume={onResume} onStop={onStop}
          />
        </View>

        {rates.length === 0 && (
          <AppButton label="Set up rates first" variant="outline" leftIcon="pricetags"
            onPress={() => navigation.navigate('Rates')} style={{ marginTop: 20 }} />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  picker: { borderWidth: 1, borderRadius: 10, marginTop: 6, overflow: 'hidden' },
});
