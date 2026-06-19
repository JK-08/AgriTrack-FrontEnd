import { callApi } from '../apiClient';
import { MAINTENANCE } from '../endpoints';

export const maintenanceService = {
  create:    (data)        => callApi({ method: 'post',   url: MAINTENANCE.CREATE, data }),
  getAll:    ()            => callApi({ method: 'get',    url: MAINTENANCE.GET_ALL }),
  byTractor: (tractorId)   => callApi({ method: 'get',    url: MAINTENANCE.BY_TRACTOR(tractorId) }),
  byOwner:   (ownerId)     => callApi({ method: 'get',    url: MAINTENANCE.BY_OWNER(ownerId) }),
  getById:   (id)          => callApi({ method: 'get',    url: MAINTENANCE.GET_BY_ID(id) }),
  update:    (id, data)    => callApi({ method: 'put',    url: MAINTENANCE.UPDATE(id), data }),
  remove:    (id)          => callApi({ method: 'delete', url: MAINTENANCE.DELETE(id) }),
};
