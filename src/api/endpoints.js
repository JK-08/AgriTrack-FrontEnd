// All paths are relative to API_BASE_URL which already ends with /api/v1

export const AUTH = {
  REGISTER:        '/user/register',
  LOGIN:           '/user/login',
  GET_ALL:         '/user/getall',
  GET_BY_ID:       (id) => `/user/getbyid/${id}`,
  DELETE:          (id) => `/user/deletebyid/${id}`,
  VERIFY_OTP:      '/user/verify-otp',
  FORGOT_PASSWORD: '/user/forgot-password',
  RESET_PASSWORD:  '/user/reset-password',
  GOOGLE_LOGIN:    '/google-login',
};

export const SESSION = {
  REFRESH:       '/auth/refresh',
  LOGOUT:        '/auth/logout',
  LOGOUT_ALL:    '/auth/logout-all',
  SESSIONS:      '/auth/sessions',
  DELETE:        (id) => `/auth/session/${id}`,
  LOGIN_HISTORY: '/auth/login-history',
};

export const MPIN = {
  CREATE:          '/mpin/create',
  VERIFY:          '/mpin/verify',
  RESET:           '/mpin/reset',
  FORGOT_SEND_OTP: '/mpin/forgot/send-otp',
  FORGOT_VERIFY:   '/mpin/forgot/verify',
  FORGOT_RESET:    '/mpin/forgot/reset',
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
  BY_DRIVER:    (driverId) => `/work/getByDriver/${driverId}`,
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
  CREATE:        '/booking/create',
  GET_ALL:       '/booking/getAll',
  BY_OWNER:      (ownerId) => `/booking/getByOwner/${ownerId}`,
  BY_CLIENT:     (clientId) => `/booking/getByClient/${clientId}`,
  BY_DRIVER:     (driverId) => `/booking/getByDriver/${driverId}`,
  PENDING:       (ownerId) => `/booking/pending/${ownerId}`,
  GET_BY_ID:     (id) => `/booking/getById/${id}`,
  ASSIGN_DRIVER: (id) => `/booking/assignDriver/${id}`,
  ACCEPT:        (id) => `/booking/accept/${id}`,
  REJECT:        (id) => `/booking/reject/${id}`,
  COMPLETE:      (id) => `/booking/complete/${id}`,
  CANCEL:        (id) => `/booking/cancel/${id}`,
  DELETE:        (id) => `/booking/deleteById/${id}`,
};

export const DRIVER = {
  CREATE:       '/driver/create',
  GET_ALL:      '/driver/getAll',
  BY_OWNER:     (ownerId) => `/driver/getByOwner/${ownerId}`,
  AVAILABLE:    (ownerId) => `/driver/available/${ownerId}`,
  GET_BY_ID:    (id) => `/driver/getById/${id}`,
  BY_USER:      (userId) => `/driver/getByUser/${userId}`,
  UPDATE:       (id) => `/driver/update/${id}`,
  AVAILABILITY: (id) => `/driver/availability/${id}`,
  DELETE:       (id) => `/driver/deleteById/${id}`,
};

export const ASSIGNMENT = {
  ASSIGN:           '/assignment/assign',
  UNASSIGN:         (id) => `/assignment/unassign/${id}`,
  BY_OWNER:         (ownerId) => `/assignment/getByOwner/${ownerId}`,
  ACTIVE_BY_DRIVER: (driverId) => `/assignment/activeByDriver/${driverId}`,
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
  OWNER_SUMMARY:   (ownerId) => `/report/owner/${ownerId}`,
  REVENUE:         (ownerId) => `/report/revenue/${ownerId}`,
  FLEET_DASHBOARD: (ownerId) => `/report/fleet-dashboard/${ownerId}`,
  ADVANCED:        (ownerId) => `/report/advanced/${ownerId}`,
  ANALYTICS:       (ownerId) => `/report/analytics/${ownerId}`,
  INSIGHTS:        (ownerId) => `/report/insights/${ownerId}`,
};

export const EXPENSE = {
  UPLOAD_BILL:  '/expense/upload-bill',
  CREATE:       '/expense/create',
  SEARCH_PAGED: (ownerId) => `/expense/search-paged/${ownerId}`,
  GET_BY_ID:    (id) => `/expense/getById/${id}`,
  UPDATE:       (id) => `/expense/update/${id}`,
  DELETE:       (id) => `/expense/deleteById/${id}`,
  PROFIT_LOSS:  (ownerId) => `/expense/profit-loss/${ownerId}`,
};

export const ATTENDANCE = {
  CLOCK_IN:     (driverId) => `/attendance/clock-in/${driverId}`,
  CLOCK_OUT:    (driverId) => `/attendance/clock-out/${driverId}`,
  BREAK:        (driverId) => `/attendance/break/${driverId}`,
  LEAVE:        '/attendance/leave',
  SEARCH_PAGED: (ownerId) => `/attendance/search-paged/${ownerId}`,
  BY_DRIVER:    (driverId) => `/attendance/by-driver/${driverId}`,
  GET_BY_ID:    (id) => `/attendance/getById/${id}`,
  UPDATE:       (id) => `/attendance/update/${id}`,
  DELETE:       (id) => `/attendance/deleteById/${id}`,
};

export const PAYROLL = {
  GENERATE:     '/payroll/generate',
  SEARCH_PAGED: (ownerId) => `/payroll/search-paged/${ownerId}`,
  GET_BY_ID:    (id) => `/payroll/getById/${id}`,
  MARK_PAID:    (id) => `/payroll/mark-paid/${id}`,
  DELETE:       (id) => `/payroll/deleteById/${id}`,
};

export const DOCUMENT = {
  UPLOAD_FILE:  '/document/upload-file',
  UPLOAD:       '/document/upload',
  BY_TRACTOR:   (tractorId) => `/document/by-tractor/${tractorId}`,
  SEARCH_PAGED: (ownerId) => `/document/search-paged/${ownerId}`,
  GET_BY_ID:    (id) => `/document/getById/${id}`,
  DELETE:       (id) => `/document/deleteById/${id}`,
};

export const NOTIFICATION = {
  BY_USER:     (userId) => `/notification/user/${userId}`,
  SEND:        '/notification/create',
  PREFERENCES: (userId) => `/notification/preferences/${userId}`,
};

export const LOCATION = {
  UPDATE:           '/location/update',
  LATEST_BY_DRIVER: (driverId) => `/location/latestByDriver/${driverId}`,
  LATEST_BY_BOOKING:(bookingId) => `/location/latestByBooking/${bookingId}`,
};

export const HEALTH = {
  CHECK: '/health',
};
