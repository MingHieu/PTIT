import { createContext, createSignal, Show, useContext } from 'solid-js';
import { Popup } from './Popup';

export const DialogContext = createContext();

export function DialogProvider(props) {
  const [visible, setVisible] = createSignal(false);
  const [type, setType] = createSignal('default'); // default, confirm
  const [text, setText] = createSignal('');
  const [closeText, setCloseText] = createSignal('Đóng');
  const [confirmText, setConfirmText] = createSignal('Xác nhận');
  const [onClose, setOnClose] = createSignal(() => {});
  const [onConfirm, setOnConfirm] = createSignal(() => {});
  const [confirmUrl, setConfirmUrl] = createSignal('');
  const [icon, setIcon] = createSignal('/images/ic-question.png');

  const showDialog = ({
    type: pType = 'default',
    text: pText = '',
    closeText: pCloseText = 'Đóng',
    confirmText: pConfirmText = 'Xác nhận',
    onClose: pOnClose = () => {},
    onConfirm: pOnConfirm = () => {},
    confirmUrl: pConfirmUrl = '',
    icon: pIcon = '/images/ic-question.png',
  }) => {
    setVisible(true);
    setType(pType);
    setText(pText);
    setCloseText(pCloseText);
    setConfirmText(pConfirmText);
    setOnClose(() => pOnClose);
    setOnConfirm(() => pOnConfirm);
    setConfirmUrl(pConfirmUrl);
    setIcon(pIcon);
  };

  const closeDialog = () => {
    setVisible(false);
    onClose()();
  };

  const confirmDialog = () => {
    setVisible(false);
    onConfirm()();
  };

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog, confirmDialog }}>
      {props.children}
      <Popup visible={visible} onClose={closeDialog}>
        <div class="w-screen max-w-lg p-6">
          <div class="bg-white min-h-52 rounded-lg p-6 flex flex-col justify-between items-center space-y-6">
            <Show when={type() == 'confirm'}>
              <img src={icon()} class="w-16 h-16" />
            </Show>
            <p class="w-full text-center text-xl font-semibold break-words">
              {text}
            </p>
            <div class="flex items-center space-x-6">
              <button
                onClick={closeDialog}
                class="text-red-600 px-4 py-2 border border-[transparent] rounded hover:border-red-500">
                {closeText()}
              </button>
              <Show when={type() == 'confirm'}>
                <Show
                  fallback={
                    <button
                      onClick={confirmDialog}
                      class="text-blue-600 px-4 py-2 border border-[transparent] rounded hover:border-blue-500">
                      {confirmText()}
                    </button>
                  }
                  when={confirmUrl()}>
                  <a
                    href={confirmUrl()}
                    target="_blank"
                    class="text-blue-600 px-4 py-2 border border-[transparent] rounded hover:border-blue-500">
                    {confirmText()}
                  </a>
                </Show>
              </Show>
            </div>
          </div>
        </div>
      </Popup>
    </DialogContext.Provider>
  );
}

export const useDialog = () => useContext(DialogContext);
