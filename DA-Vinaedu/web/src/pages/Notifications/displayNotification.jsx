import { SETTING_KEYS } from '@/constants';
import api from '@/core/api';
import { IoNotificationsOutline } from 'solid-icons/io';
import toast from 'solid-toast';
import { useSettings } from '../Settings/useSettings';

export const displayNotification = notification => {
  const { userSettings } = useSettings();
  const isPushNotificationOn = userSettings().find(
    s => s.key == SETTING_KEYS.PUSH_NOTIFICATION,
  )?.value;

  if (!isPushNotificationOn) {
    return;
  }

  const canClick = !!notification.data?.url;

  const markRead = () => {
    api.post(
      `notification/${notification.id}/mark-read`,
      {},
      { noToast: true },
    );
  };

  const handleNavigate = () => {
    window.location.href = notification.data.url;
    const url = new URL(window.location.origin + notification.data.url);
    if (window.location.pathname == url.pathname) {
      window.location.reload();
    }
  };

  const onClick = () => {
    if (canClick) {
      markRead();
      handleNavigate();
    }
  };

  toast.custom(
    t => (
      <div
        onClick={onClick}
        class="flex bg-white max-w-screen-sm px-2 py-3 rounded-sm space-x-2 animate-slideIn"
        style={{
          'box-shadow':
            '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
          cursor: canClick ? 'pointer' : 'default',
        }}>
        <IoNotificationsOutline class="text-xl text-blue-500 mt-1" />
        <div class="flex-grow">
          <h3 class="font-medium text-blue-600">{notification.title}</h3>
          <p
            class="text-sm text-gray-500 overflow-hidden line-clamp-2"
            style={{
              WebkitLineClamp: 3,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
            {notification.message}
          </p>
        </div>
      </div>
    ),
    {
      duration: 5000,
      unmountDelay: 0,
    },
  );
};
