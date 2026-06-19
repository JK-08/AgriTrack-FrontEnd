import { callApi } from '../apiClient';
import { REPORT } from '../endpoints';

export const reportService = {
  ownerSummary: (ownerId) => callApi({ method: 'get', url: REPORT.OWNER_SUMMARY(ownerId) }),
  revenue:      (ownerId) => callApi({ method: 'get', url: REPORT.REVENUE(ownerId) }),
};
