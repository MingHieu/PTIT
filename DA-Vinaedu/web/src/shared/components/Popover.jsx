import { createEffect, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

export function Popover({ visible, position, onClose, children }) {
  const id = 'popover-' + new Date().getTime();

  const handleClickOutside = event => {
    const popover = document.getElementById(id);
    if (popover && !popover.contains(event.target)) {
      onClose();
    }
  };

  createEffect(() => {
    if (visible()) {
      document.addEventListener('click', handleClickOutside);
      onCleanup(() => {
        document.removeEventListener('click', handleClickOutside);
      });
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  });

  return (
    <Show when={visible()}>
      <Portal>
        <div
          id={id}
          class="absolute z-50 bg-white border rounded-md p-4 shadow-lg"
          style={{ top: position().top, left: position().left }}>
          {children}
        </div>
      </Portal>
    </Show>
  );
}
