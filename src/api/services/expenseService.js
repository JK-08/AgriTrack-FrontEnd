import { callApi } from '../apiClient';
import { EXPENSE } from '../endpoints';

export const expenseService = {
  uploadBill: (formData) => callApi({ method: 'post', url: EXPENSE.UPLOAD_BILL, data: formData, isFormData: true }),
  create:      (data)     => callApi({ method: 'post', url: EXPENSE.CREATE, data }),
  searchPaged: (ownerId, params) => callApi({ method: 'get', url: EXPENSE.SEARCH_PAGED(ownerId), params }),
  getById:     (id)       => callApi({ method: 'get', url: EXPENSE.GET_BY_ID(id) }),
  update:      (id, data) => callApi({ method: 'put', url: EXPENSE.UPDATE(id), data }),
  remove:      (id)       => callApi({ method: 'delete', url: EXPENSE.DELETE(id) }),
  profitLoss:  (ownerId, params) => callApi({ method: 'get', url: EXPENSE.PROFIT_LOSS(ownerId), params }),
};
