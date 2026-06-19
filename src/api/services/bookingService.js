import { callApi } from '../apiClient';
import { BOOKING } from '../endpoints';

export const bookingService = {
  create:   (data)        => callApi({ method: 'post', url: BOOKING.CREATE, data }),
  getAll:   ()            => callApi({ method: 'get',  url: BOOKING.GET_ALL }),
  byOwner:  (ownerId)     => callApi({ method: 'get',  url: BOOKING.BY_OWNER(ownerId) }),
  byClient: (clientId)    => callApi({ method: 'get',  url: BOOKING.BY_CLIENT(clientId) }),
  pending:  (ownerId)     => callApi({ method: 'get',  url: BOOKING.PENDING(ownerId) }),
  getById:  (id)          => callApi({ method: 'get',  url: BOOKING.GET_BY_ID(id) }),
  accept:   (id)          => callApi({ method: 'put',  url: BOOKING.ACCEPT(id) }),
  reject:   (id)          => callApi({ method: 'put',  url: BOOKING.REJECT(id) }),
  complete: (id)          => callApi({ method: 'put',  url: BOOKING.COMPLETE(id) }),
  cancel:   (id)          => callApi({ method: 'put',  url: BOOKING.CANCEL(id) }),
  remove:   (id)          => callApi({ method: 'delete', url: BOOKING.DELETE(id) }),
};
