import { For } from 'solid-js';
import { SETTING_TABS } from '.';

function SettingsSidebar({ activeTab, setActiveTab }) {
  return (
    <div class="w-full lg:w-64 pb-6 lg:pb-0 lg:pr-6 border-b lg:border-b-0 lg:border-r">
      <ul class="flex items-center lg:items-stretch lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 ">
        <For each={Object.values(SETTING_TABS)}>
          {tab => (
            <li>
              <button
                onClick={() => setActiveTab(tab.value)}
                class={`w-full py-2 text-left px-4 rounded ${
                  activeTab() === tab.value
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-gray-600'
                }`}>
                {tab.title}
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

export default SettingsSidebar;
