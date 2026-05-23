import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '../theme';

import HomeScreen from '../screens/home/HomeScreen';
import PortfolioScreen from '../screens/portfolio/PortfolioScreen';
import TransactionsScreen from '../screens/transactions/TransactionsScreen';
import BuyGoldScreen from '../screens/buygold/BuyGoldScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const TABS = [
  { name: 'Portfolio',    label: 'Portfolio', icon: 'bar-chart-outline', iconActive: 'bar-chart',    component: PortfolioScreen },
  { name: 'Transactions', label: 'History',   icon: 'receipt-outline',   iconActive: 'receipt',      badge: 3, component: TransactionsScreen },
  { name: 'Home',         label: 'Home',      icon: 'home-outline',      iconActive: 'home',         component: HomeScreen },
  { name: 'BuyGold',      label: 'Buy Gold',  icon: 'add-circle-outline',iconActive: 'add-circle',   component: BuyGoldScreen },
  { name: 'Profile',      label: 'Profile',   icon: 'person-outline',    iconActive: 'person',       component: ProfileScreen },
];

function BadgeDot({ count, errorColor, whiteColor }) {
  if (!count || count <= 0) return null;
  return (
    <View style={[styles.badge, { backgroundColor: errorColor, borderColor: whiteColor }]}>
      <Text style={[styles.badgeText, { color: whiteColor }]}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

function CenterTab({ item, isActive, onPress }) {
  const { COLORS, SHADOWS, moderateScale } = useTheme();
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim,  { toValue: isActive ? 1.08 : 1, useNativeDriver: true, damping: 12, stiffness: 180 }),
      Animated.spring(rotateAnim, { toValue: isActive ? 1 : 0,    useNativeDriver: true, damping: 10, stiffness: 160 }),
    ]).start();
  }, [isActive]);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });
  const onIn  = () => Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 40 }).start();
  const onOut = () => Animated.spring(scaleAnim, { toValue: isActive ? 1.08 : 1, useNativeDriver: true, speed: 24 }).start();

  return (
    <View style={styles.centerTabOuter}>
      <TouchableOpacity onPress={onPress} onPressIn={onIn} onPressOut={onOut} activeOpacity={1}>
        <Animated.View style={[
          styles.centerFab,
          {
            backgroundColor: COLORS.primary,
            width: moderateScale(56), height: moderateScale(56),
            borderRadius: moderateScale(18),
            transform: [{ scale: scaleAnim }, { rotate: spin }],
            ...SHADOWS.orange,
          },
        ]}>
          <Ionicons name={isActive ? item.iconActive : item.icon} size={moderateScale(26)} color={COLORS.white} />
        </Animated.View>
      </TouchableOpacity>
      <Text style={[styles.centerLabel, { color: isActive ? COLORS.primary : COLORS.textTertiary, fontFamily: 'Poppins-Medium' }]}>
        {item.label}
      </Text>
    </View>
  );
}

function RegularTab({ item, isActive, onPress }) {
  const { COLORS, FONTS, SIZES, moderateScale } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const dotScale   = useRef(new Animated.Value(0)).current;
  const labelScale = useRef(new Animated.Value(isActive ? 1 : 0.85)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: isActive ? -3 : 0,    useNativeDriver: true, damping: 14, stiffness: 180 }),
      Animated.spring(dotScale,   { toValue: isActive ? 1 : 0,     useNativeDriver: true, damping: 12, stiffness: 200 }),
      Animated.spring(labelScale, { toValue: isActive ? 1 : 0.85,  useNativeDriver: true, damping: 14 }),
    ]).start();
  }, [isActive]);

  const onIn  = () => Animated.spring(pressScale, { toValue: 0.88, useNativeDriver: true, speed: 40 }).start();
  const onOut = () => Animated.spring(pressScale, { toValue: 1,    useNativeDriver: true, speed: 24 }).start();

  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} onPressIn={onIn} onPressOut={onOut} activeOpacity={1}>
      <Animated.View style={[styles.tabItemInner, { transform: [{ translateY }, { scale: pressScale }] }]}>
        {isActive && <View style={[styles.activePill, { backgroundColor: COLORS.primaryPale }]} />}
        <View style={styles.iconWrap}>
          <Ionicons
            name={isActive ? item.iconActive : item.icon}
            size={moderateScale(22)}
            color={isActive ? COLORS.primary : COLORS.textTertiary}
          />
          {item.badge !== undefined && (
            <BadgeDot count={item.badge} errorColor={COLORS.error} whiteColor={COLORS.white} />
          )}
        </View>
        <Animated.Text style={[
          styles.tabLabel,
          {
            color: isActive ? COLORS.primary : COLORS.textTertiary,
            transform: [{ scale: labelScale }],
            fontFamily: isActive ? FONTS.family.semiBold : FONTS.family.regular,
            fontSize: SIZES.font.xs,
          },
        ]}>
          {item.label}
        </Animated.Text>
        <Animated.View style={[styles.activeDot, { backgroundColor: COLORS.primary, transform: [{ scale: dotScale }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }) {
  const { COLORS, SIZES, SHADOWS, verticalScale } = useTheme();
  const TAB_BAR_H = Platform.OS === 'ios' ? verticalScale(64) : verticalScale(62);

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.white }}>
      <View style={[
        styles.tabBar,
        {
          height: TAB_BAR_H,
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.borderLight,
          paddingHorizontal: SIZES.padding.sm,
          ...SHADOWS.lg,
          shadowColor: COLORS.shadow,
        },
      ]}>
        <View style={[styles.topAccent, { backgroundColor: COLORS.primaryPale }]} />
        {state.routes.map((route, index) => {
          const tab      = TABS[index];
          const isActive = state.index === index;
          const isCenter = index === 2;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isActive && !event.defaultPrevented) navigation.navigate(route.name);
          };

          if (isCenter) return <CenterTab key={route.key} item={tab} isActive={isActive} onPress={onPress} />;
          return <RegularTab key={route.key} item={tab} isActive={isActive} onPress={onPress} />;
        })}
      </View>
    </SafeAreaView>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      {TABS.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar:        { flexDirection: 'row', alignItems: 'flex-end', borderTopWidth: StyleSheet.hairlineWidth },
  topAccent:     { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  tabItem:       { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  tabItemInner:  { alignItems: 'center', justifyContent: 'center', position: 'relative', paddingHorizontal: 8, paddingTop: 4 },
  activePill:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 14, borderRadius: 16 },
  iconWrap:      { position: 'relative', width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  tabLabel:      { marginTop: 3, letterSpacing: 0.2 },
  activeDot:     { width: 4, height: 4, borderRadius: 999, marginTop: 2 },
  centerTabOuter:{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 6 },
  centerFab:     { alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  centerLabel:   { fontSize: 10, marginTop: 3, letterSpacing: 0.2 },
  badge:         { position: 'absolute', top: -3, right: -6, minWidth: 15, height: 15, borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, borderWidth: 1.5 },
  badgeText:     { fontSize: 8, letterSpacing: 0.2 },
});
