import { callApi } from '../apiClient';
import { REPORT } from '../endpoints';

export const reportService = {
  ownerSummary:    (ownerId) => callApi({ method: 'get', url: REPORT.OWNER_SUMMARY(ownerId) }),
  revenue:         (ownerId) => callApi({ method: 'get', url: REPORT.REVENUE(ownerId) }),
  fleetDashboard:  (ownerId) => callApi({ method: 'get', url: REPORT.FLEET_DASHBOARD(ownerId) }),
  advanced:        (ownerId, params) => callApi({ method: 'get', url: REPORT.ADVANCED(ownerId), params }),
  analytics:       (ownerId) => callApi({ method: 'get', url: REPORT.ANALYTICS(ownerId) }),
  insights:        (ownerId) => callApi({ method: 'get', url: REPORT.INSIGHTS(ownerId) }),
};
