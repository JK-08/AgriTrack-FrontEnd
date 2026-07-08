import { callApi } from '../apiClient';
import { LOCATION } from '../endpoints';

export const locationService = {
  update:          (data)       => callApi({ method: 'post', url: LOCATION.UPDATE, data }),
  latestByDriver:  (driverId)   => callApi({ method: 'get',  url: LOCATION.LATEST_BY_DRIVER(driverId) }),
  latestByBooking: (bookingId)  => callApi({ method: 'get',  url: LOCATION.LATEST_BY_BOOKING(bookingId) }),
};
