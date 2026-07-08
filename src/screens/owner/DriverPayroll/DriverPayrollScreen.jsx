import React, { useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppModal from '../../../components/ui/appcomponents/AppModal';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { payrollService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';
import { exportHtmlAsPdf, buildReportHtml } from '../../../utils/exportHelpers';

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function DriverPayrollScreen({ route }) {
  const { COLORS, SIZES } = useTheme();
  const toast = useToast();
  const { ownerId } = useAuth();
  const driver = route?.params?.driver || {};

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ month: currentMonth(), incentives: '', penalties: '', notes: '' });
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const load = useCallback(async () => {
    if (!ownerId || !driver.driverId) return;
    try {
      const res = await payrollService.searchPaged(ownerId, {
        driverId: driver.driverId, page: 0, size: 24, sortBy: 'payrollMonth', sortDir: 'desc',
      });
      setItems(res?.content || []);
    } catch (e) {
      toast?.error?.('Could not load payroll');
    } finally {
      setLoading(false);
    }
  }, [ownerId, driver.driverId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const generate = async () => {
    setGenerating(true);
    try {
      await payrollService.generate({
        driverId: driver.driverId,
        month: form.month,
        incentives: form.incentives ? Number(form.incentives) : 0,
        penalties: form.penalties ? Number(form.penalties) : 0,
        notes: form.notes || null,
      });
      toast?.success?.('Payroll generated');
      setOpen(false);
      load();
    } catch (e) {
      toast?.error?.(e?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const markPaid = async (id) => {
    try {
      await payrollService.markPaid(id);
      toast?.success?.('Marked as paid');
      load();
    } catch (e) {
      toast?.error?.('Failed to update');
    }
  };

  const exportPayslip = (p) => {
    const html = buildReportHtml({
      title: `Payslip — ${p.payrollMonth}`,
      subtitle: `Driver #${p.driverId} · Status: ${p.status}`,
      columns: [{ key: 'label', label: 'Item' }, { key: 'value', label: 'Amount' }],
      rows: [
        { label: 'Base Salary', value: formatCurrency(p.baseSalary) },
        { label: 'Present Days', value: p.presentDays },
        { label: 'Absent Days', value: p.absentDays },
        { label: 'Leave Days', value: p.leaveDays },
        { label: 'Overtime', value: `${p.overtimeMinutes} min (${formatCurrency(p.overtimeAmount)})` },
        { label: 'Incentives', value: formatCurrency(p.incentives) },
        { label: 'Penalties', value: formatCurrency(p.penalties) },
      ],
      totalsRow: { label: 'Net Salary', value: formatCurrency(p.netSalary) },
    });
    exportHtmlAsPdf(html, `payslip-${p.payrollMonth}`).catch(() => toast?.error?.('Export failed'));
  };

  return (
    <ScreenWrapper paddingHorizontal={0} onRefresh={onRefresh} refreshing={refreshing}
      header={
        <AppHeader title="Payroll" subtitle={driver.licenseNumber ? `License ${driver.licenseNumber}` : `Driver #${driver.driverId}`}
          variant="primary" showBack actions={[{ iconName: 'add', onPress: () => setOpen(true) }]} />
      }
    >
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.payrollId)}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 14, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <AppCard style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <AppText variant="bodyMedium">{item.payrollMonth}</AppText>
                <AppText variant="caption" color={COLORS.textSecondary}>
                  {item.presentDays} present · {item.absentDays} absent · {item.leaveDays} leave
                </AppText>
              </View>
              <AppBadge label={item.status} variant={item.status === 'PAID' ? 'success' : 'warning'} size="sm" />
            </View>
            <AppText variant="h5" style={{ marginTop: 8 }}>{formatCurrency(item.netSalary)}</AppText>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              {item.status !== 'PAID' && (
                <AppButton label="Mark Paid" size="sm" variant="primary" onPress={() => markPaid(item.payrollId)} style={{ marginRight: 8 }} />
              )}
              <AppButton label="Payslip PDF" size="sm" variant="outline" leftIcon="document-text-outline" onPress={() => exportPayslip(item)} />
            </View>
          </AppCard>
        )}
        ListEmptyComponent={
          !loading && (
            <AppEmptyState variant="no-data" title="No payroll generated"
              subtitle="Generate a monthly payroll from this driver's attendance records."
              cta={{ label: 'Generate Payroll', onPress: () => setOpen(true), icon: '💰' }} />
          )
        }
      />

      <AppModal visible={open} onClose={() => setOpen(false)} title="Generate Payroll" position="bottom">
        <AppInput label="Month (YYYY-MM)" value={form.month} onChangeText={set('month')} />
        <AppInput label="Incentives (₹)" value={form.incentives} onChangeText={set('incentives')} keyboardType="numeric" />
        <AppInput label="Penalties (₹)" value={form.penalties} onChangeText={set('penalties')} keyboardType="numeric" />
        <AppInput label="Notes" value={form.notes} onChangeText={set('notes')} />
        <AppText variant="caption" color={COLORS.textSecondary} style={{ marginBottom: 8 }}>
          Calculated automatically from this driver's attendance and monthly salary. Safe to re-generate — it recalculates in place.
        </AppText>
        <AppButton label="Generate" onPress={generate} loading={generating} />
      </AppModal>
    </ScreenWrapper>
  );
}
