import api from '@/core/api';
import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import { Popup } from '@/shared/components';
import { dateToTimestamp, formatDate } from '@/shared/utils';
import { createEffect, createSignal } from 'solid-js';

function LessonFormPopup({ onClose, visible, lesson }) {
  const { classroom, refetchLessons } = useClassroom();
  const [formData, setFormData] = createSignal({
    date: '',
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = createSignal(false);

  const isFormValid = () =>
    formData().date && formData().startTime && formData().endTime;

  createEffect(() => {
    if (visible()) {
      if (lesson()) {
        fillFormData();
      }
    } else {
      resetFormData();
    }
  });

  const fillFormData = () => {
    setFormData({
      date: formatDate(lesson().start, 'YYYY-MM-DD', true),
      startTime: formatDate(lesson().start, 'HH:mm'),
      endTime: formatDate(lesson().end, 'HH:mm'),
    });
  };

  const resetFormData = () => {
    setFormData({
      date: '',
      startTime: '',
      endTime: '',
    });
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { date, startTime, endTime } = formData();
    const start = dateToTimestamp(`${date}T${startTime}`);
    const end = dateToTimestamp(`${date}T${endTime}`);
    const url = lesson() ? `lesson/${lesson().id}/update` : 'lesson';

    const body = {
      start,
      end,
      classroomId: classroom().id,
    };

    try {
      await api.post(url, body);
      refetchLessons();
      onClose();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Popup onClose={onClose} visible={visible}>
      <div class="p-6 w-screen max-w-lg">
        <div class="bg-white rounded-xl p-6 space-y-4">
          <h2 class="text-xl font-semibold">
            {lesson() ? 'Chỉnh sửa buổi học' : 'Tạo buổi học mới'}
          </h2>
          <div class="space-y-2">
            <label>Ngày</label>
            <input
              type="date"
              value={formData().date}
              onInput={e => updateFormData('date', e.target.value)}
              class="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="space-y-2">
            <label>Thời gian bắt đầu</label>
            <input
              type="time"
              value={formData().startTime}
              onInput={e => updateFormData('startTime', e.target.value)}
              class="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="space-y-2">
            <label>Thời gian kết thúc</label>
            <input
              type="time"
              value={formData().endTime}
              onInput={e => updateFormData('endTime', e.target.value)}
              class="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="flex justify-end">
            <button
              onClick={handleSubmit}
              class={`px-4 py-2 rounded transition ${
                isFormValid() && !loading()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              disabled={!isFormValid() || loading()}>
              {lesson() ? 'Cập nhật' : 'Tạo buổi học'}
            </button>
            <button class="ml-2 text-gray-700" onClick={onClose}>
              Huỷ bỏ
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default LessonFormPopup;
