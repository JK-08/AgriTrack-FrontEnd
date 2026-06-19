import React, { useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { paymentService, invoiceService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';

export default function PaymentScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const { ownerId: myId } = useAuth();
  const invoice = route?.params?.invoice || {};
  const [method, setMethod] = useState('UPI');
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      await paymentService.create({
        invoiceId: invoice.invoiceId, ownerId: invoice.ownerId, customerId: myId,
        amount: invoice.totalAmount, paymentMethod: method, paymentStatus: 'SUCCESS',
      });
      if (invoice.invoiceId) await invoiceService.setStatus(invoice.invoiceId, 'PAID');
      toast?.success?.('Payment successful');
      navigation.navigate('ClientTabs', { screen: 'Payments' });
    } catch (e) { toast?.error?.(e?.message || 'Payment failed'); }
    finally { setBusy(false); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Make Payment" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard variant="gold">
          <AppText variant="caption" color={COLORS.textSecondary}>Amount due</AppText>
          <AppText variant="h2">{formatCurrency(invoice.totalAmount)}</AppText>
        </AppCard>

        <AppText variant="label" style={{ marginTop: 18, marginBottom: 6 }}>Payment Method</AppText>
        <View style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, overflow: 'hidden' }}>
          <Picker selectedValue={method} onValueChange={setMethod}>
            <Picker.Item label="UPI" value="UPI" />
            <Picker.Item label="Cash" value="CASH" />
            <Picker.Item label="Card" value="CARD" />
            <Picker.Item label="Bank Transfer" value="BANK" />
          </Picker>
        </View>

        <AppButton label={`Pay ${formatCurrency(invoice.totalAmount)}`} onPress={pay} loading={busy} style={{ marginTop: 20 }} />
      </View>
    </ScreenWrapper>
  );
}
