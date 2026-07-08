import { callApi } from '../apiClient';
import { AUTH, SESSION } from '../endpoints';

export const authService = {
  register: (data)            => callApi({ method: 'post', url: AUTH.REGISTER, data }),
  login:    (username, password, role) =>
    callApi({ method: 'post', url: AUTH.LOGIN, data: { username, password, role } }),
  getAll:   ()               => callApi({ method: 'get', url: AUTH.GET_ALL }),
  getById:  (id)             => callApi({ method: 'get', url: AUTH.GET_BY_ID(id) }),
  remove:   (id)             => callApi({ method: 'delete', url: AUTH.DELETE(id) }),

  // ---- forgot password (OTP recovery) ----
  forgotPassword: (identifier)                         =>
    callApi({ method: 'post', url: AUTH.FORGOT_PASSWORD, data: { identifier } }),
  verifyOtp:      (identifier, otp)                     =>
    callApi({ method: 'post', url: AUTH.VERIFY_OTP, data: { identifier, otp } }),
  resetPassword:  (identifier, resetToken, newPassword) =>
    callApi({ method: 'post', url: AUTH.RESET_PASSWORD, data: { identifier, resetToken, newPassword } }),

  // ---- session / refresh-token management ----
  refresh:        (refreshToken) =>
    callApi({ method: 'post', url: SESSION.REFRESH, data: { refreshToken } }),
  logout:         (refreshToken) =>
    callApi({ method: 'post', url: SESSION.LOGOUT, data: { refreshToken } }),
  logoutAll:      ()             => callApi({ method: 'post', url: SESSION.LOGOUT_ALL }),
  getSessions:    ()             => callApi({ method: 'get', url: SESSION.SESSIONS }),
  revokeSession:  (id)           => callApi({ method: 'delete', url: SESSION.DELETE(id) }),
  getLoginHistory:()             => callApi({ method: 'get', url: SESSION.LOGIN_HISTORY }),
};
