import { callApi } from '../apiClient';
import { CUSTOMER } from '../endpoints';

export const customerService = {
  create:   (data)             => callApi({ method: 'post',   url: CUSTOMER.CREATE, data }),
  getAll:   ()                 => callApi({ method: 'get',    url: CUSTOMER.GET_ALL }),
  byOwner:  (ownerId)          => callApi({ method: 'get',    url: CUSTOMER.BY_OWNER(ownerId) }),
  search:   (ownerId, name)    => callApi({ method: 'get',    url: CUSTOMER.SEARCH(ownerId), params: { name } }),
  filter:   (ownerId, type)    => callApi({ method: 'get',    url: CUSTOMER.FILTER(ownerId), params: { type } }),
  getById:  (id)               => callApi({ method: 'get',    url: CUSTOMER.GET_BY_ID(id) }),
  update:   (id, data)         => callApi({ method: 'put',    url: CUSTOMER.UPDATE(id), data }),
  remove:   (id)               => callApi({ method: 'delete', url: CUSTOMER.DELETE(id) }),
};
