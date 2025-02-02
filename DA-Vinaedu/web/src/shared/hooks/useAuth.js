import api from '@/core/api';
import { createSignal } from 'solid-js';

const [isLoggedIn, setIsLoggedIn] = createSignal(
  !!localStorage.getItem('token'),
);

const [user, setUser] = createSignal(JSON.parse(localStorage.getItem('user')));

const setUserInfo = userInfo => {
  setUser(userInfo);
  localStorage.setItem('user', JSON.stringify(userInfo));
};

const removeUserInfo = () => {
  setUser({});
  localStorage.removeItem('user');
};

const setAuthInfo = ({ user, token }) => {
  localStorage.setItem('token', token);
  setUserInfo(user);
  setIsLoggedIn(true);
};

const logout = () => {
  localStorage.removeItem('token');
  removeUserInfo();
  setIsLoggedIn(false);
};

const refetchUser = async () => {
  try {
    const data = await api.get('user/me');
    setUserInfo(data);
  } catch (error) {}
};

const fetchNewToken = async () => {
  try {
    const data = await api.get('auth/new-token');
    localStorage.setItem('token', data);
  } catch (error) {}
};

export const useAuth = () => ({
  isLoggedIn,
  setAuthInfo,
  logout,
  user,
  setUserInfo,
  refetchUser,
  fetchNewToken,
});
