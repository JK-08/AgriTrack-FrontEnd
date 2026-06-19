import { callApi } from '../apiClient';
import { AUTH } from '../endpoints';

export const authService = {
  register: (data)            => callApi({ method: 'post', url: AUTH.REGISTER, data }),
  login:    (username, password, role) =>
    callApi({ method: 'post', url: AUTH.LOGIN, data: { username, password, role } }),
  getAll:   ()               => callApi({ method: 'get', url: AUTH.GET_ALL }),
  getById:  (id)             => callApi({ method: 'get', url: AUTH.GET_BY_ID(id) }),
  remove:   (id)             => callApi({ method: 'delete', url: AUTH.DELETE(id) }),
};
