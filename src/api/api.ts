import Axios, { AxiosRequestConfig } from 'axios';

Axios.defaults.headers.common = {
  Accept: 'application/json',
};
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
Axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

export const authenticatedApiRequest = (axiosRequestConfig: AxiosRequestConfig) => {
  const idToken = localStorage.access_token;
  axiosRequestConfig.headers = {
    ...axiosRequestConfig.headers,
    Authorization: `Bearer ${idToken}`,
  };
  return Axios(axiosRequestConfig);
};
