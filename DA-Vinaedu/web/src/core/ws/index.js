import { WS_URL } from '@/configs';
import { displayNotification } from '@/pages/Notifications/displayNotification';
import { useNotification } from '@/pages/Notifications/useNotification';
import { useAuth } from '@/shared/hooks';
import { io, Socket } from 'socket.io-client';
import { createSignal } from 'solid-js';

const { user } = useAuth();
/**
 * @type {Socket}
 */
const [socket, setSocket] = createSignal();
let connected = false;

const connect = () => {
  if (connected) return;
  setSocket(io(WS_URL, { auth: { userId: user().id } }));

  socket().on('notifications', event => {
    const { getUnReadNotificationNumber } = useNotification();
    displayNotification(event);
    getUnReadNotificationNumber();
  });

  connected = true;
};

const disconnect = () => {
  socket()?.disconnect();
  connected = false;
};

export const WS = {
  socket,
  connect,
  disconnect,
};
