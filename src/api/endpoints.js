export const ONBOARDING = {
  BANNERS: '/schemebanner/all',
};

export const AUTH = {
  REGISTER:                  '/user/register',
  VERIFY_OTP:                '/user/verify-otp',
  LOGIN:                     '/user/login',
  FORGOT_PASSWORD:           '/user/forgot-password',
  RESET_PASSWORD:            '/user/reset-password',
  PROFILE:                   '/user/profile',
  GOOGLE_LOGIN:              '/google-login',
  GOOGLE_CONTACT_UPDATE:     '/request-google-contact-update',
  GOOGLE_CONTACT_VERIFY_OTP: '/verify-google-contact-otp',
};

export const MPIN = {
  CREATE:          '/mpin/create',
  VERIFY:          '/mpin/verify',
  RESET:           '/mpin/reset',
  FORGOT_SEND_OTP: '/mpin/forgot/send-otp',
  FORGOT_VERIFY:   '/mpin/forgot/verify',
};

export const DEVICE = {
  REGISTER: '/device/register',
  LOGOUT:   '/device/logout',
  DELETE:   '/device/delete',
};
