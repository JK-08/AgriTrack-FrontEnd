import React, { useState, useRef } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppButton from '../../../components/ui/appcomponents/AppButton';

const { width } = Dimensions.get('window');

const SLIDES = [
  { icon: 'people-circle-outline', title: 'Manage Customers', text: 'Keep every farmer and their work history in one place.' },
  { icon: 'timer-outline',         title: 'Track Work Live',  text: 'Start a timer, pause and stop — amount is auto-calculated.' },
  { icon: 'receipt-outline',       title: 'Invoice & Get Paid', text: 'Generate invoices and track payments instantly.' },
];

export default function OnboardingScreen({ navigation }) {
  const { COLORS } = useTheme();
  const [index, setIndex] = useState(0);
  const ref = useRef(null);

  const finish = async () => {
    await AsyncStorage.setItem('@onboarding_complete', 'true');
    navigation.replace('RoleSelection');
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else finish();
  };

  return (
    <View style={[styles.c, { backgroundColor: COLORS.background }]}>
      <FlatList
        ref={ref}
        data={SLIDES}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconWrap, { backgroundColor: COLORS.primaryPale }]}>
              <Ionicons name={item.icon} size={70} color={COLORS.primary} />
            </View>
            <AppText variant="h2" align="center" style={{ marginTop: 30 }}>{item.title}</AppText>
            <AppText variant="body" align="center" color={COLORS.textSecondary} style={{ marginTop: 10, paddingHorizontal: 12 }}>
              {item.text}
            </AppText>
          </View>
        )}
      />
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === index ? COLORS.primary : COLORS.border, width: i === index ? 22 : 8 }]} />
        ))}
      </View>
      <View style={{ padding: 24 }}>
        <AppButton label={index === SLIDES.length - 1 ? 'Get Started' : 'Next'} onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  c:        { flex: 1 },
  slide:    { alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconWrap: { width: 160, height: 160, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  dots:     { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 6 },
  dot:      { height: 8, borderRadius: 4 },
});
