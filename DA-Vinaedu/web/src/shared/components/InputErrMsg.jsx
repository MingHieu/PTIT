import { Show } from 'solid-js';

export function InputErrMsg({ error }) {
  return (
    <Show when={error()}>
      <span class="text-red-600 text-sm">{error()}</span>
    </Show>
  );
}
