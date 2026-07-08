import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import StatCard from '../../../components/agri/StatCard';
import SectionHeader from '../../../components/agri/SectionHeader';
import { useAuth } from '../../../providers/AuthProvider';
import { expenseService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';
import { exportHtmlAsPdf, buildReportHtml } from '../../../utils/exportHelpers';

const CATEGORY_LABEL = {
  FUEL: 'Fuel', REPAIRS: 'Repairs', SPARE_PARTS: 'Spare Parts', INSURANCE: 'Insurance',
  DRIVER_SALARY: 'Driver Salary', EMI: 'EMI', TAXES: 'Taxes', MISC: 'Misc',
};

function RevenueExpenseBars({ monthly }) {
  const { COLORS } = useTheme();
  const max = Math.max(1, ...monthly.flatMap((m) => [Number(m.revenue) || 0, Number(m.expenses) || 0]));
  return (
    <View>
      {monthly.map((m) => (
        <View key={m.month} style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <AppText variant="caption" color={COLORS.textSecondary}>{m.month}</AppText>
            <AppText variant="caption" color={Number(m.profit) >= 0 ? COLORS.success : COLORS.error}>
              {formatCurrency(m.profit)}
            </AppText>
          </View>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: COLORS.borderLight, marginBottom: 3 }}>
            <View style={{ height: 8, borderRadius: 4, width: `${(Number(m.revenue) / max) * 100}%`, backgroundColor: COLORS.success }} />
          </View>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: COLORS.borderLight }}>
            <View style={{ height: 8, borderRadius: 4, width: `${(Number(m.expenses) / max) * 100}%`, backgroundColor: COLORS.error ?? COLORS.warning }} />
          </View>
        </View>
      ))}
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <View style={styles.legendDot(COLORS.success)} />
        <AppText variant="caption" color={COLORS.textSecondary} style={{ marginRight: 14 }}>Revenue</AppText>
        <View style={styles.legendDot(COLORS.error ?? COLORS.warning)} />
        <AppText variant="caption" color={COLORS.textSecondary}>Expenses</AppText>
      </View>
    </View>
  );
}

export default function ProfitLossScreen() {
  const { COLORS, SIZES } = useTheme();
  const { ownerId } = useAuth();
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try { setData(await expenseService.profitLoss(ownerId)); } catch (e) {}
  }, [ownerId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const categoryRows = data?.expensesByCategory
    ? Object.entries(data.expensesByCategory).filter(([, v]) => Number(v) > 0).sort((a, b) => Number(b[1]) - Number(a[1]))
    : [];
  const categoryMax = Math.max(1, ...categoryRows.map(([, v]) => Number(v)));

  const exportPdf = () => {
    if (!data) return;
    const html = buildReportHtml({
      title: 'Profit & Loss Report',
      subtitle: `${data.from} to ${data.to}`,
      columns: [{ key: 'label', label: 'Item' }, { key: 'value', label: 'Amount' }],
      rows: [
        { label: 'Total Revenue', value: formatCurrency(data.totalRevenue) },
        { label: 'Total Expenses', value: formatCurrency(data.totalExpenses) },
        { label: 'Net Profit', value: formatCurrency(data.netProfit) },
        ...categoryRows.map(([cat, amt]) => ({ label: CATEGORY_LABEL[cat] || cat, value: formatCurrency(amt) })),
      ],
    });
    exportHtmlAsPdf(html, 'profit-loss');
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0} onRefresh={onRefresh} refreshing={refreshing}
      header={<AppHeader title="Profit & Loss" subtitle="Revenue vs. expenses" variant="primary" showBack
        actions={[{ iconName: 'download-outline', onPress: exportPdf }]} />}>
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        {!data ? (
          <AppCard style={{ alignItems: 'center', paddingVertical: 40 }}>
            <AppText variant="bodySmall" color={COLORS.textSecondary}>Loading…</AppText>
          </AppCard>
        ) : (
          <>
            <View style={{ flexDirection: 'row' }}>
              <StatCard icon="trending-up" label="Revenue" tint={COLORS.success} value={formatCurrency(data.totalRevenue)} />
              <View style={{ width: 12 }} />
              <StatCard icon="trending-down" label="Expenses" tint={COLORS.error ?? COLORS.warning} value={formatCurrency(data.totalExpenses)} />
            </View>
            <View style={{ marginTop: 12 }}>
              <StatCard icon="wallet" label="Net Profit" tint={Number(data.netProfit) >= 0 ? COLORS.primary : COLORS.error}
                value={formatCurrency(data.netProfit)} />
            </View>

            <SectionHeader title="Revenue vs Expenses (6 months)" />
            <AppCard>
              {(data.monthlyBreakdown?.length ?? 0) === 0 ? (
                <AppText variant="bodySmall" color={COLORS.textSecondary}>No data yet.</AppText>
              ) : (
                <RevenueExpenseBars monthly={data.monthlyBreakdown} />
              )}
            </AppCard>

            <SectionHeader title="Expenses by Category" />
            <AppCard>
              {categoryRows.length === 0 ? (
                <AppText variant="bodySmall" color={COLORS.textSecondary}>No expenses recorded yet.</AppText>
              ) : (
                categoryRows.map(([cat, amt]) => (
                  <View key={cat} style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <AppText variant="bodySmall">{CATEGORY_LABEL[cat] || cat}</AppText>
                      <AppText variant="caption">{formatCurrency(amt)}</AppText>
                    </View>
                    <View style={{ height: 8, borderRadius: 4, backgroundColor: COLORS.borderLight }}>
                      <View style={{ height: 8, borderRadius: 4, width: `${(Number(amt) / categoryMax) * 100}%`, backgroundColor: COLORS.primary }} />
                    </View>
                  </View>
                ))
              )}
            </AppCard>

            <AppButton label="Export PDF Report" leftIcon="document-text-outline" variant="outline"
              onPress={exportPdf} style={{ marginTop: 16, marginBottom: 8 }} />
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = {
  legendDot: (color) => ({ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: 6, alignSelf: 'center' }),
};
