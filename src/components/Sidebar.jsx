import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, TouchableWithoutFeedback,
  StyleSheet, Dimensions, Switch, StatusBar, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme';
import { useLanguage } from '../providers/LanguageProvider';
import AppLanguagePicker, { INDIAN_LANGUAGES } from './ui/appcomponents/AppLanguage';

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.75;

export default function Sidebar({ visible, onClose }) {
  const navigation = useNavigation();
  const { COLORS, FONTS, SIZES, SHADOWS, isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const selectedLang = INDIAN_LANGUAGES.find(l => l.code === language);

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef(Array.from({ length: 8 }, () => new Animated.Value(0))).current;

  const menuItems = [
    { icon: '🏠', label: t('home'),         description: t('dashboardOverview') },
    { icon: '📊', label: t('portfolio'),    description: t('trackAssets'),  badge: 'NEW' },
    { icon: '💰', label: t('buyGold'),      description: t('investInGold') },
    { icon: '📈', label: t('sellGold'),     description: t('liquidateHoldings') },
    { icon: '🔄', label: t('transactions'), description: t('viewHistory'),  badge: '3' },
    { icon: '👤', label: t('profile'),      description: t('manageAccount') },
    { icon: '⚙️', label: t('settings'),    description: t('preferences') },
    { icon: '🧩', label: 'Components',      description: 'UI components showcase', route: 'ComponentsUsage' },
  ];

  const STATUS_BAR_H = StatusBar.currentHeight ?? (Platform.OS === 'ios' ? 44 : 0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 160 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
      Animated.stagger(50, itemAnims.map(a =>
        Animated.spring(a, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 140 })
      )).start();
    } else {
      itemAnims.forEach(a => a.setValue(0));
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -SIDEBAR_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 10, opacity: fadeAnim }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: SIDEBAR_WIDTH, zIndex: 11,
          backgroundColor: COLORS.card,
          borderTopRightRadius: SIZES.radius.xxl,
          borderBottomRightRadius: SIZES.radius.xxl,
          overflow: 'hidden',
          transform: [{ translateX: slideAnim }],
          ...SHADOWS.xl,
        }}
      >
        <View style={{
          paddingTop: STATUS_BAR_H + 16,
          paddingBottom: SIZES.padding.xl,
          paddingHorizontal: SIZES.padding.xl,
          backgroundColor: COLORS.primary,
        }}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: COLORS.secondary }} />
          <TouchableOpacity
            onPress={onClose}
            style={{
              alignSelf: 'flex-end', width: 32, height: 32,
              borderRadius: SIZES.radius.full,
              backgroundColor: COLORS.whiteOpacity10,
              alignItems: 'center', justifyContent: 'center',
              marginBottom: SIZES.margin.md,
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: 14 }}>✕</Text>
          </TouchableOpacity>

          <View style={{
            width: 64, height: 64, borderRadius: SIZES.radius.full,
            borderWidth: 2.5, borderColor: COLORS.secondary,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: COLORS.whiteOpacity20, marginBottom: SIZES.margin.sm,
          }}>
            <Text style={{ fontSize: 28 }}>👤</Text>
          </View>

          <Text style={[FONTS.h5, { color: COLORS.white }]}>Dhanapal DigiGold</Text>
          <Text style={[FONTS.caption, { color: COLORS.whiteOpacity70, marginBottom: SIZES.margin.md }]}>
            user@digigold.com
          </Text>

          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            borderWidth: 1, borderColor: COLORS.whiteOpacity30,
            backgroundColor: COLORS.whiteOpacity10,
            borderRadius: SIZES.radius.full,
            paddingHorizontal: SIZES.padding.md, paddingVertical: SIZES.padding.xs,
            alignSelf: 'flex-start',
          }}>
            <Text style={[FONTS.caption, { color: COLORS.secondaryLight }]}>✦ 2.4g Gold</Text>
            <View style={{ width: 1, height: 12, backgroundColor: COLORS.whiteOpacity30 }} />
            <Text style={[FONTS.captionBold, { color: COLORS.white }]}>₹18,240</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: SIZES.padding.sm }} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, i) => {
            const isActive = i === 0;
            return (
              <Animated.View
                key={i}
                style={{
                  opacity: itemAnims[i],
                  transform: [{ translateX: itemAnims[i].interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
                }}
              >
                <TouchableOpacity
                  onPress={() => { onClose(); item.route && navigation.navigate(item.route); }}
                  activeOpacity={0.6}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    paddingVertical: SIZES.padding.md, paddingHorizontal: SIZES.padding.lg,
                    marginHorizontal: SIZES.margin.sm, marginVertical: 2,
                    borderRadius: SIZES.radius.lg,
                    borderLeftWidth: 3, borderLeftColor: isActive ? COLORS.primary : 'transparent',
                    backgroundColor: isActive ? COLORS.primaryPale : 'transparent',
                    gap: 12,
                  }}
                >
                  <View style={{
                    width: 40, height: 40, borderRadius: SIZES.radius.md,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isActive ? COLORS.primaryPale : isDark ? COLORS.blackOpacity20 : COLORS.gray100,
                  }}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[isActive ? FONTS.bodyBold : FONTS.bodyMedium, { color: isActive ? COLORS.primary : COLORS.textPrimary }]}>
                      {item.label}
                    </Text>
                    <Text style={[FONTS.caption, { color: COLORS.textTertiary }]}>{item.description}</Text>
                  </View>
                  {item.badge && (
                    <View style={{
                      paddingHorizontal: 7, paddingVertical: 3, borderRadius: SIZES.radius.sm,
                      backgroundColor: item.badge === 'NEW' ? COLORS.primary : COLORS.primaryPale,
                    }}>
                      <Text style={[FONTS.caption, { color: item.badge === 'NEW' ? COLORS.white : COLORS.primary }]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <Text style={{ fontSize: 20, color: COLORS.gray300 }}>›</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>

        <View style={{
          paddingHorizontal: SIZES.padding.xl, paddingTop: SIZES.padding.md,
          paddingBottom: SIZES.padding.xxl,
          borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border,
          backgroundColor: COLORS.backgroundSecondary, gap: SIZES.sm,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.sm }}>
            <View style={{ width: 36, height: 36, borderRadius: SIZES.radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? COLORS.gray800 : COLORS.gray200 }}>
              <Text style={{ fontSize: 16 }}>{isDark ? '🌙' : '☀️'}</Text>
            </View>
            <Text style={[FONTS.bodyMedium, { flex: 1, color: COLORS.textPrimary }]}>
              {isDark ? t('darkMode') : t('lightMode')}
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={isDark ? COLORS.secondary : COLORS.white} />
          </View>

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: COLORS.border, marginVertical: 4 }} />

          <TouchableOpacity onPress={() => setLangSheetVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.sm, paddingVertical: SIZES.padding.xs }}>
            <View style={{ width: 36, height: 36, borderRadius: SIZES.radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? COLORS.gray800 : COLORS.gray200 }}>
              <Text style={{ fontSize: 16 }}>🌐</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[FONTS.bodyMedium, { color: COLORS.textPrimary }]}>{t('language')}</Text>
              <Text style={[FONTS.caption, { color: COLORS.textTertiary }]}>
                {selectedLang ? `${selectedLang.flag}  ${selectedLang.name}` : language.toUpperCase()}
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: COLORS.gray300 }}>›</Text>
          </TouchableOpacity>

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: COLORS.border, marginVertical: 4 }} />

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.sm, paddingVertical: SIZES.padding.sm, paddingHorizontal: SIZES.padding.md, borderRadius: SIZES.radius.md, backgroundColor: 'rgba(220,38,38,0.08)' }}>
            <Text style={{ fontSize: 16 }}>🚪</Text>
            <Text style={[FONTS.bodyMedium, { color: COLORS.error }]}>{t('signOut')}</Text>
          </TouchableOpacity>

          <Text style={[FONTS.caption, { color: COLORS.textDisabled, textAlign: 'center', marginTop: 4 }]}>
            DigiGold v1.0.0
          </Text>
        </View>
      </Animated.View>

      <AppLanguagePicker
        mode="sheet"
        visible={langSheetVisible}
        onClose={() => setLangSheetVisible(false)}
        selectedCode={language}
        onSelect={(code) => { setLanguage(code); setLangSheetVisible(false); }}
        title={t('selectLanguage')}
      />
    </>
  );
}
