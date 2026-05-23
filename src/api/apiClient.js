import { axiosInstance } from './axiosInstance';

export const callApi = async ({ method, url, data, params, headers = {}, isFormData = false }) => {
  try {
    const response = await axiosInstance.request({
      method, url, params, data,
      headers: {
        ...headers,
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ API SUCCESS [${method.toUpperCase()}] ${url}`);
    console.log('📦 Request    :', JSON.stringify(data ?? params ?? null, null, 2));
    console.log('📨 Response   :', JSON.stringify(response.data, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return response.data;
  } catch (error) {
    const status  = error?.response?.status;
    const resData = error?.response?.data;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`❌ API FAILED [${method.toUpperCase()}] ${url}`);
    console.log('📌 Status     :', status ?? 'No response');
    console.log('📦 Request    :', JSON.stringify(data ?? params ?? null, null, 2));
    console.log('📨 Response   :', JSON.stringify(resData, null, 2));
    console.log('💬 Message    :', resData?.message ?? resData ?? error?.message ?? 'Unknown error');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

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
