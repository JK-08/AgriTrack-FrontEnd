import { callApi } from '../apiClient';
import { CHAT } from '../endpoints';

export const chatService = {
  start:    (ownerId, clientId) => callApi({ method: 'post', url: CHAT.START, params: { ownerId, clientId } }),
  send:     (data)              => callApi({ method: 'post', url: CHAT.SEND, data }),
  owner:    (ownerId)           => callApi({ method: 'get',  url: CHAT.OWNER(ownerId) }),
  client:   (clientId)          => callApi({ method: 'get',  url: CHAT.CLIENT(clientId) }),
  messages: (chatId)            => callApi({ method: 'get',  url: CHAT.MESSAGES(chatId) }),
  markRead: (chatId, readerId)  => callApi({ method: 'put',  url: CHAT.MARK_READ(chatId), params: { readerId } }),
};
