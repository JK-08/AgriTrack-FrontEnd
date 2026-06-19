import { callApi } from '../apiClient';
import { TRACTOR } from '../endpoints';

export const tractorService = {
  create:    (data)            => callApi({ method: 'post',   url: TRACTOR.CREATE, data }),
  getAll:    ()                => callApi({ method: 'get',    url: TRACTOR.GET_ALL }),
  byOwner:   (ownerId)         => callApi({ method: 'get',    url: TRACTOR.BY_OWNER(ownerId) }),
  available: (ownerId)         => callApi({ method: 'get',    url: TRACTOR.AVAILABLE(ownerId) }),
  getById:   (id)              => callApi({ method: 'get',    url: TRACTOR.GET_BY_ID(id) }),
  update:    (id, data)        => callApi({ method: 'put',    url: TRACTOR.UPDATE(id), data }),
  setStatus: (id, status)      => callApi({ method: 'put',    url: TRACTOR.STATUS(id), params: { status } }),
  remove:    (id)              => callApi({ method: 'delete', url: TRACTOR.DELETE(id) }),
};
