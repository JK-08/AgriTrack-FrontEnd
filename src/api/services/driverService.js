import { callApi } from '../apiClient';
import { DRIVER } from '../endpoints';

export const driverService = {
  create:         (data)              => callApi({ method: 'post',   url: DRIVER.CREATE, data }),
  getAll:         ()                  => callApi({ method: 'get',    url: DRIVER.GET_ALL }),
  byOwner:        (ownerId)           => callApi({ method: 'get',    url: DRIVER.BY_OWNER(ownerId) }),
  available:      (ownerId)           => callApi({ method: 'get',    url: DRIVER.AVAILABLE(ownerId) }),
  getById:        (id)                => callApi({ method: 'get',    url: DRIVER.GET_BY_ID(id) }),
  byUser:         (userId)            => callApi({ method: 'get',    url: DRIVER.BY_USER(userId) }),
  update:         (id, data)          => callApi({ method: 'put',    url: DRIVER.UPDATE(id), data }),
  setAvailability:(id, available)     => callApi({ method: 'put',    url: DRIVER.AVAILABILITY(id), params: { available } }),
  remove:         (id)                => callApi({ method: 'delete', url: DRIVER.DELETE(id) }),
};
