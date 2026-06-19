import { callApi } from '../apiClient';
import { RATING } from '../endpoints';

export const ratingService = {
  create:   (data)        => callApi({ method: 'post',   url: RATING.CREATE, data }),
  getAll:   ()            => callApi({ method: 'get',    url: RATING.GET_ALL }),
  byOwner:  (ownerId)     => callApi({ method: 'get',    url: RATING.BY_OWNER(ownerId) }),
  byClient: (clientId)    => callApi({ method: 'get',    url: RATING.BY_CLIENT(clientId) }),
  average:  (ownerId)     => callApi({ method: 'get',    url: RATING.AVERAGE(ownerId) }),
  getById:  (id)          => callApi({ method: 'get',    url: RATING.GET_BY_ID(id) }),
  remove:   (id)          => callApi({ method: 'delete', url: RATING.DELETE(id) }),
};
