import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { formatCurrency, formatDuration, minutesToLabel } from '../../../utils/agriHelpers';

function Line({ label, value }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
      <AppText variant="body" color={COLORS.textSecondary}>{label}</AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
}

export default function WorkSummaryScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const work = route?.params?.work || {};
  const seconds = (work.durationMinutes || 0) * 60 || work.accumulatedSeconds || 0;

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Work Summary" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, alignItems: 'center' }}>
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <AppText variant="h1" color={COLORS.success}>{formatCurrency(work.amount)}</AppText>
          <AppText variant="caption" color={COLORS.textSecondary}>Total amount</AppText>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <AppCard>
          <Line label="Service" value={work.serviceType || '-'} />
          <Line label="Duration" value={minutesToLabel(work.durationMinutes)} />
          <Line label="Time tracked" value={formatDuration(seconds)} />
          {work.extraCharges ? <Line label="Extra charges" value={formatCurrency(work.extraCharges)} /> : null}
          <Line label="Status" value={work.status || 'COMPLETED'} />
        </AppCard>

        <AppButton label="Generate Invoice" leftIcon="receipt" style={{ marginTop: 20 }}
          onPress={() => navigation.replace('InvoiceGenerate', { work })} />
        <AppButton label="Done" variant="outline" style={{ marginTop: 12 }}
          onPress={() => navigation.navigate('OwnerTabs', { screen: 'History' })} />
      </View>
    </ScreenWrapper>
  );
}
