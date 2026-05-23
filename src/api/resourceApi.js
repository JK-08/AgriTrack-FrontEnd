import { callApi } from './apiClient';

export const createResourceApi = (resource) => ({
  getAll:  (params)              => callApi({ method: 'get',    url: `/${resource}`,     params }),
  getById: (id)                  => callApi({ method: 'get',    url: `/${resource}/${id}` }),
  create:  (data, isFormData)    => callApi({ method: 'post',   url: `/${resource}`,     data, isFormData }),
  update:  (id, data, isFormData)=> callApi({ method: 'put',    url: `/${resource}/${id}`, data, isFormData }),
  patch:   (id, data)            => callApi({ method: 'patch',  url: `/${resource}/${id}`, data }),
  delete:  (id)                  => callApi({ method: 'delete', url: `/${resource}/${id}` }),
});
