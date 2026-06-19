import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import { formatCurrency, formatDate, statusVariant } from '../../../utils/agriHelpers';

function Line({ label, value, bold }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <AppText variant={bold ? 'bodyMedium' : 'body'} color={bold ? undefined : COLORS.textSecondary}>{label}</AppText>
      <AppText variant={bold ? 'h6' : 'bodyMedium'}>{value}</AppText>
    </View>
  );
}

export default function InvoiceViewScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const invoice = route?.params?.invoice || {};
  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Invoice" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <View>
              <AppText variant="h5">{invoice.invoiceNumber || `#${invoice.invoiceId}`}</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>{formatDate(invoice.invoiceDate)}</AppText>
            </View>
            <AppBadge label={invoice.status || 'UNPAID'} variant={statusVariant(invoice.status)} />
          </View>
          <Line label="Subtotal" value={formatCurrency(invoice.subtotal)} />
          {invoice.extraCharges ? <Line label="Extra" value={formatCurrency(invoice.extraCharges)} /> : null}
          {invoice.tax ? <Line label="Tax" value={formatCurrency(invoice.tax)} /> : null}
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
          <Line label="Total" value={formatCurrency(invoice.totalAmount)} bold />
        </AppCard>
        {invoice.status !== 'PAID' && (
          <AppButton label="Pay Now" leftIcon="card" style={{ marginTop: 18 }}
            onPress={() => navigation.navigate('Payment', { invoice })} />
        )}
      </View>
    </ScreenWrapper>
  );
}
