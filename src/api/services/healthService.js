import { callApi } from '../apiClient';
import { HEALTH } from '../endpoints';

const HEALTH_CHECK_TIMEOUT_MS = 15000;

export const healthService = {
  check: () => callApi({ method: 'get', url: HEALTH.CHECK, timeout: HEALTH_CHECK_TIMEOUT_MS }),
};
