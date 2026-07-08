import { callApi } from '../apiClient';
import { ATTENDANCE } from '../endpoints';

export const attendanceService = {
  clockIn:     (driverId) => callApi({ method: 'post', url: ATTENDANCE.CLOCK_IN(driverId) }),
  clockOut:    (driverId) => callApi({ method: 'post', url: ATTENDANCE.CLOCK_OUT(driverId) }),
  recordBreak: (driverId, minutes) => callApi({ method: 'post', url: ATTENDANCE.BREAK(driverId), params: { minutes } }),
  markLeave:   (data) => callApi({ method: 'post', url: ATTENDANCE.LEAVE, data }),
  searchPaged: (ownerId, params) => callApi({ method: 'get', url: ATTENDANCE.SEARCH_PAGED(ownerId), params }),
  byDriver:    (driverId, from, to) => callApi({ method: 'get', url: ATTENDANCE.BY_DRIVER(driverId), params: { from, to } }),
  getById:     (id) => callApi({ method: 'get', url: ATTENDANCE.GET_BY_ID(id) }),
  update:      (id, data) => callApi({ method: 'put', url: ATTENDANCE.UPDATE(id), data }),
  remove:      (id) => callApi({ method: 'delete', url: ATTENDANCE.DELETE(id) }),
};
