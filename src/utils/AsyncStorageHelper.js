import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN:          '@auth_token',
  USER:           '@user',
  USER_ID:        '@user_id',
  CONTACT:        '@contact_number',
  USERNAME:       '@username',
  EMAIL:          '@email',
  REFERRAL_CODE:  '@referral_code',
  REFERRAL_LINK:  '@referral_link',
  PLAYSTORE_LINK: '@playstore_link',
  WHATSAPP_LINK:  '@whatsapp_link',
  USED_REFERRAL:  '@used_referral_code',
  MPIN_SET:       '@mpin_set',
  ONBOARDED:      '@onboarding_complete',
  FCM_TOKEN:      '@fcm_token',
  DEVICE_ID:      '@device_id',
};

const saveUserSession = async (user) => {
  const pairs = [[KEYS.USER, JSON.stringify(user)]];
  if (user.token)              pairs.push([KEYS.TOKEN,          user.token]);
  if (user.id)                 pairs.push([KEYS.USER_ID,        String(user.id)]);
  if (user.contactNumber)      pairs.push([KEYS.CONTACT,        user.contactNumber]);
  if (user.username)           pairs.push([KEYS.USERNAME,       user.username]);
  if (user.email)              pairs.push([KEYS.EMAIL,          user.email]);
  if (user.referralCode)       pairs.push([KEYS.REFERRAL_CODE,  user.referralCode]);
  if (user.referralLink)       pairs.push([KEYS.REFERRAL_LINK,  user.referralLink]);
  if (user.playStoreLink)      pairs.push([KEYS.PLAYSTORE_LINK, user.playStoreLink]);
  if (user.whatsappLink)       pairs.push([KEYS.WHATSAPP_LINK,  user.whatsappLink]);
  if (user.used_referral_code) pairs.push([KEYS.USED_REFERRAL,  user.used_referral_code]);
  await AsyncStorage.multiSet(pairs);
};

const getUser         = async () => { const raw = await AsyncStorage.getItem(KEYS.USER); return raw ? JSON.parse(raw) : null; };
const getToken         = () => AsyncStorage.getItem(KEYS.TOKEN);
const getUserId        = () => AsyncStorage.getItem(KEYS.USER_ID);
const getContactNumber = () => AsyncStorage.getItem(KEYS.CONTACT);
const getUsername      = () => AsyncStorage.getItem(KEYS.USERNAME);
const getEmail         = () => AsyncStorage.getItem(KEYS.EMAIL);
const getReferralCode  = () => AsyncStorage.getItem(KEYS.REFERRAL_CODE);
const getReferralLink  = () => AsyncStorage.getItem(KEYS.REFERRAL_LINK);
const getPlayStoreLink = () => AsyncStorage.getItem(KEYS.PLAYSTORE_LINK);
const getWhatsappLink  = () => AsyncStorage.getItem(KEYS.WHATSAPP_LINK);
const isMpinSet        = async () => (await AsyncStorage.getItem(KEYS.MPIN_SET)) === 'true';
const isOnboarded      = async () => (await AsyncStorage.getItem(KEYS.ONBOARDED)) === 'true';
const setMpinSet       = (val) => AsyncStorage.setItem(KEYS.MPIN_SET,  String(val));
const setOnboarded     = ()    => AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
const setFcmToken      = (token) => AsyncStorage.setItem(KEYS.FCM_TOKEN, token);
const getFcmToken      = () => AsyncStorage.getItem(KEYS.FCM_TOKEN);
const setDeviceId      = (id) => AsyncStorage.setItem(KEYS.DEVICE_ID, id);
const getDeviceId      = () => AsyncStorage.getItem(KEYS.DEVICE_ID);

const clearSession = () =>
  AsyncStorage.multiRemove([
    KEYS.TOKEN, KEYS.USER, KEYS.USER_ID, KEYS.CONTACT, KEYS.USERNAME,
    KEYS.EMAIL, KEYS.REFERRAL_CODE, KEYS.REFERRAL_LINK, KEYS.PLAYSTORE_LINK,
    KEYS.WHATSAPP_LINK, KEYS.USED_REFERRAL,
  ]);

const clearAll = () => AsyncStorage.multiRemove(Object.values(KEYS));

export const AsyncStorageHelper = {
  KEYS, saveUserSession, getUser, getToken, getUserId, getContactNumber,
  getUsername, getEmail, getReferralCode, getReferralLink, getPlayStoreLink,
  getWhatsappLink, isMpinSet, isOnboarded, setMpinSet, setOnboarded,
  setFcmToken, getFcmToken, setDeviceId, getDeviceId, clearSession, clearAll,
};
