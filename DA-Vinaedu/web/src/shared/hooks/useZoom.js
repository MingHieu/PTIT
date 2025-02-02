import { onCleanup } from 'solid-js';

const getZoomToken = () => {
  return localStorage.getItem('zoomToken');
};

const setZoomToken = token => {
  localStorage.setItem('zoomToken', token);
};

const removeZoomToken = () => {
  localStorage.removeItem('zoomToken');
};

const observeZoomToken = cb => {
  const observe = e => {
    if (e.key == 'zoomToken') cb(e.newValue);
  };

  window.addEventListener('storage', observe);

  onCleanup(() => {
    window.removeEventListener('storage', observe);
  });
};

export const useZoom = () => ({
  getZoomToken,
  setZoomToken,
  removeZoomToken,
  observeZoomToken,
});
