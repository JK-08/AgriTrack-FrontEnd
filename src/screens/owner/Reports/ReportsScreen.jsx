import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import { AppSkeletonCard } from '../../../components/ui/appcomponents/AppSkeleton';
import StatCard from '../../../components/agri/StatCard';
import SectionHeader from '../../../components/agri/SectionHeader';
import { useAuth } from '../../../providers/AuthProvider';
import { reportService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';
import { exportRowsAsCsv, exportRowsAsExcel, exportHtmlAsPdf, buildReportHtml } from '../../../utils/exportHelpers';

function Row({ left, right }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <AppText variant="bodySmall" numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>{left}</AppText>
      <AppText variant="bodySmall" color={COLORS.textSecondary}>{right}</AppText>
    </View>
  );
}

function ExportRow({ onPdf, onExcel, onCsv }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
      <AppButton label="PDF" size="sm" variant="outline" leftIcon="document-text-outline" onPress={onPdf} style={{ marginRight: 8 }} />
      <AppButton label="Excel" size="sm" variant="outline" leftIcon="grid-outline" onPress={onExcel} style={{ marginRight: 8 }} />
      <AppButton label="CSV" size="sm" variant="outline" leftIcon="download-outline" onPress={onCsv} />
    </ScrollView>
  );
}

const HOUR_LABEL = (h) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'AM' : 'PM'}`;

export default function ReportsScreen() {
  const { COLORS } = useTheme();
  const navigation = useNavigation();
  const { ownerId } = useAuth();
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState({});
  const [advanced, setAdvanced] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    setError(false);
    try {
      const [s, r, a] = await Promise.all([
        reportService.ownerSummary(ownerId),
        reportService.revenue(ownerId),
        reportService.advanced(ownerId),
      ]);
      setSummary(s); setRevenue(r?.revenueByDate || {}); setAdvanced(a);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const rows = Object.entries(revenue).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 10);
  const max = Math.max(1, ...rows.map(([, v]) => Number(v)));

  const driverRows = () => (advanced?.driverPerformance || []).map((d) => ({
    Driver: d.licenseNumber || `Driver #${d.driverId}`,
    'Completed Jobs': d.completedJobs,
    'Hours Worked': (d.totalMinutesWorked / 60).toFixed(1),
    Revenue: d.revenueGenerated,
  }));
  const tractorRows = () => (advanced?.tractorUtilization || []).map((t) => ({
    Tractor: t.model || `#${t.tractorId}`,
    Registration: t.registrationNumber || '',
    'Completed Jobs': t.completedJobs,
    'Hours Used': (t.totalMinutesUsed / 60).toFixed(1),
    Revenue: t.revenueGenerated,
  }));
  const customerRows = () => (advanced?.topCustomers || []).map((c) => ({
    Customer: c.name, Bookings: c.bookingCount, 'Total Spent': c.totalSpent,
  }));
  const maintenanceRows = () => (advanced?.maintenanceCosts || []).map((m) => ({
    Tractor: m.model || `#${m.tractorId}`, Services: m.serviceCount, 'Total Cost': m.totalCost,
  }));

  const exportSection = (title, rows, columns) => ({
    pdf: () => exportHtmlAsPdf(buildReportHtml({ title, columns, rows }), title.toLowerCase().replace(/\s+/g, '-')),
    excel: () => exportRowsAsExcel(rows, title.toLowerCase().replace(/\s+/g, '-')),
    csv: () => exportRowsAsCsv(rows, title.toLowerCase().replace(/\s+/g, '-')),
  });

  const driverCols = [{ key: 'Driver', label: 'Driver' }, { key: 'Completed Jobs', label: 'Jobs' }, { key: 'Hours Worked', label: 'Hours' }, { key: 'Revenue', label: 'Revenue' }];
  const tractorCols = [{ key: 'Tractor', label: 'Tractor' }, { key: 'Registration', label: 'Reg. No' }, { key: 'Completed Jobs', label: 'Jobs' }, { key: 'Hours Used', label: 'Hours' }, { key: 'Revenue', label: 'Revenue' }];
  const customerCols = [{ key: 'Customer', label: 'Customer' }, { key: 'Bookings', label: 'Bookings' }, { key: 'Total Spent', label: 'Total Spent' }];
  const maintenanceCols = [{ key: 'Tractor', label: 'Tractor' }, { key: 'Services', label: 'Services' }, { key: 'Total Cost', label: 'Total Cost' }];

  if (loading && !summary) {
    return (
      <ScreenWrapper scroll paddingHorizontal={0}
        header={<AppHeader title="Reports" subtitle="Business performance & analytics" variant="primary" showBack />}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <AppSkeletonCard lines={2} />
          <AppSkeletonCard lines={3} />
          <AppSkeletonCard lines={3} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper paddingHorizontal={0}
        header={<AppHeader title="Reports" subtitle="Business performance & analytics" variant="primary" showBack />}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <AppEmptyState variant="error" cta={{ label: 'Try Again', onPress: load, variant: 'outline' }} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Reports" subtitle="Business performance & analytics" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Analytics')} style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
          <AppText variant="bodySmall" color={COLORS.primary}>View Advanced Analytics ›</AppText>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <StatCard icon="cash" tint={COLORS.success} label="Revenue" value={formatCurrency(summary?.totalRevenue)} />
          <View style={{ width: 12 }} />
          <StatCard icon="time" tint={COLORS.warning} label="Pending" value={formatCurrency(summary?.pendingDue)} />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <StatCard icon="construct" tint={COLORS.primary} label="Total Jobs" value={summary?.totalWorks ?? 0} />
          <View style={{ width: 12 }} />
          <StatCard icon="star" tint={COLORS.secondary} label="Avg Rating" value={summary?.averageRating ?? 0} />
        </View>

        <SectionHeader title="Revenue (recent days)" />
        <AppCard>
          {rows.length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No revenue data yet.</AppText>
          ) : rows.map(([date, val]) => (
            <View key={date} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <AppText variant="caption" color={COLORS.textSecondary}>{date}</AppText>
                <AppText variant="caption">{formatCurrency(val)}</AppText>
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: COLORS.borderLight }}>
                <View style={{ height: 8, borderRadius: 4, width: `${(Number(val) / max) * 100}%`, backgroundColor: COLORS.primary }} />
              </View>
            </View>
          ))}
        </AppCard>

        <SectionHeader title="Driver Performance" />
        <AppCard>
          {(advanced?.driverPerformance || []).length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No completed jobs yet.</AppText>
          ) : advanced.driverPerformance.map((d) => (
            <Row key={d.driverId} left={d.licenseNumber || `Driver #${d.driverId}`}
              right={`${d.completedJobs} jobs · ${(d.totalMinutesWorked / 60).toFixed(1)}h · ${formatCurrency(d.revenueGenerated)}`} />
          ))}
          <ExportRow
            onPdf={() => exportSection('Driver Performance', driverRows(), driverCols).pdf()}
            onExcel={() => exportSection('Driver Performance', driverRows(), driverCols).excel()}
            onCsv={() => exportSection('Driver Performance', driverRows(), driverCols).csv()} />
        </AppCard>

        <SectionHeader title="Tractor Utilization" />
        <AppCard>
          {(advanced?.tractorUtilization || []).length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No completed jobs yet.</AppText>
          ) : advanced.tractorUtilization.map((t) => (
            <Row key={t.tractorId} left={t.model || `Tractor #${t.tractorId}`}
              right={`${t.completedJobs} jobs · ${(t.totalMinutesUsed / 60).toFixed(1)}h`} />
          ))}
          <ExportRow
            onPdf={() => exportSection('Tractor Utilization', tractorRows(), tractorCols).pdf()}
            onExcel={() => exportSection('Tractor Utilization', tractorRows(), tractorCols).excel()}
            onCsv={() => exportSection('Tractor Utilization', tractorRows(), tractorCols).csv()} />
        </AppCard>

        <SectionHeader title="Booking Analytics" />
        <AppCard>
          <AppText variant="label" color={COLORS.textSecondary} style={{ marginBottom: 6 }}>BY STATUS</AppText>
          {Object.entries(advanced?.bookingAnalytics?.byStatus || {}).length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No bookings yet.</AppText>
          ) : Object.entries(advanced.bookingAnalytics.byStatus).map(([status, count]) => (
            <Row key={status} left={status} right={String(count)} />
          ))}
          {Object.keys(advanced?.bookingAnalytics?.byHourOfDay || {}).length > 0 && (
            <>
              <AppText variant="label" color={COLORS.textSecondary} style={{ marginTop: 10, marginBottom: 6 }}>PEAK BOOKING HOURS</AppText>
              {Object.entries(advanced.bookingAnalytics.byHourOfDay)
                .sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5)
                .map(([hour, count]) => <Row key={hour} left={HOUR_LABEL(Number(hour))} right={String(count)} />)}
            </>
          )}
        </AppCard>

        <SectionHeader title="Top Customers" />
        <AppCard>
          {(advanced?.topCustomers || []).length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No customer spend recorded yet.</AppText>
          ) : advanced.topCustomers.map((c) => (
            <Row key={c.customerId} left={c.name} right={`${c.bookingCount} bookings · ${formatCurrency(c.totalSpent)}`} />
          ))}
          <ExportRow
            onPdf={() => exportSection('Top Customers', customerRows(), customerCols).pdf()}
            onExcel={() => exportSection('Top Customers', customerRows(), customerCols).excel()}
            onCsv={() => exportSection('Top Customers', customerRows(), customerCols).csv()} />
        </AppCard>

        <SectionHeader title="Payment Analytics" />
        <AppCard>
          <AppText variant="label" color={COLORS.textSecondary} style={{ marginBottom: 6 }}>
            SUCCESS RATE: {advanced?.paymentAnalytics?.successRatePercent ?? 0}%
          </AppText>
          {Object.entries(advanced?.paymentAnalytics?.amountByMethod || {}).length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No payments recorded yet.</AppText>
          ) : Object.entries(advanced.paymentAnalytics.amountByMethod).map(([method, amt]) => (
            <Row key={method} left={method} right={formatCurrency(amt)} />
          ))}
        </AppCard>

        <SectionHeader title="Maintenance Cost" />
        <AppCard>
          {(advanced?.maintenanceCosts || []).length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No maintenance recorded yet.</AppText>
          ) : advanced.maintenanceCosts.map((m) => (
            <Row key={m.tractorId} left={m.model || `Tractor #${m.tractorId}`}
              right={`${m.serviceCount} services · ${formatCurrency(m.totalCost)}`} />
          ))}
          <ExportRow
            onPdf={() => exportSection('Maintenance Cost', maintenanceRows(), maintenanceCols).pdf()}
            onExcel={() => exportSection('Maintenance Cost', maintenanceRows(), maintenanceCols).excel()}
            onCsv={() => exportSection('Maintenance Cost', maintenanceRows(), maintenanceCols).csv()} />
        </AppCard>
      </View>
    </ScreenWrapper>
  );
}
