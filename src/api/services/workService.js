import { callApi } from '../apiClient';
import { WORK } from '../endpoints';

export const workService = {
  start:      (data)                => callApi({ method: 'post', url: WORK.START, data }),
  pause:      (id)                  => callApi({ method: 'put',  url: WORK.PAUSE(id) }),
  resume:     (id)                  => callApi({ method: 'put',  url: WORK.RESUME(id) }),
  stop:       (id, extraCharges)    => callApi({ method: 'put',  url: WORK.STOP(id), params: extraCharges != null ? { extraCharges } : undefined }),
  manual:     (data)               => callApi({ method: 'post', url: WORK.MANUAL, data }),
  getAll:     ()                   => callApi({ method: 'get',  url: WORK.GET_ALL }),
  byOwner:    (ownerId)            => callApi({ method: 'get',  url: WORK.BY_OWNER(ownerId) }),
  byCustomer: (customerId)         => callApi({ method: 'get',  url: WORK.BY_CUSTOMER(customerId) }),
  byDriver:   (driverId)           => callApi({ method: 'get',  url: WORK.BY_DRIVER(driverId) }),
  getById:    (id)                 => callApi({ method: 'get',  url: WORK.GET_BY_ID(id) }),
  remove:     (id)                 => callApi({ method: 'delete', url: WORK.DELETE(id) }),
};
