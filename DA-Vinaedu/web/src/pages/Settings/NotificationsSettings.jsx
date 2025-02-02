import { SETTING_KEYS } from '@/constants';
import api from '@/core/api';
import { createEffect, createSignal } from 'solid-js';
import { useSettings } from './useSettings';

function NotificationsSettings() {
  const { userSettings, getUserSettings } = useSettings();
  const [emailNotifications, setEmailNotifications] = createSignal(false);
  const [pushNotifications, setPushNotifications] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  createEffect(() => {
    fillSettingsValue();
  });

  const fillSettingsValue = () => {
    setEmailNotifications(
      userSettings().find(s => s.key == SETTING_KEYS.PROMOTIONAL_EMAIL)?.value,
    );
    setPushNotifications(
      userSettings().find(s => s.key == SETTING_KEYS.PUSH_NOTIFICATION)?.value,
    );
  };

  const saveUserSettings = async (key, value) => {
    setLoading(true);
    try {
      await api.post('user/settings', { key, value });
      await getUserSettings();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <div>
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-semibold">Thông báo Email</h3>
            <p class="text-sm text-gray-500">
              Nhận thông tin cập nhật qua Email.
            </p>
          </div>
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications()}
              disabled={loading()}
              onChange={() =>
                saveUserSettings(
                  SETTING_KEYS.PROMOTIONAL_EMAIL,
                  !emailNotifications(),
                )
              }
              class="hidden"
            />
            <div
              class={`relative w-10 h-6 rounded-full transition-colors duration-300 ${
                loading()
                  ? 'bg-gray-400'
                  : emailNotifications()
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}>
              <div
                class={`absolute left-0 top-0 m-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                  emailNotifications() ? 'transform translate-x-4' : ''
                }`}></div>
            </div>
          </label>
        </div>

        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-semibold">Thông báo đẩy</h3>
            <p class="text-sm text-gray-500">
              Nhận thông tin cập nhật qua thông báo đẩy.
            </p>
          </div>
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pushNotifications()}
              disabled={loading()}
              onChange={() =>
                saveUserSettings(
                  SETTING_KEYS.PUSH_NOTIFICATION,
                  !pushNotifications(),
                )
              }
              class="hidden"
            />
            <div
              class={`relative w-10 h-6 rounded-full transition-colors duration-300 ${
                loading()
                  ? 'bg-gray-400'
                  : pushNotifications()
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}>
              <div
                class={`absolute left-0 top-0 m-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                  pushNotifications() ? 'transform translate-x-4' : ''
                }`}></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default NotificationsSettings;
