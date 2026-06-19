import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import { useToast } from '../../../components/ui/Toast';
import { workService } from '../../../api/services';
import { formatCurrency, formatDateTime, minutesToLabel } from '../../../utils/agriHelpers';

function Line({ label, value }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
      <AppText variant="body" color={COLORS.textSecondary}>{label}</AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
}

export default function WorkDetailScreen({ navigation, route }) {
  const toast = useToast();
  const id = route?.params?.id;
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try { setWork(await workService.getById(id)); } catch (e) {} finally { setLoading(false); }
  }, [id]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <AppLoader mode="overlay" visible message="Loading..." />;

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Work Detail" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard>
          <Line label="Service" value={work?.serviceType || '-'} />
          <Line label="Amount" value={formatCurrency(work?.amount)} />
          <Line label="Duration" value={minutesToLabel(work?.durationMinutes)} />
          <Line label="Started" value={formatDateTime(work?.startTime)} />
          <Line label="Ended" value={formatDateTime(work?.endTime)} />
          {work?.extraCharges ? <Line label="Extra charges" value={formatCurrency(work.extraCharges)} /> : null}
          <Line label="Status" value={work?.status || '-'} />
          {!!work?.notes && <Line label="Notes" value={work.notes} />}
        </AppCard>
        <AppButton label="Generate Invoice" leftIcon="receipt" style={{ marginTop: 20 }}
          onPress={() => navigation.navigate('InvoiceGenerate', { work })} />
      </View>
    </ScreenWrapper>
  );
}
