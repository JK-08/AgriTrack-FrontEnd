import { callApi } from '../apiClient';
import { NOTIFICATION } from '../endpoints';

export const notificationService = {
  byUser:            (userId) => callApi({ method: 'get', url: NOTIFICATION.BY_USER(userId) }),
  send:              (data)   => callApi({ method: 'post', url: NOTIFICATION.SEND, data }),
  getPreferences:    (userId) => callApi({ method: 'get', url: NOTIFICATION.PREFERENCES(userId) }),
  updatePreference:  (userId, data) => callApi({ method: 'put', url: NOTIFICATION.PREFERENCES(userId), data }),
};
