// All paths are relative to API_BASE_URL which already ends with /api/v1

export const AUTH = {
  REGISTER:        '/user/register',
  LOGIN:           '/user/login',
  GET_ALL:         '/user/getall',
  GET_BY_ID:       (id) => `/user/getbyid/${id}`,
  DELETE:          (id) => `/user/deletebyid/${id}`,
  VERIFY_OTP:      '/user/verify-otp',
  FORGOT_PASSWORD: '/user/forgot-password',
  GOOGLE_LOGIN:    '/google-login',
};

export const MPIN = {
  CREATE:          '/mpin/create',
  VERIFY:          '/mpin/verify',
  RESET:           '/mpin/reset',
  FORGOT_SEND_OTP: '/mpin/forgot/send-otp',
  FORGOT_VERIFY:   '/mpin/forgot/verify',
};

export const ONBOARDING = {
  GET_ALL:   '/onboarding/getAll',
  GET_BY_ID: (id) => `/onboarding/getById/${id}`,
};

export const CUSTOMER = {
  CREATE:       '/customer/create',
  GET_ALL:      '/customer/getAll',
  BY_OWNER:     (ownerId) => `/customer/getByOwner/${ownerId}`,
  SEARCH:       (ownerId) => `/customer/search/${ownerId}`,
  FILTER:       (ownerId) => `/customer/filter/${ownerId}`,
  GET_BY_ID:    (id) => `/customer/getById/${id}`,
  UPDATE:       (id) => `/customer/update/${id}`,
  DELETE:       (id) => `/customer/deleteById/${id}`,
};

export const TRACTOR = {
  CREATE:    '/tractor/create',
  GET_ALL:   '/tractor/getAll',
  BY_OWNER:  (ownerId) => `/tractor/getByOwner/${ownerId}`,
  AVAILABLE: (ownerId) => `/tractor/available/${ownerId}`,
  GET_BY_ID: (id) => `/tractor/getById/${id}`,
  UPDATE:    (id) => `/tractor/update/${id}`,
  STATUS:    (id) => `/tractor/status/${id}`,
  DELETE:    (id) => `/tractor/deleteById/${id}`,
};

export const RATE = {
  CREATE:    '/rate/create',
  GET_ALL:   '/rate/getAll',
  BY_OWNER:  (ownerId) => `/rate/getByOwner/${ownerId}`,
  ACTIVE:    (ownerId) => `/rate/active/${ownerId}`,
  GET_BY_ID: (id) => `/rate/getById/${id}`,
  UPDATE:    (id) => `/rate/update/${id}`,
  DELETE:    (id) => `/rate/deleteById/${id}`,
};

export const WORK = {
  START:        '/work/start',
  PAUSE:        (id) => `/work/pause/${id}`,
  RESUME:       (id) => `/work/resume/${id}`,
  STOP:         (id) => `/work/stop/${id}`,
  MANUAL:       '/work/manual',
  GET_ALL:      '/work/getAll',
  BY_OWNER:     (ownerId) => `/work/getByOwner/${ownerId}`,
  BY_CUSTOMER:  (customerId) => `/work/getByCustomer/${customerId}`,
  GET_BY_ID:    (id) => `/work/getById/${id}`,
  DELETE:       (id) => `/work/deleteById/${id}`,
};

export const INVOICE = {
  CREATE:      '/invoice/create',
  GET_ALL:     '/invoice/getAll',
  BY_OWNER:    (ownerId) => `/invoice/getByOwner/${ownerId}`,
  BY_CUSTOMER: (customerId) => `/invoice/getByCustomer/${customerId}`,
  GET_BY_ID:   (id) => `/invoice/getById/${id}`,
  UPDATE:      (id) => `/invoice/update/${id}`,
  STATUS:      (id) => `/invoice/status/${id}`,
  DELETE:      (id) => `/invoice/deleteById/${id}`,
};

export const PAYMENT = {
  CREATE:           '/payment/create',
  GET_ALL:          '/payment/getAll',
  OWNER_HISTORY:    (ownerId) => `/payment/history/${ownerId}`,
  CUSTOMER_HISTORY: (customerId) => `/payment/customerHistory/${customerId}`,
  PENDING:          (ownerId) => `/payment/pending/${ownerId}`,
  BY_INVOICE:       (invoiceId) => `/payment/byInvoice/${invoiceId}`,
  GET_BY_ID:        (id) => `/payment/getById/${id}`,
  STATUS:           (id) => `/payment/status/${id}`,
  DELETE:           (id) => `/payment/deleteById/${id}`,
};

export const BOOKING = {
  CREATE:     '/booking/create',
  GET_ALL:    '/booking/getAll',
  BY_OWNER:   (ownerId) => `/booking/getByOwner/${ownerId}`,
  BY_CLIENT:  (clientId) => `/booking/getByClient/${clientId}`,
  PENDING:    (ownerId) => `/booking/pending/${ownerId}`,
  GET_BY_ID:  (id) => `/booking/getById/${id}`,
  ACCEPT:     (id) => `/booking/accept/${id}`,
  REJECT:     (id) => `/booking/reject/${id}`,
  COMPLETE:   (id) => `/booking/complete/${id}`,
  CANCEL:     (id) => `/booking/cancel/${id}`,
  DELETE:     (id) => `/booking/deleteById/${id}`,
};

export const MAINTENANCE = {
  CREATE:      '/maintenance/create',
  GET_ALL:     '/maintenance/getAll',
  BY_TRACTOR:  (tractorId) => `/maintenance/getByTractor/${tractorId}`,
  BY_OWNER:    (ownerId) => `/maintenance/getByOwner/${ownerId}`,
  GET_BY_ID:   (id) => `/maintenance/getById/${id}`,
  UPDATE:      (id) => `/maintenance/update/${id}`,
  DELETE:      (id) => `/maintenance/deleteById/${id}`,
};

export const CHAT = {
  START:    '/chat/start',
  SEND:     '/chat/send',
  OWNER:    (ownerId) => `/chat/owner/${ownerId}`,
  CLIENT:   (clientId) => `/chat/client/${clientId}`,
  MESSAGES: (chatId) => `/chat/messages/${chatId}`,
  MARK_READ:(chatId) => `/chat/markRead/${chatId}`,
};

export const RATING = {
  CREATE:    '/rating/create',
  GET_ALL:   '/rating/getAll',
  BY_OWNER:  (ownerId) => `/rating/getByOwner/${ownerId}`,
  BY_CLIENT: (clientId) => `/rating/getByClient/${clientId}`,
  AVERAGE:   (ownerId) => `/rating/average/${ownerId}`,
  GET_BY_ID: (id) => `/rating/getById/${id}`,
  DELETE:    (id) => `/rating/deleteById/${id}`,
};

export const REPORT = {
  OWNER_SUMMARY: (ownerId) => `/report/owner/${ownerId}`,
  REVENUE:       (ownerId) => `/report/revenue/${ownerId}`,
};

export const NOTIFICATION = {
  BY_USER: (userId) => `/notification/user/${userId}`,
  SEND:    '/notification/send',
};
