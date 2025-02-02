import { Popup } from '@/shared/components';
import { FiArrowLeft } from 'solid-icons/fi';
import { VsClose } from 'solid-icons/vs';
import { createSignal, For, Show } from 'solid-js';
import { useMeeting } from '..';
import History from './History';
import { QuizOption } from './QuizOption';

function InteractManagerPopup() {
  const { isInteractPopupVisible, setIsInteractPopupVisible } = useMeeting();
  const [currentPage, setCurrentPage] = createSignal(0);
  const [selectedOption, setSelectedOption] = createSignal(null);
  const options = () =>
    isInteractPopupVisible()
      ? [
          {
            id: 1,
            label: 'Lịch sử',
            icon: '/images/ic-history.png',
            detail: <History onClose={onClose} />,
          },
          {
            id: 2,
            label: 'Câu hỏi',
            icon: '/images/ic-question-2.png',
            detail: <QuizOption onClose={onClose} />,
          },
        ]
      : [];

  const onClose = () => {
    setCurrentPage(0);
    setIsInteractPopupVisible(false);
    setSelectedOption(null);
  };

  const goToDetail = option => {
    setSelectedOption(option);
    setCurrentPage(1);
  };

  const goToGrid = () => {
    setSelectedOption(null);
    setCurrentPage(0);
  };

  return (
    <Popup visible={isInteractPopupVisible} onClose={onClose}>
      <div class="p-6 w-screen max-w-screen-lg">
        <div class="relative max-h-[80vh] bg-white rounded-lg p-4 overflow-y-auto">
          <Show
            when={selectedOption()}
            fallback={
              <p class="text-xl font-semibold">Tương tác với học viên</p>
            }>
            <button
              class="text-blue-600 hover:underline flex items-center"
              onClick={goToGrid}>
              <FiArrowLeft class="w-6 h-6 mr-2" />
              Quay lại
            </button>
          </Show>

          <button onClick={onClose} class="absolute top-2 right-2">
            <VsClose class="w-7 h-7" />
          </button>

          <div class="pt-4 overflow-hidden">
            <div
              class="w-[200%] h-full flex items-start transition-transform duration-300"
              style={{ transform: `translateX(-${currentPage() * 50}%)` }}>
              <div class="w-1/2 grid gap-4 grid-cols-1 sm:grid-cols-6">
                <For each={options()}>
                  {option => (
                    <button
                      class="flex flex-col justify-center items-center p-2 space-y-4 border hover:border-blue-600 sm:aspect-square"
                      onClick={() => goToDetail(option)}>
                      <img
                        src={option.icon}
                        alt={option.label}
                        class="w-12 h-12"
                      />
                      <p class="text-sm font-semibold">{option.label}</p>
                    </button>
                  )}
                </For>
              </div>

              <div class="w-1/2">
                <Show when={selectedOption()}>{selectedOption().detail}</Show>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default InteractManagerPopup;
