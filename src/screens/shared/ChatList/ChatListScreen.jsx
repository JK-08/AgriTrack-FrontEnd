import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { chatService } from '../../../api/services';
import { formatDateTime } from '../../../utils/agriHelpers';

export default function ChatListScreen({ navigation }) {
  const { SIZES } = useTheme();
  const { ownerId, role } = useAuth();
  const isOwner = role === 'OWNER' || role === 'DRIVER';
  const [data, setData] = useState([]);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try {
      const r = isOwner ? await chatService.owner(ownerId) : await chatService.client(ownerId);
      setData(Array.isArray(r) ? r : []);
    } catch (e) { setData([]); }
  }, [ownerId, isOwner]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Messages" variant="primary" showBack />}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.chatId)}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <ListRow icon="chatbubble-ellipses-outline"
            title={isOwner ? `Customer #${item.clientId}` : `Owner #${item.ownerId}`}
            subtitle={item.lastMessage || 'Start a conversation'}
            value={item.lastMessageTime ? formatDateTime(item.lastMessageTime) : ''}
            onPress={() => navigation.navigate('Chat', { chatId: item.chatId, ownerId: item.ownerId, clientId: item.clientId })} />
        )}
        ListEmptyComponent={<AppEmptyState title="No conversations" subtitle="Your chats will appear here." />}
      />
    </ScreenWrapper>
  );
}
