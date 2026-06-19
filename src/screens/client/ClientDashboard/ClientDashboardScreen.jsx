import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import SectionHeader from '../../../components/agri/SectionHeader';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { bookingService } from '../../../api/services';
import { formatDateTime, statusVariant } from '../../../utils/agriHelpers';

export default function ClientDashboardScreen({ navigation }) {
  const { COLORS, SHADOWS, SIZES, isDark, toggleTheme } = useTheme();
  const { user, ownerId: myId } = useAuth();
  const [bookings, setBookings] = useState([]);

  const load = useCallback(async () => {
    if (!myId) return;
    try { const r = await bookingService.byClient(myId); setBookings(Array.isArray(r) ? r : []); } catch (e) {}
  }, [myId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title={`Hi, ${user?.name || 'Farmer'}`} subtitle="Find & book tractor services" variant="primary"
        actions={[
          { iconName: isDark ? 'sunny-outline' : 'moon-outline', onPress: toggleTheme },
          { iconName: 'notifications-outline', onPress: () => navigation.navigate('Notifications') },
        ]} />}>
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ClientTabs', { screen: 'Search' })}
          style={[styles.cta, { backgroundColor: COLORS.primary, ...SHADOWS.orange }]}>
          <Ionicons name="search" size={22} color={COLORS.white} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <AppText variant="bodyMedium" color={COLORS.white}>Find a Tractor</AppText>
            <AppText variant="caption" color={COLORS.white} style={{ opacity: 0.9 }}>Search nearby owners & services</AppText>
          </View>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <SectionHeader title="My Recent Bookings" actionLabel="See all"
          onAction={() => navigation.navigate('ClientTabs', { screen: 'Bookings' })} />
        {bookings.length === 0 ? (
          <AppCard><AppText variant="bodySmall" color={COLORS.textSecondary}>No bookings yet. Find a tractor to get started.</AppText></AppCard>
        ) : bookings.slice(0, 5).map((b) => (
          <ListRow key={b.bookingId} icon="calendar-outline" title={b.serviceType || 'Service'}
            subtitle={formatDateTime(b.requestedDate)} status={b.status} statusVariant={statusVariant(b.status)}
            onPress={() => navigation.navigate('BookingStatus', { booking: b })} />
        ))}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  cta: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 18 },
});
