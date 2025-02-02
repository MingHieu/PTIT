import { useNotification } from '@/pages/Notifications/useNotification';
import { A, useLocation } from '@solidjs/router';
import { AiOutlineSetting } from 'solid-icons/ai';
import { FiMenu } from 'solid-icons/fi';
import { IoNotificationsOutline } from 'solid-icons/io';
import { OcSignout2 } from 'solid-icons/oc';
import { SiGoogleclassroom } from 'solid-icons/si';
import { VsCalendar, VsClose } from 'solid-icons/vs';
import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { useAuth } from '../shared/hooks';

function SidebarLayout(props) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);
  const { user } = useAuth();
  const { unReadNumber, getUnReadNotificationNumber } = useNotification();

  const isActive = path => {
    return location.pathname === path
      ? 'bg-blue-50 text-blue-600 font-semibold'
      : 'text-gray-600 hover:bg-gray-100';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen());
    if (isSidebarOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleResize = () => {
    if (window.innerWidth >= 640) {
      setIsSidebarOpen(false);
    }
  };

  onMount(() => {
    window.addEventListener('resize', handleResize);
    getUnReadNotificationNumber();
  });

  onCleanup(() => {
    window.removeEventListener('resize', handleResize);
  });

  return (
    <div class="flex flex-col h-screen">
      <Show when={!user().isVerify}>
        <div
          class="p-1 text-white shadow sticky top-0"
          style={{ background: 'linear-gradient(to right, #0072ff, #00c6ff)' }}>
          <p class="text-sm text-center font-semibold">
            Hãy xác thực tài khoản ngay để trải nghiệm tất cả các tính năng.{' '}
            <A href="/settings" class="font-bold underline">
              Xác thực ngay!
            </A>
          </p>
        </div>
      </Show>
      <div class="flex-grow flex overflow-hidden">
        <aside
          class={`top-0 transition-transform duration-300 ease-in-out transform ${
            isSidebarOpen() ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 fixed z-50 sm:relative min-w-64 max-w-64 bg-white text-gray-800 flex flex-col border-r h-full`}>
          <div class="pb-8 pt-4 sm:py-8 px-4 bg-white text-right border-b border-gray-200">
            <button
              class="mb-2 text-gray-600 sm:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar">
              <VsClose class="w-7 h-7" />
            </button>
            <a class="text-center" href="/">
              <h1 class="text-3xl font-bold text-blue-600">VinaEdu</h1>
            </a>
          </div>
          <nav class="flex-grow px-4 py-6">
            <ul class="space-y-4">
              {/* <li>
              <a
                href="/dashboard"
                class={`flex items-center space-x-4 rounded px-4 py-2 transition ${isActive(
                  '/dashboard',
                )}`}>
                <BiSolidDashboard />
                <span>Tổng quan</span>
              </a>
            </li> */}
              <li>
                <a
                  href="/classroom"
                  class={`flex items-center space-x-4 rounded px-4 py-2 transition ${isActive(
                    '/classroom',
                  )}`}>
                  <SiGoogleclassroom />
                  <span>Lớp học</span>
                </a>
              </li>
              {/* <li>
              <a
                href="/tasks"
                class={`flex items-center space-x-4 rounded px-4 py-2 transition ${isActive(
                  '/tasks',
                )}`}>
                <OcTasklist2 />
                <span>Nhiệm vụ</span>
              </a>
            </li> */}
              <li>
                <a
                  href="/timetable"
                  class={`flex items-center space-x-4 rounded px-4 py-2 transition ${isActive(
                    '/timetable',
                  )}`}>
                  <VsCalendar />
                  <span>Thời gian biểu</span>
                </a>
              </li>
              <li>
                <a
                  href="/notifications"
                  class={`relative flex items-center space-x-4 rounded px-4 py-2 transition ${isActive(
                    '/notifications',
                  )}`}>
                  <div class="relative">
                    <IoNotificationsOutline class="text-lg" />
                    <Show when={unReadNumber()}>
                      <span class="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-xs font-medium">
                        {unReadNumber()}
                      </span>
                    </Show>
                  </div>
                  <span>Thông báo</span>
                </a>
              </li>
            </ul>
          </nav>
          <nav class="px-4 py-4 mt-auto">
            <ul>
              <li>
                <a
                  href="/settings"
                  class={`flex items-center space-x-4 rounded px-4 py-2 transition ${isActive(
                    '/settings',
                  )}`}>
                  <AiOutlineSetting class="text-lg" />
                  <span>Cài đặt</span>
                </a>
              </li>
            </ul>
          </nav>
          <div class="p-4 text-gray-700 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 flex-1 overflow-hidden">
                {user().avatar ? (
                  <img
                    src={user().avatar}
                    alt="Avatar"
                    class="w-10 h-10 rounded-full text-xs"
                  />
                ) : (
                  <div class="w-10 h-10 rounded-full bg-gray-300" />
                )}
                <div class="flex-1 overflow-hidden">
                  <p class="font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                    {user().name || user().email.split('@')[0]}
                  </p>
                  <p class="text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user().email}
                  </p>
                </div>
              </div>
              <a href="/logout" class="text-gray-600 hover:text-red-600 ml-4">
                <OcSignout2 />
              </a>
            </div>
          </div>
        </aside>
        <div
          onClick={toggleSidebar}
          class="absolute z-40 inset-0 bg-[rgba(0,0,0,.4)]"
          classList={{ hidden: !isSidebarOpen() }}
        />
        <main class="flex-grow p-6 overflow-auto">
          <button
            class="text-gray-600 sm:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar">
            <FiMenu class="w-7 h-7" />
          </button>
          <div class="pt-6">{props.children}</div>
        </main>
      </div>
    </div>
  );
}

export default SidebarLayout;
