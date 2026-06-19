import { callApi } from '../apiClient';
import { PAYMENT } from '../endpoints';

export const paymentService = {
  create:          (data)          => callApi({ method: 'post',   url: PAYMENT.CREATE, data }),
  getAll:          ()              => callApi({ method: 'get',    url: PAYMENT.GET_ALL }),
  ownerHistory:    (ownerId)       => callApi({ method: 'get',    url: PAYMENT.OWNER_HISTORY(ownerId) }),
  customerHistory: (customerId)    => callApi({ method: 'get',    url: PAYMENT.CUSTOMER_HISTORY(customerId) }),
  pending:         (ownerId)       => callApi({ method: 'get',    url: PAYMENT.PENDING(ownerId) }),
  byInvoice:       (invoiceId)     => callApi({ method: 'get',    url: PAYMENT.BY_INVOICE(invoiceId) }),
  getById:         (id)            => callApi({ method: 'get',    url: PAYMENT.GET_BY_ID(id) }),
  setStatus:       (id, status)    => callApi({ method: 'put',    url: PAYMENT.STATUS(id), params: { status } }),
  remove:          (id)            => callApi({ method: 'delete', url: PAYMENT.DELETE(id) }),
};
