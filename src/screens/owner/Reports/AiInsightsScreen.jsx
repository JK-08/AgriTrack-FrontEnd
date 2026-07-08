import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import { AppSkeletonCard } from '../../../components/ui/appcomponents/AppSkeleton';
import SectionHeader from '../../../components/agri/SectionHeader';
import { useAuth } from '../../../providers/AuthProvider';
import { reportService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';

const SEVERITY_VARIANT = { SUCCESS: 'success', WARNING: 'warning', INFO: 'info' };

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function periodLabel(period) {
  const [, m] = period.split('-');
  return MONTH_SHORT[Number(m) - 1] || period;
}

export default function AiInsightsScreen() {
  const { COLORS } = useTheme();
  const { ownerId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    setError(false);
    try {
      const result = await reportService.insights(ownerId);
      setData(result);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading && !data) {
    return (
      <ScreenWrapper scroll paddingHorizontal={0}
        header={<AppHeader title="AI Insights" subtitle="Smart recommendations for your business" variant="primary" showBack />}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <AppSkeletonCard lines={2} />
          <AppSkeletonCard lines={3} />
          <AppSkeletonCard lines={4} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper paddingHorizontal={0}
        header={<AppHeader title="AI Insights" subtitle="Smart recommendations for your business" variant="primary" showBack />}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <AppEmptyState variant="error" cta={{ label: 'Try Again', onPress: load, variant: 'outline' }} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="AI Insights" subtitle="Smart recommendations for your business" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>

        <SectionHeader title="Business Insights" />
        {(data?.insights || []).map((insight, idx) => (
          <AppCard key={idx} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <AppText variant="label" style={{ flex: 1, marginRight: 8, fontWeight: '700' }}>{insight.title}</AppText>
              <AppBadge label={insight.severity} variant={SEVERITY_VARIANT[insight.severity] || 'neutral'} size="sm" />
            </View>
            <AppText variant="bodySmall" color={COLORS.textSecondary} style={{ marginTop: 6 }}>{insight.message}</AppText>
          </AppCard>
        ))}
        {(!data || (data.insights || []).length === 0) && (
          <AppCard><AppText variant="bodySmall" color={COLORS.textSecondary}>No insights yet — check back once you have more activity.</AppText></AppCard>
        )}

        <SectionHeader title="Revenue Forecast (next 3 months)" />
        <AppCard>
          {(data?.revenueForecast || []).length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>Not enough history to forecast yet.</AppText>
          ) : data.revenueForecast.map((p) => (
            <View key={p.period} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
              <AppText variant="bodySmall" color={COLORS.textSecondary}>{periodLabel(p.period)}</AppText>
              <AppText variant="bodySmall" style={{ fontWeight: '700' }}>{formatCurrency(p.estimatedRevenue)}</AppText>
            </View>
          ))}
          <AppText variant="caption" color={COLORS.textTertiary} style={{ marginTop: 8 }}>
            Estimated from a linear trend over your last 12 months of revenue.
          </AppText>
        </AppCard>

        <SectionHeader title="Recommended Tractors for Next Booking" />
        <AppCard>
          {(data?.recommendedTractors || []).length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No available tractors to recommend right now.</AppText>
          ) : data.recommendedTractors.map((r) => (
            <View key={r.tractorId} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight }}>
              <AppText variant="bodySmall" style={{ fontWeight: '700' }}>{r.model || `Tractor #${r.tractorId}`}</AppText>
              {!!r.registrationNumber && (
                <AppText variant="caption" color={COLORS.textTertiary}>{r.registrationNumber}</AppText>
              )}
              <AppText variant="caption" color={COLORS.textSecondary} style={{ marginTop: 2 }}>{r.reason}</AppText>
            </View>
          ))}
        </AppCard>
      </View>
    </ScreenWrapper>
  );
}
