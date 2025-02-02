import { API_BASE_URL } from '@/configs';
import axios from 'axios';
import toast from 'solid-toast';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let toastId = null;

api.interceptors.request.use(
  config => {
    if (config.method == 'post' && !config.noToast) {
      toastId = toast.loading('Đang xử lý...', { position: 'top-right' });
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    toast.error('Đã có lỗi xảy ra', { id: toastId, position: 'top-right' });
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    if (response.config.method == 'post' && !response.config.noToast) {
      toast.success('Thành công', { id: toastId, position: 'top-right' });
    }
    return response.data.data;
  },
  error => {
    let message = 'Đã có lỗi xảy ra';
    if (error.response) {
      // The request was made, and the server responded with a status code that is not in the 2xx range
      console.error('Error Response:', error.response);
      message = error.response.data?.message ?? message;
      if (error.response.status === 401) {
        window.location.href = '/logout';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No Response:', error.request);
      message =
        'Hệ thống không phản hồi. Hãy kiểm tra kết nối mạng hoặc thử lại sau.';
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error Message:', error.message);
      message = error.message ?? message;
    }
    if (!error.config.noToast) {
      toast.error(message, { id: toastId, position: 'top-right' });
    }
    return Promise.reject(error);
  },
);

export default api;
