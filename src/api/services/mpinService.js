import { callApi } from '../apiClient';
import { MPIN } from '../endpoints';

export const mpinService = {
  create: (mpin)                     => callApi({ method: 'post', url: MPIN.CREATE, data: { mpin } }),
  update: (oldMpin, newMpin)         => callApi({ method: 'put',  url: '/mpin/update', data: { oldMpin, newMpin } }),
  reset:  (password, newMpin)        => callApi({ method: 'put',  url: MPIN.RESET, data: { password, newMpin } }),
  remove: ()                         => callApi({ method: 'delete', url: '/mpin/delete' }),
  login:  (mobileNo, mpin)           => callApi({ method: 'post', url: '/mpin/login', data: { mobileNo, mpin } }),

  // ---- forgot MPIN (OTP recovery) ----
  forgotSendOtp: (identifier)                     =>
    callApi({ method: 'post', url: MPIN.FORGOT_SEND_OTP, data: { identifier } }),
  forgotVerify:  (identifier, otp)                =>
    callApi({ method: 'post', url: MPIN.FORGOT_VERIFY, data: { identifier, otp } }),
  forgotReset:   (identifier, resetToken, newMpin) =>
    callApi({ method: 'post', url: MPIN.FORGOT_RESET, data: { identifier, resetToken, newMpin } }),
};
