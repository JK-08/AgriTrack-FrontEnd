import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import { useToast } from '../../../components/ui/Toast';
import { invoiceService, paymentService } from '../../../api/services';
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

export default function InvoicePreviewScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const [invoice, setInvoice] = useState(route?.params?.invoice || {});
  const [busy, setBusy] = useState(false);

  const markPaid = async () => {
    setBusy(true);
    try {
      await invoiceService.setStatus(invoice.invoiceId, 'PAID');
      await paymentService.create({
        invoiceId: invoice.invoiceId, ownerId: invoice.ownerId, customerId: invoice.customerId,
        amount: invoice.totalAmount, paymentMethod: 'CASH', paymentStatus: 'SUCCESS',
      });
      setInvoice({ ...invoice, status: 'PAID' });
      toast?.success?.('Marked as paid');
    } catch (e) { toast?.error?.(e?.message || 'Failed'); }
    finally { setBusy(false); }
  };

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
          {invoice.extraCharges ? <Line label="Extra charges" value={formatCurrency(invoice.extraCharges)} /> : null}
          {invoice.tax ? <Line label="Tax" value={formatCurrency(invoice.tax)} /> : null}
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
          <Line label="Total" value={formatCurrency(invoice.totalAmount)} bold />
        </AppCard>

        {invoice.status !== 'PAID' && (
          <AppButton label="Mark as Paid" leftIcon="checkmark-circle" onPress={markPaid} loading={busy} style={{ marginTop: 18 }} />
        )}
        <AppButton label="Share / Print" variant="outline" leftIcon="share-social-outline" style={{ marginTop: 12 }}
          onPress={() => toast?.info?.('Use the system share sheet (expo-print/sharing)')} />
      </View>
    </ScreenWrapper>
  );
}
