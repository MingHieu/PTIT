import api from '@/core/api';
import { createSignal } from 'solid-js';

const [unReadNumber, setUnreadNumber] = createSignal(0);

const getUnReadNotificationNumber = async () => {
  try {
    const data = await api.get('notification/un-read-number');
    setUnreadNumber(data);
  } catch (error) {
    setUnreadNumber(0);
  }
};

export const useNotification = () => ({
  unReadNumber,
  getUnReadNotificationNumber,
});
