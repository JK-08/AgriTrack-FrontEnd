import { callApi } from '../apiClient';
import { DOCUMENT } from '../endpoints';

export const documentService = {
  uploadFile:  (formData) => callApi({ method: 'post', url: DOCUMENT.UPLOAD_FILE, data: formData, isFormData: true }),
  upload:      (data) => callApi({ method: 'post', url: DOCUMENT.UPLOAD, data }),
  byTractor:   (tractorId) => callApi({ method: 'get', url: DOCUMENT.BY_TRACTOR(tractorId) }),
  searchPaged: (ownerId, params) => callApi({ method: 'get', url: DOCUMENT.SEARCH_PAGED(ownerId), params }),
  getById:     (id) => callApi({ method: 'get', url: DOCUMENT.GET_BY_ID(id) }),
  remove:      (id) => callApi({ method: 'delete', url: DOCUMENT.DELETE(id) }),
};
