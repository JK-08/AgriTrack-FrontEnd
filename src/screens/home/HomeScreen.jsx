import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';

import AppHeader from '../../components/ui/appcomponents/AppHeader';
import AppGoldPriceCard from '../../components/ui/appcomponents/AppGoldPriceCard';
import AppSchemeCard from '../../components/ui/AppSchemeCard';
import AppCard from '../../components/ui/appcomponents/AppCard';
import AppText from '../../components/ui/appcomponents/AppText';
import AppButton from '../../components/ui/appcomponents/AppButton';
import AppIcon from '../../components/ui/appcomponents/AppIcons';
import AppDivider from '../../components/ui/appcomponents/AppDivider';
import AppLoader from '../../components/ui/appcomponents/AppLoader';
import { useToast } from '../../components/ui/Toast';
import { useLanguage } from '../../providers/LanguageProvider';
import Sidebar from '../../components/Sidebar';

export default function HomeScreen() {
  const { COLORS, SIZES } = useTheme();
  const toast = useToast();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portfolioLoading, setPortfolioLoading] = useState(false);

  const featuredSchemes = [
    {
      id: '1',
      name: 'DigiGold SIP',
      description: 'Invest as low as ₹100/month in 24K digital gold. Auto-debit enabled.',
      category: 'Investment',
      status: 'trending',
      purity: '24K',
      returns: '12.4%',
      minAmount: 100,
      duration: '11 months',
      rating: 4.7,
      reviewCount: 2340,
      tags: ['Tax Saving', 'Auto-debit', 'Flexible'],
      progress: 68,
      isFeatured: true,
    },
    {
      id: '2',
      name: 'Gold Chit Fund',
      description: 'Traditional chit fund backed by 22K gold. Monthly instalment plan.',
      category: 'Chit',
      status: 'active',
      purity: '22K',
      returns: '10.8%',
      minAmount: 500,
      duration: '12 months',
      rating: 4.3,
      reviewCount: 980,
      tags: ['Chit', 'Monthly'],
      monthlyAmount: 500,
      nextDueDate: '15 Jun 2026',
      accumulatedAmount: 3000,
    },
    {
      id: '3',
      name: 'Jewellery Savings',
      description: 'Save monthly and redeem as jewellery. 18K gold scheme.',
      category: 'Jewellery',
      status: 'new',
      purity: '18K',
      returns: '9.5%',
      minAmount: 250,
      tags: ['Jewellery', 'Redeem'],
    },
  ];

  const handleBuy    = () => toast.success('Buy Gold',  { message: 'Redirecting to purchase...' });
  const handleSell   = () => toast.warning('Sell Gold', { message: 'Confirm quantity and price.' });
  const handleSIP    = () => toast.info('Start SIP',    { message: 'Choose monthly amount.' });
  const handleRedeem = () => toast.info('Redeem',       { message: 'Check your redeemable balance.' });

  const portfolioStats = {
    totalInvested: '₹21,500',
    currentValue:  '₹23,606',
    totalReturns:  '+9.8%',
    goldHolding:   '12.5g',
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>

      <AppHeader
        title="DigiGold"
        subtitle={t('welcome') || 'Welcome back, Raj'}
        variant="primary"
        actions={[
          { iconName: 'menu-outline', onPress: () => setSidebarOpen(true) },
          { iconName: 'notifications-outline', onPress: () => toast.info('No new notifications') },
        ]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding.container,
          paddingBottom: 40,
          gap: 24,
        }}
      >
        <AppGoldPriceCard
          rates={{ '24K': 6325, '22K': 5798, '18K': 4744 }}
          change={{ '24K': 1.2, '22K': -0.4, '18K': 0.9 }}
          sparkline={{
            '24K': [6100, 6150, 6080, 6200, 6280, 6310, 6325],
            '22K': [5860, 5840, 5880, 5820, 5800, 5810, 5798],
            '18K': [4580, 4610, 4570, 4640, 4700, 4730, 4744],
          }}
          updatedAt="Today, 10:32 AM"
          onBuy={(k) => toast.success(`Buy ${k} Gold`, { message: `₹${k === '24K' ? '6,325' : k === '22K' ? '5,798' : '4,744'}/gram` })}
          onSell={(k) => toast.warning(`Sell ${k} Gold`, { message: 'Confirm in next step.' })}
          onRefresh={() => {
            toast.info('Refreshing rates...');
            setTimeout(() => toast.success('Rates updated'), 1000);
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <QuickAction icon="add-circle-outline"  label="Buy"    onPress={handleBuy} />
          <QuickAction icon="trending-up-outline" label="Sell"   onPress={handleSell} />
          <QuickAction icon="repeat-outline"      label="SIP"    onPress={handleSIP} />
          <QuickAction icon="gift-outline"        label="Redeem" onPress={handleRedeem} />
        </View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <AppText variant="h5">Featured Schemes</AppText>
            <TouchableOpacity onPress={() => toast.info('View all schemes')}>
              <AppText variant="captionBold" style={{ color: COLORS.primary }}>View all →</AppText>
            </TouchableOpacity>
          </View>
          {featuredSchemes.map((scheme) => (
            <AppSchemeCard
              key={scheme.id}
              scheme={scheme}
              onPress={(id) => toast.info(`View details of ${id}`)}
              onBuy={(id) => toast.success(`Started ${id} investment`)}
              onDetails={(id) => toast.info(`Details: ${id}`)}
              onWishlistToggle={(id, wished) => toast.info(wished ? 'Added to wishlist' : 'Removed from wishlist')}
              style={{ marginBottom: 12 }}
            />
          ))}
        </View>

        <AppCard variant="gold" padding="md">
          <AppText variant="h5" style={{ marginBottom: 12 }}>Your Portfolio</AppText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <PortfolioStat label="Total Invested" value={portfolioStats.totalInvested} />
            <PortfolioStat label="Current Value"  value={portfolioStats.currentValue} />
            <PortfolioStat label="Returns"         value={portfolioStats.totalReturns} isPositive />
          </View>
          <AppDivider color={COLORS.secondary} thickness={1} style={{ marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <AppText variant="body">Gold Holding</AppText>
            <AppText variant="h5" style={{ color: COLORS.primary }}>{portfolioStats.goldHolding}</AppText>
          </View>
          <AppButton
            label="View Detailed Portfolio"
            variant="outline"
            size="sm"
            leftIcon="bar-chart-outline"
            onPress={() => {
              setPortfolioLoading(true);
              setTimeout(() => {
                setPortfolioLoading(false);
                toast.success('Portfolio loaded');
              }, 1500);
            }}
            style={{ marginTop: 16 }}
          />
        </AppCard>

        <TouchableOpacity
          onPress={() => toast.gold('Refer & Earn', { message: 'Share code GOLD2026 and get 1g free!' })}
          style={{
            backgroundColor: '#FFF3E0',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.secondary,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <AppIcon name="gift-outline" variant="gold" size={28} />
          <View style={{ flex: 1 }}>
            <AppText variant="bodyMedium" style={{ fontWeight: 'bold' }}>Refer a Friend, Get 1g Gold Free!</AppText>
            <AppText variant="caption">Share your code and earn rewards.</AppText>
          </View>
          <AppIcon name="chevron-forward-outline" variant="ghost" />
        </TouchableOpacity>

      </ScrollView>

      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AppLoader visible={portfolioLoading} mode="overlay" message="Loading portfolio..." />

    </View>
  );
}

const QuickAction = ({ icon, label, onPress }) => {
  const { COLORS } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: COLORS.card,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <AppIcon name={icon} variant="primary" size={24} />
      <AppText variant="captionBold" style={{ marginTop: 4 }}>{label}</AppText>
    </TouchableOpacity>
  );
};

const PortfolioStat = ({ label, value, isPositive }) => {
  const { COLORS, FONTS } = useTheme();
  const valueColor = isPositive && value.includes('+') ? COLORS.success : COLORS.textPrimary;
  return (
    <View style={{ alignItems: 'center' }}>
      <AppText variant="caption" style={{ color: COLORS.textSecondary }}>{label}</AppText>
      <AppText variant="bodyMedium" style={{ fontWeight: FONTS.weight.semiBold, color: valueColor, marginTop: 4 }}>
        {value}
      </AppText>
    </View>
  );
};
