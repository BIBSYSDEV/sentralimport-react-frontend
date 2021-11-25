import Axios, { AxiosRequestConfig } from 'axios';
import { ACESS_TOKEN, AUTHORIZED, EXPIRES } from '../Components/Login/Login';
import axios from 'axios';

Axios.defaults.headers.common = {
  Accept: 'application/json',
};
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
Axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

export const authenticatedApiRequest = (axiosRequestConfig: AxiosRequestConfig) => {
  const idToken = localStorage.getItem(ACESS_TOKEN);
  axiosRequestConfig.headers = {
    ...axiosRequestConfig.headers,
    Authorization: `Bearer ${idToken}`,
  };
  return Axios(axiosRequestConfig);
};

export const handlePotentialExpiredSession = (potentialAxiosError: unknown) => {
  const expires = localStorage.getItem(EXPIRES) ?? '0';
  if (axios.isAxiosError(potentialAxiosError) && Date.now() < parseInt(expires)) {
    window.alert('din sesjon har gått ut');
    localStorage.setItem(AUTHORIZED, 'false');
    window.location.href = '/login';
  }
};
