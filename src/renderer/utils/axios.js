import axios from 'axios';
import iview from 'iview';

export const _back_public = axios.create({
  baseURL: '/back-public',
});

export const _back_api = axios.create({
  baseURL: '/back-api',
});

export const _api = axios.create({});

_back_public.interceptors.request.use(reqSuccess, reqError);
_back_public.interceptors.response.use(resSuccess, resError);

_back_api.interceptors.request.use(reqSuccess, reqError);
_back_api.interceptors.response.use(resSuccess, resError);

function reqSuccess(config) {
  config.headers.token = localStorage.getItem('token') || '';
  return config;
}

function reqError(error) {
  return Promise.reject(error);
}

function resSuccess(response) {
  const token = response.headers.token;
  if (token) {
    localStorage.token = token;
  }
  return response;
}

function resError(error) {
  if (error.response.status === 401) {
    window.location.hash = '/login?reason=expired';
  } else if (String(error.response.status)[0] === '5') {
    iview.Message.error('服务器内部错误');
  }
  return Promise.reject(error);
}

