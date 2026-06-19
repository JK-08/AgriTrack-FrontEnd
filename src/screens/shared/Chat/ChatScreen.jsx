import React, { useState, useCallback, useRef } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import { useAuth } from '../../../providers/AuthProvider';
import { chatService } from '../../../api/services';

export default function ChatScreen({ route }) {
  const { COLORS, SHADOWS } = useTheme();
  const { user, ownerId: myId } = useAuth();
  const { ownerId, clientId } = route?.params || {};
  const [chatId, setChatId] = useState(route?.params?.chatId || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  const load = useCallback(async () => {
    try {
      let id = chatId;
      if (!id && ownerId && clientId) {
        const chat = await chatService.start(ownerId, clientId);
        id = chat.chatId; setChatId(id);
      }
      if (id) {
        const m = await chatService.messages(id);
        setMessages(Array.isArray(m) ? m : []);
      }
    } catch (e) {}
  }, [chatId, ownerId, clientId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const send = async () => {
    if (!text.trim()) return;
    const body = text.trim(); setText('');
    try {
      await chatService.send({ ownerId, clientId, senderId: myId, messageText: body });
      load();
    } catch (e) {}
  };

  return (
    <ScreenWrapper paddingHorizontal={0} edges={['top']}
      header={<AppHeader title="Chat" variant="primary" showBack />}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => String(item.messageId)}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: true })}
          renderItem={({ item }) => {
            const mine = item.senderId === myId;
            return (
              <View style={[styles.bubble, mine ? styles.mine : styles.theirs,
                { backgroundColor: mine ? COLORS.primary : COLORS.card, ...SHADOWS.xs }]}>
                <AppText variant="body" color={mine ? COLORS.white : COLORS.textPrimary}>{item.messageText}</AppText>
              </View>
            );
          }}
        />
        <View style={[styles.inputBar, { backgroundColor: COLORS.card, borderTopColor: COLORS.border }]}>
          <TextInput
            value={text} onChangeText={setText} placeholder="Type a message..."
            placeholderTextColor={COLORS.textTertiary}
            style={[styles.input, { color: COLORS.textPrimary, backgroundColor: COLORS.inputBackground }]}
          />
          <TouchableOpacity onPress={send} style={[styles.sendBtn, { backgroundColor: COLORS.primary }]}>
            <Ionicons name="send" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bubble:   { maxWidth: '78%', padding: 10, borderRadius: 14, marginBottom: 8 },
  mine:     { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  theirs:   { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: StyleSheet.hairlineWidth, gap: 8 },
  input:    { flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16, fontFamily: 'Poppins-Regular' },
  sendBtn:  { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
