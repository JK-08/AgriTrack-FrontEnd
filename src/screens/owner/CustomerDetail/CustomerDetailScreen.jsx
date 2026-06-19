import React, { useState, useCallback } from 'react';
import { View, Linking, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import ListRow from '../../../components/agri/ListRow';
import { useToast } from '../../../components/ui/Toast';
import { customerService, workService } from '../../../api/services';
import { formatCurrency, formatDate, minutesToLabel, statusVariant } from '../../../utils/agriHelpers';

export default function CustomerDetailScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const id = route?.params?.id;
  const [customer, setCustomer] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const c = await customerService.getById(id);
      setCustomer(c);
      const w = await workService.byCustomer(id);
      setWorks(Array.isArray(w) ? w : []);
    } catch (e) {}
    finally { setLoading(false); }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onDelete = async () => {
    try { await customerService.remove(id); toast?.success?.('Customer deleted'); navigation.goBack(); }
    catch (e) { toast?.error?.(e?.message || 'Delete failed'); }
  };

  if (loading) return <AppLoader mode="overlay" visible message="Loading..." />;

  const call = () => customer?.mobileNo && Linking.openURL(`tel:${customer.mobileNo}`);
  const whatsapp = () => customer?.mobileNo && Linking.openURL(`whatsapp://send?phone=${customer.mobileNo}`);

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title={customer?.name || 'Customer'} variant="primary" showBack
        actions={[{ iconName: 'create-outline', onPress: () => navigation.navigate('AddCustomer', { customer }) }]} />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.avatar, { backgroundColor: COLORS.primaryPale }]}>
              <AppText variant="h2" color={COLORS.primary}>{(customer?.name || '?')[0]?.toUpperCase()}</AppText>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <AppText variant="h5">{customer?.name}</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>{customer?.mobileNo || 'No number'}</AppText>
              {!!customer?.village && <AppText variant="caption" color={COLORS.textTertiary}>{customer.village}</AppText>}
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <AppButton label="Call" leftIcon="call" size="sm" onPress={call} style={{ flex: 1 }} />
            <AppButton label="WhatsApp" leftIcon="logo-whatsapp" variant="outline" size="sm" onPress={whatsapp} style={{ flex: 1 }} />
          </View>
        </AppCard>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <AppButton label="Start Work" leftIcon="timer" onPress={() => navigation.navigate('OwnerTabs', { screen: 'Work', params: { customer } })} style={{ flex: 1 }} />
          <AppButton label="New Invoice" leftIcon="receipt" variant="gold" onPress={() => navigation.navigate('InvoiceGenerate', { customer })} style={{ flex: 1 }} />
        </View>

        <AppText variant="h5" style={{ marginTop: 22, marginBottom: 10 }}>Work History</AppText>
        {works.length === 0 ? (
          <AppText variant="bodySmall" color={COLORS.textSecondary}>No work recorded yet.</AppText>
        ) : works.map((w) => (
          <ListRow key={w.workId} icon="construct-outline"
            title={w.serviceType || 'Service'} subtitle={formatDate(w.workDate)}
            value={formatCurrency(w.amount)} status={w.status} statusVariant={statusVariant(w.status)}
            onPress={() => navigation.navigate('WorkDetail', { id: w.workId })} />
        ))}

        <AppButton label="Delete Customer" variant="danger" leftIcon="trash-outline" onPress={onDelete} style={{ marginTop: 24 }} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
