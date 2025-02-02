import { createEffect, createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

export function Popup({
  visible,
  children,
  onClose = () => {},
  cancelable = true,
}) {
  const [isOpening, setIsOpening] = createSignal(true);
  const [internalVisible, setInternalVisible] = createSignal(visible());
  const id = 'popup-' + new Date().getTime();

  const handleOutsideClick = e => {
    if (e.target.id == id && cancelable) {
      onClose();
    }
  };

  createEffect(() => {
    if (visible()) {
      setInternalVisible(true);
      setTimeout(() => setIsOpening(true), 0);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setInternalVisible(false), 300);
      setIsOpening(false);
      const popups = document.querySelectorAll('section[id^="popup-"]');
      if (popups.length == 0) {
        document.body.style.overflow = '';
      }
    }
  });

  return (
    <Show when={internalVisible()}>
      <Portal>
        <div
          id={id}
          class={`fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center transition duration-300 ease-in-out ${
            isOpening() ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleOutsideClick}>
          <div class="max-h-screen flex overflow-hidden">
            <div
              class={`overflow-auto transition duration-300 ${
                isOpening() ? 'scale-100' : 'scale-0'
              }`}>
              {children}
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
