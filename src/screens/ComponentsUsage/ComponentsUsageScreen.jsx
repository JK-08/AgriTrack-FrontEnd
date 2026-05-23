import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTheme } from '../../theme';

import AppButton from '../../components/ui/appcomponents/AppButton';
import AppInput from '../../components/ui/appcomponents/AppInput';
import AppCard from '../../components/ui/appcomponents/AppCard';
import AppText from '../../components/ui/appcomponents/AppText';
import AppBadge from '../../components/ui/appcomponents/AppBadge';
import AppChip from '../../components/ui/appcomponents/AppChip';
import AppAvatar from '../../components/ui/appcomponents/AppAvatar';
import AppDivider from '../../components/ui/appcomponents/AppDivider';
import AppLoader from '../../components/ui/appcomponents/AppLoader';
import AppModal from '../../components/ui/appcomponents/AppModal';
import AppIcon from '../../components/ui/appcomponents/AppIcons';
import AppHeader from '../../components/ui/appcomponents/AppHeader';
import AppGoldPriceCard from '../../components/ui/appcomponents/AppGoldPriceCard';
import AppBottomSheet from '../../components/ui/appcomponents/AppBottomSheet';
import AppOTPInput from '../../components/ui/appcomponents/AppOTPInput';
import AppPinInput from '../../components/ui/appcomponents/AppPinInput';
import AppSearchBar from '../../components/ui/appcomponents/AppSearchBar';
import AppEmptyState from '../../components/ui/appcomponents/AppEmptyState';
import AppSchemeCard from '../../components/ui/AppSchemeCard';
import AppSkeletonLoader, { SkeletonBox, SkeletonCircle, SkeletonText } from '../../components/ui/appcomponents/AppSkeletonLoader';
import AppRadio, { AppRadioItem } from '../../components/ui/appcomponents/AppRadio';
import AppCheckbox from '../../components/ui/appcomponents/AppCheckbox';
import AppSwitch from '../../components/ui/appcomponents/AppSwitch';
import ScreenWrapper from '../../components/ui/appcomponents/ScreenWrapper';
import KeyboardWrapper from '../../components/ui/appcomponents/KeyboardWrapper';
import { AppProgressBar, AppProgressSteps } from '../../components/ui/appcomponents/AppProgressBar';
import AppExportSheet from '../../components/ui/appcomponents/Appexportsheet';
import AppLanguagePicker from '../../components/ui/appcomponents/AppLanguage';
import { Asset } from 'expo-asset';
import * as LegacyFS from 'expo-file-system/legacy';

import Sidebar from '../../components/Sidebar';
import CustomAlert from '../../components/ui/CustomAlert';
import { useToast } from '../../components/ui/Toast';
import { useLanguage } from '../../providers/LanguageProvider';

export default function ComponentsUsageScreen() {
  const { COLORS, FONTS, SIZES, SHADOWS } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [passVal, setPassVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [selectedChips, setSelectedChips] = useState(['Gold SIP']);
  const [centerModal, setCenterModal] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '' });

  const sheetRef = useRef(null);
  const otpRef   = useRef(null);
  const pinRef   = useRef(null);
  const [otpError, setOtpError]     = useState(false);
  const [otpErrMsg, setOtpErrMsg]   = useState('');
  const [pinError, setPinError]     = useState(false);
  const [pinErrMsg, setPinErrMsg]   = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [kycStep, setKycStep] = useState(1);
  const [skeletonType, setSkeletonType] = useState('card');

  const [radioVal, setRadioVal]   = useState('sip');
  const [radioGold, setRadioGold] = useState('24k');
  const [radioSize, setRadioSize] = useState('md');

  const [cbTerms, setCbTerms]   = useState(false);
  const [cbSIP, setCbSIP]       = useState(true);
  const [cbNotify, setCbNotify] = useState(false);
  const [cbInter, setCbInter]   = useState(false);

  const [swNotify, setSwNotify]       = useState(true);
  const [swBiometric, setSwBiometric] = useState(false);
  const [swAutoSIP, setSwAutoSIP]     = useState(true);
  const [swDarkMode, setSwDarkMode]   = useState(false);

  const [langSheet, setLangSheet]   = useState(false);
  const [langCode, setLangCode]     = useState('en');
  const [langInline, setLangInline] = useState('hi');
  const [langChips, setLangChips]   = useState('ta');

  const [exportVisible, setExportVisible] = useState(false);
  const [exportData, setExportData]       = useState(null);
  const [exportFilename, setExportFilename] = useState('export');
  const [logob64, setLogob64] = useState('');
  const [iconb64, setIconb64] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [logoAsset, iconAsset] = await Asset.loadAsync([
          require('../../../assets/logo.png'),
          require('../../../assets/icon.png'),
        ]);
        const [lb, ib] = await Promise.all([
          LegacyFS.readAsStringAsync(logoAsset.localUri, { encoding: LegacyFS.EncodingType.Base64 }),
          LegacyFS.readAsStringAsync(iconAsset.localUri, { encoding: LegacyFS.EncodingType.Base64 }),
        ]);
        setLogob64(lb);
        setIconb64(ib);
      } catch {}
    })();
  }, []);

  const [kwName, setKwName]         = useState('');
  const [kwEmail, setKwEmail]       = useState('');
  const [kwRefreshing, setKwRefreshing] = useState(false);

  const SCHEMES = [
    { id: '1', name: 'DigiGold SIP', description: 'Invest as low as ₹100/month in 24K digital gold.', category: 'Investment', status: 'trending', purity: '24K', returns: '12.4%', minAmount: 100, duration: '11 months', rating: 4.7, reviewCount: 2340, tags: ['Tax Saving', 'Auto-debit', 'Flexible'], progress: 68, isFeatured: true },
    { id: '2', name: 'Gold Chit Fund', description: 'Traditional chit fund backed by 22K gold.', category: 'Chit', status: 'active', purity: '22K', returns: '10.8%', minAmount: 500, duration: '12 months', rating: 4.3, reviewCount: 980, tags: ['Chit', 'Monthly'], monthlyAmount: 500, nextDueDate: '15 Jun 2026', accumulatedAmount: 3000 },
    { id: '3', name: 'Jewellery Savings', description: 'Save monthly and redeem as jewellery.', category: 'Jewellery', status: 'new', purity: '18K', returns: '9.5%', minAmount: 250, tags: ['Jewellery', 'Redeem'] },
    { id: '4', name: 'Gold Bonds', description: 'Government-backed sovereign gold bonds.', category: 'Bonds', status: 'closing', purity: '24K', returns: '8.0%', minAmount: 1000, rating: 4.9, reviewCount: 5120 },
    { id: '5', name: 'Legacy Gold Plan', description: 'This scheme has ended. Redeem your gold now.', category: 'Savings', status: 'expired', purity: '22K', returns: '11.2%', minAmount: 200 },
  ];

  const toast = useToast();
  const { t } = useLanguage();

  const showAlert = (props) => setAlert({ ...props, visible: true, title: props.title ?? '' });
  const hideAlert = () => setAlert(prev => ({ ...prev, visible: false }));

  const chips = ['Gold SIP', 'Buy Gold', 'Sell Gold', 'History', 'Offers'];

  const S = {
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll:    { padding: SIZES.padding.container, paddingBottom: 60 },
    section:   { marginTop: SIZES.margin.lg, marginBottom: SIZES.margin.sm },
    row:       { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    gap:       { marginBottom: SIZES.margin.sm },
    spacer:    { height: SIZES.margin.sm },
  };

  return (
    <View style={S.container}>
      <AppHeader
        title="DigiGold"
        subtitle={t('welcome')}
        variant="primary"
        actions={[
          { iconName: 'menu-outline', onPress: () => setSidebarOpen(true) },
          { iconName: 'notifications-outline', onPress: () => {}, badge: 3 },
        ]}
      />

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>

        <AppText variant="h5" style={S.section}>0. AppGoldPriceCard</AppText>
        <AppGoldPriceCard
          rates={{ '24K': 6325, '22K': 5798, '18K': 4744 }}
          change={{ '24K': 1.2, '22K': -0.4, '18K': 0.9 }}
          sparkline={{ '24K': [6100,6150,6080,6200,6280,6310,6325], '22K': [5860,5840,5880,5820,5800,5810,5798], '18K': [4580,4610,4570,4640,4700,4730,4744] }}
          updatedAt="Today, 10:32 AM"
          onBuy={(k) => toast.success(`Buying ${k} Gold`)}
          onSell={(k) => toast.warning(`Selling ${k} Gold`)}
          onRefresh={() => toast.info('Rates refreshed')}
        />

        <AppText variant="h5" style={S.section}>1. AppText Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <AppText variant="h4">Heading H4</AppText>
          <AppText variant="h5">Heading H5</AppText>
          <AppText variant="bodyLarge">Body Large</AppText>
          <AppText variant="body">Body Regular</AppText>
          <AppText variant="caption">Caption</AppText>
          <AppText variant="goldText">Gold Text ✦</AppText>
        </AppCard>

        <AppText variant="h5" style={S.section}>2. AppButton Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <View style={S.gap}><AppButton label="Primary" variant="primary" onPress={() => {}} /></View>
          <View style={S.gap}><AppButton label="Gold" variant="gold" onPress={() => {}} /></View>
          <View style={S.gap}><AppButton label="Outline" variant="outline" onPress={() => {}} /></View>
          <View style={S.gap}><AppButton label="Loading" loading onPress={() => {}} /></View>
        </AppCard>

        <AppText variant="h5" style={S.section}>3. AppInput</AppText>
        <AppCard variant="outlined" padding="md">
          <AppInput label="Full Name" placeholder="Enter name" leftIcon="person-outline" value={inputVal} onChangeText={setInputVal} />
          <View style={S.spacer} />
          <AppInput label="Password" placeholder="Enter password" leftIcon="lock-closed-outline" isPassword value={passVal} onChangeText={setPassVal} />
        </AppCard>

        <AppText variant="h5" style={S.section}>10. AppLoader</AppText>
        <AppCard variant="outlined" padding="md">
          <View style={S.row}><AppLoader mode="inline" size="sm" /><AppLoader mode="inline" size="md" /><AppLoader mode="inline" size="lg" /></View>
          <AppDivider label="Overlay" marginVertical={10} />
          <AppButton label="Show Overlay (3s)" variant="primary" onPress={() => { setLoaderVisible(true); setTimeout(() => setLoaderVisible(false), 3000); }} />
        </AppCard>

        <AppText variant="h5" style={S.section}>11. AppModal</AppText>
        <AppCard variant="outlined" padding="md">
          <View style={S.gap}><AppButton label="Center Modal" variant="primary" onPress={() => setCenterModal(true)} /></View>
          <AppButton label="Bottom Sheet Modal" variant="outline" onPress={() => setBottomModal(true)} />
        </AppCard>

        <AppText variant="h5" style={S.section}>13. Toast</AppText>
        <AppCard variant="outlined" padding="md">
          <View style={S.gap}><AppButton label="✅ Success" variant="primary" onPress={() => toast.success('Gold purchased!')} /></View>
          <View style={S.gap}><AppButton label="❌ Error" variant="danger" onPress={() => toast.error('Transaction Failed')} /></View>
          <View style={S.gap}><AppButton label="✦ Gold" variant="gold" onPress={() => toast.gold('Premium Offer!')} /></View>
        </AppCard>

        <AppText variant="h5" style={S.section}>26. AppSchemeCard</AppText>
        <AppSchemeCard scheme={SCHEMES[0]} onPress={(id) => toast.info(`Pressed ${id}`)} onBuy={(id) => toast.success('SIP started!')} style={{ marginBottom: 14 }} />
        <AppSchemeCard variant="horizontal" scheme={SCHEMES[1]} onPress={(id) => toast.info(`Horizontal: ${id}`)} style={{ marginBottom: 14 }} />

      </ScrollView>

      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AppLoader visible={loaderVisible} mode="overlay" message="Loading…" />

      <AppModal visible={centerModal} onClose={() => setCenterModal(false)} title="Gold Investment" position="center">
        <AppButton label="Start SIP" variant="primary" onPress={() => setCenterModal(false)} />
      </AppModal>

      <AppModal visible={bottomModal} onClose={() => setBottomModal(false)} title="Quick Actions" position="bottom">
        <AppButton label="Buy Gold" variant="gold" onPress={() => setBottomModal(false)} />
      </AppModal>

      <AppBottomSheet ref={sheetRef} snapPoints={['50%', '90%']} title="Quick Invest" showCloseButton scrollable>
        <AppButton label="Buy Gold" variant="gold" onPress={() => sheetRef.current?.close()} />
      </AppBottomSheet>

      <CustomAlert {...alert} onDismiss={hideAlert} />

      <AppLanguagePicker mode="sheet" visible={langSheet} onClose={() => setLangSheet(false)} selectedCode={langCode} onSelect={(code) => { setLangCode(code); setLangSheet(false); }} />

      {exportData && (
        <AppExportSheet visible={exportVisible} onClose={() => setExportVisible(false)} data={exportData} filename={exportFilename} />
      )}
    </View>
  );
}
