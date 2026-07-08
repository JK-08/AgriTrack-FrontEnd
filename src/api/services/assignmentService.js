import { callApi } from '../apiClient';
import { ASSIGNMENT } from '../endpoints';

export const assignmentService = {
  assign:         (data)      => callApi({ method: 'post', url: ASSIGNMENT.ASSIGN, data }),
  unassign:       (id)        => callApi({ method: 'put',  url: ASSIGNMENT.UNASSIGN(id) }),
  byOwner:        (ownerId)   => callApi({ method: 'get',  url: ASSIGNMENT.BY_OWNER(ownerId) }),
  activeByDriver: (driverId)  => callApi({ method: 'get',  url: ASSIGNMENT.ACTIVE_BY_DRIVER(driverId) }),
};
