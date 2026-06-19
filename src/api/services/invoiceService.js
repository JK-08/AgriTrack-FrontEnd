import { callApi } from '../apiClient';
import { INVOICE } from '../endpoints';

export const invoiceService = {
  create:     (data)         => callApi({ method: 'post',   url: INVOICE.CREATE, data }),
  getAll:     ()             => callApi({ method: 'get',    url: INVOICE.GET_ALL }),
  byOwner:    (ownerId)      => callApi({ method: 'get',    url: INVOICE.BY_OWNER(ownerId) }),
  byCustomer: (customerId)   => callApi({ method: 'get',    url: INVOICE.BY_CUSTOMER(customerId) }),
  getById:    (id)           => callApi({ method: 'get',    url: INVOICE.GET_BY_ID(id) }),
  update:     (id, data)     => callApi({ method: 'put',    url: INVOICE.UPDATE(id), data }),
  setStatus:  (id, status)   => callApi({ method: 'put',    url: INVOICE.STATUS(id), params: { status } }),
  remove:     (id)           => callApi({ method: 'delete', url: INVOICE.DELETE(id) }),
};
