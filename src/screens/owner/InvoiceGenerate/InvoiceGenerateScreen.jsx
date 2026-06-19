import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { customerService, invoiceService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';

export default function InvoiceGenerateScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const { ownerId } = useAuth();
  const work = route?.params?.work;
  const presetCustomer = route?.params?.customer;

  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(work?.customerId || presetCustomer?.customerId || '');
  const [subtotal, setSubtotal] = useState((work?.amount ?? '').toString());
  const [extra, setExtra] = useState('');
  const [tax, setTax] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!ownerId) return;
      try { const c = await customerService.byOwner(ownerId); setCustomers(Array.isArray(c) ? c : []); } catch (e) {}
    })();
  }, [ownerId]);

  const total = (Number(subtotal) || 0) + (Number(extra) || 0) + (Number(tax) || 0);

  const onCreate = async () => {
    if (!subtotal) { toast?.error?.('Enter an amount'); return; }
    setSaving(true);
    try {
      const inv = await invoiceService.create({
        ownerId, customerId: customerId || null, workId: work?.workId || null,
        subtotal: Number(subtotal) || 0, extraCharges: Number(extra) || 0, tax: Number(tax) || 0,
        status: 'UNPAID',
      });
      toast?.success?.('Invoice created');
      navigation.replace('InvoicePreview', { invoice: inv });
    } catch (e) { toast?.error?.(e?.message || 'Could not create'); }
    finally { setSaving(false); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Generate Invoice" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppText variant="label" style={{ marginBottom: 6 }}>Customer</AppText>
        <View style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
          <Picker selectedValue={customerId} onValueChange={setCustomerId}>
            <Picker.Item label="Walk-in / none" value="" />
            {customers.map((c) => <Picker.Item key={c.customerId} label={c.name} value={c.customerId} />)}
          </Picker>
        </View>

        <AppInput label="Subtotal (₹)" leftIcon="cash-outline" value={subtotal} onChangeText={setSubtotal} keyboardType="numeric" />
        <AppInput label="Extra charges (₹)" leftIcon="add-circle-outline" value={extra} onChangeText={setExtra} keyboardType="numeric" />
        <AppInput label="Tax (₹)" leftIcon="calculator-outline" value={tax} onChangeText={setTax} keyboardType="numeric" />

        <AppCard variant="gold" style={{ marginTop: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText variant="bodyMedium">Total</AppText>
            <AppText variant="h5">{formatCurrency(total)}</AppText>
          </View>
        </AppCard>

        <AppButton label="Create Invoice" onPress={onCreate} loading={saving} style={{ marginTop: 18 }} />
      </View>
    </ScreenWrapper>
  );
}
