import api from '@/core/api';
import { createSignal } from 'solid-js';

const [userSettings, setUserSettings] = createSignal([]);

const getUserSettings = async () => {
  try {
    const data = await api.get('user/settings');
    setUserSettings(data);
  } catch (error) {}
};

export const useSettings = () => ({
  userSettings,
  getUserSettings,
});
