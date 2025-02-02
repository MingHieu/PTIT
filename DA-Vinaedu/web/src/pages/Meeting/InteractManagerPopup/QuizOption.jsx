import { MEETING_INTERACT_TYPE } from '@/constants/meeting';
import api from '@/core/api';
import QuizSection from '@/pages/Assignment/QuizSection';
import { createSignal } from 'solid-js';
import { useMeeting } from '..';

export function QuizOption({ onClose }) {
  const { lesson, isInteractPopupVisible } = useMeeting();
  const [formData, setFormData] = createSignal({
    questions: [],
  });
  const [loading, setLoading] = createSignal(false);

  const isFormValid = () => {
    return true;
  };

  const handleCreate = async () => {
    try {
      await api.post('meeting/interact/create', {
        lessonId: lesson().id,
        type: MEETING_INTERACT_TYPE.QUIZ,
        data: formData(),
      });
      onClose();
    } catch (error) {}
  };

  return (
    <div class="space-y-4">
      <QuizSection
        formData={formData}
        setFormData={setFormData}
        visible={isInteractPopupVisible}
      />
      <div class="flex justify-end">
        <button
          class={`px-4 py-2 rounded transition ${
            isFormValid() && !loading()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          onClick={handleCreate}
          disabled={!isFormValid() || loading()}>
          Gửi câu hỏi
        </button>
      </div>
    </div>
  );
}
