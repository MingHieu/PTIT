import api from '@/core/api';
import { NoDataView } from '@/shared/components';
import {
  createResource,
  createSignal,
  For,
  Match,
  onCleanup,
  Show,
  Switch,
} from 'solid-js';
import { useNotification } from './useNotification';

const getNotifications = async query => {
  try {
    const data = await api.get('notification', { params: query });
    return data;
  } catch (error) {
    return [];
  }
};

function Notifications() {
  const [page, setPage] = createSignal(0);
  const [notifications, { mutate: setNotifications }] = createResource(
    { page: 0 },
    getNotifications,
    { initialValue: [] },
  );
  const { getUnReadNotificationNumber } = useNotification();
  const [loading, setLoading] = createSignal(false);
  let observer;
  const [isPageEnd, setIsPageEnd] = createSignal(false);

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await api.post(`notification/mark-read-all`);
      setNotifications(
        notifications().map(notification => ({
          ...notification,
          isRead: true,
        })),
      );
      getUnReadNotificationNumber();
    } catch (error) {}
    setLoading(false);
  };

  const markAsRead = async notification => {
    if (notification.isRead) return;
    setLoading(true);
    try {
      await api.post(`notification/${notification.id}/mark-read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id == notification.id ? { ...notification, isRead: true } : n,
        ),
      );
      getUnReadNotificationNumber();
    } catch (error) {}
    setLoading(false);
  };

  const loadMore = async () => {
    if (loading() || notifications.loading || isPageEnd()) return;
    setLoading(true);
    try {
      setPage(prev => prev + 1);
      const data = await getNotifications({ page: page() });
      if (data.length) {
        setNotifications(prev => [...prev, ...data]);
      } else {
        setIsPageEnd(true);
      }
    } catch (error) {}
    setLoading(false);
  };

  const lastElementRef = element => {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });
    if (element) observer.observe(element);
  };

  onCleanup(() => observer && observer.disconnect());

  const NotificationItem = ({ notification, index }) => {
    const onClick = () => {
      if (loading()) return;
      markAsRead(notification);
      if (notification.data?.url) {
        window.location.href = notification.data.url;
      }
    };

    return (
      <div
        onClick={onClick}
        class="cursor-pointer flex items-center py-4 pl-4"
        classList={{
          'border-b': index != notifications().length - 1,
          'text-gray-500': notification.isRead,
          'cursor-not-allowed': loading(),
        }}>
        <span
          class="w-3 h-3 rounded-full mr-4"
          classList={{ 'bg-blue-500': !notification.isRead }}></span>
        <div class="flex-1">
          <h3 class="font-semibold">{notification.title}</h3>
          <p class="text-sm">{notification.message}</p>
        </div>
      </div>
    );
  };

  return (
    <div class="max-w-screen-md mx-auto">
      <Switch>
        <Match when={notifications.loading}>
          <div class="space-y-4">
            <For each={[...Array(20)]}>
              {() => <div class="h-32 rounded animate-skeleton" />}
            </For>
          </div>
        </Match>
        <Match when={notifications().length == 0}>
          <div class="h-[90vh] flex justify-center">
            <NoDataView text="Không có thông báo nào" />
          </div>
        </Match>
        <Match when={notifications()}>
          <Show when={notifications().some(n => !n.isRead)}>
            <div class="flex justify-end mb-4">
              <button
                onClick={markAllAsRead}
                disabled={loading()}
                class={`hover:underline font-medium ${
                  loading()
                    ? 'cursor-not-allowed text-gray-500'
                    : 'text-blue-500'
                }`}>
                Đọc tất cả
              </button>
            </div>
          </Show>
          <div>
            <For each={notifications()}>
              {(notification, index) => (
                <NotificationItem notification={notification} index={index()} />
              )}
            </For>
            <div ref={lastElementRef}></div>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

export default Notifications;
