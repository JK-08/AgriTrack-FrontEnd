import { callApi } from '../apiClient';
import { PAYROLL } from '../endpoints';

export const payrollService = {
  generate:    (data) => callApi({ method: 'post', url: PAYROLL.GENERATE, data }),
  searchPaged: (ownerId, params) => callApi({ method: 'get', url: PAYROLL.SEARCH_PAGED(ownerId), params }),
  getById:     (id) => callApi({ method: 'get', url: PAYROLL.GET_BY_ID(id) }),
  markPaid:    (id) => callApi({ method: 'put', url: PAYROLL.MARK_PAID(id) }),
  remove:      (id) => callApi({ method: 'delete', url: PAYROLL.DELETE(id) }),
};
