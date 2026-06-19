import { callApi } from '../apiClient';
import { RATE } from '../endpoints';

export const rateService = {
  create:  (data)        => callApi({ method: 'post',   url: RATE.CREATE, data }),
  getAll:  ()            => callApi({ method: 'get',    url: RATE.GET_ALL }),
  byOwner: (ownerId)     => callApi({ method: 'get',    url: RATE.BY_OWNER(ownerId) }),
  active:  (ownerId)     => callApi({ method: 'get',    url: RATE.ACTIVE(ownerId) }),
  getById: (id)          => callApi({ method: 'get',    url: RATE.GET_BY_ID(id) }),
  update:  (id, data)    => callApi({ method: 'put',    url: RATE.UPDATE(id), data }),
  remove:  (id)          => callApi({ method: 'delete', url: RATE.DELETE(id) }),
};
