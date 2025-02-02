import { createSignal } from 'solid-js';

import { Dynamic } from 'solid-js/web';
import ChangePassword from './ChangePassword';
import GeneralSettings from './GeneralSettings';
import NotificationsSettings from './NotificationsSettings';
import SettingsSidebar from './SettingsSidebar';

export const SETTING_TABS = {
  general: {
    title: 'Tổng quan',
    component: GeneralSettings,
    value: 'general',
  },
  notifications: {
    title: 'Thông báo',
    component: NotificationsSettings,
    value: 'notifications',
  },
  change_password: {
    title: 'Đổi mật khẩu',
    component: ChangePassword,
    value: 'change_password',
  },
};

function Settings() {
  const [activeTab, setActiveTab] = createSignal(SETTING_TABS.general.value);

  return (
    <div class="flex flex-col lg:flex-row">
      <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div class="max-w-screen-lg flex-grow py-6 lg:p-6">
        <Dynamic component={SETTING_TABS[activeTab()].component} />
      </div>
    </div>
  );
}

export default Settings;
