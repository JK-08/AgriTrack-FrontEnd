import { axiosInstance } from './axiosInstance';

export const callApi = async ({ method, url, data, params, headers = {}, isFormData = false, timeout }) => {
  try {
    const response = await axiosInstance.request({
      method, url, params, data,
      ...(timeout !== undefined ? { timeout } : {}),
      headers: {
        ...headers,
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    });
    return response.data;
  } catch (error) {
    const status  = error?.response?.status;
    const resData = error?.response?.data;
    throw {
      status: 'error',
      message:
        resData?.message ||
        resData?.error   ||
        (typeof resData === 'string' ? resData : null) ||
        error?.message   ||
        'Something went wrong',
      errors:     resData?.errors,
      statusCode: status,
    };
  }
};
